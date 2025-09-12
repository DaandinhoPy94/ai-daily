import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AccountMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = profile?.display_name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 rounded-full"
          aria-label="Account"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={profile?.display_name || 'User'} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.display_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/mijn-nieuws" onClick={() => setOpen(false)}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Mijn nieuws</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" onClick={() => setOpen(false)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profiel</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/preferences" onClick={() => setOpen(false)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Voorkeuren</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Uitloggen</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}