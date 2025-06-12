"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthSession, useAuth } from "@/components/auth-provider";
import {
  Menu,
  X,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useAuthSession();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickSignIn = () => {
    // For quick demo, redirect to login page
    window.location.href = "/auth/login";
  };

  if (!mounted) {
    return null; // or a skeleton header
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-gray-300 dark:border-border/50 bg-white/95 dark:bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-background/80 shadow-md"
          : "bg-gradient-to-r from-gray-50/30 via-gray-50/60 to-gray-50/30 dark:from-background/0 dark:via-background/50 dark:to-background/0"
      )}
    >
      {/* Main Header - Centered container with proper max-width */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo Section - Enhanced with animation */}
            <div className="flex-shrink-0 min-w-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  className="relative h-9 w-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-primary/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-primary-foreground font-bold text-sm">
                    SS
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.div
                  className="hidden sm:block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                    ShopSphere
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Center space for future features */}
            <div className="flex-1 max-w-xl mx-4 min-w-0">
              {/* Empty space for clean look */}
            </div>

            {/* Right Actions - Fixed width */}
            <div className="flex-shrink-0 min-w-0">
              <div className="flex items-center gap-2">
                {/* Enhanced Action Buttons */}
                <div className="flex items-center gap-1">
                  {/* Enhanced Theme Toggle */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="rounded-xl hover:bg-primary/5 transition-colors duration-200">
                      <ThemeToggle />
                    </div>
                  </motion.div>

                  {/* Enhanced User Menu or Auth Buttons */}
                  {session ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-xl flex-shrink-0 hover:bg-primary/10 transition-all duration-200 group"
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                                <AvatarImage
                                  src={session.user?.image || ""}
                                  alt={session.user?.name || ""}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
                                  {session.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              {/* Online indicator */}
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-56"
                          align="end"
                          forceMount
                        >
                          <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              {session.user?.name && (
                                <p className="font-medium">
                                  {session.user.name}
                                </p>
                              )}
                              {session.user?.email && (
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                  {session.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={signOut}>
                            Sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="hidden lg:flex items-center gap-2 flex-shrink-0"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleQuickSignIn}
                        className="rounded-xl h-9 px-4 hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20"
                      >
                        <Sparkles className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Quick Sign In</span>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        size="sm"
                        className="rounded-xl h-9 px-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <Link href="/auth/login">
                          <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">Login</span>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-xl h-9 px-4 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 group"
                      >
                        <Link href="/auth/register">
                          <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="h-4 w-4 mr-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                              <span className="text-xs font-bold">+</span>
                            </div>
                            <span className="font-semibold">Sign up</span>
                          </motion.div>
                        </Link>
                      </Button>
                    </motion.div>
                  )}

                  {/* Enhanced Mobile Menu Toggle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden flex-shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <motion.div
                        animate={{ rotate: isMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isMenuOpen ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Menu className="h-5 w-5" />
                        )}
                      </motion.div>
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-gray-300 dark:border-border/50 bg-gray-50/95 dark:bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Enhanced Auth buttons for non-logged in users */}
              {!session && (
                <motion.div
                  className="flex flex-col gap-3 pt-4 border-t border-gray-300 dark:border-border/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleQuickSignIn();
                      setIsMenuOpen(false);
                    }}
                    className="justify-start gap-3 h-12 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group"
                  >
                    <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Quick Sign In</span>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="justify-start gap-3 h-12 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Login</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="justify-start gap-3 h-12 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                        <span className="text-sm font-bold">+</span>
                      </div>
                      <span className="font-semibold">Sign up</span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
