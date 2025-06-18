// Klaviyo API Configuration
export const KLAVIYO_CONFIG = {
  // Replace these with your actual Klaviyo credentials
  LIST_ID: process.env.VITE_KLAVIYO_LIST_ID || "YOUR_KLAVIYO_LIST_ID",
  API_KEY: process.env.VITE_KLAVIYO_API_KEY || "YOUR_KLAVIYO_API_KEY",
  BASE_URL: "https://a.klaviyo.com/api/v2"
}

// Klaviyo API functions
export const klaviyoAPI = {
  // Add subscriber to list
  async addSubscriber(email: string, firstName?: string) {
    const data = {
      data: {
        type: "subscription",
        attributes: {
          profile: {
            email: email,
            first_name: firstName || email.split('@')[0], // Use email prefix as fallback
          },
          custom_source: "SCAMP Early Access"
        }
      }
    }

    const response = await fetch(`${KLAVIYO_CONFIG.BASE_URL}/list/${KLAVIYO_CONFIG.LIST_ID}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_CONFIG.API_KEY}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Klaviyo API error: ${response.status}`)
    }

    return response.json()
  },

  // Alternative: Use Klaviyo's embed form (simpler setup)
  getEmbedFormUrl() {
    return "https://www.klaviyo.com/forms/YOUR_FORM_ID" // Replace with your actual form ID
  }
} 