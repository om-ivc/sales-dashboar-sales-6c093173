'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Mail, 
  Eye, 
  Plus, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { NewsletterBlogsTable } from '@/components/NewsletterBlogsTable';
import { StatCard } from '@/components/StatCard';

export default function NewsletterBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    lastWeekCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/newsletter-blogs');
      setBlogs(response.data.blogs);

      // Calculate stats
      const totalBlogs = response.data.blogs.length;
      const publishedBlogs = response.data.blogs.filter(blog => blog.status === 'published').length;
      const draftBlogs = response.data.blogs.filter(blog => blog.status === 'draft').length;

      // Calculate last week's count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const lastWeekCount = response.data.blogs.filter(blog => {
        const createdAt = new Date(blog.createdAt);
        return createdAt >= oneWeekAgo;
      }).length;

      setStats({
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        lastWeekCount
      });
    } catch (err) {
      setError('Failed to fetch newsletter blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = async () => {
    try {
      setLoading(true);
      await axios.post('/api/data/generate/newsletter-blogs');
      fetchBlogs();
    } catch (err) {
      setError('Failed to generate sample data');
      console.error('Error generating data:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchBlogs}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Blogs</h1>
          <p className="text-gray-500">Manage and track your newsletter content performance</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={generateSampleData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Sample Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Blog
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Published"
          value={stats.publishedBlogs}
          icon={Mail}
          color="green"
        />
        <StatCard
          title="Drafts"
          value={stats.draftBlogs}
          icon={FileText}
          color="yellow"
        />
        <StatCard
          title="Last 7 Days"
          value={stats.lastWeekCount}
          icon={Eye}
          color="purple"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Newsletter Blog Management</span>
            <Badge variant="secondary">{blogs.length} blogs</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterBlogsTable blogs={blogs} />
        </CardContent>
      </Card>
    </div>
  );
}