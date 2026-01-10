# 📘 /channels/:channelId/messages/:messageId

> Fetch a channel message

Fetches a specific message from a text channel by channel ID and message ID.

**🛠 Methods:** `GET`
**🏷 Tags:** discord, message
**📁 Source:** `\dist\routes\discord\channel\message.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `channelId` | string | ✅ | ID of the channel containing the message | - |
| `messageId` | string | ✅ | ID of the message to fetch | - |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `raw` | boolean | ❌ | Include raw Discord.js message object | `false` |

### 🧪 Example 1
```http
GET /api/channels/123456789012345678/messages/987654321098765432
```
#### Response
```json
{
  "id": "987654321098765432",
  "content": "hello world",
  "author": {
    "id": "111111111111111111",
    "username": "Slayzi",
    "bot": false,
    "avatar": "https://cdn.discordapp.com/avatars/..."
  },
  "channelId": "123456789012345678",
  "createdTimestamp": 1710000000000,
  "editedTimestamp": null,
  "pinned": false,
  "tts": false,
  "mentions": {
    "users": [],
    "roles": [],
    "everyone": false
  }
}
```

> **[Go back to the list of endpoints](./README.md)**