# 📘 GET /db/all/:namespace

> Get all values

Returns all key-value pairs in a namespace.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\all.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |

### 🧪 Example 1
```http
GET /api/db/all/users
```
#### Response
```json
{
  "data": [
    {
      "key": "123",
      "value": {
        "name": "lezi"
      }
    },
    {
      "key": "456",
      "value": {
        "name": "alex"
      }
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**