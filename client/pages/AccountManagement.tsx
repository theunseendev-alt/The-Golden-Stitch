import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Eye,
  Trash2,
  Shield,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  Mail,
  Calendar,
  Activity,
  Star,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { apiService, User } from "@/lib/api";

export default function AccountManagement() {
  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("NetworkError when attempting to fetch resource.");
      // Fallback to mock data if API fails
      setUsers([
        {
          id: "1",
          name: "John Admin",
          email: "admin@admin.com",
          role: "ADMIN",
          isAdmin: true,
        },
        {
          id: "3",
          name: "Emma Designer",
          email: "emma@design.com",
          role: "DESIGNER",
          isAdmin: false,
        },
        {
          id: "4",
          name: "Lisa Seamstress",
          email: "lisa@craft.com",
          role: "SEAMSTRESS",
          isAdmin: false,
        },
        {
          id: "6",
          name: "Alex Chen",
          email: "alex@design.com",
          role: "DESIGNER",
          isAdmin: false,
        },
        {
          id: "7",
          name: "Maria Garcia",
          email: "maria@craft.com",
          role: "SEAMSTRESS",
          isAdmin: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // View user details (placeholder function)
  const viewUserDetails = (user: User) => {
    alert(
      `Viewing details for ${user.name}\n\nEmail: ${user.email}\nRole: ${user.role}\nID: ${user.id}\n\nThis would open a detailed user profile page.`,
    );
  };

  // View user designs (for designers)
  const viewUserDesigns = (user: User) => {
    alert(
      `Viewing designs for ${user.name}\n\nThis would navigate to a page showing all designs uploaded by ${user.name}.`,
    );
  };

  // View user reviews (for seamstresses)
  const viewUserReviews = (user: User) => {
    alert(
      `Viewing reviews for ${user.name}\n\nThis would navigate to a page showing all reviews for ${user.name}.`,
    );
  };

  // Delete user
  const deleteUser = async (user: User) => {
    if (user.isAdmin) {
      alert("Cannot delete admin users!");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      )
    ) {
      try {
        await apiService.deleteUser(user.id);
        // Remove user from local state
        setUsers(users.filter((u) => u.id !== user.id));
        alert(`${user.name} has been deleted.`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "🛡️";
      case "CUSTOMER":
        return "👤";
      case "DESIGNER":
        return "🎨";
      case "SEAMSTRESS":
        return "✂️";
      default:
        return "👤";
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800";
      case "DESIGNER":
        return "bg-purple-100 text-purple-800";
      case "SEAMSTRESS":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get user status (mock status for demo)
  const getUserStatus = (user: User) => {
    // Mock status based on user ID for demo purposes
    const statuses = [
      "Active",
      "Active",
      "Active",
      "Pending",
      "Active",
      "Active",
      "Active",
      "Banned",
    ];
    return statuses[parseInt(user.id) % statuses.length];
  };

  return (
    <Layout userRole="admin" userName={user.name || "Admin"}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Account Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage all user accounts and permissions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-sm mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Search and Filter Bar */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter: {filterRole === "all" ? "All Roles" : filterRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("ADMIN")}>
                    Admins
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("CUSTOMER")}>
                    Customers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("DESIGNER")}>
                    Designers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("SEAMSTRESS")}>
                    Seamstresses
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>



          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => getUserStatus(u) === "Active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => getUserStatus(u) === "Pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Banned Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => getUserStatus(u) === "Banned").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                All Users
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg">
                            {getRoleIcon(user.role)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            {user.isAdmin && (
                              <Shield className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>

                        <Badge
                          variant={
                            getUserStatus(user) === "Active"
                              ? "default"
                              : getUserStatus(user) === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {getUserStatus(user)}
                        </Badge>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewUserDetails(user)}
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {user.role === "DESIGNER" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewUserDesigns(user)}
                              title="View All Designs"
                            >
                              <Palette className="w-4 h-4" />
                            </Button>
                          )}

                          {user.role === "SEAMSTRESS" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewUserReviews(user)}
                              title="View All Reviews"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}

                          {!user.isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user)}
                              title="Delete User"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No users found matching your criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
