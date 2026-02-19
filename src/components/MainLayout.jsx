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
    Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ========================================
// Navigation items per role
// ========================================
const navItems = {
    student: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/student' },
        { label: 'My Complaints', icon: FileText, path: '/dashboard/student' },
    ],
    committee: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/committee' },
        { label: 'Inbox', icon: Inbox, path: '/dashboard/committee' },
    ],
    admin: [
        { label: 'Dashboard', icon: Home, path: '/dashboard/admin' },
        { label: 'Analytics', icon: BarChart3, path: '/dashboard/admin' },
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
        student: 'from-primary-500 to-primary-700',
        committee: 'from-accent-500 to-accent-700',
        admin: 'from-success-500 to-success-700',
    };

    const roleBadgeColors = {
        student: 'text-primary-400 bg-primary-900/50',
        committee: 'text-accent-400 bg-accent-900/50',
        admin: 'text-success-500 bg-success-50',
    };

    return (
        <div className="min-h-screen bg-background">
            {/* ============ Top Navbar (Glassmorphism) ============ */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2.5 group"
                        >
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-sm`}>
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
                                        key={item.label}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-primary-900/50 text-primary-400 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right side: user info + logout */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Role Badge */}
                            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ${roleBadgeColors[role]}`}>
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium capitalize">{role}</span>
                            </div>

                            {/* Notifications (decorative) */}
                            <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
                            </button>

                            {/* Logout */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 rounded-xl text-slate-400 hover:text-danger-400 hover:bg-danger-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </motion.button>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="fixed top-16 left-0 right-0 z-40 glass border-b border-slate-700/50 md:hidden overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-primary-900/50 text-primary-400'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
            <main className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ============ Mobile Bottom Navigation ============ */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="glass border-t border-slate-700/50 safe-area-bottom">
                    <div className="flex items-center justify-around px-2 py-2">
                        {items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-w-[64px] transition-all ${isActive
                                        ? 'text-primary-400'
                                        : 'text-slate-500'
                                        }`}
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.85 }}
                                        className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary-900/50' : ''
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </motion.div>
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </button>
                            );
                        })}

                        {/* Notifications bottom tab */}
                        <button
                            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-w-[64px] text-slate-500"
                        >
                            <div className="relative p-1.5 rounded-xl">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                            </div>
                            <span className="text-[10px] font-medium">Alerts</span>
                        </button>

                        {/* Profile bottom tab */}
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-w-[64px] text-slate-500"
                        >
                            <div className="p-1.5 rounded-xl">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium">Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
