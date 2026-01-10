# 📘 /dapi

> Raw Discord REST API access

Allows the bot owner to directly execute raw Discord REST API requests using client.rest. Extremely powerful and unsafe.

**🛠 Methods:** `POST`
**🏷 Tags:** unsafe, discord, bot, action
**📁 Source:** `\dist\routes\misc\dapi.js`

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `method` | enum | ❌ | HTTP method to use for the Discord API request | `"GET"` |
| `route` | string | ✅ | Discord API route (without base URL) | `"/users/@me"` |
| `query` | object | ❌ | Optional query parameters object | `{"limit":10}` |
| `body` | object | ❌ | Optional JSON body for the request | `{"name":"New Channel Name"}` |

### 🧪 Example 1
```http
POST /api/dapi
```
#### Body
```json
{
  "method": "GET",
  "route": "/users/@me"
}
```
#### Response
```json
{
  "ok": true,
  "method": "GET",
  "route": "/users/@me",
  "fullRoute": "/users/@me",
  "response": {
    "id": "1234567890",
    "username": "Bot"
  },
  "type": "object"
}
```

> **[Go back to the list of endpoints](./README.md)**