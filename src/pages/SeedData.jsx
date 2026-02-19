import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Upload,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    Trash2,
    Users,
    FileText,
    Shield,
} from 'lucide-react';
import { db, auth } from '../firebase/config';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    writeBatch,
    Timestamp,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { SEED_USERS, SEED_COMPLAINTS } from '../firebase/seedData';

// ========================================
// Seed Data Page — /seed
// ========================================
const SeedData = () => {
    const [status, setStatus] = useState('idle'); // idle | seeding | clearing | done | error
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ users: 0, complaints: 0 });

    const addLog = (message, type = 'info') => {
        setLogs((prev) => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
    };

    // Convert Date objects to Firestore Timestamps
    const toFirestoreData = (obj) => {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value instanceof Date) {
                result[key] = Timestamp.fromDate(value);
            } else if (value === null || value === undefined) {
                result[key] = value ?? null;
            } else {
                result[key] = value;
            }
        }
        return result;
    };

    // Clear Firestore collections (note: Auth accounts cannot be deleted client-side)
    const clearCollections = async () => {
        setStatus('clearing');
        setLogs([]);
        addLog('🗑️ Clearing existing Firestore data...', 'warn');

        try {
            // Clear users collection
            const usersSnap = await getDocs(collection(db, 'users'));
            const userBatch = writeBatch(db);
            usersSnap.forEach((d) => userBatch.delete(d.ref));
            await userBatch.commit();
            addLog(`Deleted ${usersSnap.size} user docs`, 'success');

            // Clear complaints collection
            const complaintsSnap = await getDocs(collection(db, 'complaints'));
            const complaintBatch = writeBatch(db);
            complaintsSnap.forEach((d) => complaintBatch.delete(d.ref));
            await complaintBatch.commit();
            addLog(`Deleted ${complaintsSnap.size} complaint docs`, 'success');

            addLog('⚠️ Auth accounts are not deleted (use Firebase Console for that)', 'warn');
            addLog('✅ Firestore collections cleared!', 'success');
            setStats({ users: 0, complaints: 0 });
            setStatus('done');
        } catch (err) {
            addLog(`❌ Error: ${err.message}`, 'error');
            setStatus('error');
        }
    };

    // Seed all data — creates Auth accounts + Firestore docs
    const seedDatabase = async () => {
        setStatus('seeding');
        setLogs([]);
        addLog('🚀 Starting database seed...', 'info');

        try {
            // 1. Seed Users (Auth + Firestore)
            addLog(`📋 Seeding ${SEED_USERS.length} users (Auth + Firestore)...`, 'info');
            for (const user of SEED_USERS) {
                const { uid, password, ...userData } = user;
                try {
                    // Try to create Firebase Auth account
                    const cred = await createUserWithEmailAndPassword(auth, userData.email, password);
                    // Save Firestore profile using the Auth UID
                    await setDoc(doc(db, 'users', cred.user.uid), toFirestoreData(userData));
                    addLog(`  ✓ Created: ${userData.email} (${userData.role})`, 'success');
                } catch (authErr) {
                    if (authErr.code === 'auth/email-already-in-use') {
                        // Account exists — sign in to get the UID and upsert Firestore profile
                        try {
                            const cred = await signInWithEmailAndPassword(auth, userData.email, password);
                            await setDoc(doc(db, 'users', cred.user.uid), toFirestoreData(userData));
                            addLog(`  ↻ Updated: ${userData.email} (already existed)`, 'warn');
                        } catch (signInErr) {
                            addLog(`  ⚠ Skipped: ${userData.email} (${signInErr.message})`, 'warn');
                        }
                    } else {
                        addLog(`  ⚠ Failed: ${userData.email} (${authErr.message})`, 'error');
                    }
                }
            }

            // Sign out after creating all users so we don't stay logged in as the last user
            await signOut(auth);

            // 2. Seed Complaints
            addLog(`📋 Seeding ${SEED_COMPLAINTS.length} complaints...`, 'info');
            for (const complaint of SEED_COMPLAINTS) {
                const { id, ...complaintData } = complaint;
                await setDoc(doc(db, 'complaints', id), toFirestoreData(complaintData));
                addLog(`  ✓ Complaint: ${complaintData.title.substring(0, 40)}...`, 'success');
            }

            setStats({ users: SEED_USERS.length, complaints: SEED_COMPLAINTS.length });
            addLog('', 'info');
            addLog('🎉 Database seeded successfully!', 'success');
            addLog(`   ${SEED_USERS.length} users + ${SEED_COMPLAINTS.length} complaints`, 'info');
            addLog('   Use the credentials shown above to log in.', 'info');
            setStatus('done');
        } catch (err) {
            addLog(`❌ Error: ${err.message}`, 'error');
            console.error('Seed error:', err);
            setStatus('error');
        }
    };

    const logColors = {
        info: 'text-gray-400',
        success: 'text-emerald-400',
        warn: 'text-amber-400',
        error: 'text-red-400',
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
                        <Database className="w-4 h-4" />
                        Developer Tool
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                            CampusWatch
                        </span>{' '}
                        Database Seeder
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Populate Firestore with mock data for development & testing
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <Users className="w-5 h-5 text-indigo-400 mb-2" />
                        <p className="text-2xl font-bold">{SEED_USERS.length}</p>
                        <p className="text-xs text-gray-500">Users to seed</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <FileText className="w-5 h-5 text-pink-400 mb-2" />
                        <p className="text-2xl font-bold">{SEED_COMPLAINTS.length}</p>
                        <p className="text-xs text-gray-500">Complaints to seed</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <Shield className="w-5 h-5 text-emerald-400 mb-2" />
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-gray-500">Roles configured</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={seedDatabase}
                        disabled={status === 'seeding' || status === 'clearing'}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                    >
                        {status === 'seeding' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {status === 'seeding' ? 'Seeding...' : 'Seed Database'}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearCollections}
                        disabled={status === 'seeding' || status === 'clearing'}
                        className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                    >
                        {status === 'clearing' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Clear All
                    </motion.button>
                </div>

                {/* Login Credentials Reference */}
                <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-8">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Test Credentials
                    </h3>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs">Student</span>
                            <span className="text-gray-400">student@campuswatch.edu</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-gray-400">student123</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-xs">Committee</span>
                            <span className="text-gray-400">committee@campuswatch.edu</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-gray-400">committee123</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">Admin</span>
                            <span className="text-gray-400">admin@campuswatch.edu</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-gray-400">admin123</span>
                        </div>
                    </div>
                </div>

                {/* Console Log Output */}
                <AnimatePresence>
                    {logs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    Console Output
                                </span>
                                {status === 'done' && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Complete
                                    </span>
                                )}
                                {status === 'error' && (
                                    <span className="flex items-center gap-1 text-xs text-red-400">
                                        <AlertTriangle className="w-3 h-3" />
                                        Error
                                    </span>
                                )}
                            </div>
                            <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs space-y-1">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={`${logColors[log.type]}`}
                                    >
                                        <span className="text-gray-600 mr-2">[{log.time}]</span>
                                        {log.message}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SeedData;
