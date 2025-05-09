'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogIn, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-12 h-10">
        <div className="loading loading-spinner loading-sm"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="btn btn-ghost flex items-center gap-2"
        >
          {session.user?.image ? (
            <div className="avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
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
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span>{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || '?'}</span>
              </div>
            </div>
          )}
          <span className="hidden md:inline">{session.user?.name || session.user?.email}</span>
          <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm hover:bg-base-300"
                onClick={() => setDropdownOpen(false)}
              >
                <FiUser className="mr-2" />
                โปรไฟล์
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm hover:bg-base-300"
                onClick={() => setDropdownOpen(false)}
              >
                <FiSettings className="mr-2" />
                ตั้งค่า
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-base-300 text-error"
              >
                <FiLogOut className="mr-2" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href="/auth/signIn" className="btn btn-ghost">
        <FiLogIn className="mr-2" />
        <span className="hidden sm:inline">เข้าสู่ระบบ</span>
      </Link>
      <Link href="/auth/signUp" className="btn btn-primary">
        <FiUser className="mr-2" />
        <span className="hidden sm:inline">สมัครสมาชิก</span>
      </Link>
    </div>
  );
};
