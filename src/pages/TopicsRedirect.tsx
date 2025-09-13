import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TopicsRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      // 301 redirect to new topic route
      navigate(`/topic/${slug}`, { replace: true });
    } else {
      navigate('/topic', { replace: true });
    }
  }, [slug, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
}