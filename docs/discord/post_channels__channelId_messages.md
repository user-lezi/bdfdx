# 📘 POST /channels/:channelId/messages

> Fetch messages from a channel

Fetches messages from a text channel. Supports pagination, user filtering, and full-history fetch when limit is omitted.

**🏷 Tags:** message, discord
**📁 Source:** `\dist\routes\discord\channel\allMessages.js`

### 📌 URL Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `channelId` | string | ✅ | Channel ID | - |

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `limit` | number | ❌ | Number of messages to fetch. If omitted, all messages will be fetched. | `100` |
| `before` | string | ❌ | Fetch messages before this message ID | - |
| `after` | string | ❌ | Fetch messages after this message ID | - |
| `from` | string | ❌ | Only include messages from this user ID | - |

### 🧪 Example 1
```http
POST /api/channels/123456789/messages?limit=50
```

### 🧪 Example 2
```http
POST /api/channels/123456789/messages?from=987654321
```

> **[Go back to the list of endpoints](./README.md)**