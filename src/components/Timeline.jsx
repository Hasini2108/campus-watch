import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    CheckCircle,
    Clock,
    AlertTriangle,
    Loader2,
    Flag,
} from 'lucide-react';

// ========================================
// Timeline Step Statuses
// ========================================
const TIMELINE_STEPS = [
    {
        key: 'submitted',
        label: 'Submitted',
        description: 'Complaint filed by student',
        icon: FileText,
    },
    {
        key: 'reviewed',
        label: 'Committee Review',
        description: 'Screened and urgency assigned',
        icon: Search,
    },
    {
        key: 'in-progress',
        label: 'In Progress',
        description: 'Admin working on resolution',
        icon: Loader2,
    },
    {
        key: 'resolved',
        label: 'Resolved',
        description: 'Proof uploaded, awaiting confirmation',
        icon: CheckCircle,
    },
    {
        key: 'confirmed',
        label: 'Confirmed & Closed',
        description: '30+ students verified the fix',
        icon: Flag,
    },
];

// Map complaint status to step index
const getActiveStep = (complaint) => {
    switch (complaint.status) {
        case 'pending-review':
            return 0;
        case 'open':
            return 1;
        case 'in-progress':
            return 2;
        case 'resolved':
            return complaint.confirmations >= 30 ? 4 : 3;
        case 'rejected':
            return -1; // special
        default:
            return 0;
    }
};

// ========================================
// Timeline Component
// ========================================
const Timeline = ({ complaint }) => {
    const activeStep = getActiveStep(complaint);
    const isRejected = complaint.status === 'rejected';

    if (isRejected) {
        return (
            <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                    Status Timeline
                </h3>
                <div className="flex items-center gap-3 p-4 bg-danger-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-danger-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-danger-700">Complaint Rejected</p>
                        <p className="text-xs text-danger-500 mt-0.5">
                            {complaint.adminResponse || 'This complaint was rejected by the committee.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">
                Status Timeline
            </h3>

            <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                    const isCompleted = i < activeStep;
                    const isActive = i === activeStep;
                    const isFuture = i > activeStep;
                    const StepIcon = step.icon;

                    // Determine if there's a date to show
                    let dateStr = null;
                    if (i === 0 && complaint.createdAt) {
                        dateStr = new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });
                    }
                    if (i === 3 && complaint.resolvedAt) {
                        dateStr = new Date(complaint.resolvedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });
                    }

                    return (
                        <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4"
                        >
                            {/* Connector line + dot */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted
                                            ? 'bg-success-100'
                                            : isActive
                                                ? 'bg-primary-100 ring-4 ring-primary-50'
                                                : 'bg-gray-100'
                                        }`}
                                >
                                    <StepIcon
                                        className={`w-5 h-5 ${isCompleted
                                                ? 'text-success-600'
                                                : isActive
                                                    ? 'text-primary-600'
                                                    : 'text-gray-300'
                                            }`}
                                    />
                                </div>
                                {/* Vertical line */}
                                {i < TIMELINE_STEPS.length - 1 && (
                                    <div
                                        className={`w-0.5 h-12 ${isCompleted ? 'bg-success-300' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="pb-8 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-sm font-semibold ${isCompleted
                                                ? 'text-success-700'
                                                : isActive
                                                    ? 'text-primary-700'
                                                    : 'text-gray-400'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                    {isCompleted && (
                                        <CheckCircle className="w-3.5 h-3.5 text-success-500" />
                                    )}
                                    {isActive && (
                                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                    )}
                                </div>
                                <p
                                    className={`text-xs mt-0.5 ${isFuture ? 'text-gray-300' : 'text-gray-500'
                                        }`}
                                >
                                    {step.description}
                                </p>
                                {dateStr && (
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {dateStr}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;
