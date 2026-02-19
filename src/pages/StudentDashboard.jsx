import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    PlusCircle,
    TrendingUp,
    CheckCircle,
    Globe,
    User,
    Search,
    Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import NewComplaintModal from '../components/NewComplaintModal';

// ========================================
// Student Dashboard — Full Implementation
// ========================================
const StudentDashboard = () => {
    const { user } = useAuth();
    const { complaints } = useComplaints();

    const [activeTab, setActiveTab] = useState('my');
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Derived data
    const myComplaints = useMemo(
        () => complaints.filter((c) => c.submittedBy === user?.uid),
        [complaints, user]
    );

    const publicComplaints = useMemo(
        () =>
            complaints.filter(
                (c) => c.visibility === 'public' && c.status !== 'pending-review' && c.status !== 'rejected'
            ),
        [complaints]
    );

    const currentList = activeTab === 'my' ? myComplaints : publicComplaints;

    // Apply search + filter
    const filteredList = useMemo(() => {
        let list = currentList;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q) ||
                    (c.location && c.location.toLowerCase().includes(q))
            );
        }

        if (filterStatus !== 'all') {
            list = list.filter((c) => c.status === filterStatus);
        }

        return list;
    }, [currentList, searchQuery, filterStatus]);

    // Stats
    const stats = useMemo(
        () => [
            {
                label: 'My Complaints',
                value: myComplaints.length,
                icon: FileText,
                color: 'text-primary-400 bg-primary-900/50',
            },
            {
                label: 'Upvoted Issues',
                value: complaints.filter((c) => c.upvotedBy.includes(user?.uid)).length,
                icon: TrendingUp,
                color: 'text-accent-400 bg-accent-900/50',
            },
            {
                label: 'Resolved',
                value: myComplaints.filter((c) => c.status === 'resolved').length,
                icon: CheckCircle,
                color: 'text-success-500 bg-success-50',
            },
        ],
        [myComplaints, complaints, user]
    );

    const tabs = [
        { key: 'my', label: 'My Complaints', icon: User, count: myComplaints.length },
        { key: 'public', label: 'Public Feed', icon: Globe, count: publicComplaints.length },
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">Student Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Welcome back, {user?.name || 'Student'}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-primary-glow hover:opacity-90 transition-opacity"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Complaint
                    </motion.button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-800 rounded-2xl p-5 shadow-card border border-slate-700/50 flex items-center gap-4"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                                <p className="text-xs text-slate-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 max-w-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setSearchQuery('');
                                setFilterStatus('all');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-slate-700 shadow-sm text-slate-100'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span
                                className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${activeTab === tab.key
                                    ? 'bg-primary-900/50 text-primary-400'
                                    : 'bg-slate-800 text-slate-500'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search + Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search complaints..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-600 bg-slate-900 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending-review">Pending Review</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Complaint List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + filterStatus + searchQuery}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {filteredList.length > 0 ? (
                            filteredList.map((complaint, i) => (
                                <ComplaintCard
                                    key={complaint.id}
                                    complaint={complaint}
                                    index={i}
                                    showUpvote={activeTab === 'public'}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800 rounded-2xl shadow-card border border-slate-700/50 p-12 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-2">No complaints found</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    {activeTab === 'my'
                                        ? "You haven't submitted any complaints yet."
                                        : 'No public complaints match your search.'}
                                </p>
                                {activeTab === 'my' && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(true)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium text-sm shadow-primary-glow"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Submit Your First Complaint
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* FAB (Mobile) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-primary-glow flex items-center justify-center z-40"
            >
                <PlusCircle className="w-7 h-7" />
            </motion.button>

            {/* New Complaint Modal */}
            <NewComplaintModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default StudentDashboard;
