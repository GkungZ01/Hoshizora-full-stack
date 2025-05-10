"use client"

import React, { useEffect, useRef } from 'react'
import styles from './page.module.css'

const Home = () => {
  const starsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (starsRef.current && containerRef.current) {
      const starsContainer = starsRef.current
      starsContainer.innerHTML = ''

      const numStars = 100 // Reduced number of stars
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        star.className = styles.star

        const x = Math.random() * 100
        const y = Math.random() * 100
        star.style.left = `${x}%`
        star.style.top = `${y}%`

        const scale = Math.random() * 1.2 + 0.3 // Smaller stars
        const opacity = Math.random() * 0.5 + 0.2 // More subtle opacity
        const duration = Math.random() * 3 + 3 // Slower twinkle
        const delay = Math.random() * 2

        star.style.setProperty('--scale', scale.toString())
        star.style.setProperty('--opacity', opacity.toString())
        star.style.setProperty('--duration', `${duration}s`)
        star.style.setProperty('--delay', `${delay}s`)

        starsContainer.appendChild(star)
      }
      // Removed shooting stars
    }
    
    if (containerRef.current) {
      const container = containerRef.current

      const rings = [
        { className: styles.ring1, orbs: 2 },
        { className: styles.ring2, orbs: 3 }
      ]

      rings.forEach(ring => {
        const ringElement = document.createElement('div')
        ringElement.className = `${styles.orbitalRing} ${ring.className}`

        for (let i = 0; i < ring.orbs; i++) {
          const orb = document.createElement('div')
          orb.className = styles.orb

          const angle = (i / ring.orbs) * 360
          const rad = angle * (Math.PI / 180)
          const x = 50 + 50 * Math.cos(rad)
          const y = 50 + 50 * Math.sin(rad)

          orb.style.left = `${x}%`
          orb.style.top = `${y}%`

          ringElement.appendChild(orb)
        }

        container.appendChild(ringElement)
      })
    }
  }, [])
  
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.stars} ref={starsRef}></div>
      
      <div className={styles.titleContainer}>
        <h1 className={styles.title} data-text="HOSHIZORA">HOSHIZORA</h1>
        <p className={styles.subtitle}>&lt; Dream. Code. Inspire. /&gt;</p>
      </div>
    </div>
  )
}

export default Home