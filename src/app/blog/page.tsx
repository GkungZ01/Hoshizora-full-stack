'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiClock, FiEye, FiCalendar } from 'react-icons/fi'
import styles from './blog.module.css'

import { blogs } from './metadata'

export default function BlogPage() {
  // For star background effect
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (starsRef.current) {
      const starsContainer = starsRef.current
      starsContainer.innerHTML = ''

      const numStars = 80
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        star.className = styles.star

        const x = Math.random() * 100
        const y = Math.random() * 100
        star.style.left = `${x}%`
        star.style.top = `${y}%`

        const scale = Math.random() * 1.2 + 0.3
        const opacity = Math.random() * 0.5 + 0.2
        const duration = Math.random() * 3 + 3
        const delay = Math.random() * 2

        star.style.setProperty('--scale', scale.toString())
        star.style.setProperty('--opacity', opacity.toString())
        star.style.setProperty('--duration', `${duration}s`)
        star.style.setProperty('--delay', `${delay}s`)

        starsContainer.appendChild(star)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <h1 className={styles.pageTitle}>บทความ</h1>

      <div className={styles.blogGrid}>
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.id}`} key={blog.id} className={styles.blogCard}>
            <div className={styles.imageContainer}>
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={styles.tagContainer}>
                {blog.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.content}>
              <h2 className={styles.title}>{blog.title}</h2>
              <p className={styles.description}>{blog.description}</p>

              <div className={styles.footer}>
                <div className={styles.metaGroup}>
                  <span className={styles.metaItem}>
                    <FiClock size={14} />
                    {blog.readTime}
                  </span>
                  <span className={styles.metaItem}>
                    <FiEye size={14} />
                    {blog.views.toLocaleString()}
                  </span>
                </div>
                <time className={styles.metaItem} dateTime={blog.date}>
                  <FiCalendar size={14} />
                  {new Date(blog.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}