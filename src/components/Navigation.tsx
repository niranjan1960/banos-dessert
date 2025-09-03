import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, ShoppingCart, User, LogOut, LogIn, Settings } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { motion } from 'framer-motion';

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ cartItemCount, onCartClick, currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { id: 'about', label: 'About Us' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'serving-ideas', label: 'Serving Ideas' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onPageChange('home');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - With navigation functionality */}
          <motion.div 
            className="flex-shrink-0 cursor-pointer"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Orders (for authenticated users) */}
            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick('my-orders')}
                  className={currentPage === 'my-orders' ? 'bg-accent' : ''}
                >
                  Orders
                </Button>
              </motion.div>
            )}

            {/* Cart */}
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={onCartClick}>
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Auth */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                {isAuthenticated ? (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </motion.div>

            {/* Admin CTA */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavClick('admin')}
                className={currentPage === 'admin' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={onCartClick}>
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                  
                  <div className="border-t pt-4">
                    {isAuthenticated && (
                      <Button
                        variant={currentPage === 'my-orders' ? "default" : "ghost"}
                        className="w-full justify-start mb-3"
                        onClick={() => handleNavClick('my-orders')}
                      >
                        Orders
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-3"
                      onClick={handleAuthClick}
                    >
                      {isAuthenticated ? (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout {user?.name && `(${user.name})`}
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Login / Sign Up
                        </>
                      )}
                    </Button>

                    {/* Admin CTA - Mobile */}
                    <Button
                      variant={currentPage === 'admin' ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleNavClick('admin')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.nav>
  );
}