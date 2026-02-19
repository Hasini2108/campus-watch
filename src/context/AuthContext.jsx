import { createContext, useContext, useState } from 'react';

// ========================================
// Mock Users Database
// ========================================
const MOCK_USERS = {
    student: {
        uid: 'stu-001',
        email: 'john.doe@college.edu',
        name: 'John Doe',
        role: 'student',
        department: 'Computer Science',
    },
    committee: {
        uid: 'com-001',
        email: 'committee@campuswatch.in',
        name: 'Priya Sharma',
        role: 'committee',
        department: 'Student Affairs',
    },
    admin: {
        uid: 'adm-001',
        email: 'admin@campuswatch.in',
        name: 'Campus Admin',
        role: 'admin',
        phone: '+919876543210',
    },
};

// Available departments for registration
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
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Mock login — accepts role and credentials,
     * simulates auth delay, then sets user state.
     */
    const login = async (role, email, password) => {
        setIsLoading(true);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Basic validation
        if (!email || !password) {
            setIsLoading(false);
            throw new Error('Email and password are required.');
        }

        // For mock: any credentials work, role determines user
        const mockUser = MOCK_USERS[role];
        if (!mockUser) {
            setIsLoading(false);
            throw new Error('Invalid role specified.');
        }

        // Set user with the provided email (override mock for students)
        setUser({
            ...mockUser,
            email: role === 'student' ? email : mockUser.email,
        });

        setIsLoading(false);
        return mockUser;
    };

    /**
     * Mock register — students only.
     * Simulates account creation.
     */
    const register = async ({ name, email, password, department }) => {
        setIsLoading(true);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Basic validation
        if (!name || !email || !password || !department) {
            setIsLoading(false);
            throw new Error('All fields are required.');
        }

        if (!email.includes('@') || !email.includes('.')) {
            setIsLoading(false);
            throw new Error('Please use a valid college email address.');
        }

        if (password.length < 6) {
            setIsLoading(false);
            throw new Error('Password must be at least 6 characters.');
        }

        // Create mock student user
        const newUser = {
            uid: `stu-${Date.now()}`,
            email,
            name,
            role: 'student',
            department,
        };

        setUser(newUser);
        setIsLoading(false);
        return newUser;
    };

    /**
     * Logout — clears user state
     */
    const logout = () => {
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
