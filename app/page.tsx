'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, ArrowRight, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-blue-600 rounded-xl">
              <Bot className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              TelemanBot
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful Telegram bot system for managing applications with a beautiful admin dashboard
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Easy Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Users can submit applications directly through Telegram with simple messages
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Admin Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full admin dashboard to review, accept, or decline applications with notifications
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Real-time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instant notifications to users about their application status
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>

        {/* Bot Info */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Bot Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Bot URL:</strong>{' '}
                <a 
                  href="https://t.me/telemadeBot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  t.me/telemadeBot
                </a>
              </p>
              <p className="text-muted-foreground">
                Send /start to the bot to begin the application process
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}