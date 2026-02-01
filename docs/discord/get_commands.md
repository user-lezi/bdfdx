# 📘 GET /commands

> List registered application commands

Returns bot's application commands and it's information.

**🏷 Tags:** discord, bot, utility
**📁 Source:** `\dist\routes\discord\client\slash.js`

### 🧪 Example 1
```http
GET /api/commands
```
#### Response
```json
{
  "count": 2,
  "commands": {
    "ChatInput": [
      {
        "type": 0,
        "id": "123456789012345678",
        "name": "help",
        "description": "List all the commands."
      },
      {
        "type": 0,
        "id": "123123123123123123",
        "name": "balance",
        "description": "Shows your balance."
      }
    ]
  }
}
```

> **[Go back to the list of endpoints](./README.md)**