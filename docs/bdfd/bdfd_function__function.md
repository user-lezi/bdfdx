# 📘 /bdfd/function/:function

> Get a BDFD function by name

Fetch detailed information about a specific BDFD function. If no exact match is found, similar functions are suggested.

**🛠 Methods:** `GET`
**🏷 Tags:** bdfd, utility
**📁 Source:** `\dist\routes\bdfd\function.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `function` | string | ✅ | Function tag or partial name (case-insensitive) | `"$addButton"` |

### 🧪 Example 1
```http
GET /api/bdfd/function/$addButton
```
#### Response
```json
{
  "exact": true,
  "function": {
    "tag": "$addButton[]",
    "cleanTag": "$addButton[]",
    "position": 12
  },
  "matches": [
    "$addButton[]"
  ]
}
```

### 🧪 Example 2
```http
GET /api/bdfd/function/$addButon
```
#### Response
```json
{
  "exact": false,
  "function": {
    "tag": "$addButton[]",
    "cleanTag": "$addButton[]",
    "position": 12
  },
  "matches": [
    "$addButton[]",
    "$ai[]"
  ]
}
```

> **[Go back to the list of endpoints](./README.md)**