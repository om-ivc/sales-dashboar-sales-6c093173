'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Plus, Mail, User, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

export default function EmailInteractionsPage() {
  const [interactions, setInteractions] = useState([]);
  const [filteredInteractions, setFilteredInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    email: '',
    recipient: '',
    type: 'opened',
    status: 'sent',
    subject: '',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    fetchInteractions();
  }, []);

  useEffect(() => {
    filterInteractions();
  }, [interactions, searchTerm, statusFilter, typeFilter]);

  const fetchInteractions = async () => {
    try {
      const response = await axios.get('/api/email-interactions');
      setInteractions(response.data);
    } catch (error) {
      console.error('Error fetching email interactions:', error);
    }
  };

  const filterInteractions = () => {
    let result = interactions;

    if (searchTerm) {
      result = result.filter(interaction => 
        interaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(interaction => interaction.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(interaction => interaction.type === typeFilter);
    }

    setFilteredInteractions(result);
  };

  const handleCreateInteraction = async () => {
    try {
      const response = await axios.post('/api/email-interactions', newInteraction);
      setInteractions([response.data, ...interactions]);
      setIsDialogOpen(false);
      setNewInteraction({
        email: '',
        recipient: '',
        type: 'opened',
        status: 'sent',
        subject: '',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating email interaction:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent': return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'opened': return <Badge className="bg-purple-100 text-purple-800">Opened</Badge>;
      case 'clicked': return <Badge className="bg-indigo-100 text-indigo-800">Clicked</Badge>;
      case 'bounced': return <Badge className="bg-red-100 text-red-800">Bounced</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'opened': return <Badge variant="secondary">Opened</Badge>;
      case 'clicked': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Clicked</Badge>;
      case 'replied': return <Badge variant="secondary" className="bg-green-100 text-green-800">Replied</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Interactions</h1>
          <p className="text-gray-600">Track and manage all email interactions with prospects and customers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Interaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Email Interaction</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newInteraction.email}
                  onChange={(e) => setNewInteraction({...newInteraction, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipient" className="text-right">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  value={newInteraction.recipient}
                  onChange={(e) => setNewInteraction({...newInteraction, recipient: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newInteraction.subject}
                  onChange={(e) => setNewInteraction({...newInteraction, subject: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newInteraction.type} 
                  onValueChange={(value) => setNewInteraction({...newInteraction, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="clicked">Clicked</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={newInteraction.status} 
                  onValueChange={(value) => setNewInteraction({...newInteraction, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="clicked">Clicked</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateInteraction} className="w-full">Add Interaction</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by email, recipient, or subject..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.map((interaction) => (
                <TableRow key={interaction._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {interaction.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {interaction.recipient}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{interaction.subject}</TableCell>
                  <TableCell>{getTypeBadge(interaction.type)}</TableCell>
                  <TableCell>{getStatusBadge(interaction.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(interaction.timestamp).toLocaleDateString()}
                      <Clock className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                      {new Date(interaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredInteractions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No email interactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}