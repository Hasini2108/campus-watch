import { motion } from 'framer-motion';
import { Inbox, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// ========================================
// Committee Dashboard (Shell)
// ========================================
const CommitteeDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Committee Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Screen complaints, assign urgency, and verify resolutions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Review', value: '8', icon: Inbox, color: 'text-warning-500 bg-warning-50' },
                    { label: 'High Urgency', value: '3', icon: AlertTriangle, color: 'text-danger-500 bg-danger-50' },
                    { label: 'Awaiting Verification', value: '5', icon: Clock, color: 'text-primary-600 bg-primary-50' },
                    { label: 'Verified Today', value: '4', icon: CheckCircle, color: 'text-success-500 bg-success-50' },
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

            {/* Placeholder */}
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                <p className="text-gray-400 text-sm">Complaint screening inbox will be built in Phase 5.</p>
            </div>
        </motion.div>
    );
};

export default CommitteeDashboard;
