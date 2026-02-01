# 📘 DELETE /channels/:channelId/messages/:messageId

> Delete a message

Deletes a message from a Discord text channel. The bot must have permission to delete the message.

**🏷 Tags:** discord, bot, action
**📁 Source:** `\dist\routes\discord\channel\deleteMessages.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `channelId` | string | ✅ | The ID of the channel | `"123456789012345678"` |
| `messageId` | string | ✅ | The ID of the message | `"987654321098765432"` |

### 🧪 Example 1
```http
DELETE /api/channels/123456789012345678/messages/987654321098765432
```
#### Response
```json
{
  "success": true,
  "messageId": "987654321098765432"
}
```

> **[Go back to the list of endpoints](./README.md)**