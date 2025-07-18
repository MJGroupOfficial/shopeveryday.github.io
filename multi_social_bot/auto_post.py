import os
import json
import time
import requests
import datetime
import schedule
from dotenv import load_dotenv
from twilio.rest import Client

# === Load .env ===
load_dotenv()

# === Load deals ===
with open("deals2.json") as f:
    deals = json.load(f)

# === Load or initialize posted_ids.json ===
POSTED_FILE = "posted_ids.json"
if not os.path.exists(POSTED_FILE):
    with open(POSTED_FILE, "w") as f:
        json.dump({"telegram": [], "facebook": [], "instagram": []}, f, indent=2)

with open(POSTED_FILE, "r") as f:
    posted_ids = json.load(f)

# === Environment Variables ===
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

# === Twilio Client ===
client = Client(TWILIO_SID, TWILIO_AUTH)

# === Hashtag Helper ===
def get_hashtags(platform):
    tags = {
        "telegram": "#DealsChannel #HotDiscounts #TelegramDeals #SaveNow",
        "facebook": "#ShopSmart #SaveBig #DealsOfTheDay #OnlineShopping #MustBuy",
        "instagram": "#SmartShopping #DealZone #OfferOfTheDay #InstaFinds #ReelDeals"
    }
    return tags.get(platform, "")

# === Message Formatter ===
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
        base += "\n\n📢 Join WhatsApp: https://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"
    elif platform == "whatsapp":
        base += "\n\n📢 Join Telegram: https://t.me/ShoppingEvreyday"
    else:
        base += "\n\n📢 Telegram: https://t.me/ShoppingEvreyday\n📱 WhatsApp: https://whatsapp.com/channel/0029Vb60MS8ADTOJrgbn6z3D"

    return base + "\n\n" + get_hashtags(platform)

# === Platform Posting ===

def post_telegram(deal):
    if deal["id"] in posted_ids["telegram"]:
        print("⏩ Already posted to Telegram:", deal["title"])
        return
    try:
        img_data = requests.get(deal["image"]).content
        files = {"photo": ("image.webp", img_data)}
        data = {
            "chat_id": TELEGRAM_CHANNEL,
            "caption": format_msg(deal, "telegram")
        }
        r = requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto", data=data, files=files)
        if r.status_code == 200:
            print("✅ Telegram:", deal["title"])
            posted_ids["telegram"].append(deal["id"])
        else:
            print("❌ Telegram failed:", r.text)
    except Exception as e:
        print("❌ Telegram error:", e)

def post_whatsapp(deal):
    try:
        msg = format_msg(deal, "whatsapp")
        message = client.messages.create(body=msg, from_=WHATSAPP_FROM, to=WHATSAPP_TO)
        print("✅ WhatsApp sent:", message.sid)
    except Exception as e:
        print("❌ WhatsApp failed:", e)

def post_facebook(deal):
    if deal["id"] in posted_ids["facebook"]:
        print("⏩ Already posted to Facebook:", deal["title"])
        return
    try:
        urls = deal.get("images") if "images" in deal else [deal.get("image")]
        media_ids = []
        for url in urls:
            data = {
                "url": url,
                "published": "false",
                "access_token": FB_ACCESS_TOKEN
            }
            res = requests.post(f"https://graph.facebook.com/{FB_PAGE_ID}/photos", data=data).json()
            if "id" in res:
                media_ids.append({"media_fbid": res["id"]})
            else:
                print("❌ FB image upload failed:", res)

        if not media_ids:
            print("❌ Facebook: No media to post.")
            return

        payload = {"message": format_msg(deal, "facebook"), "access_token": FB_ACCESS_TOKEN}
        for i, media in enumerate(media_ids):
            payload[f"attached_media[{i}]"] = json.dumps(media)

        r = requests.post(f"https://graph.facebook.com/{FB_PAGE_ID}/feed", data=payload)
        if r.status_code == 200:
            print("✅ Facebook:", deal["title"])
            posted_ids["facebook"].append(deal["id"])
        else:
            print("❌ Facebook post failed:", r.text)
    except Exception as e:
        print("❌ Facebook error:", e)

def post_instagram(deal):
    if deal["id"] in posted_ids["instagram"]:
        print("⏩ Already posted to Instagram:", deal["title"])
        return

    caption = format_msg(deal, "instagram")
    media_ids = []

    try:
        if deal.get("video"):
            # === Post REEL ===
            container = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
                data={
                    "media_type": "REELS",
                    "video_url": deal["video"],
                    "caption": caption,
                    "access_token": IG_ACCESS_TOKEN
                }
            ).json()

            creation_id = container.get("id")
            if not creation_id:
                print("❌ Instagram REEL container failed:", container)
                return

            for _ in range(10):
                status = requests.get(
                    f"https://graph.facebook.com/v19.0/{creation_id}?fields=status_code&access_token={IG_ACCESS_TOKEN}"
                ).json()
                if status.get("status_code") == "FINISHED":
                    break
                time.sleep(3)
            else:
                print("❌ Timeout: REEL not ready.")
                return

            publish = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish",
                data={
                    "creation_id": creation_id,
                    "access_token": IG_ACCESS_TOKEN
                }
            ).json()

            if "id" in publish:
                print("✅ Instagram (REEL):", deal["title"])
                posted_ids["instagram"].append(deal["id"])
            else:
                print("❌ Instagram REEL publish failed:", publish)

        else:
            # === Post Carousel ===
            if deal.get("image"):
                r = requests.post(
                    f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
                    data={
                        "image_url": deal["image"],
                        "access_token": IG_ACCESS_TOKEN
                    }
                ).json()
                if "id" in r:
                    media_ids.append(r["id"])
                else:
                    print("❌ Main image upload failed:", r)

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
                    print("❌ Extra image upload failed:", r)

            if not media_ids:
                print("❌ No images for carousel.")
                return

            carousel_req = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
                data={
                    "media_type": "CAROUSEL",
                    "children": ",".join(media_ids),
                    "caption": caption,
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
                    print("✅ Instagram (Carousel):", deal["title"])
                    posted_ids["instagram"].append(deal["id"])
                else:
                    print("❌ Instagram publish error:", publish)
            else:
                print("❌ Carousel creation failed:", carousel_req)

    except Exception as e:
        print("❌ Instagram error:", e)

# === Posting Jobs ===

def telegram_job():
    for deal in deals:
        if deal["id"] not in posted_ids["telegram"]:
            post_telegram(deal)
            break

def facebook_job():
    for deal in deals:
        if deal["id"] not in posted_ids["facebook"]:
            post_facebook(deal)
            break

def instagram_job():
    for deal in deals:
        if deal["id"] not in posted_ids["instagram"]:
            post_instagram(deal)
            break

# === Schedule Posts ===

schedule.every().day.at("10:30").do(facebook_job)
schedule.every().day.at("11:30").do(telegram_job)
schedule.every().day.at("17:30").do(instagram_job)

print("📅 Scheduler started. Waiting for post times...")

try:
    while True:
        schedule.run_pending()
        with open(POSTED_FILE, "w") as f:
            json.dump(posted_ids, f, indent=2)
        time.sleep(120)
except KeyboardInterrupt:
    print("🛑 Stopped manually.")