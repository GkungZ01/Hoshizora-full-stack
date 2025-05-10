'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSave, FiImage, FiX, FiTag, FiCalendar, FiClock, FiEye } from 'react-icons/fi'

export default function NewPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [allTags, setAllTags] = useState([
    { id: '1', name: 'Drama' },
    { id: '2', name: 'Mystery' },
    { id: '3', name: 'Fantasy' },
    { id: '4', name: 'Suspense' },
    { id: '5', name: 'Isekai' },
    { id: '6', name: 'Reincarnation' },
  ])
  
  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    readTime: '5 min',
    published: false,
    publishedAt: new Date().toISOString().split('T')[0],
    selectedTags: []
  })

  // Update slug from title (simplified version)
  useEffect(() => {
    if (postData.title) {
      setPostData(prev => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }))
    }
  }, [postData.title])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPostData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tagId: string) => {
    setPostData(prev => {
      const selectedTags = [...prev.selectedTags]
      
      if (selectedTags.includes(tagId)) {
        return { ...prev, selectedTags: selectedTags.filter(id => id !== tagId) }
      } else {
        return { ...prev, selectedTags: [...selectedTags, tagId] }
      }
    })
  }

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData(prev => ({ ...prev, published: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // In a real implementation, this would be an API call to save the post
      console.log('Saving post:', postData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to posts list after successful creation
      router.push('/cms/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Post</h1>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="mr-2" /> {isLoading ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={postData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={postData.slug}
                  onChange={handleInputChange}
                  placeholder="post-url-slug"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={postData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  rows={3}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={postData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here"
                  rows={12}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-medium text-white mb-4">Publication</h3>
              
              <div className="mb-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={postData.published}
                    onChange={handlePublishedChange}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-500"
                  />
                  <span className="text-gray-300">Publish immediately</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-300 mb-2">
                  <FiCalendar className="inline mr-2" /> Publish Date
                </label>
                <input
                  type="date"
                  id="publishedAt"
                  name="publishedAt"
                  value={postData.publishedAt}
                  onChange={handleInputChange}
                  disabled={!postData.published}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
                  <FiClock className="inline mr-2" /> Read Time
                </label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={postData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 min"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-medium text-white mb-4">Featured Image</h3>
              
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  <FiImage className="inline mr-2" /> Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={postData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="text-center">
                {postData.imageUrl ? (
                  <div className="relative">
                    <img 
                      src={postData.imageUrl} 
                      alt="Featured" 
                      className="rounded-lg mx-auto max-h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPostData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <FiImage className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Enter image URL above or use the media library</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
                      onClick={() => console.log('Open media library')}
                    >
                      Browse Media Library
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-medium text-white mb-4">
                <FiTag className="inline mr-2" /> Tags
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      postData.selectedTags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}