/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SetupWebhookPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const { toast } = useToast();

  const getCurrentWebhookInfo = async () => {
    try {
      const response = await fetch("/api/set-webhook");
      const data = await response.json();
      setWebhookInfo(data.result || data);
    } catch (error) {
      console.error("Error getting webhook info:", error);
    }
  };

  const setWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/set-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhookUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Webhook set successfully!",
        });
        await getCurrentWebhookInfo();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set webhook",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  useEffect(() => {
    getCurrentWebhookInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Webhook Setup</h1>
            <p className="text-muted-foreground">
              Configure your Telegram bot webhook
            </p>
          </div>
        </div>

        {/* Current Webhook Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Current Webhook Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={getCurrentWebhookInfo}
                variant="outline"
                size="sm"
              >
                Refresh Status
              </Button>

              {webhookInfo && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    {webhookInfo.url ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Set
                      </Badge>
                    )}
                  </div>

                  {webhookInfo.url && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">URL:</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                          {webhookInfo.url}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(webhookInfo.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {webhookInfo.pending_update_count !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Pending Updates:</span>
                          <Badge variant="secondary">
                            {webhookInfo.pending_update_count}
                          </Badge>
                        </div>
                      )}

                      {webhookInfo.last_error_date && (
                        <div className="space-y-1">
                          <span className="font-medium text-red-600">
                            Last Error:
                          </span>
                          <p className="text-sm text-red-600">
                            {webhookInfo.last_error_message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              webhookInfo.last_error_date * 1000
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Set Webhook */}
        <Card>
          <CardHeader>
            <CardTitle>Set Webhook URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://your-domain.com/api/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={setWebhook} disabled={isLoading}>
                    {isLoading ? "Setting..." : "Set Webhook"}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Deploy your application to a hosting service (Vercel,
                    Netlify, etc.)
                  </li>
                  <li>
                    Copy your deployed URL and add <code>/api/webhook</code> to
                    the end
                  </li>
                  <li>
                    Paste the complete webhook URL above and click "Set Webhook"
                  </li>
                  <li>
                    Test your bot by sending <code>/start</code> to{" "}
                    <a
                      href="https://t.me/telemadeBot"
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 hover:underline"
                    >
                      @telemadeBot
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bot Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bot Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Bot URL:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://t.me/telemadeBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    t.me/telemadeBot
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open("https://t.me/telemadeBot", "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Bot Token:</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  7656479673:AAH1s-9DwI294MZoMnvKNSnzyHhi_zRxjj8
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.open("/dashboard", "_blank")}
          >
            Open Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://t.me/telemadeBot", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Test Bot
          </Button>
        </div>
      </div>
    </div>
  );
}
