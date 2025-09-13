import { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  user_id: string;
  parent_id?: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
  user_reaction?: 'like' | 'dislike' | null;
  replies?: Comment[];
}

interface ArticleCommentsProps {
  articleId: string;
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  user: any;
  replyingTo: string | null;
  replyContent: string;
  submitting: boolean;
  onSetReplyingTo: (commentId: string | null) => void;
  onSetReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
  onReaction: (commentId: string, reactionType: 'like' | 'dislike') => void;
}

function CommentItem({
  comment,
  isReply = false,
  user,
  replyingTo,
  replyContent,
  submitting,
  onSetReplyingTo,
  onSetReplyContent,
  onSubmitReply,
  onReaction
}: CommentItemProps) {
  const currentReplyContent = replyingTo === comment.id ? replyContent : '';
  
  return (
    <div className={`${isReply ? 'ml-8 mt-4' : 'mb-6'} border-b border-border pb-4`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          {comment.author?.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.display_name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-xs font-medium">
              {comment.author?.display_name?.charAt(0) || 'A'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {comment.author?.display_name || 'Anoniem'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: nl })}
            </span>
          </div>
          
          <p className="text-sm mb-3">{comment.content}</p>
          
          <div className="flex items-center gap-4 text-xs">
            {!isReply && (
              <button
                onClick={() => onSetReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reageren
              </button>
            )}
            
            <button
              onClick={() => onReaction(comment.id, 'like')}
              className={`flex items-center gap-1 transition-colors ${
                comment.user_reaction === 'like' 
                  ? 'text-green-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              disabled={!user}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes_count}</span>
            </button>
            
            <button
              onClick={() => onReaction(comment.id, 'dislike')}
              className={`flex items-center gap-1 transition-colors ${
                comment.user_reaction === 'dislike' 
                  ? 'text-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              disabled={!user}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{comment.dislikes_count}</span>
            </button>
          </div>

          {replyingTo === comment.id && user && (
            <div className="mt-4">
              <Textarea
                value={currentReplyContent}
                onChange={(e) => onSetReplyContent(e.target.value)}
                placeholder="Schrijf je antwoord..."
                className="mb-2"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={!currentReplyContent.trim() || submitting}
                  size="sm"
                >
                  Verstuur
                </Button>
                <Button
                  onClick={() => {
                    onSetReplyingTo(null);
                    onSetReplyContent('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Annuleren
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  user={user}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  submitting={submitting}
                  onSetReplyingTo={onSetReplyingTo}
                  onSetReplyContent={onSetReplyContent}
                  onSubmitReply={onSubmitReply}
                  onReaction={onReaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'most_liked'>('newest');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the reply textarea when replying starts
  useEffect(() => {
    if (replyingTo && replyTextareaRef.current) {
      // Use setTimeout to ensure the textarea is rendered before focusing
      setTimeout(() => {
        replyTextareaRef.current?.focus();
      }, 0);
    }
  }, [replyingTo]);

  const fetchComments = async () => {
    try {
      const orderBy = sortBy === 'newest' ? 'created_at' : 'likes_count';
      const ascending = sortBy === 'newest' ? false : false;

      const { data: commentsData, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .is('parent_id', null)
        .order(orderBy, { ascending });

      if (error) throw error;

      // Get all user IDs for profile lookup
      const userIds = [...new Set((commentsData || []).map(c => c.user_id))];
      
      // Fetch profiles separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      const profilesMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {} as Record<string, any>);

      // Fetch user reactions if logged in
      let reactionsData = [];
      if (user) {
        const { data: reactions } = await supabase
          .from('comment_reactions')
          .select('comment_id, reaction_type')
          .eq('user_id', user.id)
          .in('comment_id', commentsData?.map(c => c.id) || []);
        
        reactionsData = reactions || [];
      }

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('article_comments')
            .select('*')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          const userReaction = reactionsData.find(r => r.comment_id === comment.id);

          return {
            ...comment,
            author: profilesMap[comment.user_id] || { display_name: 'Anoniem' },
            user_reaction: userReaction?.reaction_type || null,
            replies: (replies || []).map(reply => ({
              ...reply,
              author: profilesMap[reply.user_id] || { display_name: 'Anoniem' },
              user_reaction: reactionsData.find(r => r.comment_id === reply.id)?.reaction_type || null
            }))
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Fout bij laden reacties",
        description: "Er ging iets mis bij het laden van de reacties.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId, sortBy, user]);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      toast({
        title: "Reactie geplaatst",
        description: "Je reactie is succesvol geplaatst.",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Fout bij plaatsen reactie",
        description: "Er ging iets mis bij het plaatsen van je reactie.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          parent_id: parentId,
          content: replyContent.trim()
        });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      await fetchComments();
      toast({
        title: "Antwoord geplaatst",
        description: "Je antwoord is succesvol geplaatst.",
      });
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Fout bij plaatsen antwoord",
        description: "Er ging iets mis bij het plaatsen van je antwoord.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId: string, reactionType: 'like' | 'dislike') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comment_reactions')
        .upsert({
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType
        });

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast({
        title: "Fout bij reageren",
        description: "Er ging iets mis bij het reageren.",
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return (
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Reacties</h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Nieuwste eerst
          </Button>
          <Button
            variant={sortBy === 'most_liked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('most_liked')}
          >
            Meest geliked
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Er zijn nog geen reacties op dit artikel. Ben de eerste die reageert.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              replyingTo={replyingTo}
              replyContent={replyContent}
              submitting={submitting}
              onSetReplyingTo={setReplyingTo}
              onSetReplyContent={setReplyContent}
              onSubmitReply={handleSubmitReply}
              onReaction={handleReaction}
            />
          ))}
        </div>
      )}

      {user ? (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-xs font-medium">
                  {profile?.display_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schrijf je reactie..."
                className="mb-3"
                rows={4}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? 'Plaatsen...' : 'Reactie plaatsen'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            Je moet ingelogd zijn om een reactie te plaatsen.
          </p>
          <Button variant="outline" asChild>
            <a href="/auth">Inloggen</a>
          </Button>
        </div>
      )}
    </div>
  );
}