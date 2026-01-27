# 📘 GET /bot

> Fetch bot information

Returns public bot identity, application metadata, runtime statistics, and environment information.

**🏷 Tags:** discord, bot, utility
**📁 Source:** `\dist\routes\discord\bot.js`

### 🧪 Example 1
```http
GET /api/bot
```
#### Response
```json
{
  "user": {
    "id": "123456789012345678",
    "username": "MyBot",
    "displayName": "MyBot",
    "tag": "MyBot#0000"
  },
  "application": {
    "id": "123456789012345678",
    "name": "My Bot",
    "public": true
  },
  "stats": {
    "guilds": 42,
    "users": 12345,
    "uptime": 123456789,
    "ping": 42
  },
  "runtime": {
    "nodeVersion": "v20.x",
    "platform": "linux",
    "arch": "x64"
  }
}
```

> **[Go back to the list of endpoints](./README.md)**