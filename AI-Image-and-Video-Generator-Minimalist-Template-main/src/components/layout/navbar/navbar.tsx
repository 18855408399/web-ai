"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LoginButton from "@/components/button/login-button";
import UserButton from "@/components/button/user-button";
import { useAppContext } from "@/contexts/app";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const locale = useLocale();
  const { user, setUser } = useAppContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session, setUser]);

  // 确保所有链接带有当前语言前缀
  const navLinks = [
    { label: "Home", href: `/${locale}` },
    { label: "Features", href: `/${locale}/features` },
    { label: "How it Works", href: `/${locale}/how-it-works` },
    { label: "Pricing", href: `/${locale}/pricing` },
    { label: "FAQ", href: `/${locale}/faq` },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo 区域 */}
        <a
          href={`/${locale}`}
          className="flex items-center gap-1 cursor-pointer group"
          aria-label="Homepage"
        >
          <div className="text-2xl font-black tracking-tighter text-white drop-shadow-md group-hover:text-white/80 transition-all">
            A<span className="text-white/70">I</span>O
          </div>
        </a>

        {/* 电脑端导航栏 */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90 tracking-wide">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors drop-shadow-sm"
            >
              {link.label}
            </a>
          ))}
          {user && (
            <a
              href={`/${locale}/dashboard`}
              className="hover:text-white transition-colors drop-shadow-sm"
            >
              My Workspace
            </a>
          )}
        </div>

        {/* 登录/头像 区域 */}
        <div className="hidden md:flex items-center gap-4">
          {user ? <UserButton /> : <LoginButton />}
        </div>

        {/* 手机端菜单按钮 */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 手机端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute left-0 right-0 top-16 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-6 flex flex-col gap-4 z-50"
            role="menu"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white text-base font-medium py-2 px-3 rounded hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={0}
              >
                {link.label}
              </a>
            ))}
            {user && (
              <a
                href={`/${locale}/dashboard`}
                className="text-white text-base font-medium py-2 px-3 rounded hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={0}
              >
                My Workspace
              </a>
            )}
            <div className="pt-2 border-t border-white/20 flex flex-col gap-2">
              {user ? <UserButton /> : <LoginButton />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;