# 📘 POST /db/incr/:namespace/:key

> Increment a numeric path

Increment a numeric value inside an object path.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\incr.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |
| `key` | string | ✅ | - | - |

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `path` | string | ✅ | - | `"stats.xp"` |
| `by` | number | ❌ | - | `1` |

### 🧪 Example 1
```http
POST /api/db/incr/users/123
```
#### Body
```json
{
  "path": "stats.xp",
  "by": 5
}
```
#### Response
```json
{
  "value": 10
}
```

> **[Go back to the list of endpoints](./README.md)**