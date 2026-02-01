# 📘 GET /endpoints

> List all API endpoints

Returns a machine-readable list of all available API endpoints along with their metadata. Primarily used for documentation generation, API explorers, and internal tooling.

**🏷 Tags:** utility, internal
**📁 Source:** `\dist\routes\misc\internals\endpoints.js`

### 🧪 Example 1
```http
GET /api/endpoints
```
#### Response
```json
{
  "endpoints": [
    {
      "path": "/guild/:id",
      "methods": [
        "get",
        "delete"
      ],
      "summary": "Fetch guild info or leave a guild",
      "tags": [
        "guild",
        "action"
      ]
    },
    {
      "path": "/user/:id",
      "methods": [
        "get"
      ],
      "summary": "Fetch a user's public Discord profile",
      "tags": [
        "user"
      ]
    }
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**