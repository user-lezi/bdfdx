# 📘 /api/user/:id
> Fetches a user's public Discord profile and optionally returns more detailed information.

**🛠 Methods:** `GET`
**📁 Source:** `\dist\routes\user.js`

### 🧪 Example  
```http
GET /api/user/:id
```
### 🔍 Query Parameters
| Name | Description |
|------|-------------|
| `fetch` | Force refetch from API instead of cache (true/false) |
| `mutualGuilds` | Include list of guild IDs the bot shares with the user (true/false) |
| `raw` | Include raw Discord.js user object (true/false) |

