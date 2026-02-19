import { motion } from 'framer-motion';
import { BarChart3, AlertCircle, CheckCircle2, Clock, FileWarning } from 'lucide-react';

// ========================================
// Admin Dashboard (Shell)
// ========================================
const AdminDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all complaints across categories</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Open', value: '18', icon: AlertCircle, color: 'text-primary-600 bg-primary-50' },
                    { label: 'In Progress', value: '7', icon: Clock, color: 'text-warning-500 bg-warning-50' },
                    { label: 'Resolved', value: '42', icon: CheckCircle2, color: 'text-success-500 bg-success-50' },
                    { label: 'Overdue', value: '2', icon: FileWarning, color: 'text-danger-500 bg-danger-50', urgent: true },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-white rounded-2xl p-5 shadow-card flex items-center gap-4 ${stat.urgent ? 'ring-2 ring-danger-500 ring-opacity-30' : ''}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} ${stat.urgent ? 'badge-urgent' : ''}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Category Tabs Placeholder */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {['All', 'Mess', 'Infrastructure', 'Hostel', 'Safety', 'Department'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`px-5 py-3 text-sm font-medium transition-colors ${i === 0
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="p-8 text-center">
                    <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Complaint management interface will be built in Phase 5.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
