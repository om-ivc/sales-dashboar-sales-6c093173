'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function WebsiteVisitsTable() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/website-visits');
      setVisits(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch website visits data');
      console.error('Error fetching website visits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-8">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Website Visits</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchVisits}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Referral</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit._id}>
                <TableCell>
                  <div className="font-medium">{visit.visitor.name}</div>
                  <div className="text-sm text-gray-500">{visit.visitor.email}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                    {visit.page}
                  </div>
                </TableCell>
                <TableCell>{visit.referral || 'Direct'}</TableCell>
                <TableCell>{visit.duration} seconds</TableCell>
                <TableCell>{getStatusBadge(visit.status)}</TableCell>
                <TableCell>
                  {new Date(visit.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No website visits recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}