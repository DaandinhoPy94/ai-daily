#!/usr/bin/env python3
"""
Multi-Source News Scraper
Scrapes tech news articles from multiple sources and stores them in Supabase.
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

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# =============================================================================
# CONFIGURATIE: Voeg hier nieuwe bronnen toe
# =============================================================================
SOURCES = [
    {
        "name": "nos",
        "url": "https://nos.nl/nieuws/tech",
        "link_pattern": "/artikel/",
        "base_url": "https://nos.nl",
    },
    {
        "name": "guardian",
        "url": "https://www.theguardian.com/uk/technology",
        "link_pattern": "/technology/",
        "base_url": "https://www.theguardian.com",
    },
]
# =============================================================================


def get_existing_urls() -> set:
    """Fetch all existing URLs from the database."""
    response = supabase.table("article_websites").select("url").execute()
    return {item["url"] for item in response.data}


def get_article_links(source: dict) -> list:
    """Scrape a source page for article links."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
        response = requests.get(source["url"], headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        links = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]

            # Check if link matches the pattern for this source
            if source["link_pattern"] in href:
                # Build full URL
                if href.startswith("http"):
                    full_url = href
                else:
                    full_url = f"{source['base_url']}{href}"

                # Avoid duplicates in this batch
                if full_url not in links:
                    links.append(full_url)

        print(f"  Found {len(links)} article links")
        return links
    except Exception as e:
        print(f"  Error fetching page: {e}")
        return []


def extract_article_content(url: str, source_name: str) -> Optional[dict]:
    """Extract title and content from an article URL using trafilatura."""
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            print(f"  Could not download: {url}")
            return None

        # Extract metadata
        metadata = trafilatura.extract_metadata(downloaded)
        title = metadata.title if metadata else None

        # Extract main content
        content = trafilatura.extract(downloaded)

        if not title or not content:
            print(f"  Could not extract content from: {url}")
            return None

        return {
            "url": url,
            "title": title,
            "content": content,
            "source": source_name,
            "status": "new"
        }
    except Exception as e:
        print(f"  Error extracting content from {url}: {e}")
        return None


def save_article(article: dict) -> bool:
    """Save an article to Supabase."""
    try:
        supabase.table("article_websites").insert(article).execute()
        print(f"  Saved: {article['title'][:50]}...")
        return True
    except Exception as e:
        print(f"  Error saving article: {e}")
        return False


def main():
    """Main scraper function."""
    print("Starting Multi-Source News Scraper...")
    print(f"Configured sources: {[s['name'] for s in SOURCES]}\n")

    # Get existing URLs to avoid duplicates
    existing_urls = get_existing_urls()
    print(f"Found {len(existing_urls)} existing articles in database\n")

    total_saved = 0

    # Process each source
    for source in SOURCES:
        print(f"[{source['name'].upper()}] Scraping {source['url']}")

        # Get article links from this source
        article_links = get_article_links(source)

        # Filter out already scraped URLs
        new_links = [url for url in article_links if url not in existing_urls]
        print(f"  {len(new_links)} new articles to scrape")

        # Process each new article
        for url in new_links:
            article = extract_article_content(url, source["name"])
            if article:
                if save_article(article):
                    total_saved += 1
                    existing_urls.add(url)  # Prevent duplicates across sources

            # Rate limiting: wait 2 seconds between requests
            time.sleep(2)

        print()

    print(f"Scraping complete. Saved {total_saved} new articles total.")


if __name__ == "__main__":
    main()
