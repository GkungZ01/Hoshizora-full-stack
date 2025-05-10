'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiUser, FiMail, FiLock, FiSave, FiAlertCircle, FiSettings, FiUserCheck } from 'react-icons/fi'
import styles from './settings.module.css'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signIn')
      return
    }

    
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }

    
    if (starsRef.current) {
      const starsContainer = starsRef.current
      starsContainer.innerHTML = ''

      // Reduced number of stars for a more minimal design
      const numStars = 80
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        star.className = styles.star

        const x = Math.random() * 100
        const y = Math.random() * 100
        star.style.left = `${x}%`
        star.style.top = `${y}%`

        // More subtle stars
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

      // Shooting stars removed for minimal design
    }
  }, [session, status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) return

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
        })
      })

      if (!response.ok) {
        throw new Error('การอัปเดตข้อมูลล้มเหลว')
      }

      
      await update({ name: formData.name })

      setMessage({
        type: 'success',
        text: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) return

    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' })
      return
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'การเปลี่ยนรหัสผ่านล้มเหลว')
      }

      setMessage({ type: 'success', text: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' })

      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.starryBackground}></div>
        <div className={styles.stars} ref={starsRef}></div>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <div className="container mx-auto px-4">
        <h1 className={`${styles.settingsHeader} text-3xl font-bold`}>
          <FiSettings className="inline-block mr-2" /> ตั้งค่าบัญชีผู้ใช้
        </h1>

        {message.text && (
          <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
            <FiAlertCircle className={styles.alertIcon} />
            <span>{message.text}</span>
          </div>
        )}

        <div className={styles.gridContainer}>
          {/* Profile Update Form */}
          <div className={`${styles.settingsCard} ${styles.fadeIn} ${styles.delayAnimation1}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <FiUserCheck size={20} /> ข้อมูลส่วนตัว
              </h2>
            </div>

            <div className={styles.cardBody}>
              <form onSubmit={handleProfileUpdate}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="name">
                    ชื่อผู้ใช้
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiUser className={styles.inputIcon} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="ชื่อผู้ใช้ของคุณ"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">
                    อีเมล
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiMail className={styles.inputIcon} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className={styles.input}
                      disabled
                    />
                  </div>
                  <p className={styles.helperText}>ไม่สามารถเปลี่ยนอีเมลได้</p>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner} style={{ width: "20px", height: "20px" }}></div>
                  ) : (
                    <FiSave size={18} />
                  )}
                  บันทึกข้อมูล
                </button>
              </form>
            </div>
          </div>

          {/* Password Update Form */}
          <div className={`${styles.settingsCard} ${styles.fadeIn} ${styles.delayAnimation2}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <FiLock size={20} /> เปลี่ยนรหัสผ่าน
              </h2>
            </div>

            <div className={styles.cardBody}>
              <form onSubmit={handlePasswordUpdate}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="currentPassword">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="รหัสผ่านปัจจุบัน"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="newPassword">
                    รหัสผ่านใหม่
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="รหัสผ่านใหม่"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="confirmPassword">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="ยืนยันรหัสผ่านใหม่"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner} style={{ width: "20px", height: "20px" }}></div>
                  ) : (
                    <FiSave size={18} />
                  )}
                  เปลี่ยนรหัสผ่าน
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}