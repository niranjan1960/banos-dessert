import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { ServingIdeasSection } from './components/ServingIdeasSection';
import { ContactSection } from './components/ContactSection';
import { ContactPage } from './components/ContactPage';
import { ProductsPage } from './components/ProductsPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { Footer } from './components/Footer';
import { ShoppingCart } from './components/ShoppingCart';
import { CartProvider, useCart } from './components/CartContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ContentProvider, useContent } from './components/ContentContext';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Settings, Package, ShoppingBag, Users, FileText, Plus, Edit, ArrowLeft, LayoutDashboard, Quote, CreditCard, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import admin components
import { AdminDessertsManager } from './components/admin/AdminDessertsManager';
import { AdminHeroManager } from './components/admin/AdminHeroManager';
import { AdminAboutManager } from './components/admin/AdminAboutManager';
import { AdminServingIdeasManager } from './components/admin/AdminServingIdeasManager';
import { AdminOrdersManager } from './components/admin/AdminOrdersManager';
import { AdminSiteSettings } from './components/admin/AdminSiteSettings';
import { AdminTestimonialsManager } from './components/admin/AdminTestimonialsManager';
import { AdminPaymentSettings } from './components/admin/AdminPaymentSettings';

type PageType = 'home' | 'desserts' | 'about' | 'serving-ideas' | 'contact' | 'my-orders' | 'profile' | 'admin';
type AdminSectionType = 'dashboard' | 'desserts' | 'hero' | 'about' | 'serving-ideas' | 'testimonials' | 'orders' | 'settings' | 'payments';

function AdminDashboard({ currentSection, onSectionChange }: { 
  currentSection: AdminSectionType; 
  onSectionChange: (section: AdminSectionType) => void; 
}) {
  const { content, isLoading } = useContent();
  const [dashboardData, setDashboardData] = useState({
    totalDesserts: 0,
    activeOrders: 0,
    totalTestimonials: 0,
    configuredGateways: 0
  });

  useEffect(() => {
    // Don't update dashboard data if content is still loading or not available
    if (isLoading || !content) return;

    // Calculate real dashboard statistics
    const updateDashboardData = () => {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('customer-orders') || '[]');
      const activeOrders = orders.filter((order: any) => 
        ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
      ).length;

      // Get payment gateways
      const gateways = JSON.parse(localStorage.getItem('payment-gateways') || '[]');
      const configuredGateways = gateways.filter((gateway: any) => gateway.enabled).length;

      setDashboardData({
        totalDesserts: content.desserts?.length || 0,
        activeOrders,
        totalTestimonials: content.testimonials?.length || 0,
        configuredGateways
      });
    };

    updateDashboardData();
    
    // Update every 30 seconds to reflect changes
    const interval = setInterval(updateDashboardData, 30000);
    return () => clearInterval(interval);
  }, [content, isLoading]);

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderAdminContent = () => {
    switch (currentSection) {
      case 'desserts':
        return <AdminDessertsManager />;
      case 'hero':
        return <AdminHeroManager />;
      case 'about':
        return <AdminAboutManager />;
      case 'serving-ideas':
        return <AdminServingIdeasManager />;
      case 'testimonials':
        return <AdminTestimonialsManager />;
      case 'orders':
        return <AdminOrdersManager />;
      case 'settings':
        return <AdminSiteSettings />;
      case 'payments':
        return <AdminPaymentSettings />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Stats Overview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Desserts</p>
                      <p className="text-2xl font-bold">{dashboardData.totalDesserts}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Orders</p>
                      <p className="text-2xl font-bold">{dashboardData.activeOrders}</p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Testimonials</p>
                      <p className="text-2xl font-bold">{dashboardData.totalTestimonials}</p>
                    </div>
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-full">
                      <Quote className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Gateways</p>
                      <p className="text-2xl font-bold">{dashboardData.configuredGateways}</p>
                    </div>
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => onSectionChange('desserts')}
                    >
                      <Plus className="h-5 w-5" />
                      Add New Dessert
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => onSectionChange('testimonials')}
                    >
                      <Quote className="h-5 w-5" />
                      Add Testimonial
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => onSectionChange('payments')}
                    >
                      <CreditCard className="h-5 w-5" />
                      Setup Payments
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2"
                      onClick={() => onSectionChange('orders')}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      View Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity & Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
            >
              {/* Quick Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Website Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Orders Processing</span>
                      <Badge variant={dashboardData.activeOrders > 0 ? "default" : "secondary"}>
                        {dashboardData.activeOrders > 0 ? 'Active' : 'No Orders'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Gateways</span>
                      <Badge variant={dashboardData.configuredGateways > 0 ? "default" : "secondary"}>
                        {dashboardData.configuredGateways} Configured
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Status</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Updated
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Desserts</span>
                      <span className="font-medium">{content.desserts.filter(d => d.isActive !== false).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Featured Items</span>
                      <span className="font-medium">{content.desserts.filter(d => d.featured).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Serving Ideas</span>
                      <span className="font-medium">{content.servingIdeas.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Customer Reviews</span>
                      <span className="font-medium">{content.testimonials.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Management Sections */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Desserts Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Add, edit, and manage your dessert catalog with pricing, images, and descriptions.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('desserts')}>
                    <Package className="h-4 w-4 mr-2" />
                    Manage Desserts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5" />
                    Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage customer testimonials and reviews to build trust and credibility.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('testimonials')}>
                    <Quote className="h-4 w-4 mr-2" />
                    Manage Testimonials
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure payment gateways like PayPal and Stripe for online transactions.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('payments')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Setup Payments
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Orders Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View and manage customer orders, update statuses, and track deliveries.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('orders')}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Hero Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Customize your homepage hero section with images, titles, and CTAs.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('hero')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Hero
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    About Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Edit Chef Bano's story, certifications, and about page content.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('about')}>
                    <Users className="h-4 w-4 mr-2" />
                    Edit About
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Serving Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage occasion-based serving suggestions and celebration ideas.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('serving-ideas')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Ideas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Site Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure business settings, contact info, and social media links.
                  </p>
                  <Button className="w-full" onClick={() => onSectionChange('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Site Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        );
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'desserts': return 'Desserts Management';
      case 'hero': return 'Hero Section';
      case 'about': return 'About Section';
      case 'serving-ideas': return 'Serving Ideas';
      case 'testimonials': return 'Testimonials Management';
      case 'orders': return 'Orders Management';
      case 'settings': return 'Site Settings';
      case 'payments': return 'Payment Settings';
      case 'dashboard':
      default: return 'Admin Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentSection !== 'dashboard' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSectionChange('dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              )}
              <div>
                <h1 className="font-parisienne text-3xl lg:text-4xl mb-2">{getSectionTitle()}</h1>
                <p className="text-muted-foreground">
                  {currentSection === 'dashboard' 
                    ? 'Manage your website content and business operations'
                    : `Manage your ${getSectionTitle().toLowerCase()} content`
                  }
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {currentSection === 'dashboard' ? (
                <>
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  CMS Panel
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-1" />
                  {getSectionTitle()}
                </>
              )}
            </Badge>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAdminContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentAdminSection, setCurrentAdminSection] = useState<AdminSectionType>('dashboard');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  // Auto scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Listen for navigation events from components
  useEffect(() => {
    const handleNavigate = (event: any) => {
      handlePageChange(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handlePageChange = (page: string) => {
    // If user tries to access protected pages without authentication, redirect to home
    if (!isAuthenticated && (page === 'my-orders' || page === 'profile')) {
      setCurrentPage('home');
      return;
    }
    
    // Reset admin section when navigating away from admin
    if (page !== 'admin') {
      setCurrentAdminSection('dashboard');
    }
    
    setCurrentPage(page as PageType);
  };

  const handleAdminSectionChange = (section: AdminSectionType) => {
    setCurrentAdminSection(section);
  };

  const renderCurrentPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const pageTransition = {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3
    };

    switch (currentPage) {
      case 'desserts':
        return (
          <motion.div
            key="desserts"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ProductsPage />
          </motion.div>
        );
      
      case 'about':
        return (
          <motion.div
            key="about"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <main>
              <AboutSection />
            </main>
          </motion.div>
        );
      
      case 'serving-ideas':
        return (
          <motion.div
            key="serving-ideas"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <main>
              <ServingIdeasSection isStandalonePage={true} />
            </main>
          </motion.div>
        );
      
      case 'contact':
        return (
          <motion.div
            key="contact"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ContactPage />
          </motion.div>
        );
      
      case 'my-orders':
        return (
          <motion.div
            key="my-orders"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <MyOrdersPage />
          </motion.div>
        );
      
      case 'admin':
        return (
          <motion.div
            key="admin"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AdminDashboard 
              currentSection={currentAdminSection}
              onSectionChange={handleAdminSectionChange}
            />
          </motion.div>
        );
      
      case 'profile':
        return (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <div className="min-h-screen bg-background py-8">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-parisienne text-3xl mb-8">Profile Settings</h1>
                <p className="text-muted-foreground">Profile management coming soon...</p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'home':
      default:
        return (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <main>
              <HeroSection />
              <FeaturedProducts />
              <TestimonialsSection />
              <div id="about-section">
                <AboutSection />
              </div>
              <ContactSection />
            </main>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        cartItemCount={itemCount} 
        onCartClick={handleCartClick}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      
      {/* Main Content with page transitions */}
      <AnimatePresence mode="wait">
        {renderCurrentPage()}
      </AnimatePresence>

      {/* Footer - only show on non-admin pages */}
      {!['admin'].includes(currentPage) && ['home', 'about', 'serving-ideas', 'contact'].includes(currentPage) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Footer />
        </motion.div>
      )}

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={handleCartClose} />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ContentProvider>
          <AppContent />
        </ContentProvider>
      </CartProvider>
    </AuthProvider>
  );
}