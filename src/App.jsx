import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Layout
import MainLayout from './components/MainLayout';

// ========================================
// Protected Route Wrapper
// ========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// ========================================
// App Component — Central Router
// ========================================
const App = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login/:role" element={<Login />} />

            {/* Protected Dashboard Routes — wrapped in MainLayout */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={['student', 'committee', 'admin']}>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                {/* Student */}
                <Route
                    path="/dashboard/student"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Committee */}
                <Route
                    path="/dashboard/committee"
                    element={
                        <ProtectedRoute allowedRoles={['committee']}>
                            <CommitteeDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/dashboard/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Catch-all: redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
