#!/usr/bin/env python3
"""
Image Processor
Processes generated PNG images, creates optimized variants, and uploads to Supabase Storage.
"""

import os
from pathlib import Path
from datetime import datetime, timezone
from PIL import Image
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Directories
SCRIPT_DIR = Path(__file__).parent
IMAGES_DIR = SCRIPT_DIR.parent / "afbeelding-generator" / "afbeeldingen"

# Storage bucket
BUCKET_NAME = "media"

# Image size ladders - 16:9 formats (hero images)
SIZES_16_9 = [
    ((1280, 720), "hero_1600.webp"),
    ((1024, 576), "hero_1200.webp"),
    ((768, 432), "hero_800.webp"),
    ((480, 270), "hero_400.webp"),
]

# Image size ladders - 1:1 formats (list/thumbnail images)
SIZES_1_1 = [
    ((384, 384), "list_320.webp"),
    ((512, 512), "list_480.webp"),
    ((768, 768), "list_600.webp"),
]

# Mapping for database columns
DB_COLUMN_MAPPING = {
    "hero_1600.webp": "image_large",
    "hero_1200.webp": "image_standard",
    "hero_800.webp": "image_tablet",
    "hero_400.webp": "image_mobile",
    "list_320.webp": "image_list",
}


def get_png_files():
    """Get all PNG files in the images directory."""
    if not IMAGES_DIR.exists():
        return []
    return list(IMAGES_DIR.glob("*.png"))


def get_article_by_image_filename(filename: str):
    """Find article by image_standard filename."""
    # The image_generator stores the filename in image_standard
    response = supabase.table("articles").select("id").eq("image_standard", filename).limit(1).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None


def center_crop_square(img: Image.Image) -> Image.Image:
    """Crop image to square from center."""
    width, height = img.size
    size = min(width, height)
    left = (width - size) // 2
    top = (height - size) // 2
    right = left + size
    bottom = top + size
    return img.crop((left, top, right, bottom))


def center_crop_16_9(img: Image.Image) -> Image.Image:
    """Crop image to 16:9 aspect ratio from center."""
    width, height = img.size
    target_ratio = 16 / 9

    current_ratio = width / height

    if abs(current_ratio - target_ratio) < 0.01:
        # Already 16:9, no crop needed
        return img

    if current_ratio > target_ratio:
        # Image is wider than 16:9, crop width
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        return img.crop((left, 0, left + new_width, height))
    else:
        # Image is taller than 16:9, crop height
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        return img.crop((0, top, width, top + new_height))


def resize_image(img: Image.Image, size: tuple, crop_square: bool = False, crop_16_9: bool = False) -> Image.Image:
    """Resize image to specified size with optional cropping."""
    if crop_square:
        img = center_crop_square(img)
    elif crop_16_9:
        img = center_crop_16_9(img)
    return img.resize(size, Image.Resampling.LANCZOS)


def process_image(png_path: Path) -> dict:
    """Process a PNG image and create all variants."""
    variants = {}

    with Image.open(png_path) as img:
        # Convert to RGB if necessary (for webp compatibility)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Log input dimensions
        width, height = img.size
        print(f"  Input image: {width}x{height} (ratio: {width/height:.2f})")

        # Generate 16:9 variants (hero images)
        # First crop to 16:9 if needed, then resize
        for size, filename in SIZES_16_9:
            resized = resize_image(img, size, crop_16_9=True)
            temp_path = IMAGES_DIR / f"temp_{filename}"
            resized.save(temp_path, 'WEBP', quality=85)
            variants[filename] = temp_path

        # Generate 1:1 variants (list images - center crop from original)
        for size, filename in SIZES_1_1:
            resized = resize_image(img, size, crop_square=True)
            temp_path = IMAGES_DIR / f"temp_{filename}"
            resized.save(temp_path, 'WEBP', quality=85)
            variants[filename] = temp_path

    return variants


def upload_to_storage(file_path: Path, storage_path: str) -> str:
    """Upload file to Supabase Storage and return public URL."""
    with open(file_path, 'rb') as f:
        file_data = f.read()

    # Upload to storage
    supabase.storage.from_(BUCKET_NAME).upload(
        storage_path,
        file_data,
        {"content-type": "image/webp", "upsert": "true"}
    )

    # Get public URL
    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
    return public_url


def update_article_images(article_id: str, image_urls: dict) -> bool:
    """Update article with image URLs."""
    try:
        supabase.table("articles").update(image_urls).eq("id", article_id).execute()
        return True
    except Exception as e:
        print(f"  Error updating article: {e}")
        return False


def cleanup_files(png_path: Path, variants: dict):
    """Remove local PNG and temporary webp files."""
    # Remove original PNG
    if png_path.exists():
        png_path.unlink()
        print(f"  Deleted: {png_path.name}")

    # Remove temporary webp files
    for temp_path in variants.values():
        if temp_path.exists():
            temp_path.unlink()


def process_single_image(png_path: Path) -> bool:
    """Process a single PNG image end-to-end."""
    filename = png_path.name  # full filename with extension
    print(f"\nProcessing: {filename}")

    # Find article by image_standard field
    article = get_article_by_image_filename(filename)
    if not article:
        print(f"  Article not found for image: {filename}")
        return False

    article_id = article['id']
    print(f"  Found article ID: {article_id}")

    # Process image into variants
    print("  Creating image variants...")
    variants = process_image(png_path)
    print(f"  Created {len(variants)} variants")

    # Upload all variants
    print("  Uploading to Supabase Storage...")
    image_urls = {}

    for filename, temp_path in variants.items():
        storage_path = f"articles/{article_id}/{filename}"
        try:
            public_url = upload_to_storage(temp_path, storage_path)

            # Check if this filename maps to a database column
            if filename in DB_COLUMN_MAPPING:
                column = DB_COLUMN_MAPPING[filename]
                image_urls[column] = public_url
                print(f"    Uploaded {filename} → {column}")
            else:
                print(f"    Uploaded {filename}")
        except Exception as e:
            print(f"    Error uploading {filename}: {e}")

    # Update database with image URLs
    if image_urls:
        print("  Updating database with image URLs...")
        if update_article_images(article_id, image_urls):
            print(f"  Updated {len(image_urls)} image columns")
        else:
            print("  Failed to update database")
            return False

    # Set published_at to publish the article
    print("  Setting published_at timestamp...")
    now = datetime.now(timezone.utc).isoformat()

    try:
        supabase.table("articles").update({
            "published_at": now
        }).eq("id", article_id).execute()
        print(f"  Article published at: {now}")
    except Exception as e:
        print(f"  Error setting published_at: {e}")
        return False

    # Cleanup
    print("  Cleaning up local files...")
    cleanup_files(png_path, variants)

    return True


def main():
    """Main image processor function."""
    print("Starting Image Processor...")

    # Get all PNG files
    png_files = get_png_files()

    if not png_files:
        print("No PNG files found to process.")
        return

    print(f"Found {len(png_files)} PNG file(s) to process")

    # Process each file
    success_count = 0
    for png_path in png_files:
        if process_single_image(png_path):
            success_count += 1

    print(f"\nProcessing complete. {success_count}/{len(png_files)} images processed successfully.")


if __name__ == "__main__":
    main()
