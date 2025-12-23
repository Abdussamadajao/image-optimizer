"use client";

import * as React from "react";
import { MdImage, MdMenu, MdLightMode, MdDarkMode } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useThemeStore } from "@/lib/stores/theme-store";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Header({ className, logo, navigation, actions }: HeaderProps) {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-20 h-auto",
        "bg-card",
        "border-b border-border",
        "px-4 sm:px-6 py-3",
        "flex items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MdMenu className="h-5 w-5" />
        </Button>
        {logo || (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MdImage className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">
              ImageOpt
            </span>
          </div>
        )}
      </div>

      {navigation && (
        <nav className="hidden md:flex items-center gap-9">{navigation}</nav>
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        {actions && (
          <div className="hidden sm:flex items-center gap-2">{actions}</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <MdDarkMode className="h-5 w-5" />
          ) : (
            <MdLightMode className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
