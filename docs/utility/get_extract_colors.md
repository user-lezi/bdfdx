# 📘 GET /extract-colors

> Extract dominant and accent colors from an image

Downloads an image and extracts dominant, palette, and accent colors using pixel sampling.

**🏷 Tags:** utility, image
**📁 Source:** `\dist\routes\misc\extract-colors.js`

### 🔍 Query Parameters
| Name | Type | Required | Description | Example |
|------|------|---------|-------------|--------|
| `image` | string | ✅ | The url if the image | `"https://placecats.com/300/200"` |

### 🧪 Example 1
```http
GET /api/extract-colors?image=https://placecats.com/300/200
```
#### Response
```json
{
  "dominant_color": {
    "rgb": [
      255,
      255,
      255
    ],
    "hex": "#ffffff"
  },
  "palette": [
    {
      "rgb": [
        255,
        255,
        255
      ],
      "hex": "#ffffff"
    }
  ],
  "accent": {
    "primary": {
      "rgb": [
        255,
        255,
        255
      ],
      "hex": "#ffffff"
    },
    "secondary": {
      "rgb": [
        255,
        255,
        255
      ],
      "hex": "#ffffff"
    }
  },
  "average_color": {
    "rgb": [
      255,
      255,
      255
    ],
    "hex": "#ffffff"
  }
}
```

> **[Go back to the list of endpoints](./README.md)**