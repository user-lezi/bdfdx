# 📘 /guilds

> List bot guilds

Returns a list of guilds the bot is currently in.

**🛠 Methods:** `GET`
**🏷 Tags:** discord, bot, guild
**📁 Source:** `\dist\routes\discord\guild\guilds.js`

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `sort` | enum | ❌ | Sort the returned guild list. | `"membercount"` |

### 🧪 Example 1
```http
GET /api/guilds?sort=membercount
```
#### Response
```json
[
  {
    "id": "123456789012345678",
    "name": "My Server",
    "owner": "987654321098765432",
    "icon": "https://cdn.discordapp.com/icons/…"
  },
  {
    "id": "234567890123456789",
    "name": "Another Server",
    "owner": "876543210987654321",
    "icon": null
  }
]
```

> **[Go back to the list of endpoints](./README.md)**