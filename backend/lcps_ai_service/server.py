"""LCPS AI HTTP bridge.

This small server loads the LCPS AI assistant (copied into "backend/lcps_ai")
once and exposes a minimal HTTP API that the Node/Express backend can call.

Endpoints:
- GET  /health
- POST /query   { "query": "...", "userId": "..." }

Notes:
- Uses only the Python standard library (no FastAPI/Flask dependency).
- First start can be slow because it loads Transformers models.
"""

from __future__ import annotations

import json
import os
import sys
import traceback

# Service mode should be headless (no opening browsers, no interactive UI side-effects).
os.environ.setdefault('LCPS_AI_HEADLESS', '1')
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict


def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: Dict[str, Any]) -> None:
    body = json.dumps(payload).encode("utf-8")

    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    # Helpful for local dev (Node calls this server, but CORS doesn't hurt)
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    handler.end_headers()
    handler.wfile.write(body)


def _read_json(handler: BaseHTTPRequestHandler) -> Dict[str, Any]:
    content_length = int(handler.headers.get("content-length", "0"))
    raw = handler.rfile.read(content_length) if content_length else b"{}"
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception:
        raise ValueError("Invalid JSON payload")


# Resolve the LCPS AI folder.
REPO_ROOT = Path(__file__).resolve().parents[2]
# Default to the in-backend copy so the repo can delete the original "LCPS AI" folder.
DEFAULT_LCPS_DIR = REPO_ROOT / "backend" / "lcps_ai"
LCPS_DIR = Path(os.environ.get("LCPS_AI_DIR", str(DEFAULT_LCPS_DIR))).resolve()

if not LCPS_DIR.exists():
    raise RuntimeError(f"LCPS AI folder not found at: {LCPS_DIR}")

# Make 'core', 'modules', etc importable (they live under LCPS_DIR)
sys.path.insert(0, str(LCPS_DIR))

# Import after sys.path update
from main import LCPSAssistant  # type: ignore


print(f"[lcps_ai_service] Using LCPS AI directory: {LCPS_DIR}")
print("[lcps_ai_service] Loading LCPSAssistant (can take a while on first run)...")
assistant = LCPSAssistant(use_voice=False)
print("[lcps_ai_service] LCPSAssistant loaded.")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
        # Reduce noisy default logging; uncomment if needed.
        # super().log_message(format, *args)
        return

    def do_OPTIONS(self) -> None:  # noqa: N802
        _json_response(self, 200, {"success": True})

    def do_GET(self) -> None:  # noqa: N802
        if self.path.rstrip("/") == "/health":
            _json_response(self, 200, {"success": True, "message": "LCPS AI service is running"})
            return

        _json_response(self, 404, {"success": False, "message": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path.rstrip("/") != "/query":
            _json_response(self, 404, {"success": False, "message": "Not found"})
            return

        try:
            payload = _read_json(self)
            query = str(payload.get("query", "")).strip()
            user_id = payload.get("userId")  # optional; currently unused

            if not query:
                _json_response(self, 400, {"success": False, "message": "'query' is required"})
                return

            # Keep intent separately so Node can store a queryType.
            intent = assistant.intent_analyzer.detect_intent(query)
            response = assistant.process_input(query)

            _json_response(
                self,
                200,
                {
                    "success": True,
                    "data": {
                        "response": response,
                        "intent": intent,
                        "userId": user_id,
                    },
                },
            )
        except ValueError as e:
            _json_response(self, 400, {"success": False, "message": str(e)})
        except Exception as e:
            _json_response(
                self,
                500,
                {
                    "success": False,
                    "message": str(e),
                    "stack": traceback.format_exc(),
                },
            )


def main() -> None:
    host = os.environ.get("LCPS_AI_HOST", "127.0.0.1")
    port = int(os.environ.get("LCPS_AI_PORT", "8001"))

    server = ThreadingHTTPServer((host, port), Handler)
    print(f"[lcps_ai_service] Listening on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
