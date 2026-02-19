import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Inbox,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    Shield,
    MapPin,
    X,
    ChevronDown,
    Bell,
    XCircle,
    Zap,
    FileText,
    Eye,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';

// ========================================
// Committee Dashboard — Full Implementation
// ========================================
const CommitteeDashboard = () => {
    const navigate = useNavigate();
    const { complaints, setUrgency, rejectComplaint } = useComplaints();

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [urgencyChoice, setUrgencyChoice] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    // Filtered lists
    const pendingComplaints = useMemo(
        () => complaints.filter((c) => c.status === 'pending-review'),
        [complaints]
    );

    const verifiedToday = useMemo(
        () =>
            complaints.filter(
                (c) =>
                    c.status !== 'pending-review' &&
                    c.status !== 'rejected' &&
                    c.urgency !== null
            ),
        [complaints]
    );

    const highUrgency = useMemo(
        () => complaints.filter((c) => c.urgency === 'high' && c.status !== 'resolved'),
        [complaints]
    );

    // Search
    const filteredPending = useMemo(() => {
        if (!searchQuery.trim()) return pendingComplaints;
        const q = searchQuery.toLowerCase();
        return pendingComplaints.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q)
        );
    }, [pendingComplaints, searchQuery]);

    // Stats
    const stats = [
        { label: 'Pending Review', value: pendingComplaints.length, icon: Inbox, color: 'text-warning-500 bg-warning-50' },
        { label: 'High Urgency', value: highUrgency.length, icon: AlertTriangle, color: 'text-danger-500 bg-danger-50' },
        { label: 'Verified', value: verifiedToday.length, icon: CheckCircle, color: 'text-success-500 bg-success-50' },
        { label: 'Total Active', value: complaints.filter((c) => !['resolved', 'rejected'].includes(c.status)).length, icon: FileText, color: 'text-primary-600 bg-primary-50' },
    ];

    // Show toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Verify & Assign Urgency
    const handleVerify = () => {
        if (!urgencyChoice || !selectedComplaint) return;
        setUrgency(selectedComplaint.id, urgencyChoice);

        if (urgencyChoice === 'high') {
            showToast('🚨 HIGH URGENCY: SMS alert sent to Admin!', 'urgent');
        } else {
            showToast(`Complaint verified with ${urgencyChoice} urgency.`);
        }

        setShowVerifyModal(false);
        setSelectedComplaint(null);
        setUrgencyChoice('');
    };

    // Reject
    const handleReject = () => {
        if (!rejectReason.trim() || !selectedComplaint) return;
        rejectComplaint(selectedComplaint.id, rejectReason.trim());
        showToast('Complaint rejected.', 'error');
        setShowRejectModal(false);
        setSelectedComplaint(null);
        setRejectReason('');
    };

    // Time ago helper
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Committee Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Screen complaints, assign urgency, and verify resolutions
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
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

                {/* Screening Inbox */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    {/* Inbox Header */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Inbox className="w-5 h-5 text-primary-500" />
                                Screening Inbox
                                {pendingComplaints.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-warning-100 text-warning-700">
                                        {pendingComplaints.length}
                                    </span>
                                )}
                            </h2>
                            <div className="relative max-w-xs w-full">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search pending..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Complaint List */}
                    <div className="divide-y divide-gray-50">
                        {filteredPending.length > 0 ? (
                            filteredPending.map((complaint, i) => (
                                <motion.div
                                    key={complaint.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-5 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Left: Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning-50 text-warning-600 text-xs font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    Pending Review
                                                </span>
                                                <span className="text-xs text-gray-400">{timeAgo(complaint.createdAt)}</span>
                                            </div>
                                            <h3
                                                className="text-sm font-semibold text-gray-900 mb-1 cursor-pointer hover:text-primary-600 transition-colors"
                                                onClick={() => navigate(`/complaint/${complaint.id}`)}
                                            >
                                                {complaint.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{complaint.description}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    {complaint.category}
                                                </span>
                                                {complaint.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {complaint.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate(`/complaint/${complaint.id}`)}
                                                className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSelectedComplaint(complaint);
                                                    setShowVerifyModal(true);
                                                }}
                                                className="px-3 py-2 rounded-xl text-xs font-medium bg-success-50 text-success-700 hover:bg-success-100 transition-colors flex items-center gap-1.5"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Verify
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSelectedComplaint(complaint);
                                                    setShowRejectModal(true);
                                                }}
                                                className="px-3 py-2 rounded-xl text-xs font-medium bg-danger-50 text-danger-700 hover:bg-danger-100 transition-colors flex items-center gap-1.5"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                Reject
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-success-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">All caught up!</h3>
                                <p className="text-sm text-gray-400">No pending complaints to review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ===== Verify & Assign Urgency Modal ===== */}
            <AnimatePresence>
                {showVerifyModal && selectedComplaint && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowVerifyModal(false);
                                setSelectedComplaint(null);
                            }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-success-400 to-success-600" />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Verify & Assign Urgency</h2>
                                    <button
                                        onClick={() => {
                                            setShowVerifyModal(false);
                                            setSelectedComplaint(null);
                                        }}
                                        className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedComplaint.title}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{selectedComplaint.description}</p>
                                </div>

                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Assign Urgency Level
                                </label>
                                <div className="space-y-2 mb-6">
                                    {[
                                        { value: 'low', label: 'Low', desc: 'Routine, no deadline', color: 'border-gray-200 bg-gray-50', active: 'border-gray-400 bg-gray-100' },
                                        { value: 'medium', label: 'Medium', desc: 'Should be addressed soon', color: 'border-warning-200 bg-warning-50', active: 'border-warning-400 bg-warning-100' },
                                        { value: 'high', label: 'High', desc: '7-day deadline + SMS alert', color: 'border-danger-200 bg-danger-50', active: 'border-danger-400 bg-danger-100' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setUrgencyChoice(opt.value)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${urgencyChoice === opt.value ? opt.active : opt.color
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${urgencyChoice === opt.value ? 'border-primary-600' : 'border-gray-300'
                                                }`}>
                                                {urgencyChoice === opt.value && (
                                                    <div className="w-2 h-2 rounded-full bg-primary-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                                                <p className="text-xs text-gray-500">{opt.desc}</p>
                                            </div>
                                            {opt.value === 'high' && (
                                                <Zap className="w-4 h-4 text-danger-500 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleVerify}
                                    disabled={!urgencyChoice}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-success-500 to-success-700 text-white font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                                >
                                    Verify Complaint
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== Reject Modal ===== */}
            <AnimatePresence>
                {showRejectModal && selectedComplaint && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowRejectModal(false);
                                setSelectedComplaint(null);
                            }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-danger-400 to-danger-600" />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Reject Complaint</h2>
                                    <button
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setSelectedComplaint(null);
                                        }}
                                        className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedComplaint.title}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{selectedComplaint.description}</p>
                                </div>

                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Reason for Rejection <span className="text-danger-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Explain why this complaint is being rejected..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent resize-none mb-5"
                                />

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim()}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-danger-500 to-danger-700 text-white font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                                >
                                    Reject Complaint
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== Toast Notification ===== */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 60, x: '-50%' }}
                        className={`fixed bottom-6 left-1/2 z-[60] px-5 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center gap-2 ${toast.type === 'urgent'
                                ? 'bg-danger-600 text-white'
                                : toast.type === 'error'
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-success-600 text-white'
                            }`}
                    >
                        {toast.type === 'urgent' && <Bell className="w-4 h-4 animate-bounce" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CommitteeDashboard;
