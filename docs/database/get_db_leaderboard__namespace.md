# 📘 GET /db/leaderboard/:namespace

> Generate leaderboard

Generate a leaderboard sorted by a numeric object path.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\leaderboard.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `path` | string | ✅ | - | `"stats.xp"` |
| `limit` | number | ❌ | - | `10` |
| `order` | string | ❌ | - | `"desc"` |

### 🧪 Example 1
```http
GET /api/db/leaderboard/users?path=stats.xp&limit=3
```
#### Response
```json
{
  "data": [
    {
      "key": "123",
      "value": 100
    },
    {
      "key": "456",
      "value": 80
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**