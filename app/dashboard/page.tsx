"use client";

import { useState, useEffect } from "react";
import { Application } from "@/types/application";
import ApplicationsList from "@/components/ApplicationsList";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bot,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const [appsResponse, statsResponse] = await Promise.all([
        fetch("/api/applications?t=" + Date.now()),
        fetch("/api/stats?t=" + Date.now()),
      ]);

      if (!appsResponse.ok || !statsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [appsData, statsData] = await Promise.all([
        appsResponse.json(),
        statsResponse.json(),
      ]);

      console.log("Fetched applications:", appsData.length);
      console.log("Fetched stats:", statsData);

      setApplications(appsData);
      setStats(statsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
      toast({
        title: "Success",
        description: "Data refreshed",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApplicationUpdate = async (
    id: string,
    status: "accepted" | "declined",
    adminNotes?: string
  ) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) throw new Error("Update failed");

      await fetchData();
      toast({
        title: "Success",
        description: `Application ${status}`,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                TelemanBot Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and review applications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/setup-webhook", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Setup Webhook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://t.me/telemadeBot", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Bot
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={Users}
            color="bg-blue-600"
            description="All-time applications"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            color="bg-yellow-600"
            description="Awaiting decision"
          />
          <StatsCard
            title="Accepted"
            value={stats.accepted}
            icon={CheckCircle}
            color="bg-green-600"
            description="Approved applications"
          />
          <StatsCard
            title="Declined"
            value={stats.declined}
            icon={XCircle}
            color="bg-red-600"
            description="Rejected applications"
          />
        </div>

        {/* Bot Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Bot Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Bot URL:</strong>
                  <a
                    href="https://t.me/telemadeBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    t.me/telemadeBot
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Status:</strong>
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-green-100 text-green-700"
                  >
                    Active
                  </Badge>
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Users can send messages to the bot to submit applications</p>
                <p>Applications are automatically processed and appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsList
              applications={applications}
              onUpdate={handleApplicationUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
