'use client';

import { Application } from '@/types/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, User, Calendar, Mail, Cake, Hash } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationCardProps {
  application: Application;
  onUpdate: (id: string, status: 'accepted' | 'declined', adminNotes?: string) => void;
}

export default function ApplicationCard({ application, onUpdate }: ApplicationCardProps) {
  const [adminNotes, setAdminNotes] = useState(application.adminNotes || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500 text-white';
      case 'declined': return 'bg-red-500 text-white';
      default: return 'bg-yellow-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (status: 'accepted' | 'declined') => {
    setIsProcessing(true);
    try {
      await onUpdate(application.id, status, adminNotes);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {application.firstName} {application.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                @{application.username || 'No username'}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
            {getStatusIcon(application.status)}
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Submitted {formatDistanceToNow(application.submittedAt, { addSuffix: true })}</span>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong>Age:</strong> {application.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong>Date of Birth:</strong> {application.dateOfBirth}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong>Email:</strong> {application.email}</span>
            </div>
          </div>
        </div>

        {application.status === 'pending' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`notes-${application.id}`} className="text-sm font-medium">
                Admin Notes (Optional)
              </Label>
              <Textarea
                id={`notes-${application.id}`}
                placeholder="Add notes for the applicant..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button
                onClick={() => handleStatusUpdate('declined')}
                disabled={isProcessing}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </div>
        )}

        {application.status !== 'pending' && application.processedAt && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Processed {formatDistanceToNow(application.processedAt, { addSuffix: true })}
              </span>
            </div>
            {application.adminNotes && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Admin Notes</Label>
                <p className="text-sm mt-1">{application.adminNotes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}