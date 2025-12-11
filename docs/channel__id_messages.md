# 📘 /api/channel/:id/messages
> Send a message to a channel. Supports both v1 and v2 component formats.

**🛠 Methods:** `POST`
**📁 Source:** `\dist\routes\discord\channel\postmessages.js`

### 🧪 Example  
```http
POST /api/channel/:id/messages
```
### 📦 Body Parameters
| Name | Description |
|------|-------------|
| `content` | Message text content |
| `embeds` | Array of embed objects |
| `components` | Array of components |

