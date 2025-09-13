import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setViewType('tablet');
      } else {
        setViewType('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    avatar_url: profile?.avatar_url || '',
  });
  
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Je moet ingelogd zijn om je profiel te bekijken.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ongeldig bestand',
        description: 'Selecteer een afbeelding.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Bestand te groot',
        description: 'Afbeelding moet kleiner zijn dan 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const { url, error } = await uploadAvatar(file);
      if (error) throw error;
      
      if (url) {
        setFormData(prev => ({ ...prev, avatar_url: url }));
        await updateProfile({ avatar_url: url });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const initials = profile.display_name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || 'U';

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profiel</h1>
          <p className="text-muted-foreground">
            Beheer je profielinformatie en voorkeuren.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profielinformatie</CardTitle>
            <CardDescription>
              Deze informatie wordt gebruikt voor je profiel en kan openbaar zijn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar_url} alt={formData.display_name} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploaden...' : 'Foto wijzigen'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG tot 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Label htmlFor="newsletter" className="text-sm font-medium">
                  Nieuwsbrief
                </Label>
                <Switch
                  id="newsletter"
                  checked={newsletterEnabled}
                  onCheckedChange={setNewsletterEnabled}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Naam</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    display_name: e.target.value 
                  }))}
                  placeholder="Je volledige naam"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Je e-mailadres kan niet worden gewijzigd.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL (optioneel)</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    avatar_url: e.target.value 
                  }))}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Of upload een afbeelding hierboven.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Opslaan...' : 'Profiel opslaan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet">
        {content}
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      
      <main>
        {content}
      </main>

      {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
    </div>
  );
}