# 📘 DELETE /guild/:guildId

> Leave guild

Commands the bot to leave the guild.

**🏷 Tags:** discord, bot, guild, action
**📁 Source:** `\dist\routes\discord\guild\leave-guild.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `guildId` | string | ✅ | The ID of the guild | `"123456789012345678"` |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `fetch` | boolean | ❌ | Force refetch from API instead of cache | `false` |

### 🧪 Example 1
```http
DELETE /api/guild/123456789012345678
```
#### Response
```json
{
  "id": "123456789012345678",
  "success": true,
  "message": "Bot left the guild."
}
```

> **[Go back to the list of endpoints](./README.md)**