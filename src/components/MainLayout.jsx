import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Home,
    FileText,
    LogOut,
    Menu,
    X,
    User,
    BarChart3,
    Inbox,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ========================================
// Navigation items per role
// ========================================
const navItems = {
    student: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/student' },
        { label: 'My Complaints', icon: FileText, path: '/dashboard/student/complaints' },
    ],
    committee: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/committee' },
        { label: 'Inbox', icon: Inbox, path: '/dashboard/committee/inbox' },
    ],
    admin: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/admin' },
        { label: 'Analytics', icon: BarChart3, path: '/dashboard/admin/analytics' },
    ],
};

// ========================================
// MainLayout Component
// ========================================
const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const role = user?.role || 'student';
    const items = navItems[role] || navItems.student;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const roleColors = {
        student: 'text-primary-600',
        committee: 'text-accent-500',
        admin: 'text-success-500',
    };

    return (
        <div className="min-h-screen bg-background">
            {/* ============ Top Navbar (Glassmorphism) ============ */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight gradient-text hidden sm:block">
                                CampusWatch
                            </span>
                        </button>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-primary-50 text-primary-600'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right side: user info + logout */}
                        <div className="flex items-center gap-3">
                            {/* User badge */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50">
                                <User className={`w-4 h-4 ${roleColors[role]}`} />
                                <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
                            </div>

                            {/* Logout */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 rounded-xl text-gray-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </motion.button>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ============ Mobile Slide-down Menu ============ */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-16 left-0 right-0 z-40 glass border-b border-white/20 md:hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-primary-50 text-primary-600'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============ Page Content ============ */}
            <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MainLayout;
