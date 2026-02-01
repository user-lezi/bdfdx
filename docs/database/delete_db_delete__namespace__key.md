# 📘 DELETE /db/delete/:namespace/:key

> Delete a key

Delete a key from the database.

**🏷 Tags:** db
**📁 Source:** `\dist\routes\db\delete.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `namespace` | string | ✅ | - | - |
| `key` | string | ✅ | - | - |

### 🧪 Example 1
```http
DELETE /api/db/delete/users/123456
```
#### Response
```json
{
  "deleted": true
}
```

> **[Go back to the list of endpoints](./README.md)**