import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Alert {
  type: "warning" | "info" | "success";
  title: string;
  message: string;
}

interface PlatformAlertsProps {
  alerts: Alert[];
}

export function PlatformAlerts({ alerts }: PlatformAlertsProps) {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextStyles = (type: string) => {
    switch (type) {
      case "warning":
        return { title: "text-yellow-800", message: "text-yellow-700" };
      case "info":
        return { title: "text-blue-800", message: "text-blue-700" };
      case "success":
        return { title: "text-green-800", message: "text-green-700" };
      default:
        return { title: "text-gray-800", message: "text-gray-700" };
    }
  };

  return (
    <Card className="p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          Platform Alerts
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert, index) => {
          const styles = getTextStyles(alert.type);
          return (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getAlertStyles(alert.type)}`}
            >
              <p className={`font-medium ${styles.title}`}>{alert.title}</p>
              <p className={`text-sm ${styles.message}`}>
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}