import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register - Hoshizora',
  description: 'Register an account on Hoshizora',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}