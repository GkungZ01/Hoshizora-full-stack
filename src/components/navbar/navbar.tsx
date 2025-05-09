"use client";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import Link from "next/link";
import styles from "./navbar.module.css";
import AuthButton from "../auth/AuthButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuList = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" }
  ];

  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute("data-theme", "business");
  }

  return (
    <div
      className={`w-full h-fit navbar sticky top-0 z-50 px-4 sm:px-6 lg:px-8 ${styles.navbarContainer}`}
    >
      <div className="flex-1">
        <Link
          href="/"
          className={`btn btn-ghost text-lg sm:text-xl ${styles.logoText}`}
        >
          HOSHIZORA
        </Link>
      </div>

      <button
        className={`btn btn-circle lg:hidden ${styles.menuButton}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <HiMenu className="w-6 h-6" />
      </button>

      <div className="hidden lg:flex lg:items-center lg:gap-4">
        {menuList.map((item, index) => (
          <Link key={index} href={item.href} className={`btn btn-ghost ${styles.navItem}`}>
            {item.name}
          </Link>
        ))}

        <AuthButton />
      </div>

      {isOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 p-4 border-b border-primary/30 ${styles.mobileMenu}`}>
          <div className="flex flex-col gap-2 w-full">
            {menuList.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`btn btn-ghost w-full justify-start ${styles.navItem}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-primary/20">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
