import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Users,
    Settings,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
    UserPlus,
    LogIn,
    ChevronDown,
    CheckCircle,
} from 'lucide-react';
import { useAuth, DEPARTMENTS } from '../context/AuthContext';

// ========================================
// Role config for adaptive UI
// ========================================
const roleConfig = {
    student: {
        title: 'Student Portal',
        loginSubtitle: 'Use your college email to sign in',
        registerSubtitle: 'Create your student account',
        icon: Users,
        gradient: 'from-primary-500 to-primary-700',
        accentColor: 'primary',
        showRegister: true,
    },
    committee: {
        title: 'Committee Login',
        loginSubtitle: 'Credentials provided by administration',
        registerSubtitle: '',
        icon: Shield,
        gradient: 'from-accent-500 to-accent-700',
        accentColor: 'accent',
        showRegister: false,
    },
    admin: {
        title: 'Admin Login',
        loginSubtitle: 'Authorized personnel only',
        registerSubtitle: '',
        icon: Settings,
        gradient: 'from-success-500 to-success-600',
        accentColor: 'success',
        showRegister: false,
    },
};

// ========================================
// Login / Register Page
// ========================================
const Login = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [isRegister, setIsRegister] = useState(false);

    // Login fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Register-only fields
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartment] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const config = roleConfig[role] || roleConfig.student;
    const Icon = config.icon;

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        setDepartment('');
        setError('');
        setSuccess(false);
    };

    const handleToggle = () => {
        resetFields();
        setIsRegister(!isRegister);
    };

    // ---- Login handler ----
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(role, email, password);
            const dashboardRoutes = {
                student: '/dashboard/student',
                committee: '/dashboard/committee',
                admin: '/dashboard/admin',
            };
            navigate(dashboardRoutes[role] || '/dashboard/student');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ---- Register handler ----
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await register({ name, email, password, department });
            setSuccess(true);
            // Brief success animation then redirect
            setTimeout(() => {
                navigate('/dashboard/student');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                    style={{ animationDelay: '3s' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back Button */}
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </motion.button>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-glass relative overflow-hidden">
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`} />

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-4`}
                            >
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {isRegister ? config.registerSubtitle : config.loginSubtitle}
                            </p>
                        </div>

                        {/* Login / Register Toggle (Student only) */}
                        {config.showRegister && (
                            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => !loading && handleToggle()}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${!isRegister
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </button>
                                <button
                                    onClick={() => !loading && handleToggle()}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${isRegister
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Register
                                </button>
                            </div>
                        )}

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-3 py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-8 h-8 text-success-600" />
                                    </motion.div>
                                    <p className="text-lg font-semibold text-gray-900">Account Created!</p>
                                    <p className="text-sm text-gray-500">Redirecting to dashboard…</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && !success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded-xl mb-6 font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ====== FORMS ====== */}
                        {!success && (
                            <AnimatePresence mode="wait">
                                {!isRegister ? (
                                    /* ---- LOGIN FORM ---- */
                                    <motion.form
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.25 }}
                                        onSubmit={handleLogin}
                                        className="space-y-5"
                                    >
                                        {/* Email / Username */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                {role === 'student' ? 'College Email' : 'Username'}
                                            </label>
                                            <input
                                                type={role === 'student' ? 'email' : 'text'}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={role === 'student' ? 'you@college.edu' : 'Enter username'}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading}
                                            className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-primary-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Signing in…
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn className="w-4 h-4" />
                                                    Sign In
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                ) : (
                                    /* ---- REGISTER FORM ---- */
                                    <motion.form
                                        key="register"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25 }}
                                        onSubmit={handleRegister}
                                        className="space-y-4"
                                    >
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Priya Reddy"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* College Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                College Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@college.edu"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Department Select */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                                            <div className="relative">
                                                <select
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none pr-10"
                                                >
                                                    <option value="" disabled>
                                                        Select department
                                                    </option>
                                                    {DEPARTMENTS.map((dept) => (
                                                        <option key={dept} value={dept}>
                                                            {dept}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Min 6 characters"
                                                    required
                                                    minLength={6}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter password"
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading}
                                            className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-primary-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Creating account…
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-4 h-4" />
                                                    Create Account
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
