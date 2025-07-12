import requests
import json
import time
import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

# Load deals
with open("deals.json") as f:
    deals = json.load(f)

# Load config
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

# Format message
def format_msg(deal, platform):
    try:
        original = int(deal['originalPrice'].replace(',', ''))
        current = int(deal['currentPrice'].replace(',', ''))
        savings = original - current
    except:
        savings = f"{deal['discount']}%"

    base = f"""🛍️ {deal['title']}

💰 Original Price: ₹{deal['originalPrice']}
🔥 Deal Price: ₹{deal['currentPrice']}
💸 You Save: ₹{savings} ({deal['discount']}% OFF)

🛒 Buy Now: {deal['buyLink']}"""

    if platform == "telegram":
        return base + "\n\n📢 Join our WhatsApp Channel:\nhttps://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"
    elif platform == "whatsapp":
        return base + "\n\n📢 Join our Telegram Channel:\nhttps://t.me/ShoppingEvreyday"
    else:
        return base + "\n\nAbove link for buying!\n📢 Telegram: https://t.me/ShoppingEvreyday\n📱 WhatsApp: https://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"

# Telegram Post
def post_telegram(deal, msg):
    media_url = deal["image"]
    payload = {
        "chat_id": TELEGRAM_CHANNEL,
        "caption": msg,
        "photo": media_url
    }
    res = requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto", data=payload)
    if res.status_code == 200:
        print("✅ Telegram:", deal["title"])
    else:
        print("❌ Telegram failed:", res.text)

# WhatsApp Post
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

# Facebook Post (image/video)
def post_facebook(deal, msg):
    if deal.get("video"):
        endpoint = f"https://graph.facebook.com/{FB_PAGE_ID}/videos"
        data = {
            "file_url": deal["video"],
            "description": msg,
            "access_token": FB_ACCESS_TOKEN
        }
    else:
        endpoint = f"https://graph.facebook.com/{FB_PAGE_ID}/photos"
        data = {
            "url": deal["image"],
            "caption": msg,
            "access_token": FB_ACCESS_TOKEN
        }

    res = requests.post(endpoint, data=data)
    if res.status_code == 200:
        print("✅ Facebook:", deal["title"])
    else:
        print("❌ Facebook error:", res.text)

# Instagram Post (REELS/image)
def post_instagram(deal, msg):
    try:
        media_url = deal.get("video") or deal.get("image")
        is_video = bool(deal.get("video"))

        media_type = "REELS" if is_video else None
        media_payload = {
            "caption": msg,
            "access_token": IG_ACCESS_TOKEN
        }

        if is_video:
            media_payload["media_type"] = "REELS"
            media_payload["video_url"] = media_url
        else:
            media_payload["image_url"] = media_url

        # Step 1: Create media container
        container = requests.post(
            f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
            data=media_payload
        ).json()

        if "id" not in container:
            print("❌ Instagram container failed:", container)
            return

        creation_id = container["id"]

        # Step 2: Wait for media to be ready
        for _ in range(10):
            status = requests.get(
                f"https://graph.facebook.com/v19.0/{creation_id}?fields=status_code&access_token={IG_ACCESS_TOKEN}"
            ).json()
            if status.get("status_code") == "FINISHED":
                break
            time.sleep(3)
        else:
            print("❌ Instagram timeout: Media not ready")
            return

        # Step 3: Publish
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
            print("❌ Instagram publish failed:", publish)

    except Exception as e:
        print("❌ Instagram error:", e)

# === Main Posting Loop ===
start_from_id = 2

for deal in deals:
    try:
        if int(deal.get("id", 0)) < start_from_id:
            continue

        telegram_msg = format_msg(deal, "telegram")
        whatsapp_msg = format_msg(deal, "whatsapp")
        fb_ig_msg = format_msg(deal, "other")

        post_telegram(deal, telegram_msg)
        post_whatsapp(whatsapp_msg)
        post_facebook(deal, fb_ig_msg)
        post_instagram(deal, fb_ig_msg)

        print("✅ All posted for:", deal["title"])
        time.sleep(18000)

    except Exception as e:
        print("❌ Error posting deal:", deal.get("title"), "-", e)