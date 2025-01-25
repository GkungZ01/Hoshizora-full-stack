'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiGithub } from 'react-icons/fi'
import styles from './login.module.css'
import type { Metadata } from 'next'


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Add your authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className={styles.glassCard}>
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="input input-bordered pl-10 w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered pl-10 w-full"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>

          <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <button className="btn btn-outline w-full gap-2">
          <FiGithub className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="link link-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}