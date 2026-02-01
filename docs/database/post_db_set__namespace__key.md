# 📘 POST /db/set/:namespace/:key

> Set a value in database

Set or update a value in the database for a namespace and key.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\set.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | `"users"` |
| `key` | string | ✅ | - | `"123456"` |

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `value` | any | ✅ | - | `{"name":"lezi"}` |
| `options` | object | ❌ | - | `{"merge":true,"ttl":60000}` |

### 🧪 Example 1
```http
POST /api/db/set/users/123456
```
#### Body
```json
{
  "value": {
    "name": "lezi"
  }
}
```
#### Response
```json
{
  "success": true
}
```

> **[Go back to the list of endpoints](./README.md)**