# 📘 /bdfd/functions

> List all BDFD functions.

Returns a list of all available BDFD functions with or without details.

**🛠 Methods:** `GET`
**🏷 Tags:** bdfd, utility
**📁 Source:** `\dist\routes\bdfd\functions.js`

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `detailed` | boolean | ❌ | Show detailed information about the function | `true` |

### 🧪 Example 1
```http
GET /api/bdfd/functions
```
#### Response
```json
[
  "$addButton[]",
  "$ai",
  "$botID"
]
```

### 🧪 Example 2
```http
GET /api/bdfd/functions?detailed=true
```
#### Response
```json
[
  {
    "tag": "$addButton[]",
    "cleanTag": "$addButton[]",
    "position": 0,
    "description": "Adds a button component",
    "arguments": [],
    "premium": false
  }
]
```

> **[Go back to the list of endpoints](./README.md)**