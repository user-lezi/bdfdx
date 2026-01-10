# 📘 /guild/:guildId/members

> Fetch guild members

Returns members of a guild with optional filtering, sorting, and force-fetching from the Discord API.

**🛠 Methods:** `GET`
**🏷 Tags:** discord, guild, member
**📁 Source:** `\dist\routes\discord\guild\members.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `guildId` | string | ✅ | The ID of the guild whose members are being fetched. | `"123456789012345678"` |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `fetch` | boolean | ❌ | Force-fetch all members from Discord API instead of using cache. | `false` |
| `type` | enum | ❌ | Filter members by type. | `"all"` |
| `sort` | enum | ❌ | Sort returned members. | `"username"` |

### 🧪 Example 1
```http
GET /api/guild/123456789012345678/members?type=human&sort=username
```
#### Response
```json
[
  {
    "id": "111111111111111111",
    "username": "Alice",
    "bot": false,
    "avatar": "https://cdn.discordapp.com/avatars/…"
  },
  {
    "id": "222222222222222222",
    "username": "Bob",
    "bot": false,
    "avatar": "https://cdn.discordapp.com/avatars/…"
  }
]
```

> **[Go back to the list of endpoints](./README.md)**