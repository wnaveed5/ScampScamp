# Klaviyo Setup Guide

## Getting Your Klaviyo Credentials

### 1. Get Your API Key
1. Go to [Klaviyo Settings](https://www.klaviyo.com/settings/account/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "SCAMP Early Access")
4. Copy the API key

### 2. Get Your List ID
1. Go to [Klaviyo Lists](https://www.klaviyo.com/lists)
2. Create a new list or select an existing one
3. Go to the list settings
4. Copy the List ID from the URL or settings

### 3. Environment Variables
Create a `.env` file in your project root with:

```env
VITE_KLAVIYO_LIST_ID=your_klaviyo_list_id_here
VITE_KLAVIYO_API_KEY=your_klaviyo_api_key_here
```

### 4. Update Configuration
Replace the placeholder values in `src/lib/klaviyo.ts`:

```typescript
export const KLAVIYO_CONFIG = {
  LIST_ID: process.env.VITE_KLAVIYO_LIST_ID || "YOUR_ACTUAL_LIST_ID",
  API_KEY: process.env.VITE_KLAVIYO_API_KEY || "YOUR_ACTUAL_API_KEY",
  BASE_URL: "https://a.klaviyo.com/api/v2"
}
```

## Alternative: Using Klaviyo Embed Form

If you prefer to use Klaviyo's embed form instead of the API:

1. Create a form in Klaviyo
2. Get the form embed code
3. Update the `getEmbedFormUrl()` function in `src/lib/klaviyo.ts`
4. Use the form URL instead of API calls

## Video Setup

1. Place your `scamp-hero.mov` video file in `public/videos/`
2. The video should be optimized for web (MP4 format, under 10MB)
3. The component will automatically use it as the background

## Testing

1. Start your development server
2. The lock screen should appear with the new design
3. Test both the email signup and password modes
4. Check your Klaviyo dashboard to see if subscribers are being added 