# 📘 POST /channels/:channelId/messages/:messageId/edit

> Edit a message

Edits an existing message in a Discord text channel. Supports content, embeds, and components.

**🏷 Tags:** discord, bot, action
**📁 Source:** `\dist\routes\discord\channel\editmessage.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `channelId` | string | ✅ | The ID of the channel | `"123456789012345678"` |
| `messageId` | string | ✅ | The ID of the message | `"987654321098765432"` |

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `content` | string | ❌ | Updated text content of the message | `"Edited message content"` |
| `embeds` | array | ❌ | Updated embeds (Discord API format) | `[{"title":"Updated Embed","description":"Updated text"}]` |
| `components` | array | ❌ | Updated message components (buttons, selects, etc.) | - |

### 🧪 Example 1
```http
POST /api/channels/123456789012345678/messages/987654321098765432/edit
```
#### Body
```json
{
  "content": "Updated content"
}
```
#### Response
```json
{
  "success": true,
  "messageId": "987654321098765432",
  "channelId": "123456789012345678"
}
```

> **[Go back to the list of endpoints](./README.md)**