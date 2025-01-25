import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  description: string
  imageUrl: string
}

const BlogDetail = () => {
  const router = useRouter()
  const { id } = router.query


  const blog: BlogPost = {
    id: id as string,
    title: 'Blog Post Title',
    description: 'Full blog post content goes here...',
    imageUrl: '/images/blog1.jpg'
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-96 mb-6">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="prose max-w-none">
          <p>{blog.description}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail