#!/usr/bin/env python3
"""
NOS Tech News Scraper
Scrapes articles from NOS.nl/nieuws/tech and stores them in Supabase.
"""

import os
import time
from typing import Optional
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import trafilatura
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
NOS_TECH_URL = "https://nos.nl/nieuws/tech"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_existing_urls() -> set:
    """Fetch all existing URLs from the database."""
    response = supabase.table("article_websites").select("url").execute()
    return {item["url"] for item in response.data}


def get_article_links() -> list:
    """Scrape the NOS Tech page for article links."""
    try:
        response = requests.get(NOS_TECH_URL, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        links = []
        # Find all article links on the tech page
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            # NOS article links typically start with /artikel/ or /nieuwsuur/
            if href.startswith("/artikel/") or href.startswith("/nieuwsuur/"):
                full_url = f"https://nos.nl{href}"
                if full_url not in links:
                    links.append(full_url)

        print(f"Found {len(links)} article links on NOS Tech page")
        return links
    except Exception as e:
        print(f"Error fetching NOS Tech page: {e}")
        return []


def extract_article_content(url: str) -> Optional[dict]:
    """Extract title and content from an article URL using trafilatura."""
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            print(f"Could not download: {url}")
            return None

        # Extract metadata
        metadata = trafilatura.extract_metadata(downloaded)
        title = metadata.title if metadata else None

        # Extract main content
        content = trafilatura.extract(downloaded)

        if not title or not content:
            print(f"Could not extract content from: {url}")
            return None

        return {
            "url": url,
            "title": title,
            "content": content,
            "source": "nos",
            "status": "new"
        }
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
        return None


def save_article(article: dict) -> bool:
    """Save an article to Supabase."""
    try:
        supabase.table("article_websites").insert(article).execute()
        print(f"Saved: {article['title'][:50]}...")
        return True
    except Exception as e:
        print(f"Error saving article: {e}")
        return False


def main():
    """Main scraper function."""
    print("Starting NOS Tech scraper...")

    # Get existing URLs to avoid duplicates
    existing_urls = get_existing_urls()
    print(f"Found {len(existing_urls)} existing articles in database")

    # Get article links from NOS Tech page
    article_links = get_article_links()

    # Filter out already scraped URLs
    new_links = [url for url in article_links if url not in existing_urls]
    print(f"Found {len(new_links)} new articles to scrape")

    # Process each new article
    saved_count = 0
    for url in new_links:
        print(f"\nProcessing: {url}")

        article = extract_article_content(url)
        if article:
            if save_article(article):
                saved_count += 1

        # Rate limiting: wait 2 seconds between requests
        time.sleep(2)

    print(f"\nScraping complete. Saved {saved_count} new articles.")


if __name__ == "__main__":
    main()
