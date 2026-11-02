#!/usr/bin/env python3
"""Generate separate mobile WebP copies in Supabase Storage; originals are never changed."""
import io, os, sys, time
from urllib.parse import quote
import requests
from PIL import Image, ImageOps

BASE = os.environ["SUPABASE_URL"].rstrip("/")
KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
BUCKET = "ogloszenia"
HEADERS = {"apikey": KEY, "Authorization": "Bearer " + KEY}
session = requests.Session()
session.headers.update(HEADERS)

def list_objects(prefix=""):
    offset = 0
    while True:
        resp = session.post(f"{BASE}/storage/v1/object/list/{BUCKET}", json={
            "prefix": prefix, "limit": 100, "offset": offset, "sortBy": {"column": "name", "order": "asc"}
        }, timeout=30)
        resp.raise_for_status()
        page = resp.json()
        for obj in page:
            name = obj["name"]
            path = prefix + name
            if obj.get("id") is None:
                yield from list_objects(path + "/")
            else:
                yield path
        if len(page) < 100:
            break
        offset += len(page)

def mobile_path(path):
    stem = path.rsplit(".", 1)[0]
    parent, filename = stem.rsplit("/", 1)
    return parent + "/mobile/" + filename + ".webp"

def main():
    files = set(list_objects())
    sources = sorted(p for p in files if "/mobile/" not in p and p.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    created = skipped = failed = 0
    for path in sources:
        target = mobile_path(path)
        if target in files:
            skipped += 1
            continue
        try:
            src = session.get(f"{BASE}/storage/v1/object/authenticated/{BUCKET}/{quote(path, safe='/')}", timeout=45)
            src.raise_for_status()
            with Image.open(io.BytesIO(src.content)) as img:
                img = ImageOps.exif_transpose(img)
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                if img.mode != "RGB":
                    background = Image.new("RGB", img.size, "white")
                    if "A" in img.getbands(): background.paste(img, mask=img.getchannel("A"))
                    else: background.paste(img)
                    img = background
                buf = io.BytesIO()
                img.save(buf, format="WEBP", quality=65, method=6)
            dest = session.post(f"{BASE}/storage/v1/object/{BUCKET}/{quote(target,safe='/')}",
                headers={"Content-Type": "image/webp", "cache-control": "3600", "x-upsert": "false"},
                data=buf.getvalue(), timeout=45)
            if dest.status_code == 409:
                skipped += 1
            else:
                dest.raise_for_status()
                created += 1
                print(f"CREATED {target}: {len(buf.getvalue())} bytes")
        except Exception as exc:
            failed += 1
            print(f"FAILED {path}: {exc}", file=sys.stderr)
        time.sleep(0.1)
    print(f"Summary: created={created} skipped={skipped} failed={failed} total={len(sources)}")
    if failed: sys.exit(1)

if __name__ == "__main__": main()
