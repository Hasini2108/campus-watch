import { motion } from 'framer-motion';
import { FileText, PlusCircle, TrendingUp } from 'lucide-react';

// ========================================
// Student Dashboard (Shell)
// ========================================
const StudentDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">View, submit, and track your complaints</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-primary-glow hover:opacity-90 transition-opacity"
                >
                    <PlusCircle className="w-5 h-5" />
                    New Complaint
                </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'My Complaints', value: '5', icon: FileText, color: 'text-primary-600 bg-primary-50' },
                    { label: 'Upvoted Issues', value: '12', icon: TrendingUp, color: 'text-accent-600 bg-accent-50' },
                    { label: 'Resolved', value: '3', icon: FileText, color: 'text-success-500 bg-success-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for Tabs & Content */}
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                <p className="text-gray-400 text-sm">Complaint feed and submission form will be built in Phase 3.</p>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
