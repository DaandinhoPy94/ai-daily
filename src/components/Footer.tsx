import { Linkedin, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { FacebookIcon } from '@/components/FacebookIcon';
import { XIcon } from '@/components/XIcon';
import { RSSIcon } from '@/components/RSSIcon';

const footerLinks = {
  'Over AI Dagelijks': [
    'Over ons',
    'Redactie',
    'Werken bij AD',
    'Pers & Media',
    'Contact'
  ],
  'Algemeen': [
    'Nieuwsbrief',
    'RSS feeds',
    'Podcasts',
    'Webinars',
    'Events'
  ],
  'Service': [
    'Klantenservice',
    'Mijn account',
    'Digitale krant',
    'Apps',
    'Technische hulp'
  ],
  'Producten': [
    'Abonnementen',
    'Zakelijk',
    'AI Cursussen',
    'Research Portal',
    'API Access'
  ],
  'Van onze partners': [
    'AI Jobs',
    'Tech Events',
    'Startup Database',
    'Investment News',
    'Conferences'
  ],
  'Meer van AI Dagelijks': [
    'AI Weekly',
    'Deep Dive Reports',
    'Video Content',
    'Interviews',
    'Opinion'
  ]
};

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/aidagelijks' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/ai-dagelijks' },
  { icon: XIcon, label: 'X', href: 'https://x.com/AI_Dagelijks' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/ai.dagelijks' },
  { icon: RSSIcon, label: 'RSS', href: '/rss-feeds' }
];

export function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Footer Top - Link Columns */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom - Social, Theme, Legal */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Thema:</span>
              <div className="flex rounded-md border border-border overflow-hidden">
                {(['light', 'dark', 'system'] as const).map((themeOption) => (
                  <Button
                    key={themeOption}
                    variant={theme === themeOption ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none text-xs px-3 py-1"
                    onClick={() => setTheme(themeOption)}
                  >
                    {themeOption === 'light' ? 'Licht' : 
                     themeOption === 'dark' ? 'Donker' : 'Systeem'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 AI Dagelijks</span>
              <a href="#" className="hover:text-foreground hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground hover:underline">
                Algemene voorwaarden
              </a>
              <a href="#" className="hover:text-foreground hover:underline">
                Cookie beleid
              </a>
              <span>KvK: 12345678</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}