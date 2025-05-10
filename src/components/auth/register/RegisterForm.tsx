'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FiMail, FiLock, FiUser, FiGithub, FiUserPlus, FiAlertCircle } from 'react-icons/fi'
import styles from './RegisterForm.module.css'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState('')
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create starry background
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')

    if (!formData.acceptTerms) {
      setError('กรุณายอมรับข้อกำหนดและเงื่อนไขการใช้งาน')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน')
      }

      router.push('/auth/signIn?registered=true')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative">
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <div className={styles.glassCard}>
        <h1 className={styles.pageTitle}>สร้างบัญชีใหม่</h1>

        {error && (
          <div className={styles.alertError}>
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                name="username"
                placeholder="ชื่อผู้ใช้"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              อีเมล
            </label>
            <div className="relative">
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              รหัสผ่าน
            </label>
            <div className="relative">
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={8}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <FiLock className={styles.inputIcon} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.customCheckbox}
                checked={formData.acceptTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, acceptTerms: e.target.checked }))}
              />
              <span>ยอมรับข้อกำหนดและเงื่อนไขการใช้งาน</span>
            </label>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? (
              <>กำลังสร้างบัญชี...</>
            ) : (
              <>
                <FiUserPlus size={18} />
                สมัครสมาชิก
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}>หรือ</div>

        <button
          type="button"
          onClick={() => signIn('github')}
          className={styles.secondaryButton}
        >
          <FiGithub size={18} />
          สมัครด้วย GitHub
        </button>

        <p className={styles.footerText}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/auth/signIn" className={styles.footerLink}>
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}