# Authentication Flow - Visual Guide

## 1. LOGIN FLOW (First Time)

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER INTERFACE                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Campus Echo Login Page]                                          │
│  ┌──────────────────────┐                                         │
│  │ Email:   ____________│                                         │
│  │ Password:____________│                                         │
│  │ [Login Button]       │                                         │
│  └──────────────────────┘                                         │
│           │                                                        │
│           ▼ POST /api/auth/login                                  │
│           { email, password }                                     │
│           │                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ NETWORK (Browser → Backend)                                        │
├─────────────────────────────────────────────────────────────────────┤
│           │                                                        │
│           ▼                                                        │
│    ┌──────────────────┐                                           │
│    │ BACKEND VALIDATES│                                           │
│    │ Email & Password │                                           │
│    │ vs Database      │                                           │
│    └──────────────────┘                                           │
│           │                                                        │
│           ├─ ✓ Valid?                                             │
│           │   ├─ Generate Access Token (15 min)                   │
│           │   ├─ Generate Refresh Token (7 days)                  │
│           │   └─ Return both tokens                               │
│           │                                                        │
│           ├─ ✗ Invalid?                                           │
│           │   └─ Return 401 Unauthorized                          │
│           │                                                        │
│           ▼                                                        │
│    Response Headers:                                              │
│    ┌────────────────────────────────────────┐                    │
│    │ Set-Cookie: refreshToken=eyJhbGc...  │ ← httpOnly cookie   │
│    │ Content-Type: application/json        │                    │
│    │ Access-Control-Allow-Credentials: true │                   │
│    └────────────────────────────────────────┘                    │
│           │                                                        │
│           Response Body:                                          │
│           {                                                       │
│             "success": true,                                      │
│             "data": {                                             │
│               "accessToken": "eyJhbGc...",  (15 min)              │
│               "refreshToken": "eyJhbGc...", (7 days)              │
│               "user": {                                           │
│                 "id": "123",                                      │
│                 "email": "student@college.edu",                   │
│                 "role": "student"                                 │
│               }                                                   │
│             }                                                     │
│           }                                                       │
│           │                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ FRONTEND STORAGE                                                   │
├─────────────────────────────────────────────────────────────────────┤
│           │                                                        │
│           ▼                                                        │
│    ┌────────────────────────────────────────────────┐            │
│    │ Frontend JavaScript                            │            │
│    │ ┌─────────────────┐  ┌──────────────────────┐ │            │
│    │ │   MEMORY        │  │   BROWSER STORAGE    │ │            │
│    │ ├─────────────────┤  ├──────────────────────┤ │            │
│    │ │ accessToken:    │  │ sessionStorage:      │ │            │
│    │ │ eyJhbGc...      │  │ - accessToken:       │ │            │
│    │ │                 │  │   eyJhbGc...        │ │            │
│    │ │ (15 min)        │  │ - (deleted on close) │ │            │
│    │ │ (HIGH SECURITY) │  │                      │ │            │
│    │ │ (Fast access)   │  │ localStorage:        │ │            │
│    │ │                 │  │ - refreshToken:      │ │            │
│    │ │                 │  │   eyJhbGc...        │ │            │
│    │ │                 │  │ - (7 days)           │ │            │
│    │ │                 │  │ - (PERSISTENT)       │ │            │
│    │ │                 │  │                      │ │            │
│    │ │                 │  │ cookies: (auto)      │ │            │
│    │ │                 │  │ - refreshToken:      │ │            │
│    │ │                 │  │   eyJhbGc...        │ │            │
│    │ │                 │  │ - (httpOnly)         │ │            │
│    │ │                 │  │ - (7 days)           │ │            │
│    │ │                 │  │ - (Browser managed)  │ │            │
│    │ └─────────────────┘  └──────────────────────┘ │            │
│    └────────────────────────────────────────────────┘            │
│           │                                                        │
│           ▼                                                        │
│    [Redirect to Dashboard] ✅                                     │
│           │                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. API REQUEST FLOW (Using Access Token)

```
┌──────────────────────────────────────────────────────┐
│ USER CLICKS BUTTON: "Load Courses"                   │
└──────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Frontend retrieves   │
    │ access token from    │
    │ memory               │
    │ eyJhbGc...           │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────┐
    │ Create HTTP Request                          │
    │ GET /api/student/courses                     │
    │                                              │
    │ Headers: {                                   │
    │   "Authorization": "Bearer eyJhbGc...",      │
    │   "Content-Type": "application/json"         │
    │ }                                            │
    │ Cookies: (auto-sent by browser)             │
    │   refreshToken=eyJhbGc...                   │
    │                                              │
    │ credentials: 'include'                       │
    └──────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ BACKEND VALIDATES    │
    │ Access Token         │
    │                      │
    │ ✓ Token valid?       │
    │ ✓ Not expired?       │
    │ ✓ User exists?       │
    └──────────────────────┘
           │
       ┌───┴────┐
       │         │
      ✓✓        ✗✗ Token Expired
       │        or Invalid
       │         │
       ▼         └────────┐
    Return            Goes to #3:
    Courses          Token Refresh
       │                 │
       ▼                 ▼
    200 OK          (Auto-refresh)
    {courses}       Retry Request
       │
       ▼
    Frontend displays
    courses to user ✅
```

## 3. AUTO-REFRESH FLOW (When Access Token Expires)

```
┌──────────────────────────────────────────────────────┐
│ USER MAKES API REQUEST                               │
│ GET /api/student/courses                             │
└──────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ BACKEND VALIDATION   │
    │ Access Token         │
    │                      │
    │ ✗ EXPIRED!           │
    │ exp: 1234567890      │
    │ now: 1234567900      │
    │                      │
    │ Return: 401          │
    │ Unauthorized         │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────┐
    │ FRONTEND AUTO-REFRESH (Transparent!)     │
    │                                          │
    │ POST /api/auth/refresh                   │
    │ {                                        │
    │   "refreshToken": "eyJhbGc..."           │
    │ }                                        │
    │                                          │
    │ Body source:                             │
    │ 1. Try: httpOnly cookie (same device)    │
    │ 2. Try: localStorage (cross-device)      │
    │ 3. Fallback: Request body                │
    └──────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ BACKEND VALIDATES    │
    │ Refresh Token        │
    │                      │
    │ ✓ Token valid?       │
    │ ✓ Not expired?       │
    │ ✓ User exists?       │
    │ ✓ Token not revoked? │
    └──────────────────────┘
           │
    ┌──────┴────────┐
    │               │
   ✓✓              ✗✗ Invalid
    │               │
    ▼               ▼
Generate      Return 401
New Access    (Auto-logout)
Token              │
    │               ▼
    │          [Redirect to
    │           Login Page]
    │
    ▼
Return New
Access Token
    │
    ▼
┌──────────────────────────────────┐
│ FRONTEND STORES NEW TOKEN        │
│                                  │
│ sessionStorage.setItem(          │
│   'accessToken',                 │
│   'eyJhbGc...' [NEW]             │
│ )                                │
│                                  │
│ localStorage.setItem(            │
│   'refreshToken',                │
│   'eyJhbGc...' [OLD - unchanged] │
│ )                                │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ RETRY ORIGINAL REQUEST (Automatic)│
│                                  │
│ GET /api/student/courses         │
│ Authorization: Bearer eyJhbGc... │
│ (NEW TOKEN)                      │
└──────────────────────────────────┘
    │
    ▼
Return 200 OK
Courses Data ✅
    │
    ▼
User sees
courses
(Never knew
 token expired!)
```

## 4. LOGOUT FLOW

```
┌──────────────────────────────────────────┐
│ USER CLICKS: "Logout"                    │
└──────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Frontend sends:      │
    │ POST /api/auth/logout│
    │                      │
    │ Body: {              │
    │   "refreshToken":    │
    │   "eyJhbGc..."       │
    │ }                    │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Backend:             │
    │ 1. Mark token as     │
    │    revoked           │
    │ 2. Clear cookie      │
    │    refreshToken=;    │
    │ 3. Return success    │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────┐
    │ Frontend clears all tokens:          │
    │                                      │
    │ ① sessionStorage.clear()             │
    │    - accessToken GONE                │
    │                                      │
    │ ② localStorage.clear()               │
    │    - refreshToken GONE               │
    │                                      │
    │ ③ Cookies cleared by browser         │
    │    - refreshToken GONE               │
    │                                      │
    │ ④ AuthContext set to:               │
    │    - user: null                      │
    │    - isAuthenticated: false          │
    │    - loading: false                  │
    └──────────────────────────────────────┘
           │
           ▼
    [Redirect to Login Page] ✅
           │
           ▼
    User must login again
    All tokens destroyed
```

## 5. CROSS-DEVICE FLOW (Login on Device A, Access on Device B)

```
╔═══════════════════════════════════════════════════════════════════╗
║ DEVICE A (Laptop)                                                 ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Step 1: User logs in at http://192.168.1.100:5174               ║
║                                                                   ║
║  ┌────────────────────────────────────────┐                     ║
║  │ [Login Success]                        │                     ║
║  │                                        │                     ║
║  │ localStorage:                          │                     ║
║  │ - refreshToken: eyJhbGc...            │ ← 7 DAYS             ║
║  │                                        │                     ║
║  │ sessionStorage:                        │                     ║
║  │ - accessToken: eyJhbGc...             │ ← 15 MIN             ║
║  │                                        │                     ║
║  │ Cookies (auto):                        │                     ║
║  │ - refreshToken: eyJhbGc...            │ ← httpOnly            │
║  │                                        │                     ║
║  │ [Dashboard Loaded]                     │                     ║
║  └────────────────────────────────────────┘                     ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │ SAME MACHINE NETWORK (WiFi)                                 │ ║
║  │                                                             │ ║
║  │ Device A IP: 192.168.1.100                                 │ ║
║  │ Device B IP: 192.168.1.101                                 │ ║
║  │ Both can access: http://192.168.1.100:5174                 │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
          │
          │ (Different Device)
          │
          ▼
╔═══════════════════════════════════════════════════════════════════╗
║ DEVICE B (Phone)                                                  ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Step 2: User opens http://192.168.1.100:5174                   ║
║                                                                   ║
║  ┌────────────────────────────────────────┐                     ║
║  │ [Fresh Page Load]                      │                     ║
║  │                                        │                     ║
║  │ Device B has NO tokens:                │                     ║
║  │ - localStorage: EMPTY                  │                     ║
║  │ - sessionStorage: EMPTY                │                     ║
║  │ - Cookies: NONE (cross-device barrier) │                     ║
║  │                                        │                     ║
║  │ (httpOnly cookies don't cross devices!)│                     ║
║  │                                        │                     ║
║  │ AuthContext.checkAuth() tries refresh: │                     ║
║  │ POST /api/auth/refresh                 │                     ║
║  │ (no token available)                   │                     ║
║  │                                        │                     ║
║  │ Result: 401 Unauthorized               │                     ║
║  │ (This is expected!)                    │                     ║
║  │                                        │                     ║
║  │ [Redirect to Login Page]               │                     ║
║  └────────────────────────────────────────┘                     ║
║                                                                   ║
║  Step 3: User logs in with same credentials                      ║
║                                                                   ║
║  POST /api/auth/login                                           ║
║  email: student@college.edu                                     ║
║  password: password123                                          ║
║                                                                   ║
║  ┌────────────────────────────────────────┐                     ║
║  │ [Login Success - New Tokens Generated] │                     ║
║  │                                        │                     ║
║  │ Device B localStorage:                 │                     ║
║  │ - refreshToken: eyJhbGc... [NEW]      │ ← 7 DAYS             ║
║  │   (INDEPENDENT from Device A)          │                     ║
║  │                                        │                     ║
║  │ Device B sessionStorage:               │                     ║
║  │ - accessToken: eyJhbGc... [NEW]       │ ← 15 MIN             ║
║  │                                        │                     ║
║  │ Device B Cookies:                      │                     ║
║  │ - refreshToken: eyJhbGc... [NEW]      │ ← httpOnly            │
║  │   (Only on this device)                │                     ║
║  │                                        │                     ║
║  │ [Dashboard Loaded]                     │                     ║
║  └────────────────────────────────────────┘                     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

KEY POINTS:

✓ Both devices maintain SEPARATE tokens
  (Not shared between devices)

✓ Each device has 7-day refresh window
  (Independent expiration timers)

✓ Logout on one device doesn't affect other device
  (Tokens remain independent)

✓ Each login generates NEW tokens
  (Not reused from other devices)

✓ httpOnly cookies DON'T cross devices
  (By design, for security)

✓ localStorage IS available on same origin
  (But stores NEW tokens from new login)

SECURITY IMPLICATIONS:

- Each device maintains separate session
- If one device is compromised, others unaffected
- Logout only works on that device
- No automatic cross-device authentication
- Requires login on each new device
- But login happens once (token lasts 7 days)
```

## 6. TOKEN REFRESH TIMELINE

```
┌─────────────────────────────────────────────────────────────────┐
│ Timeline: User stays logged in                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 00:00 [LOGIN]                                                  │
│       ├─ Access Token: Valid (expires at 00:15)               │
│       └─ Refresh Token: Valid (expires in 7 days)             │
│                                                                │
│ 00:10 [API Call]                                              │
│       └─ Access Token Valid ✓ → API succeeds                  │
│                                                                │
│ 00:15 [ACCESS TOKEN EXPIRES]                                  │
│       ├─ API Call → 401 Unauthorized                          │
│       ├─ Trigger Auto-Refresh                                 │
│       ├─ New Access Token Generated (expires at 00:30)        │
│       └─ Retry API Call ✓ → API succeeds                      │
│                                                                │
│ 00:30 [ACCESS TOKEN EXPIRES AGAIN]                            │
│       ├─ API Call → 401 Unauthorized                          │
│       ├─ Trigger Auto-Refresh                                 │
│       ├─ New Access Token Generated (expires at 00:45)        │
│       └─ Retry API Call ✓ → API succeeds                      │
│                                                                │
│ ... (repeats every 15 minutes) ...                            │
│                                                                │
│ 23:59 [NEXT DAY] (Access continues for 7 days)               │
│       └─ Refresh still works! Access tokens keep refreshing   │
│                                                                │
│ 7:23:59 [LOGOUT or REFRESH EXPIRES]                          │
│       ├─ Refresh Token Expires                                │
│       ├─ Cannot get new Access Token                          │
│       ├─ All API calls return 401                             │
│       └─ User must login again                                │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

1. **Login**: User provides email/password → Backend generates tokens
2. **Storage**: Access token in memory, Refresh token in localStorage/cookie
3. **API Calls**: Use access token from memory
4. **Refresh**: When access expires, use refresh token to get new one
5. **Logout**: Clear all tokens from storage
6. **Cross-Device**: Each device has independent tokens, must login separately

This flow ensures:
- ✅ Secure token handling
- ✅ Automatic token refresh (user transparency)
- ✅ Cross-device support (if configured)
- ✅ Proper session management
- ✅ Easy logout and security
