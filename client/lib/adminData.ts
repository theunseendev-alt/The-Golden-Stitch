// Mock data for admin dashboard
export const stats = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    iconName: "Users",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Designers",
    value: "156",
    change: "+8%",
    iconName: "Palette",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Registered Seamstresses",
    value: "89",
    change: "+15%",
    iconName: "Scissors",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Orders This Month",
    value: "342",
    change: "+23%",
    iconName: "ShoppingBag",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Revenue",
    value: "$24,580",
    change: "+18%",
    iconName: "DollarSign",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Platform Growth",
    value: "94%",
    change: "+5%",
    iconName: "TrendingUp",
    color: "from-indigo-500 to-indigo-600",
  },
];

export const recentUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah@email.com",
    role: "Customer",
    status: "Active",
    joined: "2 hours ago",
  },
  {
    name: "Emma Designer",
    email: "emma@design.com",
    role: "Designer",
    status: "Active",
    joined: "1 day ago",
  },
  {
    name: "Lisa Seamstress",
    email: "lisa@craft.com",
    role: "Seamstress",
    status: "Pending",
    joined: "3 days ago",
  },
  {
    name: "Mike Wilson",
    email: "mike@email.com",
    role: "Customer",
    status: "Banned",
    joined: "1 week ago",
  },
];

export const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Sarah J.",
    designer: "Emma D.",
    seamstress: "Lisa S.",
    status: "In Progress",
    value: "$120",
  },
  {
    id: "#ORD-002",
    customer: "John D.",
    designer: "Alex P.",
    seamstress: "Maria R.",
    status: "Completed",
    value: "$95",
  },
  {
    id: "#ORD-003",
    customer: "Lisa M.",
    designer: "Emma D.",
    seamstress: "Lisa S.",
    status: "Pending",
    value: "$150",
  },
  {
    id: "#ORD-004",
    customer: "Tom K.",
    designer: "Sarah L.",
    seamstress: "Not Assigned",
    status: "Waiting",
    value: "$110",
  },
];

export const alerts = [
  {
    type: "warning",
    title: "Server Load",
    message: "High traffic expected this weekend",
  },
  {
    type: "info",
    title: "Feature Update",
    message: "New payment system launching Monday",
  },
  {
    type: "success",
    title: "Milestone",
    message: "Reached 1000+ active users!",
  },
];