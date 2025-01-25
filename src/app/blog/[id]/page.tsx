import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiClock, FiTag, FiEye, FiArrowLeft } from 'react-icons/fi'
import type { Metadata } from 'next'

interface LocalBlogPost {
  id: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  readTime: string
  views: number
  date: string
}

// Mock data - in real app this would come from an API/database
const blogs: LocalBlogPost[] = [
  {
    id: '1',
    title: '薬屋のひとりごと 第2期',
    description: 'Maomao, an apothecary daughter...',
    imageUrl: '/image/112.jpg',
    tags: ['Drama', 'Mystery'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-20'
  },
  {
    id: '2',
    title: 'Re:ゼロから始める異世界生活',
    description: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection. Considering the meeting s significance and the potential dangers Emilia could face, Subaru and his friends accompany her ',
    imageUrl: '/image/121.jpg',
    tags: ['Drama', 'Fantasy', 'Suspense'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-04'
  },
  {
    id: '3',
    title: 'マジック・メイカー',
    description: 'A man who was thirty years old and wanted to use magic died unexpectedly, and when he woke up, he was reborn in another world. Named Theon, he had high hopes that there would be magic in another world, but there was no magic in that world.',
    imageUrl: '/image/111.jpg',
    tags: ['Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-11'
  },
  {
    id: '4',
    title: '無職転生 ～異世界行ったら本気だす～',
    description: 'Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents.',
    imageUrl: '/image/232.jpeg',
    tags: [' Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2024-12-29'
  },
  // ... other blog posts
]

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = blogs.find(blog => blog.id === params.id)
  return {
    title: blog?.title ?? 'Blog Post',
    description: blog?.description
  }
}

export default function BlogPost({ params }: Props) {
  const blog = blogs.find(blog => blog.id === params.id)

  if (!blog) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 mb-6 btn btn-ghost hover:bg-base-200 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="badge badge-primary badge-lg">
                <FiTag className="mr-2" /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold">{blog.title}</h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-base-content/60">
            <span className="flex items-center">
              <FiClock className="mr-1" /> {blog.readTime}
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" /> {blog.views} views
            </span>
            <time className="ml-auto">
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </time>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p>{blog.description}</p>
          </div>
        </div>
      </div>
    </article>
  )
}