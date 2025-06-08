import requests
import json
import time

BOT_TOKEN = '7625076150:AAHjA6HCHyYdVu9LXF0cwhkiUJ9ASoLaTHE'  # Replace this
CHANNEL_ID = '@ShoppingEvreyday'  # Replace this
DEALS_FILE = 'deals.json'
POST_INTERVAL = 60  # seconds

def post_deal(deal):
    # Calculate savings
    try:
        original = int(str(deal['originalPrice']).replace(",", ""))
        current = int(str(deal['currentPrice']).replace(",", ""))
        savings = original - current
    except:
        original = deal['originalPrice']
        current = deal['currentPrice']
        savings = f"{deal['discount']}%"

    text = f"""🛍️ *{deal['title']}*

💰 *Original Price:* ₹{deal['originalPrice']}  
🔥 *Deal Price:* ₹{deal['currentPrice']}  
💸 *You Save:* ₹{savings} ({deal['discount']}% OFF)

🛒 *Click the button below to buy now!*"""

    # Inline "Buy Now" button
    button = {
        "inline_keyboard": [[
            {
                "text": "🛍️ Buy Now",
                "url": deal["buyLink"]
            }
        ]]
    }

    # Send image + text + button
    payload = {
        'chat_id': CHANNEL_ID,
        'caption': text,
        'parse_mode': 'Markdown',
        'photo': deal['image'],
        'reply_markup': json.dumps(button)
    }

    response = requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto',
        data=payload
    )

    if response.status_code == 200:
        print(f"✅ Posted: {deal['title']}")
    else:
        print(f"❌ Failed to post: {deal['title']}")
        print("Response:", response.text)

    time.sleep(POST_INTERVAL)

# Load and loop deals
with open(DEALS_FILE, 'r') as f:
    deals = json.load(f)

for deal in deals:
    post_deal(deal)