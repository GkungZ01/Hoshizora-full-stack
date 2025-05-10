'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FiHome, FiFileText, FiTag, FiImage, FiSettings, FiMenu, FiX, FiLogOut, FiUser, FiUsers } from 'react-icons/fi'

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN'
  const isEditor = session?.user && (session.user as any).role === 'EDITOR'

  // Protect the CMS route - client-side protection in addition to middleware
  useEffect(() => {
    if (status === 'loading') return

    // If not authenticated or not admin/editor, redirect to unauthorized page
    if (status === 'unauthenticated' ||
        (status === 'authenticated' && !isAdmin && !isEditor)) {
      router.push('/auth/unauthorized')
    }
  }, [status, isAdmin, isEditor, router])

  // Don't render anything while checking authentication
  if (status === 'loading' || status === 'unauthenticated' || (status === 'authenticated' && !isAdmin && !isEditor)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/cms', 
      icon: <FiHome className="w-5 h-5" /> 
    },
    { 
      name: 'Posts', 
      path: '/cms/posts', 
      icon: <FiFileText className="w-5 h-5" /> 
    },
    { 
      name: 'Tags', 
      path: '/cms/tags', 
      icon: <FiTag className="w-5 h-5" /> 
    },
    { 
      name: 'Media', 
      path: '/cms/media', 
      icon: <FiImage className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/cms/settings', 
      icon: <FiSettings className="w-5 h-5" /> 
    }
  ]

  // Admin-only menu items
  const adminMenuItems = [
    { 
      name: 'Users', 
      path: '/cms/users', 
      icon: <FiUsers className="w-5 h-5" /> 
    }
  ]

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar Toggle Button (Mobile) */}
      <button 
        onClick={toggleSidebar}
        className="fixed z-50 bottom-4 right-4 lg:hidden p-3 rounded-full bg-blue-600 text-white shadow-lg"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform duration-300 transform lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <Link href="/cms" className="text-xl font-bold text-white">
              Hoshizora CMS
            </Link>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}

              {/* Admin-only menu items */}
              {isAdmin && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="border-t border-gray-700 my-2"></div>
                    <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Admin
                    </h3>
                  </div>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                        pathname === item.path
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>

          {/* User Info and Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="rounded-full h-10 w-10" 
                  />
                ) : (
                  <FiUser className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                <p className="text-xs text-gray-400">{(session?.user as any)?.role || 'User'}</p>
              </div>
            </div>
            <Link 
              href="/api/auth/signout"
              className="flex items-center px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ml-0 lg:ml-64 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <main className="h-full overflow-y-auto bg-gray-900 text-white">
          {children}
        </main>
      </div>
    </div>
  )
}