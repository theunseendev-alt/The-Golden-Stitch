import { Button } from "@/components/ui/button";
import { Scissors, Eye, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  onBrowseDesigns: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  userName,
  onBrowseDesigns,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Seamstress Dashboard
            </h1>
            <p className="text-sm text-gray-600">Welcome back, {userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={onBrowseDesigns}>
            <Eye className="w-4 h-4 mr-2" />
            Browse Designs
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
