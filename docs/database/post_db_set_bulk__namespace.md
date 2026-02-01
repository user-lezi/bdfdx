# 📘 POST /db/set-bulk/:namespace

> Set multiple values

Set multiple key-value pairs in a namespace.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\set-bulk.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `entries` | array | ✅ | - | `[["123",{"xp":10}],["456",{"xp":20}]]` |

### 🧪 Example 1
```http
POST /api/db/set-bulk/users
```
#### Body
```json
{
  "entries": [
    [
      "123",
      {
        "xp": 10
      }
    ]
  ]
}
```
#### Response
```json
{
  "success": true
}
```

> **[Go back to the list of endpoints](./README.md)**