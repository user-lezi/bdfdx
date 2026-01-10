# 📘 /api/guild/:id
> Fetches a guild's public information or makes the bot leave the guild.

**🛠 Methods:** `GET`, `DELETE`
**📁 Source:** `\dist\routes\discord\guild\guild.js`

### 🧪 Example  
```http
GET /api/guild/:id
```
### 🔍 Query Parameters
| Name | Description |
|------|-------------|
| `fetch` | Force refetch from API instead of cache (true/false) |
| `raw` | Include raw Discord.js guild object (true/false) |

