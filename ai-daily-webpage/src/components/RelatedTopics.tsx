import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { followTopic, unfollowTopic, getFollowedTopics } from '../lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface RelatedTopicsProps {
  topics?: Topic[];
}

export function RelatedTopics({ topics = [] }: RelatedTopicsProps) {
  const { user } = useAuth();
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState<string[]>([]);

  useEffect(() => {
    if (user && topics.length > 0) {
      loadFollowedTopics();
    }
  }, [user, topics]);

  const loadFollowedTopics = async () => {
    if (!user) return;
    const followed = await getFollowedTopics(user.id);
    setFollowedTopics(followed);
  };

  const handleFollow = async (topicId: string, isFollowing: boolean) => {
    if (!user) {
      toast({
        title: "Inloggen vereist",
        description: "Je moet ingelogd zijn om onderwerpen te kunnen volgen.",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => [...prev, topicId]);

    try {
      if (isFollowing) {
        const result = await unfollowTopic(topicId, user.id);
        if (result.success) {
          setFollowedTopics(prev => prev.filter(id => id !== topicId));
          toast({
            title: "Onderwerp ontvolgd",
            description: "Je volgt dit onderwerp niet meer."
          });
        }
      } else {
        const result = await followTopic(topicId, user.id);
        if (result.success) {
          setFollowedTopics(prev => [...prev, topicId]);
          toast({
            title: "Onderwerp gevolgd",
            description: "Je volgt dit onderwerp nu."
          });
        }
      }
    } catch (error) {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => prev.filter(id => id !== topicId));
    }
  };

  if (!topics || topics.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="h-px bg-border mb-6"></div>
      
      <h2 className="text-xl font-bold font-serif mb-6 text-foreground">Gerelateerde onderwerpen</h2>
      
      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        {topics.slice(0, 5).map((topic) => {
          const isFollowing = followedTopics.includes(topic.id);
          const isLoading = loading.includes(topic.id);

          return (
            <div key={topic.id} className="flex items-center justify-between">
              <a
                href={`/topic/${topic.slug}`}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
              >
                {topic.name}
              </a>
              
              {user && (
                <button
                  onClick={() => handleFollow(topic.id, isFollowing)}
                  disabled={isLoading}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
                    transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary 
                    focus-visible:ring-opacity-40 focus-visible:outline-none
                    ${isFollowing 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      {isFollowing ? 'Ontvolgen...' : 'Volgen...'}
                    </>
                  ) : isFollowing ? (
                    <>
                      <Check className="h-4 w-4" />
                      Gevolgd
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Volg
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}