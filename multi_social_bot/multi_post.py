import requests
import json
import time
import os
from dotenv import load_dotenv
import tweepy

load_dotenv()

# Load product list
with open("deals.json") as f:
    deals = json.load(f)

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHANNEL = os.getenv("TELEGRAM_CHANNEL")

# WhatsApp (Twilio)
from twilio.rest import Client
twilio_client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH"))

# Twitter/X
auth = tweepy.OAuth1UserHandler(
    os.getenv("X_API_KEY"),
    os.getenv("X_API_SECRET"),
    os.getenv("X_ACCESS_TOKEN"),
    os.getenv("X_ACCESS_SECRET")
)
x_api = tweepy.API(auth)

# Facebook & Instagram
FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_TOKEN = os.getenv("FB_ACCESS_TOKEN")
IG_USER_ID = os.getenv("IG_USER_ID")
IG_TOKEN = os.getenv("IG_ACCESS_TOKEN")

def format_text(deal):
    return f"""🛍️ {deal['title']}

💰 Original: ₹{deal['originalPrice']}
🔥 Deal: ₹{deal['currentPrice']}
💸 Save ₹{int(str(deal['originalPrice']).replace(',', '')) - int(str(deal['currentPrice']).replace(',', ''))} ({deal['discount']}% OFF)

🔗 {deal['buyLink']}
"""

def post_telegram(deal, msg):
    requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto", data={
        "chat_id": TELEGRAM_CHANNEL,
        "caption": msg,
        "parse_mode": "Markdown",
        "photo": deal["image"]
    })

def post_whatsapp(msg):
    twilio_client.messages.create(
        body=msg,
        from_=os.getenv("WHATSAPP_FROM"),
        to=os.getenv("WHATSAPP_TO")
    )

def post_x(msg):
    x_api.update_status(msg)

def post_facebook(msg):
    requests.post(
        f"https://graph.facebook.com/{FB_PAGE_ID}/photos",
        data={
            "url": deal["image"],
            "caption": msg,
            "access_token": FB_TOKEN
        }
    )

def post_instagram(deal, msg):
    # Step 1: Upload media
    media = requests.post(
        f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
        data={
            "image_url": deal["image"],
            "caption": msg,
            "access_token": IG_TOKEN
        }
    ).json()
    creation_id = media["id"]

    # Step 2: Publish media
    requests.post(
        f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish",
        data={
            "creation_id": creation_id,
            "access_token": IG_TOKEN
        }
    )

for deal in deals:
    msg = format_text(deal)
    post_telegram(deal, msg)
    post_whatsapp(msg)
    post_x(msg)
    post_facebook(msg)
    post_instagram(deal, msg)
    print("✅ Posted:", deal["title"])
    time.sleep(60)