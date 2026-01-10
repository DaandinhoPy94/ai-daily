-- Clear existing data to avoid conflicts
DELETE FROM public.article_views;
DELETE FROM public.article_relations;
DELETE FROM public.article_tags;
DELETE FROM public.topic_section_pins;
DELETE FROM public.topic_sections;
DELETE FROM public.homepage_slot_items;
DELETE FROM public.homepage_slots;
DELETE FROM public.ticker_quotes;
DELETE FROM public.tickers;
DELETE FROM public.articles;
DELETE FROM public.authors;
DELETE FROM public.tags;
DELETE FROM public.topics;

-- Insert Topics
INSERT INTO public.topics (id, name, slug, description, is_active, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'AI & Machine Learning', 'ai-machine-learning', 'Latest developments in artificial intelligence and machine learning', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Cybersecurity', 'cybersecurity', 'Security threats, solutions and best practices', true, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Tech Industry', 'tech-industry', 'Technology business news and industry analysis', true, 3),
('550e8400-e29b-41d4-a716-446655440004', 'Innovation', 'innovation', 'Breakthrough technologies and innovative solutions', true, 4);

-- Insert Authors
INSERT INTO public.authors (id, name, bio, avatar_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Sarah Chen', 'Senior Technology Analyst with 10+ years covering AI and emerging tech', null),
('650e8400-e29b-41d4-a716-446655440002', 'Mark Thompson', 'Cybersecurity expert and former CISO', null),
('650e8400-e29b-41d4-a716-446655440003', 'Lisa Rodriguez', 'Tech industry reporter covering startups and venture capital', null);

-- Insert Articles
INSERT INTO public.articles (id, title, slug, summary, body, status, published_at, topic_id, author_id, read_time_minutes, is_featured) VALUES
('750e8400-e29b-41d4-a716-446655440001', 
 'OpenAI Announces GPT-5: Revolutionary AI Model Sets New Industry Standards',
 'openai-gpt5-announcement',
 'OpenAI reveals GPT-5 with unprecedented capabilities in reasoning, multimodal understanding, and real-time processing.',
 '<p>In a groundbreaking announcement today, OpenAI unveiled GPT-5, the latest iteration of their flagship language model that promises to revolutionize artificial intelligence applications across industries.</p><p>The new model demonstrates significant improvements in reasoning capabilities, with benchmark scores exceeding previous models by 40% in complex problem-solving tasks. GPT-5 also introduces enhanced multimodal understanding, allowing seamless integration of text, images, audio, and video inputs.</p><p>"This represents a quantum leap in AI capabilities," said Sam Altman, CEO of OpenAI. "GPT-5 brings us closer to artificial general intelligence while maintaining our commitment to safety and alignment."</p><p>Key features include real-time processing speeds 10x faster than GPT-4, improved factual accuracy, and advanced code generation capabilities that can handle entire software projects.</p>',
 'published', 
 now() - interval '2 hours',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440001',
 5,
 true),

('750e8400-e29b-41d4-a716-446655440002',
 'Major Data Breach Exposes 50 Million User Records Across Multiple Platforms',
 'major-data-breach-50-million-records',
 'Cybersecurity researchers discover sophisticated attack targeting major tech companies, highlighting urgent need for enhanced security measures.',
 '<p>A coordinated cyberattack has compromised user data from several major technology platforms, affecting an estimated 50 million users worldwide. The breach, discovered by security firm CyberGuard, represents one of the largest data security incidents of the year.</p><p>The attackers exploited a previously unknown vulnerability in widely-used authentication systems, gaining access to names, email addresses, encrypted passwords, and partial payment information. No full credit card details or social security numbers were exposed.</p><p>Affected companies have begun notifying users and implementing additional security measures. Industry experts emphasize this incident underscores the critical importance of multi-factor authentication and regular security audits.</p>',
 'published',
 now() - interval '4 hours', 
 '550e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440002',
 4,
 false),

('750e8400-e29b-41d4-a716-446655440003',
 'Tesla Unveils Autonomous Robotaxi Fleet: The Future of Urban Transportation',
 'tesla-autonomous-robotaxi-fleet',
 'Tesla demonstrates fully autonomous vehicles in live city testing, marking a pivotal moment for self-driving technology.',
 '<p>Tesla has officially launched its autonomous robotaxi service in select cities, featuring a fleet of vehicles operating without human drivers. The announcement marks a significant milestone in autonomous vehicle technology and urban transportation.</p><p>The robotaxi fleet utilizes Tesla''s latest Full Self-Driving (FSD) technology, enhanced with advanced neural networks and real-time learning capabilities. Initial deployment covers three major metropolitan areas, with plans for rapid expansion.</p><p>Elon Musk demonstrated the technology in a live stream, showing vehicles navigating complex urban environments, handling unexpected obstacles, and coordinating with traffic systems. The service promises to reduce transportation costs by up to 60% compared to traditional ride-sharing.</p>',
 'published',
 now() - interval '6 hours',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440001',
 6,
 true),

('750e8400-e29b-41d4-a716-446655440004',
 'Quantum Computing Breakthrough: IBM Achieves 1000-Qubit Processor',
 'ibm-quantum-1000-qubit-breakthrough',
 'IBM researchers successfully develop a 1000-qubit quantum processor, bringing practical quantum computing applications closer to reality.',
 '<p>IBM has achieved a major breakthrough in quantum computing with the successful development of a 1000-qubit quantum processor, surpassing previous limitations and opening new possibilities for practical applications.</p><p>The new processor, codenamed "Quantum Eagle," demonstrates unprecedented stability and error correction capabilities. This advancement brings quantum computing closer to solving real-world problems in drug discovery, financial modeling, and cryptography.</p><p>Researchers successfully ran complex algorithms that would take classical computers thousands of years to complete, finishing calculations in mere hours. The achievement represents years of research in quantum error correction and superconducting qubit design.</p>',
 'published',
 now() - interval '8 hours',
 '550e8400-e29b-41d4-a716-446655440004',
 '650e8400-e29b-41d4-a716-446655440001',
 7,
 false),

('750e8400-e29b-41d4-a716-446655440005',
 'Meta Announces $10B Investment in AR/VR Metaverse Infrastructure',
 'meta-10b-investment-metaverse',
 'Meta commits massive funding to accelerate metaverse development, including new hardware, software platforms, and creator tools.',
 '<p>Meta has announced a $10 billion investment in metaverse infrastructure, representing the company''s largest commitment to virtual and augmented reality development to date.</p><p>The investment will fund next-generation VR headsets, advanced haptic feedback systems, and cloud computing infrastructure to support millions of concurrent metaverse users. Meta also plans to hire 10,000 additional engineers and researchers across Europe.</p><p>CEO Mark Zuckerberg outlined the company''s vision for an interconnected virtual world where users can work, socialize, and create. The announcement includes partnerships with major brands and educational institutions to develop immersive experiences.</p>',
 'published',
 now() - interval '1 day',
 '550e8400-e29b-41d4-a716-446655440003',
 '650e8400-e29b-41d4-a716-446655440003',
 5,
 false),

('750e8400-e29b-41d4-a716-446655440006',
 'Breakthrough in Renewable Energy: New Solar Panel Technology Achieves 47% Efficiency',
 'solar-panel-47-percent-efficiency',
 'Scientists develop revolutionary solar technology using perovskite materials, dramatically improving energy conversion rates.',
 '<p>Researchers at MIT have developed a groundbreaking solar panel technology that achieves 47% efficiency, nearly doubling the performance of current commercial solar panels.</p><p>The breakthrough utilizes advanced perovskite materials combined with traditional silicon cells in a tandem configuration. This innovation could revolutionize renewable energy adoption by making solar power significantly more cost-effective.</p><p>The new panels maintain high efficiency even in low-light conditions and demonstrate remarkable durability in testing. Commercial production is expected to begin within two years, with potential to transform global energy markets.</p>',
 'published',
 now() - interval '1 day 2 hours',
 '550e8400-e29b-41d4-a716-446655440004',
 '650e8400-e29b-41d4-a716-446655440001',
 4,
 false);

-- Insert Homepage Slots
INSERT INTO public.homepage_slots (id, code, name, display_order, max_items, is_active) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'hero-left', 'Hero Left', 1, 1, true),
('850e8400-e29b-41d4-a716-446655440002', 'hero-middle', 'Hero Middle', 2, 1, true),
('850e8400-e29b-41d4-a716-446655440003', 'row-2', 'Row 2', 3, 3, true),
('850e8400-e29b-41d4-a716-446655440004', 'row-3', 'Row 3', 4, 3, true);

-- Insert Homepage Slot Items
INSERT INTO public.homepage_slot_items (slot_id, article_id, item_order) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', 1),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 1),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', 2),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', 3),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440006', 1),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 2),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 3);

-- Insert Topic Sections
INSERT INTO public.topic_sections (id, topic_id, heading, display_order, is_active) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'AI & Machine Learning', 1, true),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Cybersecurity News', 2, true);

-- Insert Topic Section Pins
INSERT INTO public.topic_section_pins (section_id, article_id, item_order) VALUES
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1),
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 2),
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 3),
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', 4),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 1),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 2),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440006', 3),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 4);

-- Insert Tickers using correct enum values
INSERT INTO public.tickers (id, symbol, name, type, display_metric, unit, display_order) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'NVDA', 'NVIDIA Corp', 'equity', 'valuation', 'USD', 1),
('a50e8400-e29b-41d4-a716-446655440002', 'AAPL', 'Apple Inc', 'equity', 'valuation', 'USD', 2),
('a50e8400-e29b-41d4-a716-446655440003', 'MSFT', 'Microsoft Corp', 'equity', 'valuation', 'USD', 3),
('a50e8400-e29b-41d4-a716-446655440004', 'GOOGL', 'Alphabet Inc', 'equity', 'valuation', 'USD', 4),
('a50e8400-e29b-41d4-a716-446655440005', 'TSLA', 'Tesla Inc', 'equity', 'valuation', 'USD', 5);

-- Insert Ticker Quotes
INSERT INTO public.ticker_quotes (ticker_id, value, quote_time, metadata) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 890.50, now() - interval '5 minutes', '{"change": 12.30, "change_pct": 1.40}'),
('a50e8400-e29b-41d4-a716-446655440002', 175.25, now() - interval '5 minutes', '{"change": -2.15, "change_pct": -1.21}'),
('a50e8400-e29b-41d4-a716-446655440003', 420.80, now() - interval '5 minutes', '{"change": 5.60, "change_pct": 1.35}'),
('a50e8400-e29b-41d4-a716-446655440004', 142.75, now() - interval '5 minutes', '{"change": -1.85, "change_pct": -1.28}'),
('a50e8400-e29b-41d4-a716-446655440005', 195.40, now() - interval '5 minutes', '{"change": 8.90, "change_pct": 4.77}');

-- Insert Tags
INSERT INTO public.tags (id, name, slug) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Artificial Intelligence', 'artificial-intelligence'),
('b50e8400-e29b-41d4-a716-446655440002', 'Machine Learning', 'machine-learning'),
('b50e8400-e29b-41d4-a716-446655440003', 'Data Security', 'data-security'),
('b50e8400-e29b-41d4-a716-446655440004', 'Autonomous Vehicles', 'autonomous-vehicles'),
('b50e8400-e29b-41d4-a716-446655440005', 'Quantum Computing', 'quantum-computing'),
('b50e8400-e29b-41d4-a716-446655440006', 'Virtual Reality', 'virtual-reality'),
('b50e8400-e29b-41d4-a716-446655440007', 'Renewable Energy', 'renewable-energy');

-- Insert Article Tags
INSERT INTO public.article_tags (article_id, tag_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440003'),
('750e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440006'),
('750e8400-e29b-41d4-a716-446655440006', 'b50e8400-e29b-41d4-a716-446655440007');

-- Insert Article Relations
INSERT INTO public.article_relations (article_id, related_article_id, relation_order) VALUES
('750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 1),
('750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 2),
('750e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 1),
('750e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', 2),
('750e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 1),
('750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 1);

-- Insert some fake article views for the "most read" section
INSERT INTO public.article_views (article_id, session_id, viewed_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'session_1', now() - interval '1 hour'),
('750e8400-e29b-41d4-a716-446655440001', 'session_2', now() - interval '2 hours'),
('750e8400-e29b-41d4-a716-446655440001', 'session_3', now() - interval '3 hours'),
('750e8400-e29b-41d4-a716-446655440001', 'session_4', now() - interval '4 hours'),
('750e8400-e29b-41d4-a716-446655440003', 'session_5', now() - interval '2 hours'),
('750e8400-e29b-41d4-a716-446655440003', 'session_6', now() - interval '3 hours'),
('750e8400-e29b-41d4-a716-446655440003', 'session_7', now() - interval '5 hours'),
('750e8400-e29b-41d4-a716-446655440002', 'session_8', now() - interval '1 hour'),
('750e8400-e29b-41d4-a716-446655440002', 'session_9', now() - interval '6 hours'),
('750e8400-e29b-41d4-a716-446655440004', 'session_10', now() - interval '3 hours');