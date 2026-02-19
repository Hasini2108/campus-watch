import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronDown,
    MapPin,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle,
    Upload,
    GripHorizontal,
} from 'lucide-react';
import { useComplaints, CATEGORIES } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../context/AuthContext';

// ========================================
// New Complaint Modal (Draggable + Dark)
// ========================================
const NewComplaintModal = ({ isOpen, onClose }) => {
    const { addComplaint } = useComplaints();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [imageName, setImageName] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const isDeptCategory = ['Infrastructure', 'Academics'].includes(category);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setDepartment('');
        setLocation('');
        setVisibility('public');
        setImageName('');
        setError('');
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim() || !category) {
            setError('Please fill in all required fields.');
            return;
        }

        if (isDeptCategory && !department) {
            setError('Please select a department for this category.');
            return;
        }

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        addComplaint({
            title: title.trim(),
            description: description.trim(),
            category,
            department: isDeptCategory ? department : null,
            location: location.trim() || null,
            visibility,
            image: imageName || null,
            submittedBy: user?.uid || 'unknown',
            submitterName: 'Anonymous Student',
        });

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal — Draggable */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        drag
                        dragConstraints={{ top: -200, bottom: 200, left: -300, right: 300 }}
                        dragElastic={0.1}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700"
                    >
                        {/* Gradient top bar */}
                        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

                        {/* Drag Handle + Header */}
                        <div className="flex flex-col border-b border-slate-700">
                            <div className="flex justify-center pt-2">
                                <GripHorizontal className="w-5 h-5 text-slate-600 drag-handle" />
                            </div>
                            <div className="flex items-center justify-between px-6 py-3">
                                <h2 className="text-lg font-bold text-slate-100">New Complaint</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Success State */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center gap-4 py-16 px-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-10 h-10 text-success-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-100">Complaint Submitted!</h3>
                                    <p className="text-sm text-slate-400 text-center">
                                        The committee will review your complaint shortly.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        {!success && (
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-danger-50 text-danger-400 text-sm px-4 py-3 rounded-xl font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Title <span className="text-danger-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Brief description of the issue"
                                        maxLength={100}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-right">{title.length}/100</p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Description <span className="text-danger-400">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide detailed information about the issue..."
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-right">{description.length}/500</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Category <span className="text-danger-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                if (!['Infrastructure', 'Academics'].includes(e.target.value)) {
                                                    setDepartment('');
                                                }
                                            }}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none pr-10"
                                        >
                                            <option value="" disabled>
                                                Select category
                                            </option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Department (conditional) */}
                                <AnimatePresence>
                                    {isDeptCategory && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                                Department <span className="text-danger-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none pr-10"
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
                                                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Block-A, 2nd Floor"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Visibility Toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
                                    <div className="flex bg-slate-900 rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => setVisibility('public')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${visibility === 'public'
                                                ? 'bg-slate-700 shadow-sm text-slate-100'
                                                : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Public
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVisibility('private')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${visibility === 'private'
                                                ? 'bg-slate-700 shadow-sm text-slate-100'
                                                : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            <EyeOff className="w-4 h-4" />
                                            Private
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1.5">
                                        {visibility === 'public'
                                            ? 'Visible to everyone. Other students can upvote.'
                                            : 'Only visible to committee and admin.'}
                                    </p>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Attach Photo
                                    </label>
                                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 hover:border-primary-500 hover:bg-slate-800 cursor-pointer transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                                            {imageName ? (
                                                <ImageIcon className="w-5 h-5 text-primary-400" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-primary-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {imageName ? (
                                                <>
                                                    <p className="text-sm font-medium text-slate-200 truncate">{imageName}</p>
                                                    <p className="text-xs text-slate-500">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-400">Upload a photo</p>
                                                    <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-primary-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Complaint'
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NewComplaintModal;
