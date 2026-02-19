import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ThumbsUp,
    MapPin,
    Clock,
    Shield,
    Eye,
    EyeOff,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Flag,
    Image as ImageIcon,
    MessageSquare,
    Users,
    Calendar,
    Timer,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import Timeline from '../components/Timeline';

// ========================================
// Status / Urgency Configs
// ========================================
const statusConfig = {
    'pending-review': { label: 'Pending Review', color: 'bg-slate-700 text-slate-300', icon: Clock },
    open: { label: 'Open', color: 'bg-warning-50 text-warning-500', icon: AlertTriangle },
    'in-progress': { label: 'In Progress', color: 'bg-primary-900/50 text-primary-400', icon: Loader2 },
    resolved: { label: 'Resolved', color: 'bg-success-50 text-success-500', icon: CheckCircle2 },
    rejected: { label: 'Rejected', color: 'bg-danger-50 text-danger-400', icon: AlertTriangle },
};

const urgencyColors = {
    high: 'bg-danger-50 text-danger-400',
    medium: 'bg-warning-50 text-warning-500',
    low: 'bg-slate-700 text-slate-400',
};

// ========================================
// Complaint Details Page
// ========================================
const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { complaints, toggleUpvote, confirmResolution, flagComplaint } = useComplaints();
    const { user } = useAuth();

    const complaint = complaints.find((c) => c.id === id);

    if (!complaint) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
            >
                <div className="w-20 h-20 rounded-2xl bg-slate-700 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-300 mb-2">Complaint Not Found</h2>
                <p className="text-sm text-slate-500 mb-6">
                    The complaint you're looking for doesn't exist.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm"
                >
                    Go Back
                </button>
            </motion.div>
        );
    }

    const status = statusConfig[complaint.status] || statusConfig.open;
    const StatusIcon = status.icon;
    const hasUpvoted = user && complaint.upvotedBy.includes(user.uid);
    const hasConfirmed = user && complaint.confirmedBy.includes(user.uid);
    const isOverdue =
        complaint.deadline &&
        complaint.status !== 'resolved' &&
        new Date(complaint.deadline) < new Date();

    // Days remaining / overdue
    const getDaysRemaining = () => {
        if (!complaint.deadline) return null;
        const diff = new Date(complaint.deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const daysRemaining = getDaysRemaining();

    const handleUpvote = () => {
        if (user && complaint.visibility === 'public') {
            toggleUpvote(complaint.id, user.uid);
        }
    };

    const handleConfirm = () => {
        if (user) {
            confirmResolution(complaint.id, user.uid);
        }
    };

    const handleFlag = () => {
        if (user) {
            flagComplaint(complaint.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            {/* Back Button */}
            <motion.button
                whileHover={{ x: -4 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </motion.button>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column — Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-slate-800 rounded-2xl shadow-card border border-slate-700/50 overflow-hidden">
                        {/* Urgency stripe */}
                        {complaint.urgency && (
                            <div
                                className={`h-1.5 ${complaint.urgency === 'high'
                                    ? 'bg-gradient-to-r from-danger-500 to-accent-500'
                                    : complaint.urgency === 'medium'
                                        ? 'bg-gradient-to-r from-warning-400 to-warning-500'
                                        : 'bg-slate-600'
                                    }`}
                            />
                        )}

                        <div className="p-6">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${status.color}`}
                                >
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {status.label}
                                </span>

                                {complaint.urgency && (
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${urgencyColors[complaint.urgency]
                                            } ${complaint.urgency === 'high' ? 'badge-urgent' : ''}`}
                                    >
                                        {complaint.urgency.charAt(0).toUpperCase() + complaint.urgency.slice(1)} Urgency
                                    </span>
                                )}

                                {isOverdue && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-danger-50 text-danger-400 badge-urgent">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Overdue
                                    </span>
                                )}

                                {complaint.visibility === 'private' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-400">
                                        <EyeOff className="w-3.5 h-3.5" />
                                        Private
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-900/50 text-primary-400">
                                        <Eye className="w-3.5 h-3.5" />
                                        Public
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-slate-100 mb-3">{complaint.title}</h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
                                <span className="inline-flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-primary-500" />
                                    {complaint.category}
                                </span>
                                {complaint.department && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-slate-500" />
                                        {complaint.department}
                                    </span>
                                )}
                                {complaint.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-accent-500" />
                                        {complaint.location}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="prose prose-sm max-w-none mb-6">
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {complaint.description}
                                </p>
                            </div>

                            {/* Image placeholder */}
                            {complaint.image && (
                                <div className="rounded-xl bg-slate-700 p-8 flex items-center justify-center mb-6">
                                    <div className="text-center">
                                        <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                        <p className="text-xs text-slate-400">Attachment: {complaint.image}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700">
                                {/* Upvote */}
                                {complaint.visibility === 'public' && (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleUpvote}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${hasUpvoted
                                            ? 'bg-primary-900/50 text-primary-400 ring-1 ring-primary-700'
                                            : 'bg-slate-700 text-slate-400 hover:bg-primary-900/50 hover:text-primary-400'
                                            }`}
                                    >
                                        <motion.div
                                            animate={hasUpvoted ? { scale: [1, 1.4, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-primary-400' : ''}`} />
                                        </motion.div>
                                        Upvote ({complaint.upvotes})
                                    </motion.button>
                                )}

                                {/* Confirm Resolution (only when resolved) */}
                                {complaint.status === 'resolved' && user?.role === 'student' && (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleConfirm}
                                        disabled={hasConfirmed}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${hasConfirmed
                                            ? 'bg-success-50 text-success-400 ring-1 ring-success-800'
                                            : 'bg-success-50 text-success-400 hover:bg-success-900/60'
                                            }`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {hasConfirmed ? 'Confirmed' : `Confirm Fix (${complaint.confirmations}/30)`}
                                    </motion.button>
                                )}

                                {/* Flag (only when resolved) */}
                                {complaint.status === 'resolved' && user?.role === 'student' && !complaint.flagged && (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleFlag}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-danger-50 text-danger-400 hover:bg-danger-900/60 transition-all"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report Issue Persists
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Admin Response Card */}
                    {complaint.adminResponse && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-800 rounded-2xl shadow-card border border-slate-700/50 p-6"
                        >
                            <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary-400" />
                                Admin Response
                            </h3>
                            <div className="bg-primary-900/30 rounded-xl p-4 border border-primary-800/50">
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {complaint.adminResponse}
                                </p>
                            </div>

                            {/* Resolution Proof */}
                            {complaint.proofImage && (
                                <div className="mt-4 rounded-xl bg-success-50 p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-success-900/50 flex items-center justify-center flex-shrink-0">
                                        <ImageIcon className="w-5 h-5 text-success-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-success-400">Proof of Resolution</p>
                                        <p className="text-xs text-success-500">Image attached by admin</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Right Column — Timeline & Info */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Timeline complaint={complaint} />
                    </motion.div>

                    {/* Deadline Card */}
                    {complaint.deadline && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`rounded-2xl shadow-card p-6 ${isOverdue ? 'bg-danger-50 border border-danger-800' : 'bg-slate-800 border border-slate-700/50'
                                }`}
                        >
                            <h3 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Timer className="w-4 h-4 text-warning-500" />
                                Deadline
                            </h3>
                            <p className="text-lg font-bold text-slate-100 mb-1">
                                {new Date(complaint.deadline).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                            {daysRemaining !== null && (
                                <p
                                    className={`text-sm font-medium ${isOverdue ? 'text-danger-400' : daysRemaining <= 2 ? 'text-warning-500' : 'text-slate-400'
                                        }`}
                                >
                                    {isOverdue
                                        ? `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''}`
                                        : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`}
                                </p>
                            )}
                            {complaint.extensions > 0 && (
                                <p className="text-xs text-slate-500 mt-2">
                                    Extended {complaint.extensions} time{complaint.extensions > 1 ? 's' : ''}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Engagement Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800 rounded-2xl shadow-card border border-slate-700/50 p-6"
                    >
                        <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">
                            Engagement
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4" />
                                    Upvotes
                                </span>
                                <span className="text-sm font-bold text-slate-100">{complaint.upvotes}</span>
                            </div>
                            {complaint.upvotes >= 30 && complaint.status !== 'pending-review' && (
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}
                            {complaint.upvotes < 30 && complaint.visibility === 'public' && (
                                <>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                                            style={{ width: `${Math.min((complaint.upvotes / 30) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {30 - complaint.upvotes} more to trigger deadline
                                    </p>
                                </>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                <span className="text-sm text-slate-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirmations
                                </span>
                                <span className="text-sm font-bold text-slate-100">
                                    {complaint.confirmations}/30
                                </span>
                            </div>
                            {complaint.status === 'resolved' && (
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full transition-all"
                                        style={{
                                            width: `${Math.min((complaint.confirmations / 30) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ComplaintDetails;
