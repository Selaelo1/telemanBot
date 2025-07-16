'use client';

import { Application } from '@/types/application';
import ApplicationCard from './ApplicationCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ApplicationsListProps {
  applications: Application[];
  onUpdate: (id: string, status: 'accepted' | 'declined', adminNotes?: string) => void;
}

export default function ApplicationsList({ applications, onUpdate }: ApplicationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      declined: applications.filter(app => app.status === 'declined').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
              <SelectItem value="declined">Declined ({statusCounts.declined})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All
          <Badge variant="secondary" className="ml-2">
            {statusCounts.all}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
        >
          Pending
          <Badge variant="secondary" className="ml-2">
            {statusCounts.pending}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === 'accepted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('accepted')}
        >
          Accepted
          <Badge variant="secondary" className="ml-2">
            {statusCounts.accepted}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === 'declined' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('declined')}
        >
          Declined
          <Badge variant="secondary" className="ml-2">
            {statusCounts.declined}
          </Badge>
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications found matching your criteria.</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}