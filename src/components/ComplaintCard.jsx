import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ThumbsUp,
    Clock,
    MapPin,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    EyeOff,
    Shield,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';

// ========================================
// Status Badge Component (Dark Theme)
// ========================================
const statusConfig = {
    'pending-review': {
        label: 'Pending Review',
        color: 'bg-slate-700 text-slate-300',
        icon: Clock,
    },
    open: {
        label: 'Open',
        color: 'bg-warning-50 text-warning-500',
        icon: AlertTriangle,
    },
    'in-progress': {
        label: 'In Progress',
        color: 'bg-primary-900/50 text-primary-400',
        icon: Loader2,
    },
    resolved: {
        label: 'Resolved',
        color: 'bg-success-50 text-success-500',
        icon: CheckCircle2,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-danger-50 text-danger-400',
        icon: AlertTriangle,
    },
};

const urgencyConfig = {
    high: { label: 'High', color: 'bg-danger-50 text-danger-400', pulse: true },
    medium: { label: 'Medium', color: 'bg-warning-50 text-warning-500', pulse: false },
    low: { label: 'Low', color: 'bg-slate-700 text-slate-400', pulse: false },
};

// ========================================
// Complaint Card (Dark Theme)
// ========================================
const ComplaintCard = ({ complaint, showUpvote = true, index = 0 }) => {
    const { toggleUpvote } = useComplaints();
    const { user } = useAuth();
    const navigate = useNavigate();

    const status = statusConfig[complaint.status] || statusConfig.open;
    const StatusIcon = status.icon;
    const urgency = complaint.urgency ? urgencyConfig[complaint.urgency] : null;
    const hasUpvoted = user && complaint.upvotedBy.includes(user.uid);

    const handleUpvote = (e) => {
        e.stopPropagation();
        if (user && complaint.visibility === 'public') {
            toggleUpvote(complaint.id, user.uid);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return `${Math.floor(days / 7)}w ago`;
    };

    const isOverdue =
        complaint.deadline &&
        complaint.status !== 'resolved' &&
        new Date(complaint.deadline) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => navigate(`/complaint/${complaint.id}`)}
            className="bg-slate-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group overflow-hidden border border-slate-700/50"
        >
            {/* Urgency top stripe */}
            {urgency && (
                <div
                    className={`h-1 ${complaint.urgency === 'high'
                        ? 'bg-gradient-to-r from-danger-500 to-accent-500'
                        : complaint.urgency === 'medium'
                            ? 'bg-gradient-to-r from-warning-400 to-warning-500'
                            : 'bg-slate-600'
                        }`}
                />
            )}

            <div className="p-5">
                {/* Top Row: Status + Urgency + Time */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}
                        >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                        </span>

                        {/* Urgency Badge */}
                        {urgency && (
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${urgency.color
                                    } ${urgency.pulse ? 'badge-urgent' : ''}`}
                            >
                                {urgency.label}
                            </span>
                        )}

                        {/* Overdue Badge */}
                        {isOverdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-danger-50 text-danger-400 badge-urgent">
                                <AlertTriangle className="w-3 h-3" />
                                Overdue
                            </span>
                        )}

                        {/* Visibility */}
                        {complaint.visibility === 'private' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-700 text-slate-400">
                                <EyeOff className="w-3 h-3" />
                                Private
                            </span>
                        )}
                    </div>

                    <span className="text-xs text-slate-500">{timeAgo(complaint.createdAt)}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {complaint.title}
                </h3>

                {/* Description Preview */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {complaint.description}
                </p>

                {/* Bottom Row: Meta + Upvote */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {/* Category */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700 text-slate-400">
                            <Shield className="w-3 h-3" />
                            {complaint.category}
                        </span>

                        {/* Location */}
                        {complaint.location && (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {complaint.location}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Upvote Button */}
                        {showUpvote && complaint.visibility === 'public' && (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={handleUpvote}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${hasUpvoted
                                    ? 'bg-primary-900/50 text-primary-400'
                                    : 'bg-slate-700 text-slate-400 hover:bg-primary-900/50 hover:text-primary-400'
                                    }`}
                            >
                                <motion.div
                                    animate={hasUpvoted ? { scale: [1, 1.3, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-primary-400' : ''}`} />
                                </motion.div>
                                {complaint.upvotes}
                            </motion.button>
                        )}

                        {/* Arrow */}
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ComplaintCard;
