'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '../ui/AppIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'ChartBarIcon' },
    { name: 'Visit Form', href: '/visit-form', icon: 'ClipboardDocumentListIcon' },
    { name: 'Analytics', href: '/analytics-center', icon: 'ChartPieIcon' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-elevated border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transform transition-smooth group-hover:scale-105 group-hover:rotate-3">
              <svg
                className="w-6 h-6 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
              SalesTracker Pro
            </h1>
            <p className="text-xs text-muted-foreground font-body">Luxury Technology</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-cta font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth group"
            >
              <Icon
                name={item.icon as any}
                size={20}
                className="text-secondary group-hover:text-accent transition-smooth"
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth">
            <Icon name="BellIcon" size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          <div className="w-px h-6 bg-border"></div>
          
          <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-smooth group">
            <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-sm font-display font-semibold text-white">
              SP
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-sm font-cta font-semibold text-foreground">Sales Pro</p>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
            <Icon
              name="ChevronDownIcon"
              size={16}
              className="text-muted-foreground group-hover:text-foreground transition-smooth"
            />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          aria-label="Toggle mobile menu"
        >
          <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in-from-top">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-cta font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name={item.icon as any} size={20} className="text-secondary" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border">
              <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-cta font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-sm font-display font-semibold text-white">
                    SP
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-cta font-semibold text-foreground">Sales Pro</p>
                    <p className="text-xs text-muted-foreground">Manager</p>
                  </div>
                </div>
                <Icon name="ChevronDownIcon" size={16} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;