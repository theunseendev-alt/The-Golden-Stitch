import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, CheckCircle } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

interface RecentUsersListProps {
  users: User[];
}

export function RecentUsersList({ users }: RecentUsersListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Users
        </h2>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.role}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : user.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{user.joined}</p>
              <div className="flex items-center gap-1 mt-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>
                {user.status === "Banned" && (
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}