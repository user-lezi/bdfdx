# 📘 /api/guild/:id/members
> Returns members of a guild.

**🛠 Methods:** `GET`
**📁 Source:** `\dist\routes\discord\guild\members.js`

### 🧪 Example  
```http
GET /api/guild/:id/members
```
### 🔍 Query Parameters
| Name | Description |
|------|-------------|
| `fetch` | Force-fetch all members from API instead of cache. Default: false. |
| `type` | `all`, `bots`, or `human`. Default: `all`. |
| `sort` | `username`, `id`, or `joined`. Default: none. |

