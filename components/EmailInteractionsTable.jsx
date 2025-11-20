'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, Plus, Mail, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const EmailInteractionsTable = () => {
  const [interactions, setInteractions] = useState([]);
  const [filteredInteractions, setFilteredInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    email: '',
    subject: '',
    status: 'sent',
    recipient: '',
    sentAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchEmailInteractions();
  }, []);

  useEffect(() => {
    filterInteractions();
  }, [interactions, searchTerm, statusFilter]);

  const fetchEmailInteractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/email-interactions');
      if (!response.ok) throw new Error('Failed to fetch email interactions');
      const data = await response.json();
      setInteractions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterInteractions = () => {
    let result = interactions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(interaction => 
        interaction.email.toLowerCase().includes(term) ||
        interaction.subject.toLowerCase().includes(term) ||
        interaction.recipient.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(interaction => interaction.status === statusFilter);
    }

    setFilteredInteractions(result);
  };

  const handleCreateInteraction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/email-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInteraction)
      });

      if (!response.ok) throw new Error('Failed to create email interaction');

      const created = await response.json();
      setInteractions([created, ...interactions]);
      setIsOpen(false);
      setNewInteraction({
        email: '',
        subject: '',
        status: 'sent',
        recipient: '',
        sentAt: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent': return <Badge variant="default" className="bg-green-100 text-green-800">Sent</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Interactions
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Interaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Email Interaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateInteraction} className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={newInteraction.recipient}
                  onChange={(e) => setNewInteraction({...newInteraction, recipient: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInteraction.email}
                  onChange={(e) => setNewInteraction({...newInteraction, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newInteraction.subject}
                  onChange={(e) => setNewInteraction({...newInteraction, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newInteraction.status} 
                  onValueChange={(value) => setNewInteraction({...newInteraction, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sentAt">Sent Date</Label>
                <Input
                  id="sentAt"
                  type="date"
                  value={newInteraction.sentAt}
                  onChange={(e) => setNewInteraction({...newInteraction, sentAt: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Interaction</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search interactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 mt-3 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No email interactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInteractions.map((interaction) => (
                  <TableRow key={interaction._id}>
                    <TableCell className="font-medium">{interaction.recipient}</TableCell>
                    <TableCell>{interaction.email}</TableCell>
                    <TableCell>{interaction.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(interaction.status)}
                        {getStatusBadge(interaction.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(interaction.sentAt), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailInteractionsTable;