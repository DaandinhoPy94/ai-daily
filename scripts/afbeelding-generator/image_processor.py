#!/usr/bin/env python3
"""
Image Processor
Processes generated PNG images, creates optimized variants, and uploads to Supabase Storage.
"""

import os
from pathlib import Path
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
IMAGES_DIR = SCRIPT_DIR / "afbeeldingen"

# Storage bucket
BUCKET_NAME = "media"

# Image size ladders
SIZES_16_9 = [
    (320, 180),
    (480, 270),
    (640, 360),
    (768, 432),
    (1024, 576),
    (1280, 720),
]

SIZES_1_1 = [
    (64, 64),
    (128, 128),
    (256, 256),
    (384, 384),
    (512, 512),
    (768, 768),
    (1024, 1024),
]

# Mapping for database columns
DB_COLUMN_MAPPING = {
    (1280, 720): "image_large",
    (1024, 576): "image_standard",
    (768, 432): "image_tablet",
    (480, 270): "image_mobile",
    (384, 384): "image_list",
}


def get_png_files():
    """Get all PNG files in the images directory."""
    if not IMAGES_DIR.exists():
        return []
    return list(IMAGES_DIR.glob("*.png"))


def get_article_by_image_filename(filename: str):
    """Find article by image_standard filename."""
    # The image_generator stores the filename in image_standard
    response = supabase.table("articles").select("id, slug").eq("image_standard", filename).limit(1).execute()
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


def resize_image(img: Image.Image, size: tuple, crop_square: bool = False) -> Image.Image:
    """Resize image to specified size."""
    if crop_square:
        img = center_crop_square(img)
    return img.resize(size, Image.Resampling.LANCZOS)


def process_image(png_path: Path) -> dict:
    """Process a PNG image and create all variants."""
    variants = {}

    with Image.open(png_path) as img:
        # Convert to RGB if necessary (for webp compatibility)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Generate 16:9 variants
        for size in SIZES_16_9:
            resized = resize_image(img, size, crop_square=False)
            filename = f"{size[0]}x{size[1]}.webp"
            temp_path = IMAGES_DIR / f"temp_{filename}"
            resized.save(temp_path, 'WEBP', quality=85)
            variants[size] = temp_path

        # Generate 1:1 variants (center crop)
        for size in SIZES_1_1:
            resized = resize_image(img, size, crop_square=True)
            filename = f"{size[0]}x{size[1]}.webp"
            temp_path = IMAGES_DIR / f"temp_{filename}"
            resized.save(temp_path, 'WEBP', quality=85)
            variants[size] = temp_path

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

    slug = article['slug']
    print(f"  Found article ID: {article['id']}, slug: {slug}")

    # Process image into variants
    print("  Creating image variants...")
    variants = process_image(png_path)
    print(f"  Created {len(variants)} variants")

    # Upload all variants
    print("  Uploading to Supabase Storage...")
    image_urls = {}

    for size, temp_path in variants.items():
        storage_path = f"articles/{slug}/{size[0]}x{size[1]}.webp"
        try:
            public_url = upload_to_storage(temp_path, storage_path)

            # Check if this size maps to a database column
            if size in DB_COLUMN_MAPPING:
                column = DB_COLUMN_MAPPING[size]
                image_urls[column] = public_url
                print(f"    Uploaded {size[0]}x{size[1]} → {column}")
            else:
                print(f"    Uploaded {size[0]}x{size[1]}")
        except Exception as e:
            print(f"    Error uploading {size[0]}x{size[1]}: {e}")

    # Update database
    if image_urls:
        print("  Updating database...")
        if update_article_images(article['id'], image_urls):
            print(f"  Updated {len(image_urls)} image columns")
        else:
            print("  Failed to update database")
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
