import requests
import json
import datetime
import time
import os
from dotenv import load_dotenv
from twilio.rest import Client
from PIL import Image
from io import BytesIO

load_dotenv()

# === Load product deals ===
with open("deals2.json") as f:
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

def resize_image_from_url(url):
    try:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        image.thumbnail((1080, 1350))
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return buffer
    except Exception as e:
        print("❌ Image resize failed:", e)
        return None

# === Posting Functions ===

def post_telegram(deal, msg, media_url):
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
    try:
        media_urls = deal.get("images") if "images" in deal else [deal.get("image")]
        media_ids = []

        for url in media_urls:
            image_buffer = resize_image_from_url(url)
            if image_buffer:
                files = {'source': image_buffer}
                data = {
                    "published": "false",
                    "access_token": FB_ACCESS_TOKEN
                }
                r = requests.post(f"https://graph.facebook.com/{FB_PAGE_ID}/photos", data=data, files=files).json()
                if "id" in r:
                    media_ids.append({"media_fbid": r["id"]})
                else:
                    print("❌ Facebook image upload failed:", r)

        if not media_ids:
            print("❌ Facebook: No media to post.")
            return

        post_data = {"message": msg, "access_token": FB_ACCESS_TOKEN}
        for idx, media in enumerate(media_ids):
            post_data[f"attached_media[{idx}]"] = json.dumps(media)

        res = requests.post(f"https://graph.facebook.com/{FB_PAGE_ID}/feed", data=post_data)
        if res.status_code == 200:
            print("✅ Facebook post created:", deal["title"])
        else:
            print("❌ Facebook post failed:", res.text)

    except Exception as e:
        print("❌ Facebook error:", e)

def post_instagram(deal, msg):
    media_ids = []

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
        if 9 <= current_hour < 21:
            break
        else:
            print("⏸️ Sleeping... Outside of posting hours (9AM - 9PM). Waiting 10 minutes...")
            time.sleep(600)

    media_url = deal.get("video") or deal.get("image")
    telegram_msg = format_msg(deal, "telegram")
    whatsapp_msg = format_msg(deal, "whatsapp")
    fb_ig_msg = format_msg(deal, "other")

    post_telegram(deal, telegram_msg, media_url)
    post_whatsapp(whatsapp_msg)
    post_facebook(deal, fb_ig_msg)
    post_instagram(deal, fb_ig_msg)

    print("✅ All posted for:", deal["title"])
    time.sleep(21600)  # 6 hours