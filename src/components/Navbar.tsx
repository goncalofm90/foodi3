"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { account } from "@/lib/client";
import { ChefHat, Search, Heart, LogOut, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      window.location.href = "/auth";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { href: "/dishes", label: "Dishes", icon: ChefHat },
    { href: "/cocktails", label: "Cocktails", icon: Search },
    { href: "/profile", label: "Favorites", icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-card flex items-center justify-center shadow-medium group-hover:shadow-lifted transition-all duration-300 group-hover:scale-105">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-2xl text-neutral-900 tracking-tight">
                Foodi3
              </h1>
              <p className="text-xs text-neutral-500 -mt-1">
                Your recipe companion
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-button font-medium text-sm
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium text-error hover:bg-error/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-primary-500 text-white rounded-button font-medium text-sm hover:bg-primary-600 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-button hover:bg-neutral-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-button font-medium
                      transition-all
                      ${
                        isActive
                          ? "bg-primary-500 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="h-px bg-neutral-200 my-2" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-button text-neutral-700 hover:bg-neutral-100 transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="truncate">{user.name || user.email}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-button text-error hover:bg-error/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 bg-primary-500 text-white rounded-button font-medium text-center hover:bg-primary-600 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
