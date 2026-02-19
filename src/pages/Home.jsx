import { motion } from 'framer-motion';
import {
    Shield,
    Users,
    ArrowRight,
    CheckCircle,
    Clock,
    TrendingUp,
    FileText,
    Search,
    ThumbsUp,
    ArrowDown,
    Eye,
    Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCountUp from '../utils/useCountUp';

// ========================================
// Animated Stat Card Component
// ========================================
const AnimatedStat = ({ icon: Icon, label, end, suffix = '' }) => {
    const { count, ref } = useCountUp(end, 2000);
    return (
        <div ref={ref} className="glass rounded-2xl px-6 py-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary-600" />
            <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                    {count}
                    {suffix}
                </p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
};

// ========================================
// Landing Page — CampusWatch Home
// ========================================
const Home = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: 'Student',
            description: 'Raise complaints, upvote issues, and verify resolutions.',
            icon: Users,
            color: 'from-primary-500 to-primary-700',
            path: '/login/student',
        },
        {
            title: 'Committee',
            description: 'Screen complaints, assign urgency, and enforce deadlines.',
            icon: Shield,
            color: 'from-accent-500 to-accent-700',
            path: '/login/committee',
        },
        {
            title: 'Admin',
            description: 'Respond to complaints, upload proof, and resolve issues.',
            icon: CheckCircle,
            color: 'from-success-500 to-success-600',
            path: '/login/admin',
        },
    ];

    const steps = [
        {
            icon: FileText,
            title: 'Submit',
            description: 'Describe the issue, add photos, and tag the location.',
            color: 'from-primary-500 to-primary-600',
        },
        {
            icon: Search,
            title: 'Screen',
            description: 'Committee reviews and assigns urgency before publishing.',
            color: 'from-accent-500 to-accent-600',
        },
        {
            icon: ThumbsUp,
            title: 'Upvote',
            description: '30+ upvotes triggers a 7-day resolution deadline.',
            color: 'from-warning-500 to-warning-600',
        },
        {
            icon: Eye,
            title: 'Resolve & Verify',
            description: 'Admin uploads proof. 30 students must confirm to close.',
            color: 'from-success-500 to-success-600',
        },
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* ============================
          HERO SECTION
          ============================ */}
            <section className="relative min-h-screen flex items-center justify-center px-4">
                {/* Background gradient blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" />
                    <div
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
                        style={{ animationDelay: '2s' }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                        style={{ animationDelay: '4s' }}
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                    >
                        <Shield className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-600">
                            Transparent. Accountable. Student-Powered.
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        <span className="gradient-text">CampusWatch</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        A community-verified campus grievance platform where every complaint is visible,
                        time-bound, and accountable. Your voice matters.
                    </motion.p>

                    {/* Animated Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16"
                    >
                        <AnimatedStat icon={CheckCircle} label="Complaints Resolved" end={127} />
                        <AnimatedStat icon={Clock} label="Active Issues" end={34} />
                        <AnimatedStat icon={TrendingUp} label="Student Participation" end={89} suffix="%" />
                    </motion.div>

                    {/* Role Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                    >
                        {roles.map((role, i) => (
                            <motion.button
                                key={role.title}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                onClick={() => navigate(role.path)}
                                className="group relative overflow-hidden rounded-2xl p-6 text-left bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`} />
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                                >
                                    <role.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:gap-3 transition-all">
                                    Login <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col items-center gap-2 text-gray-400"
                    >
                        <span className="text-xs">Scroll to learn more</span>
                        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <ArrowDown className="w-4 h-4" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============================
          HOW IT WORKS SECTION
          ============================ */}
            <section className="py-24 px-4 gradient-bg-soft">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            From submission to verified resolution — every step is transparent and time-bound.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                className="relative bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow group"
                            >
                                {/* Step number */}
                                <span className="absolute top-4 right-4 text-5xl font-black text-gray-100 group-hover:text-primary-100 transition-colors select-none">
                                    {i + 1}
                                </span>

                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}
                                >
                                    <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================
          ACCOUNTABILITY HIGHLIGHTS
          ============================ */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Built-in Accountability
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            CampusWatch ensures no complaint is ignored and no resolution goes unverified.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Clock,
                                title: '7-Day Deadline',
                                description:
                                    'Once a complaint crosses 30 upvotes, a strict 7-day countdown begins. Overdue complaints are auto-flagged in red.',
                                gradient: 'from-danger-500 to-accent-500',
                            },
                            {
                                icon: Eye,
                                title: 'Public Verification',
                                description:
                                    'Admin must upload proof of resolution. 30 students must confirm the fix before a complaint can be officially closed.',
                                gradient: 'from-primary-500 to-primary-700',
                            },
                            {
                                icon: Bell,
                                title: 'Automatic Escalation',
                                description:
                                    'Missed deadlines trigger automatic committee notifications, empowering formal questioning of the concerned department.',
                                gradient: 'from-warning-500 to-warning-600',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                className="glass rounded-2xl p-8 text-center"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5`}
                                >
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================
          CTA SECTION
          ============================ */}
            <section className="py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto gradient-bg rounded-3xl p-12 text-center relative overflow-hidden"
                >
                    {/* Decorative circles */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Make Your Campus Better?
                        </h2>
                        <p className="text-white/80 max-w-lg mx-auto mb-8">
                            Join thousands of students using CampusWatch to create a transparent, accountable
                            campus community.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login/student')}
                            className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            Get Started — It's Free
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* ============================
          FOOTER
          ============================ */}
            <footer className="border-t border-gray-200 py-12 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold gradient-text">CampusWatch</span>
                    </div>
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} CampusWatch. Built for students, by students.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <span className="hover:text-primary-600 cursor-pointer transition-colors">About</span>
                        <span className="hover:text-primary-600 cursor-pointer transition-colors">Contact</span>
                        <span className="hover:text-primary-600 cursor-pointer transition-colors">Privacy</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
