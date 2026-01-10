# 📘 /channel/:channelId/messages

> Send a message to a channel

Send a message to a Discord channel. Supports content, embeds, and components (v1 & v2 format).

**🛠 Methods:** `POST`
**🏷 Tags:** discord, bot, action
**📁 Source:** `\dist\routes\discord\channel\postmessages.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `channelId` | string | ✅ | The ID of the channel | `"123456789012345678"` |

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `content` | string | ❌ | The text content of the message | `"Hello, world!"` |
| `embeds` | array | ❌ | Array of embed objects (Discord API format) | `[{"title":"Embed Title","description":"Embed description"}]` |
| `components` | array | ❌ | Array of message components (buttons, selects, etc.) | `[{"type":1,"components":[{"type":2,"label":"Click me","style":1,"custom_id":"btn_1"}]}]` |

### 🧪 Example 1
```http
POST /api/channel/123456789012345678/messages
```
#### Body
```json
{
  "content": "Hello, world!",
  "embeds": [
    {
      "title": "Embed Title",
      "description": "Embed description"
    }
  ]
}
```
#### Response
```json
{
  "messagePayload": {
    "content": "Hello, world!",
    "embeds": [
      {
        "title": "Embed Title",
        "description": "Embed description"
      }
    ]
  },
  "message": {
    "id": "987654321098765432",
    "content": "Hello, world!",
    "author": {
      "id": "111222333444555666",
      "username": "BotUser",
      "bot": true
    },
    "embeds": [
      {
        "title": "Embed Title",
        "description": "Embed description"
      }
    ]
  }
}
```

> **[Go back to the list of endpoints](./README.md)**