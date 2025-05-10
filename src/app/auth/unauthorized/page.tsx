'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import styles from '@/components/auth/signin/SignIn.module.css' // Reusing styles from sign in

export default function UnauthorizedPage() {
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
    <div className="w-full h-full flex items-center justify-center px-4 relative">
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <div className={styles.glassCard}>
        <div className="text-center mb-8">
          <FiAlertCircle className="text-red-500 w-20 h-20 mx-auto mb-4" />
          <h1 className={styles.pageTitle}>Access Denied</h1>
          <p className="text-gray-300 mb-4">
            You don't have permission to access this area.
          </p>
          <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg inline-block">
            <p className="text-gray-200 text-sm">
              This area is restricted to <span className="text-blue-400 font-medium">Editors</span> and <span className="text-blue-400 font-medium">Administrators</span> only.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Please contact an administrator if you need access.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/"
            className={styles.primaryButton}
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}