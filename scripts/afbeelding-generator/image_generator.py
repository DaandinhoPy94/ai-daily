#!/usr/bin/env python3
"""
Image Generator
Generates clickbait thumbnails for articles using OpenAI's image generation API.
"""

import os
import re
import base64
from pathlib import Path
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Image output directory
SCRIPT_DIR = Path(__file__).parent
IMAGES_DIR = SCRIPT_DIR / "afbeeldingen"


def ensure_images_directory():
    """Create the images directory if it doesn't exist."""
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Images directory: {IMAGES_DIR}")


def slugify(text: str) -> str:
    """Convert text to a URL/filename-safe slug."""
    # Convert to lowercase
    slug = text.lower()
    # Replace spaces with hyphens
    slug = slug.replace(" ", "-")
    # Remove special characters (keep only alphanumeric and hyphens)
    slug = re.sub(r"[^a-z0-9\-]", "", slug)
    # Remove multiple consecutive hyphens
    slug = re.sub(r"-+", "-", slug)
    # Remove leading/trailing hyphens
    slug = slug.strip("-")
    # Limit length
    slug = slug[:50]
    return slug


def get_article_without_image():
    """Fetch one article that doesn't have an image yet."""
    response = supabase.table("articles").select("id, title, summary").is_("image_standard", "null").limit(1).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    return None


def generate_thumbnail(title: str, summary: str) -> str:
    """Generate a thumbnail image using OpenAI's image generation API."""
    # Format summary if it's a list
    if isinstance(summary, list):
        summary_text = " ".join(summary)
    else:
        summary_text = str(summary)

    prompt = f"Make a clickbate thumpnail for a news website, given the following title: '{title}' and summary: '{summary_text}' USE NO TEXT IN IMAGE!"

    print(f"  Generating image with prompt: {prompt[:100]}...")

    response = openai_client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1792x1024",  # Landscape 16:9 formaat
        quality="medium",
        n=1,
    )

    # Get the base64 image data
    image_data = response.data[0].b64_json

    return image_data


def save_image(image_data: str, title: str) -> str:
    """Save the base64 image to a file and return the filename."""
    filename = f"{slugify(title)}.png"
    filepath = IMAGES_DIR / filename

    # Decode base64 and save
    image_bytes = base64.b64decode(image_data)
    with open(filepath, "wb") as f:
        f.write(image_bytes)

    print(f"  Saved image: {filename}")
    return filename


def update_article_image(article_id: str, filename: str) -> bool:
    """Update the article with the image filename."""
    try:
        supabase.table("articles").update({
            "image_standard": filename
        }).eq("id", article_id).execute()
        print(f"  Updated article with image: {filename}")
        return True
    except Exception as e:
        print(f"  Error updating article: {e}")
        return False


def main():
    """Main image generator function."""
    print("Starting Image Generator...")

    # Ensure images directory exists
    ensure_images_directory()

    # Get one article without an image
    article = get_article_without_image()

    if not article:
        print("No articles without images found.")
        return

    print(f"\nProcessing: {article['title'][:60]}...")

    try:
        # Generate thumbnail
        print("  Calling OpenAI Image API...")
        image_data = generate_thumbnail(article['title'], article['summary'])

        # Save image
        filename = save_image(image_data, article['title'])

        # Update article in database
        update_article_image(article['id'], filename)

        print("\nImage generation complete!")

    except Exception as e:
        print(f"  Error during image generation: {e}")


if __name__ == "__main__":
    main()
