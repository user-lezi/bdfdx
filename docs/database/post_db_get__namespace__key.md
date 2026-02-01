# 📘 POST /db/get/:namespace/:key

> Get a value from database

Get the value from the database with the provided namespace and key.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\get.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | The namespace | `"users"` |
| `key` | string | ✅ | the key | `"123456123456123456"` |

### 🧪 Example 1
```http
POST /api/db/get/users/123123123123
```
#### Response
```json
{
  "namespace": "users",
  "key": "123123123123",
  "value": {
    "name": "lezi"
  }
}
```

> **[Go back to the list of endpoints](./README.md)**