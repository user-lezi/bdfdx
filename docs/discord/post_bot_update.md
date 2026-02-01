# 📘 POST /bot/update

> Update bot identity

Updates the bot's username, avatar, or banner. Only provided fields will be changed.

**🏷 Tags:** discord, bot, action, utility
**📁 Source:** `\dist\routes\discord\client\update-bot.js`

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `name` | string | ❌ | The new name for the bot. | `"NewBotName"` |
| `avatar` | string | ❌ | The new avatar URL | `"https://example.com/avatar.png"` |
| `banner` | string | ❌ | The new banner URL | `"https://example.com/banner.png"` |

### 🧪 Example 1
```http
POST /api/bot/update
```
#### Body
```json
{
  "name": "NewBotName",
  "avatar": "https://example.com/avatar.png"
}
```
#### Response
```json
{
  "success": true,
  "updated": [
    "name",
    "avatar"
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**