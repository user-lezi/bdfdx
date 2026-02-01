# BDFDX
An external API for BDFD, adding the features that BDFD is too lazy to implement. 😎

---

## 🚀 Setup

1. **Fork the repository**  
2. **Create a `.env` file** with the following:
```env
Port=4000
BotToken=your_discord_bot_token
Password=your_panel_password
```
3. Install dependencies
```bash
npm install
```
4. Run the server
```bash
node dist/index.js
```
5. Access the API
- Base URL: `http://localhost:4000/api/*`
- Include your password in the headers: password: "your_panel_password"

6. Access the panel
- The web panel is available at the same host once the server is running.

---

## ✨ Features

- Multiple cool endpoints for Discord bots
- Easy to use API design
- Panel for quick overview and management 👀

---

## ⚡ Quick Example
- Using BDFD
```
$httpAddHeader[password;your_panel_password]
$httpGet[http://localhost:4000/api/bot]
$httpResult $c[ The API Response ]
```

- Using fetch in JavaScript:
```js
const PASSWORD = "your_panel_password";

async function getBotInfo() {
  const res = await fetch("http://localhost:4000/api/bot", {
    headers: { password: PASSWORD }
  });
  const data = await res.json();
  console.log(data);
}

getBotInfo();
```
- Using curl in Terminal:
```curl
curl -H "password: your_panel_password" http://localhost:4000/api/bot
```

---

## ❤️ Made with love by Lezi
Don't forget to ⭐ the repo!