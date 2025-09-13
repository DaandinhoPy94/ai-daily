import { Badge } from "@/components/ui/badge";

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export function DevModeIndicator() {
  if (!USE_MOCK_AUTH) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
        🔧 Mock Auth Actief
      </Badge>
    </div>
  );
}