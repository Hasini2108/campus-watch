import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileWarning,
    Search,
    Shield,
    MapPin,
    X,
    Loader2,
    MessageSquare,
    Upload,
    Timer,
    Plus,
    ChevronDown,
    Eye,
    Image as ImageIcon,
    ThumbsUp,
    ArrowRight,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';

// ========================================
// Status Tabs
// ========================================
const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'overdue', label: 'Overdue' },
];

const statusBadge = {
    open: { label: 'Open', color: 'bg-warning-50 text-warning-500', icon: AlertCircle },
    'in-progress': { label: 'In Progress', color: 'bg-primary-900/50 text-primary-400', icon: Loader2 },
    resolved: { label: 'Resolved', color: 'bg-success-50 text-success-500', icon: CheckCircle2 },
    'pending-review': { label: 'Pending', color: 'bg-slate-700 text-slate-400', icon: Clock },
    rejected: { label: 'Rejected', color: 'bg-danger-50 text-danger-400', icon: AlertCircle },
};

const urgencyColors = {
    high: 'text-danger-400 bg-danger-50',
    medium: 'text-warning-500 bg-warning-50',
    low: 'text-slate-400 bg-slate-700',
};

// ========================================
// Admin Dashboard — Full Implementation
// ========================================
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { complaints, updateStatus } = useComplaints();

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [proofName, setProofName] = useState('');
    const [actionType, setActionType] = useState('respond'); // 'respond' | 'resolve' | 'extend'
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter only admin-visible complaints (not pending-review or rejected)
    const adminComplaints = useMemo(
        () => complaints.filter((c) => !['pending-review', 'rejected'].includes(c.status)),
        [complaints]
    );

    // Overdue complaints
    const overdueComplaints = useMemo(
        () =>
            adminComplaints.filter(
                (c) =>
                    c.deadline &&
                    c.status !== 'resolved' &&
                    new Date(c.deadline) < new Date()
            ),
        [adminComplaints]
    );

    // Stats
    const stats = useMemo(
        () => [
            {
                label: 'Total Open',
                value: adminComplaints.filter((c) => c.status === 'open').length,
                icon: AlertCircle,
                color: 'text-primary-400 bg-primary-900/50',
            },
            {
                label: 'In Progress',
                value: adminComplaints.filter((c) => c.status === 'in-progress').length,
                icon: Clock,
                color: 'text-warning-500 bg-warning-50',
            },
            {
                label: 'Resolved',
                value: adminComplaints.filter((c) => c.status === 'resolved').length,
                icon: CheckCircle2,
                color: 'text-success-500 bg-success-50',
            },
            {
                label: 'Overdue',
                value: overdueComplaints.length,
                icon: FileWarning,
                color: 'text-danger-500 bg-danger-50',
                urgent: overdueComplaints.length > 0,
            },
        ],
        [adminComplaints, overdueComplaints]
    );

    // Filtered by tab + search
    const filteredComplaints = useMemo(() => {
        let list = adminComplaints;

        if (activeTab === 'overdue') {
            list = overdueComplaints;
        } else if (activeTab !== 'all') {
            list = list.filter((c) => c.status === activeTab);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q) ||
                    (c.location && c.location.toLowerCase().includes(q))
            );
        }

        return list;
    }, [adminComplaints, overdueComplaints, activeTab, searchQuery]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Time ago
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const isOverdue = (c) =>
        c.deadline && c.status !== 'resolved' && new Date(c.deadline) < new Date();

    // Open response/resolve modal
    const openAction = (complaint, type) => {
        setSelectedComplaint(complaint);
        setActionType(type);
        setResponseText(complaint.adminResponse || '');
        setProofName('');
        setShowResponseModal(true);
    };

    const handleAction = async () => {
        if (!selectedComplaint) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));

        if (actionType === 'respond') {
            updateStatus(selectedComplaint.id, 'in-progress', responseText.trim() || null);
            showToast('Response saved. Complaint marked In Progress.');
        } else if (actionType === 'resolve') {
            updateStatus(selectedComplaint.id, 'resolved', responseText.trim() || null);
            showToast('Complaint marked as Resolved!');
        } else if (actionType === 'extend') {
            // Mock extension — just show toast
            showToast('Deadline extended by 7 days.');
        }

        setLoading(false);
        setShowResponseModal(false);
        setSelectedComplaint(null);
        setResponseText('');
        setProofName('');
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
                    <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage all complaints across categories</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-slate-800 rounded-2xl p-5 shadow-card border border-slate-700/50 flex items-center gap-4 ${stat.urgent ? 'ring-2 ring-danger-500/30' : ''
                                }`}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} ${stat.urgent ? 'badge-urgent' : ''
                                    }`}
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

                {/* Tabs + Search */}
                <div className="bg-slate-800 rounded-2xl shadow-card border border-slate-700/50 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-700">
                        {/* Status Tabs */}
                        <div className="flex overflow-x-auto gap-1 bg-slate-900 rounded-xl p-1">
                            {STATUS_TABS.map((tab) => {
                                const count =
                                    tab.key === 'all'
                                        ? adminComplaints.length
                                        : tab.key === 'overdue'
                                            ? overdueComplaints.length
                                            : adminComplaints.filter((c) => c.status === tab.key).length;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.key
                                            ? 'bg-slate-700 shadow-sm text-slate-100'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {tab.label}
                                        <span
                                            className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.key
                                                ? tab.key === 'overdue'
                                                    ? 'bg-danger-50 text-danger-400'
                                                    : 'bg-primary-900/50 text-primary-400'
                                                : 'bg-slate-800 text-slate-500'
                                                }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search */}
                        <div className="relative max-w-xs w-full">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search complaints..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-600 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Complaint List */}
                    <div className="divide-y divide-slate-700/50">
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint, i) => {
                                const badge = statusBadge[complaint.status] || statusBadge.open;
                                const BadgeIcon = badge.icon;
                                const overdue = isOverdue(complaint);

                                return (
                                    <motion.div
                                        key={complaint.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="p-5 hover:bg-slate-700/30 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${badge.color}`}>
                                                        <BadgeIcon className="w-3 h-3" />
                                                        {badge.label}
                                                    </span>
                                                    {complaint.urgency && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${urgencyColors[complaint.urgency]} ${complaint.urgency === 'high' ? 'badge-urgent' : ''}`}>
                                                            {complaint.urgency.charAt(0).toUpperCase() + complaint.urgency.slice(1)}
                                                        </span>
                                                    )}
                                                    {overdue && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-danger-50 text-danger-400 badge-urgent">
                                                            Overdue
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-500">{timeAgo(complaint.createdAt)}</span>
                                                </div>

                                                <h3
                                                    className="text-sm font-semibold text-slate-100 mb-1 cursor-pointer hover:text-primary-400 transition-colors"
                                                    onClick={() => navigate(`/complaint/${complaint.id}`)}
                                                >
                                                    {complaint.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
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
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="w-3 h-3" />
                                                        {complaint.upvotes}
                                                    </span>
                                                    {complaint.deadline && (
                                                        <span className={`flex items-center gap-1 ${overdue ? 'text-danger-500 font-medium' : ''}`}>
                                                            <Timer className="w-3 h-3" />
                                                            {new Date(complaint.deadline).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => navigate(`/complaint/${complaint.id}`)}
                                                    className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View
                                                </button>

                                                {complaint.status === 'open' && (
                                                    <button
                                                        onClick={() => openAction(complaint, 'respond')}
                                                        className="px-3 py-2 rounded-xl text-xs font-medium bg-primary-900/50 text-primary-400 hover:bg-primary-900/70 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        Respond
                                                    </button>
                                                )}

                                                {complaint.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => openAction(complaint, 'resolve')}
                                                        className="px-3 py-2 rounded-xl text-xs font-medium bg-success-50 text-success-400 hover:bg-success-900/60 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Resolve
                                                    </button>
                                                )}

                                                {complaint.deadline &&
                                                    complaint.status !== 'resolved' &&
                                                    complaint.extensions < 2 && (
                                                        <button
                                                            onClick={() => openAction(complaint, 'extend')}
                                                            className="px-3 py-2 rounded-xl text-xs font-medium bg-warning-50 text-warning-500 hover:bg-warning-900/60 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                            Extend
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-1">No complaints found</h3>
                                <p className="text-sm text-slate-500">Try a different filter or search term.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ===== Response / Resolve / Extend Modal ===== */}
            <AnimatePresence>
                {showResponseModal && selectedComplaint && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowResponseModal(false);
                                setSelectedComplaint(null);
                            }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div
                                className={`h-1.5 ${actionType === 'resolve'
                                    ? 'bg-gradient-to-r from-success-400 to-success-600'
                                    : actionType === 'extend'
                                        ? 'bg-gradient-to-r from-warning-400 to-warning-600'
                                        : 'bg-gradient-to-r from-primary-400 to-primary-600'
                                    }`}
                            />
                            <div className="p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-100">
                                        {actionType === 'respond'
                                            ? 'Respond to Complaint'
                                            : actionType === 'resolve'
                                                ? 'Mark as Resolved'
                                                : 'Request Deadline Extension'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowResponseModal(false);
                                            setSelectedComplaint(null);
                                        }}
                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Complaint Summary */}
                                <div className="bg-slate-900 rounded-xl p-4 mb-5">
                                    <p className="text-sm font-medium text-slate-100 mb-1">{selectedComplaint.title}</p>
                                    <p className="text-xs text-slate-400 line-clamp-2">{selectedComplaint.description}</p>
                                </div>

                                {actionType === 'extend' ? (
                                    <div className="bg-warning-900/30 rounded-xl p-4 mb-5 flex items-center gap-3 border border-warning-800">
                                        <Timer className="w-6 h-6 text-warning-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-warning-400">
                                                This will extend the deadline by 7 days.
                                            </p>
                                            <p className="text-xs text-warning-500 mt-0.5">
                                                Extension {selectedComplaint.extensions + 1} of 2 allowed.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Response Text */}
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            {actionType === 'resolve' ? 'Resolution Summary' : 'Admin Response'}
                                        </label>
                                        <textarea
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            placeholder={
                                                actionType === 'resolve'
                                                    ? 'Describe how the issue was resolved...'
                                                    : 'Add your response or update...'
                                            }
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-4"
                                        />

                                        {/* Proof Upload (Resolve only) */}
                                        {actionType === 'resolve' && (
                                            <div className="mb-5">
                                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                                    Attach Proof of Resolution
                                                </label>
                                                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 hover:border-success-500 cursor-pointer transition-all">
                                                    <div className="w-10 h-10 rounded-lg bg-success-900/50 flex items-center justify-center flex-shrink-0">
                                                        {proofName ? (
                                                            <ImageIcon className="w-5 h-5 text-success-400" />
                                                        ) : (
                                                            <Upload className="w-5 h-5 text-success-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {proofName ? (
                                                            <>
                                                                <p className="text-sm font-medium text-slate-100 truncate">{proofName}</p>
                                                                <p className="text-xs text-slate-500">Click to change</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-medium text-slate-400">Upload proof image</p>
                                                                <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) setProofName(e.target.files[0].name);
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Action Button */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAction}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-xl font-semibold text-white shadow-sm transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 ${actionType === 'resolve'
                                        ? 'bg-gradient-to-r from-success-500 to-success-700'
                                        : actionType === 'extend'
                                            ? 'bg-gradient-to-r from-warning-500 to-warning-700'
                                            : 'bg-gradient-to-r from-primary-500 to-primary-700'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : actionType === 'resolve' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Mark as Resolved
                                        </>
                                    ) : actionType === 'extend' ? (
                                        <>
                                            <Timer className="w-4 h-4" />
                                            Extend Deadline
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="w-4 h-4" />
                                            Save & Mark In Progress
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== Toast ===== */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 60, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 z-[60] px-5 py-3 rounded-2xl shadow-xl bg-gray-900 text-white font-medium text-sm flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4 text-success-400" />
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminDashboard;
