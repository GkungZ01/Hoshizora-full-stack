import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiClock, FiTag, FiEye } from 'react-icons/fi'
// import type { BlogPost as BlogPostType } from '@/types/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Hoshizora',
  description: 'Blog posts from Hoshizora'
}

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

export default function BlogPage() {
  const blogs: LocalBlogPost[] = [
    {
      id: '1',
      title: '薬屋のひとりごと 第2期',
      description: 'Maomao, an apothecary  daughter, has been plucked from her peaceful life and sold to the lowest echelons of the imperial court. Now merely a maid, Maomao settles into her new mundane life and hides her extensive knowledge of medicine in order to avoid any unwanted attention.',
      imageUrl: '/image/112.jpg',
      tags: ['Drama', 'Mystery'],
      readTime: '5 min',
      views: 9999,
      date: '2025-01-20'
    },
    {
      id: '2',
      title: 'Re:ゼロから始める異世界生活',
      description: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection',
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
    // Add more blog posts here
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.id}`} key={blog.id}>
            <article className="group h-full">
              <div className="flex flex-col h-full overflow-hidden rounded-xl bg-base-200/50 hover:bg-base-200 
                transition-all duration-300 border border-base-content/10 hover:border-base-content/20">
                <div className="relative aspect-video">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="flex flex-col flex-grow p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs sm:text-sm rounded-full bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>

                  <p className="text-sm sm:text-base text-base-content/70 mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-sm sm:text-base text-base-content/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {blog.views}
                      </span>
                    </div>
                    <time dateTime={blog.date}>
                      {new Date(blog.date).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}