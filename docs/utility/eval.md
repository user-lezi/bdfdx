# 📘 /eval

> Evaluate JavaScript code

Executes arbitrary JavaScript code in an async context and returns the result along with captured console output.

**🛠 Methods:** `POST`
**🏷 Tags:** unsafe, utility, action
**📁 Source:** `\dist\routes\misc\eval.js`

### 📦 Body Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `code` | string | ✅ | The JavaScript code to evaluate | `"console.log('hi'); 2 + 2;"` |

### 🧪 Example 1
```http
POST /api/eval
```
#### Body
```json
{
  "code": "console.log('hi'); 2 + 2;"
}
```
#### Response
```json
{
  "ok": true,
  "result": "4",
  "logs": [
    "hi"
  ],
  "type": "number"
}
```

> **[Go back to the list of endpoints](./README.md)**