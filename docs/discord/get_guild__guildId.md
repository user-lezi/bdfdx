# 📘 GET /guild/:guildId

> Get guild info

Fetches a guild's public information

**🏷 Tags:** discord, bot, guild
**📁 Source:** `\dist\routes\discord\guild\guild.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `guildId` | string | ✅ | The ID of the guild | `"123456789012345678"` |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `fetch` | boolean | ❌ | Force refetch from API instead of cache | `false` |
| `raw` | boolean | ❌ | Include raw Discord.js guild object | `false` |

### 🧪 Example 1
```http
GET /api/guild/123456789012345678?fetch=true
```
#### Response
```json
{
  "id": "123456789012345678",
  "name": "My Server",
  "description": "A test server",
  "owner": {
    "id": "987654321098765432",
    "username": "OwnerUser",
    "name": "OwnerDisplay",
    "icon": "https://cdn.discordapp.com/avatars/…"
  },
  "dates": {
    "created": 1680000000000,
    "joined": 1685000000000
  },
  "nsfwLevel": 0,
  "features": [
    "ANIMATED_ICON",
    "BANNER"
  ],
  "nameAcronym": "MS",
  "icon": "https://cdn.discordapp.com/icons/…",
  "banner": "https://cdn.discordapp.com/banners/…",
  "locale": "en-US",
  "vanityURL": null,
  "count": {
    "members": 150,
    "channels": 20,
    "roles": 10,
    "emojis": 50
  }
}
```

> **[Go back to the list of endpoints](./README.md)**