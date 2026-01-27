# 📘 GET /user/:userId

> Fetch Discord user profile

Fetches a user's public Discord profile and can optionally include mutual guilds or the raw Discord.js user object.

**🏷 Tags:** discord, user
**📁 Source:** `\dist\routes\discord\user.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `userId` | string | ✅ | Discord user ID | `"123456789012345678"` |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `fetch` | boolean | ❌ | Force refetch from Discord API instead of cache | `true` |
| `mutualGuilds` | boolean | ❌ | Include guilds the bot and user share (requires member cache) | `true` |
| `raw` | boolean | ❌ | Include raw Discord.js User object | `false` |

### 🧪 Example 1
```http
GET /api/user/123456789012345678?mutualGuilds=true
```
#### Response
```json
{
  "id": "123456789012345678",
  "username": "SomeUser",
  "displayName": "SomeUser",
  "tag": "SomeUser#0001",
  "bot": false,
  "globalName": "Some User",
  "flags": [
    "EarlySupporter"
  ],
  "avatar": "https://cdn.discordapp.com/...",
  "banner": null,
  "createdTimestamp": 1600000000000,
  "accentColor": 16711680,
  "mutualGuilds": [
    {
      "id": "987654321098765432",
      "name": "Example Server",
      "nickname": "Nick"
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**