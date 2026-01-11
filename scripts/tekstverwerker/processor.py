#!/usr/bin/env python3
"""
AI Article Processor
Transforms raw articles from article_websites into polished articles using AI.
"""

import os
import json
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

# Author ID for all processed articles
AUTHOR_ID = "54e42e2d-3b18-4bb6-a962-f298aecb8c75"

# Topics mapping (id: name)
TOPICS = {
    "06c536f1-b4b7-42ec-87a3-1bc25f9b09bd": "Financiën & Business",
    "0ec7dc19-d8e9-4406-bdcc-a6fecfc003f8": "Veiligheid & Regelgeving",
    "1710fe1c-9bf6-4caa-9d73-6ea2a1f3ad7f": "Geografie & Politiek",
    "1a164371-8062-40e3-81c0-3c11a88f8579": "Overheid & Publieke sector",
    "2511d775-671e-4cbf-bcf8-16a7f5c2cfb7": "Productiviteit & Automatisering",
    "261992cc-d5f6-4597-9ca3-75e3845148fe": "Text-to-Speech / Speech-to-Text",
    "295fb0cc-275a-439f-a92d-abac6d3d3840": "Robotics & Embodied AI",
    "29ac33df-abde-4ee2-bbff-a0317953e89e": "Verenigde Staten",
    "2ff2000d-f26e-492f-98e3-77dc3621d490": "Gezondheidszorg",
    "32774bfa-0364-402d-8dd4-ba47143d89e1": "Startups & Scale-ups",
    "3afab735-27f5-4180-af14-fc7befb49a17": "Text-to-Text (LLMs)",
    "44d75601-6d07-4b0a-a5b9-479508b35e2f": "Onderwijs & Training",
    "4b3098b8-a29d-4267-9211-2ea5247a0782": "Toepassingen",
    "4b3b7ec6-ed54-4e23-afa7-d3f3fcde709e": "Academische publicaties",
    "63ca6387-d837-47f3-ad56-a89a86f2ef16": "AI Safety & Alignment",
    "6506a06e-aa51-44eb-8825-88ed67dfd4ad": "Militair & Cyber",
    "659c1108-32f3-4d7e-9f10-9a3929ad2507": "Publiek debat & cultuur",
    "66960335-47df-464c-a91d-d71964bac637": "Technologie & Modellen",
    "67bce79d-c1c2-408c-adf4-8fdfe04add59": "Text-to-Image",
    "72125828-9310-4a54-9256-2d581eb9df51": "Ethiek & Bias",
    "840144c8-8851-4fa5-a7cd-ade4ed6bcaa3": "Creatieve industrie",
    "a22099df-ba6d-4443-87ac-7026eda0a5d9": "Big Tech",
    "a3ab58c5-0ff9-4db2-b958-c0e61def1ec9": "Europa",
    "ae979551-a984-4594-8b3b-ec17d28fdcce": "Text-to-Video / 3D",
    "bd0399be-27d1-4461-b904-c5b5e6861da9": "Economie & Werk",
    "be727401-d8ad-4381-aa59-3cfa3f91fcbf": "Cultuur & Samenleving",
    "c24a2cf9-e6e3-45fc-9efc-26a632e12a67": "Arbeidsmarkt & Skills",
    "d1d417f1-d8d4-446d-b552-232788108ed8": "Azië",
    "dd69e5db-4ad3-426a-8b7c-a13e370a47a2": "Chipmakers & Infrastructuur",
    "de470bac-c1fc-4020-9d19-145ec3bdfeba": "Bedrijven & Markt",
    "e2084c57-e9e4-4ad3-a3c9-f8001229f0c0": "Onderzoek & Ontwikkeling",
    "e7ee563f-7ee9-4937-b374-10f8cc7f5c33": "AI-onderzoekslabs",
    "ff80bcd8-6418-484b-a329-3600e22745b7": "Modeldoorbraken",
}

# Format topics for the prompt
TOPICS_LIST = "\n".join([f"- {id}: {name}" for id, name in TOPICS.items()])

SYSTEM_PROMPT = f"""Je bent een top-journalist voor een medium als de NYT. Herschrijf de aangeleverde tekst tot een professioneel nieuwsartikel in vloeiend Nederlands.

BELANGRIJKE REGELS:
- Gebruik <p> tags voor paragrafen in de body
- Schrijf in een journalistieke, objectieve stijl
- Behoud alle feitelijke informatie uit de brontekst

GENEREER DE VOLGENDE VELDEN (JSON formaat):

1. title: Pakkende krantenkop (max 80 karakters)
2. summary: Een enkele string van platte tekst. Genereer exact 3 krachtige zinnen en zet deze direct achter elkaar in één tekstblok. Gebruik GEEN lijst-notatie, GEEN bullets en GEEN blokhaken []
3. body: Volledig artikel in HTML met <p> tags
4. read_time_minutes: Geschatte leestijd in hele minuten (integer)
5. seo_title: SEO-geoptimaliseerde titel (max 60 karakters)
6. seo_description: Meta description (max 160 karakters)
7. slug: URL-vriendelijke slug (3-5 woorden, lowercase, met koppeltekens)
8. structured_data: JSON-LD object voor het artikel
9. primary_topic_id: Kies het meest passende topic ID uit onderstaande lijst

BESCHIKBARE TOPICS:
{TOPICS_LIST}

ANTWOORD ALLEEN MET VALIDE JSON, GEEN ANDERE TEKST."""


def get_pending_article():
    """Fetch one article with status 'new' from article_websites."""
    response = supabase.table("article_websites").select("*").eq("status", "new").limit(1).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    return None


def process_with_ai(content: str, title: str) -> dict:
    """Send content to OpenAI and get structured article data."""
    user_message = f"ORIGINELE TITEL: {title}\n\nORIGINELE TEKST:\n{content}"

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        response_format={"type": "json_object"},
        temperature=0.7
    )

    return json.loads(response.choices[0].message.content)


def save_processed_article(ai_data: dict) -> bool:
    """Save the processed article to the articles table."""
    # Build the article record
    article = {
        "title": ai_data.get("title", ""),
        "summary": ai_data.get("summary", ""),
        "body": ai_data.get("body", ""),
        "read_time_minutes": ai_data.get("read_time_minutes", 5),
        "seo_title": ai_data.get("seo_title", ""),
        "seo_description": ai_data.get("seo_description", ""),
        "slug": ai_data.get("slug", ""),
        "structured_data": ai_data.get("structured_data", {}),
        "primary_topic_id": ai_data.get("primary_topic_id", ""),
        "author_id": AUTHOR_ID,
        "status": "published",
        "is_featured": False,
    }

    try:
        supabase.table("articles").insert(article).execute()
        print(f"  Saved article: {article['title'][:50]}...")
        return True
    except Exception as e:
        print(f"  Error saving article: {e}")
        return False


def update_source_status(article_id: int, status: str) -> bool:
    """Update the status of the source article in article_websites."""
    try:
        supabase.table("article_websites").update({"status": status}).eq("id", article_id).execute()
        return True
    except Exception as e:
        print(f"  Error updating status: {e}")
        return False


def main():
    """Main processor function."""
    print("Starting AI Article Processor...")

    # Get one pending article
    article = get_pending_article()

    if not article:
        print("No articles with status 'new' found.")
        return

    print(f"\nProcessing: {article['title'][:60]}...")
    print(f"  Source: {article['source']}")

    try:
        # Process with AI
        print("  Sending to AI...")
        ai_data = process_with_ai(article['content'], article['title'])

        # Save to articles table
        print("  Saving processed article...")
        if save_processed_article(ai_data):
            # Update source status
            update_source_status(article['id'], 'processed')
            print("  Status updated to 'processed'")
            print("\nProcessing complete!")
        else:
            print("  Failed to save article")

    except Exception as e:
        print(f"  Error during processing: {e}")
        update_source_status(article['id'], 'error')


if __name__ == "__main__":
    main()
