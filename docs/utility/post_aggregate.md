# 📘 POST /aggregate

> Aggregate multiple API calls

Executes multiple internal API calls in parallel and returns their results in a single response.

**🏷 Tags:** utility, internal
**📁 Source:** `\dist\routes\misc\internals\aggregate.js`

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `calls` | array | ✅ | List of requests | `[{"path":"/bot","method":"get"},{"path":"/guilds","method":"get"}]` |

### 🧪 Example 1
```http
POST /api/aggregate
```
#### Body
```json
{
  "calls": [
    {
      "path": "/bot",
      "method": "get"
    },
    {
      "path": "/guilds",
      "method": "get"
    }
  ]
}
```
#### Response
```json
{
  "results": [
    {
      "path": "/bot",
      "method": "get",
      "ok": true,
      "status": 200
    },
    {
      "path": "/guilds",
      "method": "get",
      "ok": true,
      "status": 200
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**