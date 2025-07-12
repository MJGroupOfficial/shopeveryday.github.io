import requests
import json
import datetime
import time
import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

# Load product deals
with open("deals.json") as f:
    deals = json.load(f)

# === Config ===
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHANNEL = os.getenv("TELEGRAM_CHANNEL")

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH = os.getenv("TWILIO_AUTH")
WHATSAPP_FROM = os.getenv("WHATSAPP_FROM")
WHATSAPP_TO = os.getenv("WHATSAPP_TO")

FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_ACCESS_TOKEN = os.getenv("FB_ACCESS_TOKEN")

IG_USER_ID = os.getenv("IG_USER_ID")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")

twilio_client = Client(TWILIO_SID, TWILIO_AUTH)

# === Helpers ===
def format_msg(deal, platform):
    try:
        original = int(deal["originalPrice"].replace(",", ""))
        current = int(deal["currentPrice"].replace(",", ""))
        savings = original - current
    except:
        savings = f"{deal['discount']}%"

    base = f"""🛍️ {deal['title']}

💰 Original: ₹{deal['originalPrice']}
🔥 Deal: ₹{deal['currentPrice']}
💸 Save ₹{savings} ({deal['discount']}% OFF)

🛒 Buy Now: {deal['buyLink']}"""

    if platform == "telegram":
        return base + "\n\n📢 Join our WhatsApp Channel:\nhttps://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"
    elif platform == "whatsapp":
        return base + "\n\n📢 Join our Telegram Channel:\nhttps://t.me/ShoppingEvreyday"
    else:
        return base + "\n\n📢 Telegram: https://t.me/ShoppingEvreyday\n📱 WhatsApp: https://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"

# === Posting Functions ===
def post_telegram(deal, msg):
    media_url = deal.get("image")
    res = requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto",
        data={
            "chat_id": TELEGRAM_CHANNEL,
            "caption": msg,
            "photo": media_url
        }
    )
    if res.status_code == 200:
        print("✅ Telegram:", deal["title"])
    else:
        print("❌ Telegram failed:", res.text)

def post_whatsapp(msg):
    try:
        message = twilio_client.messages.create(
            body=msg,
            from_=WHATSAPP_FROM,
            to=WHATSAPP_TO
        )
        print("✅ WhatsApp sent:", message.sid)
    except Exception as e:
        print("❌ WhatsApp failed:", e)

def post_facebook(deal, msg):
    media_type = "video" if deal.get("video") else "image"
    url_key = "file_url" if media_type == "video" else "url"
    media_url = deal.get("video") if deal.get("video") else deal.get("image")

    endpoint = "videos" if media_type == "video" else "photos"
    data = {
        url_key: media_url,
        "caption": msg,
        "access_token": FB_ACCESS_TOKEN
    }

    res = requests.post(f"https://graph.facebook.com/{FB_PAGE_ID}/{endpoint}", data=data)
    if res.status_code == 200:
        print("✅ Facebook:", deal["title"])
    else:
        print("❌ Facebook error:", res.text)

def post_instagram(deal, msg):
    media_ids = []

    # Step 1: main image
    if deal.get("image"):
        r = requests.post(
            f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
            data={
                "image_url": deal["image"],
                "caption": msg,
                "access_token": IG_ACCESS_TOKEN
            }
        ).json()
        if "id" in r:
            media_ids.append(r["id"])
        else:
            print("❌ Instagram main image error:", r)

    # Step 2: video (reels)
    if deal.get("video"):
        r = requests.post(
            f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
            data={
                "media_type": "REELS",
                "video_url": deal["video"],
                "caption": msg,
                "access_token": IG_ACCESS_TOKEN
            }
        ).json()
        if "id" in r:
            media_ids.append(r["id"])
        else:
            print("❌ Instagram video error:", r)

    # Step 3: other images
    for img in deal.get("images", []):
        r = requests.post(
            f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
            data={
                "image_url": img,
                "access_token": IG_ACCESS_TOKEN
            }
        ).json()
        if "id" in r:
            media_ids.append(r["id"])
        else:
            print("❌ Instagram extra image error:", r)

    # Step 4: publish carousel
    if media_ids:
        carousel_req = requests.post(
            f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
            data={
                "media_type": "CAROUSEL",
                "children": ",".join(media_ids),
                "caption": msg,
                "access_token": IG_ACCESS_TOKEN
            }
        ).json()

        if "id" in carousel_req:
            creation_id = carousel_req["id"]

            publish = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish",
                data={
                    "creation_id": creation_id,
                    "access_token": IG_ACCESS_TOKEN
                }
            ).json()

            if "id" in publish:
                print(f"✅ Instagram posted: {deal['title']}")
            else:
                print("❌ Instagram publish error:", publish)
        else:
            print("❌ Instagram carousel creation failed:", carousel_req)
    else:
        print("❌ Instagram: No media to post")

# === Posting Loop ===
start_from_id = 1

for deal in deals:
    while True:
        now = datetime.datetime.now()
        current_hour = now.hour

        # Only post between 9:00 AM and 9:00 PM
        if 9 <= current_hour < 21:
            break  # It's within allowed time, continue posting
        else:
            print("⏸️ Sleeping... Outside of posting hours (9AM - 9PM). Waiting 10 minutes...")
            time.sleep(600)  # Sleep for 10 minutes before checking again

    # ---- Post to all platforms ----
    media_url = deal.get("video") or deal.get("image")
    telegram_msg = format_msg(deal, "telegram")
    whatsapp_msg = format_msg(deal, "whatsapp")
    fb_ig_msg = format_msg(deal, "other")

    post_telegram(deal, telegram_msg, media_url)
    post_whatsapp(whatsapp_msg)
    post_facebook(fb_ig_msg, media_url)
    post_instagram(deal, fb_ig_msg)

    print("✅ All posted for:", deal["title"])

    # Wait 6 hours before next product
    time.sleep(21600)