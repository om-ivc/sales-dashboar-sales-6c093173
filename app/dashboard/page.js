'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Mail, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import StatCard from '@/components/StatCard';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState({
    websiteVisits: 0,
    newsletterBlogs: 0,
    emailInteractions: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [visitsRes, blogsRes, emailsRes, usersRes] = await Promise.all([
          axios.get('/api/website-visits'),
          axios.get('/api/newsletter-blogs'),
          axios.get('/api/email-interactions'),
          axios.get('/api/users')
        ]);

        setStats({
          websiteVisits: visitsRes.data.length,
          newsletterBlogs: blogsRes.data.length,
          emailInteractions: emailsRes.data.length,
          users: usersRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Website Visits",
      value: stats.websiteVisits,
      description: "Total visits recorded",
      icon: <TrendingUp className="h-4 w-4 text-blue-600" />,
      change: "+12% from last month"
    },
    {
      title: "Newsletter Blogs",
      value: stats.newsletterBlogs,
      description: "Published articles",
      icon: <FileText className="h-4 w-4 text-green-600" />,
      change: "+3 new this week"
    },
    {
      title: "Email Interactions",
      value: stats.emailInteractions,
      description: "Opened/clicked emails",
      icon: <Mail className="h-4 w-4 text-purple-600" />,
      change: "+8% engagement rate"
    },
    {
      title: "Active Users",
      value: stats.users,
      description: "Team members",
      icon: <Users className="h-4 w-4 text-orange-600" />,
      change: "2 new this month"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track website visits, newsletter blogs, and email interactions in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Performance Overview
            </CardTitle>
            <CardDescription>
              Key metrics and trends for your sales activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Performance charts will appear here</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access key modules quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => router.push('/dashboard/website-visits')}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Website Visits
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => router.push('/dashboard/newsletter-blogs')}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Manage Newsletter Blogs
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => router.push('/dashboard/email-interactions')}
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Track Email Interactions
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Begin tracking your sales activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Start by generating sample data or adding your first records manually.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push('/dashboard/website-visits')}
                >
                  Add Website Visit
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push('/dashboard/newsletter-blogs')}
                >
                  Create Blog Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}