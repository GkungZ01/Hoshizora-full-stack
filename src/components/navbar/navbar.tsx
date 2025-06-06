"use client";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { FiLayout } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./navbar.module.css";
import AuthButton from "../auth/AuthButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  const isAdminOrEditor = userRole === 'ADMIN' || userRole === 'EDITOR';

  const menuList = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  // Add CMS link for admin and editor
  const adminMenuList = [
    { name: "CMS", href: "/cms", icon: <FiLayout className="mr-1" /> }
  ];

  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute("data-theme", "business");
  }

  return (
    <div
      className={`w-full h-fit navbar sticky top-0 z-40 px-4 sm:px-6 lg:px-8 ${styles.navbarContainer}`}
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

        {/* Admin Menu Items (only visible for Admin/Editor) */}
        {isAdminOrEditor && adminMenuList.map((item, index) => (
          <Link
            key={`admin-${index}`}
            href={item.href}
            className={`btn ${styles.navItem} bg-[rgba(112,165,253,0.2)] hover:bg-[rgba(112,165,253,0.3)] text-white border-[rgba(112,165,253,0.2)] hover:border-[rgba(112,165,253,0.4)]`}
          >
            {item.icon} {item.name}
          </Link>
        ))}

        <AuthButton />
      </div>

      {isOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 p-4 border-b border-primary/30 ${styles.mobileMenu} z-40`}>
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

            {/* Admin Mobile Menu Items */}
            {isAdminOrEditor && (
              <div className="mt-2 mb-2">
                <div className="text-xs font-semibold text-[#70a5fd] opacity-80 px-4 py-1">ADMIN AREA</div>
                {adminMenuList.map((item, index) => (
                  <Link
                    key={`admin-mobile-${index}`}
                    href={item.href}
                    className={`btn w-full justify-start ${styles.navItem} bg-[rgba(112,165,253,0.2)] hover:bg-[rgba(112,165,253,0.3)] text-white border-[rgba(112,165,253,0.2)] hover:border-[rgba(112,165,253,0.4)]`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
            )}

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
