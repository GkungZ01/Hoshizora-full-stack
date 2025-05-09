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
      
      const numStars = 150
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        star.className = styles.star
        
        const x = Math.random() * 100
        const y = Math.random() * 100
        star.style.left = `${x}%`
        star.style.top = `${y}%`
        
        const scale = Math.random() * 1.5 + 0.5
        const opacity = Math.random() * 0.7 + 0.3
        const duration = Math.random() * 3 + 2
        const delay = Math.random() * 2
        
        star.style.setProperty('--scale', scale.toString())
        star.style.setProperty('--opacity', opacity.toString())
        star.style.setProperty('--duration', `${duration}s`)
        star.style.setProperty('--delay', `${delay}s`)
        
        starsContainer.appendChild(star)
      }
      
      const numShootingStars = 5
      for (let i = 0; i < numShootingStars; i++) {
        const shootingStar = document.createElement('div')
        shootingStar.className = styles.shootingStar
        
        const top = Math.random() * 50 + 10
        const left = Math.random() * 80
        const angle = Math.random() * 60 - 30
        const delay = Math.random() * 10
        const distance = Math.random() * 200 + 300
        
        shootingStar.style.setProperty('--top', `${top}%`)
        shootingStar.style.setProperty('--left', `${left}%`)
        shootingStar.style.setProperty('--angle', `${angle}deg`)
        shootingStar.style.setProperty('--delay', `${delay}s`)
        shootingStar.style.setProperty('--distance', distance.toString())
        
        starsContainer.appendChild(shootingStar)
      }
    }
    
    if (containerRef.current) {
      const container = containerRef.current
      
      const rings = [
        { className: styles.ring1, orbs: 3 },
        { className: styles.ring2, orbs: 5 },
        { className: styles.ring3, orbs: 7 }
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
        <h1 className={styles.title}>HOSHIZORA</h1>
        <p className={styles.subtitle}>&lt; Dream. Code. Inspire. /&gt;</p>
      </div>
    </div>
  )
}

export default Home