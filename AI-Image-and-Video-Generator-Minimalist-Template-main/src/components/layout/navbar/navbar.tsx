"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LoginButton from "@/components/button/login-button";
import UserButton from "@/components/button/user-button";
import { useAppContext } from "@/contexts/app";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navLinks = [
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
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href={`/${locale}`}
          className="flex items-center gap-1 cursor-pointer"
        >
          <div className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
            A<span className="text-white/70">I</span>O
          </div>
        </a>

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

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <UserButton />
          ) : (
            <>
              <LoginButton />
            </>
          )}
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white py-2 font-medium"
                >
                  {link.label}
                </a>
              ))}
              {user && (
                <a
                  href={`/${locale}/dashboard`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white py-2 font-medium"
                >
                  My Workspace
                </a>
              )}
              <div className="h-px bg-white/10 my-2 w-full"></div>
              <div>{user ? <UserButton /> : <LoginButton />}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}