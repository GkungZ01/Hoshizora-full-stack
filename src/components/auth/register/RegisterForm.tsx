'use client'
import type { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiUser, FiGithub } from 'react-icons/fi'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptTerms) return
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/login')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-full h-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className={`${styles.glassCard} w-full max-w-md mx-auto`}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base">Username</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                name="username"
                placeholder="username"
                className="input input-bordered pl-10 w-full h-12 text-base sm:text-lg"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base">Email</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="input input-bordered pl-10 w-full h-12 text-base sm:text-lg"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered pl-10 w-full h-12 text-base sm:text-lg"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm sm:text-base">Confirm Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="input input-bordered pl-10 w-full h-12 text-base sm:text-lg"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.customCheckbox}
                checked={formData.acceptTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, acceptTerms: e.target.checked }))}
              />
              <span className="label-text">I accept the terms and conditions</span>
            </label>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full h-12 text-base sm:text-lg" disabled={loading}>
              {loading ? "Creating Account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="divider my-6 sm:my-8">OR</div>

        <button className="btn btn-outline w-full h-12 text-base sm:text-lg gap-2">
          <FiGithub className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="text-center mt-6 sm:mt-8 text-sm sm:text-base">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}