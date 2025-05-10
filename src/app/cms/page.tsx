'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiEdit, FiEye, FiFileText, FiImage, FiTag, FiUsers } from 'react-icons/fi'
import { useSession } from 'next-auth/react'

interface Stats {
  posts: number
  tags: number
  media: number
  users?: number
}

export default function CMSDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    tags: 0,
    media: 0,
    users: 0
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN'

  // This would be replaced with actual API calls
  useEffect(() => {
    // Simulate API calls
    setIsLoading(true)
    
    // Mock data for demo
    setTimeout(() => {
      setStats({
        posts: 4,
        tags: 6,
        media: 8,
        users: 3
      })
      
      setRecentPosts([
        {
          id: '1',
          title: '薬屋のひとりごと 第2期',
          status: 'published',
          date: '2025-01-20',
          views: 9999
        },
        {
          id: '2',
          title: 'Re:ゼロから始める異世界生活',
          status: 'published',
          date: '2025-01-04',
          views: 9999
        },
        {
          id: '3',
          title: 'マジック・メイカー',
          status: 'published',
          date: '2025-01-11',
          views: 9999
        },
        {
          id: '4',
          title: '無職転生 ～異世界行ったら本気だす～',
          status: 'published',
          date: '2024-12-29',
          views: 9999
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Hoshizora CMS</h1>
        <p className="text-gray-400">
          Here's what's happening with your blog today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Posts" 
          value={stats.posts} 
          icon={<FiFileText className="w-8 h-8 text-blue-400" />}
          linkTo="/cms/posts"
        />
        <StatCard 
          title="Tags" 
          value={stats.tags} 
          icon={<FiTag className="w-8 h-8 text-purple-400" />}
          linkTo="/cms/tags"
        />
        <StatCard 
          title="Media" 
          value={stats.media} 
          icon={<FiImage className="w-8 h-8 text-green-400" />}
          linkTo="/cms/media"
        />
        {isAdmin && (
          <StatCard 
            title="Users" 
            value={stats.users || 0} 
            icon={<FiUsers className="w-8 h-8 text-yellow-400" />}
            linkTo="/cms/users"
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/cms/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
            <FiEdit className="mr-2" /> New Post
          </Link>
          <Link href="/cms/media/upload" className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center">
            <FiImage className="mr-2" /> Upload Media
          </Link>
          <Link href="/blog" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
            <FiEye className="mr-2" /> View Blog
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Posts</h2>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-gray-300 text-sm font-medium">Title</th>
                  <th className="px-6 py-3 text-gray-300 text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-gray-300 text-sm font-medium">Date</th>
                  <th className="px-6 py-3 text-gray-300 text-sm font-medium">Views</th>
                  <th className="px-6 py-3 text-gray-300 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 text-green-300">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(post.date).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Link href={`/cms/posts/edit/${post.id}`} className="text-blue-400 hover:text-blue-300">
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <Link href={`/blog/${post.id}`} className="text-gray-400 hover:text-white">
                          <FiEye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  linkTo: string
}

function StatCard({ title, value, icon, linkTo }: StatCardProps) {
  return (
    <Link href={linkTo} className="bg-gray-800 rounded-xl p-6 shadow-md hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </Link>
  )
}