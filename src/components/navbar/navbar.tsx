'use client'
import { useState, useEffect } from 'react';
import { HiOutlineSun, HiOutlineMoon, HiMenu } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import styles from './navbar.module.css';

const Navbar = () => {
  const [theme, setTheme] = useState('business');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'business';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'business' ? 'winter' : 'business';
    setTheme(newTheme);
  };

  return (
    <div className="w-full h-fit navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 
      border-b border-base-content/10 shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="flex-1">
        <Link href="/" className={`btn btn-ghost text-lg sm:text-xl font-bold tracking-wider ${styles.logoText}`}>
          Hoshizora
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="btn btn-ghost btn-circle lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <HiMenu className="w-6 h-6" />
      </button>

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:items-center lg:gap-2">
        <Link href="/" className="btn btn-ghost">Home</Link>
        <Link href="/blog" className="btn btn-ghost">Blog</Link>
        <Link href="/about" className="btn btn-ghost">About</Link>
        
        <button 
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
        >
          {theme === 'business' 
            ? <HiOutlineSun className="w-5 h-5" />
            : <HiOutlineMoon className="w-5 h-5" />
          }
        </button>

        <Link href="/login" className="btn btn-ghost btn-circle">
          <FaUserCircle className="w-5 h-5" />
        </Link>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 p-4 bg-base-100 border-b border-base-content/10">
          <div className="flex flex-col gap-2 w-full">
            <Link href="/" className="btn btn-ghost w-full justify-start" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/blog" className="btn btn-ghost w-full justify-start" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="btn btn-ghost w-full justify-start" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-base-content/10">
              <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                {theme === 'business' 
                  ? <HiOutlineSun className="w-5 h-5" />
                  : <HiOutlineMoon className="w-5 h-5" />
                }
              </button>
              <Link href="/login" className="btn btn-ghost btn-circle">
                <FaUserCircle className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;