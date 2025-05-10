'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogIn, FiLogOut, FiSettings, FiChevronDown, FiLayout, FiEdit } from "react-icons/fi";
import { createPortal } from 'react-dom';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Client-side only code
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Log when dropdown state changes (for debugging)
  useEffect(() => {
    if (dropdownOpen) {
      console.log('Dropdown opened');
    } else {
      console.log('Dropdown closed');
    }
  }, [dropdownOpen]);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is outside both dropdown and button
      const targetNode = event.target as Node;
      const isOutsideDropdown = mounted && !document.querySelector('.user-dropdown-menu')?.contains(targetNode);
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(targetNode);

      if (isOutsideDropdown && isOutsideButton) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      // Add event listener only when dropdown is open
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen, mounted]);

  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-12 h-10">
        <div className="loading loading-spinner loading-sm"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative z-50" ref={dropdownRef}>
        <div ref={buttonRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-opacity-20 bg-[#1e3a8a] backdrop-blur-sm border border-[rgba(112,165,253,0.15)] hover:border-[rgba(112,165,253,0.3)] transition-all duration-300 group"
          >
            {session.user?.image ? (
              <div className="avatar">
                <div className="w-8 h-8 rounded-full ring-2 ring-[#70a5fd] ring-opacity-40 transition-all duration-300 group-hover:ring-opacity-70 overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] bg-opacity-60 flex items-center justify-center text-white font-medium ring-2 ring-[#70a5fd] ring-opacity-40 transition-all duration-300 group-hover:ring-opacity-70">
                  <span className="text-glow">{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || '?'}</span>
                </div>
              </div>
            )}
            <span className="hidden md:inline text-white opacity-90 group-hover:opacity-100 transition-opacity text-glow">
              {session.user?.name || session.user?.email}
            </span>
            <FiChevronDown
              className={`text-[#70a5fd] transition-all duration-300 ${dropdownOpen ? 'rotate-180' : ''}
              ${dropdownOpen ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100`}
            />
          </button>
        </div>

        {/* Using conditional portal rendering for dropdown */}
        {mounted && dropdownOpen && createPortal(
          <div
            className="fixed w-56 rounded-lg overflow-hidden shadow-lg bg-[#0f1e4a] bg-opacity-95 backdrop-blur-lg border border-[rgba(112,165,253,0.2)] z-[9999] user-dropdown-menu"
            style={{
              animation: 'fadeSlideIn 0.2s ease-out forwards',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(112, 165, 253, 0.15)',
              top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 0,
              right: buttonRef.current ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 0,
            }}
          >
            <div className="pt-3 pb-2 px-1">
              {/* User info section */}
              <div className="px-4 pb-3 mb-2 border-b border-[rgba(112,165,253,0.15)]">
                <div className="flex items-center space-x-3">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-[#70a5fd] ring-opacity-40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center">
                      <span className="text-white text-glow">{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-glow">{session.user?.name || 'ผู้ใช้งาน'}</p>
                    <p className="text-[#70a5fd] text-opacity-80 text-xs">{session.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <Link
                href="/profile"
                className="flex items-center px-4 py-2.5 text-white opacity-80 hover:opacity-100 hover:bg-[rgba(112,165,253,0.15)] rounded-md mx-2 transition-all duration-200"
                onClick={() => setDropdownOpen(false)}
              >
                <FiUser className="mr-3 text-[#70a5fd]" />
                โปรไฟล์
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2.5 text-white opacity-80 hover:opacity-100 hover:bg-[rgba(112,165,253,0.15)] rounded-md mx-2 transition-all duration-200"
                onClick={() => setDropdownOpen(false)}
              >
                <FiSettings className="mr-3 text-[#70a5fd]" />
                ตั้งค่า
              </Link>

              {/* Show CMS link only for Admin and Editor */}
              {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                <>
                  <div className="mx-2 my-2 border-t border-[rgba(112,165,253,0.15)]"></div>
                  <div className="px-4 py-1">
                    <span className="text-xs font-semibold text-[#70a5fd] opacity-80">ADMIN AREA</span>
                  </div>
                  <Link
                    href="/cms"
                    className={`flex items-center px-4 py-2.5 text-white opacity-90 hover:opacity-100 hover:bg-[rgba(112,165,253,0.15)] rounded-md mx-2 transition-all duration-200 ${userRole === 'ADMIN' ? 'bg-[rgba(112,165,253,0.1)]' : ''}`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiLayout className="mr-3 text-[#70a5fd]" />
                    <span>จัดการเว็บไซต์ (CMS)</span>
                  </Link>
                </>
              )}
              <div className="px-3 pt-2 pb-3">
                <button
                  onClick={() => {
                    signOut();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center justify-center w-full py-2 mt-1 text-white bg-[rgba(255,76,76,0.15)] hover:bg-[rgba(255,76,76,0.25)] rounded-md transition-all duration-200"
                >
                  <FiLogOut className="mr-2 opacity-90" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Link
        href="/auth/signIn"
        className="px-4 py-2 rounded-full text-white border border-[rgba(255,255,255,0.15)] hover:border-[rgba(112,165,253,0.4)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(112,165,253,0.1)] transition-all duration-300 flex items-center"
      >
        <FiLogIn className="mr-2 text-[#70a5fd] text-glow" />
        <span className="hidden sm:inline text-glow">เข้าสู่ระบบ</span>
      </Link>
      <Link
        href="/auth/signUp"
        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] border border-[rgba(112,165,253,0.3)] hover:border-[rgba(112,165,253,0.6)] shadow-[0_0_15px_rgba(30,64,175,0.15)] hover:shadow-[0_0_20px_rgba(30,64,175,0.3)] transition-all duration-300 flex items-center text-white"
      >
        <FiUser className="mr-2 text-white" />
        <span className="hidden sm:inline font-medium text-glow">สมัครสมาชิก</span>
      </Link>
    </div>
  );
};
