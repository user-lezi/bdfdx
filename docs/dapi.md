# 📘 /api/dapi
> Owner-only raw Discord API access via client.rest

**🛠 Methods:** `POST`
**📁 Source:** `\dist\routes\misc\dapi.js`

### 🧪 Example  
```http
POST /api/dapi
```
### 📦 Body Parameters
| Name | Description |
|------|-------------|
| `method` | HTTP method (GET, POST, PATCH, DELETE) |
| `route` | Discord API route (e.g. /users/@me) |
| `query` | Optional query object |
| `body` | Optional JSON body |

