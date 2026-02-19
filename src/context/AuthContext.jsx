import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// ========================================
// Departments list
// ========================================
export const DEPARTMENTS = [
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Science',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'MBA',
    'Other',
];

// ========================================
// Auth Context
// ========================================
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // true initially for auth state check

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user profile from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: userData.name || 'User',
                            role: userData.role || 'student',
                            department: userData.department || null,
                            phone: userData.phone || null,
                        });
                    } else {
                        // User exists in Auth but not Firestore — sign out
                        await signOut(auth);
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    /**
     * Login with Firebase Auth
     * Fetches user role/profile from Firestore `users` collection
     */
    const login = async (role, email, password) => {
        setIsLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);

            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid));

            if (!userDoc.exists()) {
                await signOut(auth);
                throw new Error('Account not found. Please contact admin.');
            }

            const userData = userDoc.data();

            // Verify role matches
            if (userData.role !== role) {
                await signOut(auth);
                throw new Error(`This account is not registered as a ${role}.`);
            }

            const userProfile = {
                uid: cred.user.uid,
                email: cred.user.email,
                name: userData.name || 'User',
                role: userData.role,
                department: userData.department || null,
                phone: userData.phone || null,
            };

            setUser(userProfile);
            setIsLoading(false);
            return userProfile;
        } catch (err) {
            setIsLoading(false);
            // Map Firebase error codes to user-friendly messages
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                throw new Error('Invalid email or password.');
            } else if (err.code === 'auth/wrong-password') {
                throw new Error('Incorrect password.');
            } else if (err.code === 'auth/too-many-requests') {
                throw new Error('Too many failed attempts. Try again later.');
            }
            throw err;
        }
    };

    /**
     * Register a new student account
     * Creates Firebase Auth user + Firestore profile
     */
    const register = async ({ name, email, password, department }) => {
        setIsLoading(true);
        try {
            // Validation
            if (!name || !email || !password || !department) {
                throw new Error('All fields are required.');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters.');
            }

            // Create Firebase Auth user
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            // Create Firestore user profile
            const userProfile = {
                email,
                name,
                role: 'student',
                department,
                phone: null,
                createdAt: Timestamp.now(),
            };

            await setDoc(doc(db, 'users', cred.user.uid), userProfile);

            const fullUser = {
                uid: cred.user.uid,
                ...userProfile,
            };

            setUser(fullUser);
            setIsLoading(false);
            return fullUser;
        } catch (err) {
            setIsLoading(false);
            if (err.code === 'auth/email-already-in-use') {
                throw new Error('An account with this email already exists.');
            } else if (err.code === 'auth/weak-password') {
                throw new Error('Password is too weak. Use at least 6 characters.');
            } else if (err.code === 'auth/invalid-email') {
                throw new Error('Please enter a valid email address.');
            }
            throw err;
        }
    };

    /**
     * Logout — signs out of Firebase
     */
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for accessing auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
