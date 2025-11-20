'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, Mail, FileText, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalBlogs: 0,
    totalEmails: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardStats();
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [visitsRes, blogsRes, emailsRes, usersRes] = await Promise.all([
        fetch('/api/website-visits'),
        fetch('/api/newsletter-blogs'),
        fetch('/api/email-interactions'),
        fetch('/api/users')
      ]);

      const [visits, blogs, emails, users] = await Promise.all([
        visitsRes.json(),
        blogsRes.json(),
        emailsRes.json(),
        usersRes.json()
      ]);

      setStats({
        totalVisits: visits.data?.length || 0,
        totalBlogs: blogs.data?.length || 0,
        totalEmails: emails.data?.length || 0,
        activeUsers: users.data?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Sales Dashboard</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Track website visits, newsletter blogs, and email interactions in one centralized platform
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {isAuthenticated && (
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Website Visits"
                value={stats.totalVisits}
                icon={<Globe className="h-6 w-6" />}
                color="blue"
              />
              <StatCard 
                title="Newsletter Blogs"
                value={stats.totalBlogs}
                icon={<FileText className="h-6 w-6" />}
                color="green"
              />
              <StatCard 
                title="Email Interactions"
                value={stats.totalEmails}
                icon={<Mail className="h-6 w-6" />}
                color="purple"
              />
              <StatCard 
                title="Active Users"
                value={stats.activeUsers}
                icon={<Users className="h-6 w-6" />}
                color="orange"
              />
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Website Visit Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                Monitor traffic sources, user behavior, and conversion rates with detailed analytics.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Newsletter Blog Management</CardTitle>
              </CardHeader>
              <CardContent>
                Create, schedule, and analyze performance of your marketing newsletters and blog posts.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Email Interaction Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                Track open rates, click-through rates, and engagement metrics for all email campaigns.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to boost your sales strategy?</h2>
          <p className="text-lg mb-8">
            Join thousands of businesses using our platform to track, analyze, and optimize their customer interactions.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}