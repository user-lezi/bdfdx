# 📘 GET /db/keys/:namespace

> List keys in namespace

Returns all keys stored under a namespace.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\keys.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |

### 🧪 Example 1
```http
GET /api/db/keys/users
```
#### Response
```json
{
  "keys": [
    "123",
    "456"
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**