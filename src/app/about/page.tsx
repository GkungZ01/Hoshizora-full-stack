'use client'
import React, { useState, useEffect } from 'react'
import { FiGithub, FiBook, FiUsers, FiStar, FiExternalLink, FiAward, FiCode, FiGitBranch } from 'react-icons/fi'
import { FaTwitter, FaLinkedin } from 'react-icons/fa'
import styles from './about.module.css'
import type { Metadata } from 'next'

interface GitHubProfile {
  avatar_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  html_url: string
  repos_url: string
}

interface Repository {
  name: string
  description: string
  stargazers_count: number
  html_url: string
  language: string
}

interface ExtendedGitHubProfile extends GitHubProfile {
  languages: { [key: string]: number }
  contributions: number
  pinnedRepos: Repository[]
  socialLinks: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export default function AboutPage() {
  const [profiles, setProfiles] = useState<{ [key: string]: GitHubProfile | null }>({})
  const [repos, setRepos] = useState<{ [key: string]: Repository[] }>({})
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const usernames = ['Jiranon-K', 'GKungZ01']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData: { [key: string]: GitHubProfile | null } = {}
        const repoData: { [key: string]: Repository[] } = {}

        for (const username of usernames) {
          try {
            const profileRes = await fetch(`https://api.github.com/users/${username}`)
            if (!profileRes.ok) {
              profileData[username] = null
              continue
            }
            profileData[username] = await profileRes.json()

            const reposRes = await fetch(`https://api.github.com/users/${username}/repos`)
            if (reposRes.ok) {
              repoData[username] = await reposRes.json()
            } else {
              repoData[username] = []
            }
          } catch (err) {
            console.error(`Error fetching data for ${username}:`, err)
            profileData[username] = null
            repoData[username] = []
          }
        }

        setProfiles(profileData)
        setRepos(repoData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-error">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12">Our Team</h1>
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {usernames.map(username => (
          profiles[username] && (
            <div key={username} className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarContainer}>
                    <img src={profiles[username]?.avatar_url} alt={username} />
                  </div>
                </div>
                
                <div className={styles.profileInfo}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold">{profiles[username]?.name}</h2>
                    <span className={styles.badge}>Developer</span>
                  </div>
                  <p className="text-base sm:text-lg text-base-content/70 mt-2">{profiles[username]?.bio}</p>
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <FiBook className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-xl sm:text-2xl font-bold">{profiles[username]?.public_repos}</span>
                      <span className="text-xs sm:text-sm">Repositories</span>
                    </div>
                    <div className={styles.statCard}>
                      <FiUsers className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-xl sm:text-2xl font-bold">{profiles[username]?.followers}</span>
                      <span className="text-xs sm:text-sm">Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <a 
                  href={profiles[username]?.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <FiGithub className="w-4 sm:w-5 h-4 sm:h-5" /> GitHub
                </a>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}