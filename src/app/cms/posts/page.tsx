'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEdit, FiEye, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function PostsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedFilter, setSelectedFilter] = useState('all')

  // This would be replaced with actual API calls in a real implementation
  useEffect(() => {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      // Mock data for demo
      const mockPosts = [
        {
          id: '1',
          title: '薬屋のひとりごと 第2期',
          slug: 'the-apothecary-diaries-season-2',
          status: 'published',
          date: '2025-01-20',
          views: 9999,
          tags: ['Drama', 'Mystery']
        },
        {
          id: '2',
          title: 'Re:ゼロから始める異世界生活',
          slug: 're-zero-starting-life-in-another-world',
          status: 'published',
          date: '2025-01-04',
          views: 9999,
          tags: ['Drama', 'Fantasy', 'Suspense']
        },
        {
          id: '3',
          title: 'マジック・メイカー',
          slug: 'magic-maker',
          status: 'published',
          date: '2025-01-11',
          views: 9999,
          tags: ['Isekai', 'Reincarnation']
        },
        {
          id: '4',
          title: '無職転生 ～異世界行ったら本気だす～',
          slug: 'mushoku-tensei-jobless-reincarnation',
          status: 'published',
          date: '2024-12-29',
          views: 9999,
          tags: ['Isekai', 'Reincarnation']
        }
      ]
      
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and search posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'published') return post.status === 'published' && matchesSearch;
    if (selectedFilter === 'draft') return post.status === 'draft' && matchesSearch;
    
    return matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      // In a real implementation, this would be an API call to delete the post
      console.log('Deleting post:', id);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Posts</h1>
        <Link 
          href="/cms/posts/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredPosts.length > 0 ? (
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Title</th>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Status</th>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Date</th>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Views</th>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Tags</th>
                      <th className="px-6 py-3 text-gray-300 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentItems.map(post => (
                      <tr key={post.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{post.title}</div>
                          <div className="text-xs text-gray-400">/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.status === 'published' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(post.date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag: string) => (
                              <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Link href={`/cms/posts/edit/${post.id}`} className="text-blue-400 hover:text-blue-300">
                              <FiEdit className="w-5 h-5" />
                            </Link>
                            <Link href={`/blog/${post.id}`} className="text-gray-400 hover:text-white">
                              <FiEye className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(post.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredPosts.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredPosts.length}</span> results
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-white">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center shadow-md">
              <p className="text-gray-400 mb-4">No posts found matching your criteria.</p>
              <Link 
                href="/cms/posts/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                <FiPlus className="mr-2" /> Create New Post
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}