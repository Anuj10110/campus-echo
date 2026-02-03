#!/bin/bash
# Get local IP address
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
    # Windows with Git Bash
    IP=$(ipconfig | grep "IPv4 Address" | head -1 | awk -F: '{print $2}' | xargs)
fi

echo "🌐 Your Local IP: $IP"
echo ""
echo "Backend URL: http://$IP:5000"
echo "Frontend URL: http://$IP:5174"
echo ""
echo "Update frontend/.env.local with:"
echo "VITE_API_URL=http://$IP:5000/api"
