-- Insert the Grok article with the new image
INSERT INTO articles (
  id,
  slug,
  title,
  summary,
  body,
  author_id,
  topic_id,
  published_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'elon-musk-grok-eigen-beeld',
  'Hoe Elon Musk Grok naar zijn beeld vormt',
  'Elon Musk''s AI-chatbot Grok weerspiegelt steeds meer de controversiële opvattingen van de Tesla-CEO. Een analyse van hoe de X-eigenaar zijn AI-assistent naar zijn eigen wereldbeeld vormt.',
  '<p>Elon Musk''s nieuwste AI-project, Grok, wordt steeds meer een digitale weerspiegeling van de controversiële tech-miljardair zelf. De chatbot, geïntegreerd in het X-platform (voorheen Twitter), toont opvallende overeenkomsten met Musk''s eigen communicatiestijl en wereldvisie.</p>

<p>In tegenstelling tot andere AI-assistenten die streven naar neutraliteit, lijkt Grok bewust geprogrammeerd om Musk''s libertijnse en vaak provocerende standpunten te reflecteren. Dit roept belangrijke vragen op over de objectiviteit van AI-systemen en de invloed van hun makers.</p>

<p>De training van Grok gebeurt grotendeels op basis van data van het X-platform, waar Musk''s eigen tweets en die van zijn volgers een prominente rol spelen. Dit creëert een echo-kamer effect waarbij de AI steeds meer gaat lijken op zijn maker.</p>

<p>Critici waarschuwen voor de gevaren van deze ontwikkeling. "Als AI-systemen de vooroordelen van hun makers gaan weerspiegelen, verliezen we de kans op genuanceerde en evenwichtige informatie," aldus AI-ethicus Dr. Sarah Chen.</p>

<p>Toch heeft deze benadering ook voorstanders. Zij stellen dat transparantie over de visie achter een AI-systeem beter is dan de illusie van volledige neutraliteit. "Alle AI heeft vooroordelen," zegt technologie-analist Mark Weber. "Het is eerlijker om deze open te communiceren."</p>

<p>Voor gebruikers betekent dit dat ze extra kritisch moeten zijn bij het interpreteren van Grok''s antwoorden. De AI-assistent is niet zomaar een informatietool, maar een verlengstuk van Musk''s eigen denken.</p>

<p>De ontwikkeling van Grok markeert een belangrijk moment in de AI-evolutie, waarbij de grens tussen technologie en persoonlijkheid steeds verder vervaagt.</p>',
  (SELECT id FROM authors WHERE name = 'Sarah van der Berg'),
  (SELECT id FROM topics WHERE name = 'Kunstmatige intelligentie'),
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
);

-- Create media asset for the Grok image
INSERT INTO media_assets (
  id,
  article_id,
  file_path,
  file_type,
  alt_text,
  display_order,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM articles WHERE slug = 'elon-musk-grok-eigen-beeld'),
  'src/assets/grok-ai-interface.jpg',
  'image',
  'GROK AI interface met futuristische technologie en hand die naar robot reikt',
  1,
  NOW() - INTERVAL '2 hours'
);

-- Add some article views for the new article
INSERT INTO article_views (article_id, view_count, view_date)
VALUES (
  (SELECT id FROM articles WHERE slug = 'elon-musk-grok-eigen-beeld'),
  87,
  CURRENT_DATE
);