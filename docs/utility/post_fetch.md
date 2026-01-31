# 📘 POST /fetch

> Batch fetch external resources

Performs multiple HTTP requests in parallel and returns their responses.

**🏷 Tags:** utility
**📁 Source:** `\dist\routes\misc\fetch.js`

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `request` | array | ✅ | List of fetch requests | `[{"url":"https://api.github.com","method":"GET"}]` |

### 🧪 Example 1
```http
POST /api/fetch
```
#### Body
```json
{
  "request": [
    {
      "url": "https://api.github.com",
      "method": "GET"
    },
    {
      "url": "https://httpbin.org/post",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "hello": "world"
      }
    }
  ]
}
```
#### Response
```json
{
  "results": [
    {
      "ok": true,
      "status": 200,
      "data": {}
    },
    {
      "ok": true,
      "status": 200,
      "data": {}
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**