'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiUser, FiSettings, FiCalendar, FiBookOpen, FiStar } from 'react-icons/fi'
import styles from './profile.module.css'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signIn')
      return
    }

    
    if (session?.user) {
      setUserData(session.user)
      setLoading(false)
    }

    
    if (starsRef.current) {
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

        
        const top = Math.random() * 70 + 5
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
  }, [session, status, router])

  if (loading || status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.starryBackground}></div>
        <div className={styles.stars} ref={starsRef}></div>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-white ${styles.fadeIn}`}>
            โปรไฟล์ของฉัน
          </h1>

          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderBg}></div>
              <div className={styles.headerAurora}></div>
            </div>

            <div className={styles.contentSection}>
              <div className="flex justify-between items-end mb-8">
                <div className="relative">
                  <div className={styles.profileAvatar}>
                    <div className={styles.avatarRing}></div>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-[#0f1c3f]">
                      {userData?.image ? (
                        <Image
                          src={userData.image}
                          alt={userData.name || 'โปรไฟล์'}
                          width={128}
                          height={128}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-5xl font-bold text-white/70">
                          {(userData?.name?.charAt(0) || userData?.email?.charAt(0) || '?').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Link href="/settings" className={styles.editButton}>
                  <FiSettings className="text-lg" />
                  แก้ไขโปรไฟล์
                </Link>
              </div>

              <h2 className={styles.profileName}>{userData?.name || 'ผู้ใช้ไม่ระบุชื่อ'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className={`${styles.infoItem} ${styles.fadeIn} ${styles.delayAnimation1}`}>
                  <div className={styles.infoIcon}>
                    <FiMail className="text-[#70a5fd] text-2xl" />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>อีเมล</div>
                    <div className={styles.infoValue}>{userData?.email || '-'}</div>
                  </div>
                </div>

                <div className={`${styles.infoItem} ${styles.fadeIn} ${styles.delayAnimation2}`}>
                  <div className={styles.infoIcon}>
                    <FiCalendar className="text-[#70a5fd] text-2xl" />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>เข้าร่วมเมื่อ</div>
                    <div className={styles.infoValue}>{new Date().toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                  </div>
                </div>

                {userData?.githubUsername && (
                  <div className={`${styles.infoItem} ${styles.fadeIn} ${styles.delayAnimation3}`}>
                    <div className={styles.infoIcon}>
                      <FiUser className="text-[#70a5fd] text-2xl" />
                    </div>
                    <div>
                      <div className={styles.infoLabel}>GitHub Username</div>
                      <div className={styles.infoValue}>{userData.githubUsername}</div>
                    </div>
                  </div>
                )}

                <div className={`${styles.infoItem} ${styles.fadeIn} ${styles.delayAnimation4}`}>
                  <div className={styles.infoIcon}>
                    <FiBookOpen className="text-[#70a5fd] text-2xl" />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>บทความที่บันทึก</div>
                    <div className={styles.infoValue}>0 บทความ</div>
                  </div>
                </div>

                <div className={`${styles.infoItem} ${styles.fadeIn} ${styles.delayAnimation4}`}>
                  <div className={styles.infoIcon}>
                    <FiStar className="text-[#70a5fd] text-2xl" />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>บทความที่ชื่นชอบ</div>
                    <div className={styles.infoValue}>0 บทความ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}