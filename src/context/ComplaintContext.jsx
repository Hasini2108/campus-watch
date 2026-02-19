import { createContext, useContext, useState } from 'react';

// ========================================
// Seed Data — Complaints
// ========================================
const INITIAL_COMPLAINTS = [
    {
        id: 'cmp-001',
        title: 'Water leakage in Block-A washroom',
        description:
            'Severe water leakage from the ceiling near the second-floor washroom in Block-A. The floor is slippery and poses a safety hazard. Multiple students have slipped. Please fix this urgently.',
        category: 'Infrastructure',
        department: 'Civil Engineering',
        status: 'open',
        urgency: 'high',
        visibility: 'public',
        upvotes: 42,
        upvotedBy: ['stu-001', 'stu-002', 'stu-003'],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-002',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Block-A, 2nd Floor',
        adminResponse: null,
        proofImage: null,
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-12T10:30:00Z',
        deadline: '2026-02-19T10:30:00Z',
        resolvedAt: null,
    },
    {
        id: 'cmp-002',
        title: 'WiFi connectivity issues in Library',
        description:
            'The WiFi network in the main library has been extremely slow for the past week. Students are unable to access online resources needed for coursework. Speed tests show only 0.5 Mbps on average.',
        category: 'IT Services',
        department: null,
        status: 'in-progress',
        urgency: 'medium',
        visibility: 'public',
        upvotes: 67,
        upvotedBy: ['stu-001'],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-003',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Main Library',
        adminResponse: 'We have contacted the ISP and are awaiting their technician visit scheduled for tomorrow.',
        proofImage: null,
        extensions: 1,
        flagged: false,
        createdAt: '2026-02-08T14:00:00Z',
        deadline: '2026-02-22T14:00:00Z',
        resolvedAt: null,
    },
    {
        id: 'cmp-003',
        title: 'Broken AC in Seminar Hall 2',
        description:
            'The air conditioning unit in Seminar Hall 2 has not been working for over two weeks. With large classes scheduled daily, its unbearable during afternoon sessions.',
        category: 'Infrastructure',
        department: 'Electrical Engineering',
        status: 'resolved',
        urgency: 'medium',
        visibility: 'public',
        upvotes: 35,
        upvotedBy: [],
        confirmations: 32,
        confirmedBy: ['stu-001', 'stu-002'],
        submittedBy: 'stu-001',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Seminar Hall 2',
        adminResponse: 'The AC compressor has been replaced and is now fully functional.',
        proofImage: '/proof-ac-fixed.jpg',
        extensions: 0,
        flagged: false,
        createdAt: '2026-01-25T09:00:00Z',
        deadline: '2026-02-01T09:00:00Z',
        resolvedAt: '2026-01-30T16:00:00Z',
    },
    {
        id: 'cmp-004',
        title: 'Insufficient seating in Canteen',
        description:
            'During lunch hours (12 PM - 2 PM), there is a severe shortage of seating. Students end up eating standing or sitting on the floor. We need more tables and chairs.',
        category: 'General',
        department: null,
        status: 'open',
        urgency: 'low',
        visibility: 'public',
        upvotes: 18,
        upvotedBy: ['stu-001'],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-004',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Main Canteen',
        adminResponse: null,
        proofImage: null,
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-14T11:20:00Z',
        deadline: null,
        resolvedAt: null,
    },
    {
        id: 'cmp-005',
        title: 'Street lights not working near Hostel-C',
        description:
            'Three of the five street lights along the path from Hostel-C to the main gate are not functioning. This is a safety concern, especially for students walking at night.',
        category: 'Safety',
        department: 'Electrical Engineering',
        status: 'open',
        urgency: 'high',
        visibility: 'public',
        upvotes: 55,
        upvotedBy: ['stu-001', 'stu-002'],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-005',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Hostel-C to Main Gate Path',
        adminResponse: null,
        proofImage: null,
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-10T20:00:00Z',
        deadline: '2026-02-17T20:00:00Z',
        resolvedAt: null,
    },
    {
        id: 'cmp-006',
        title: 'Lab equipment missing in Physics Lab',
        description:
            'Several oscilloscopes and multimeters are missing from Physics Lab-3. This is affecting the practical sessions for the second-year students.',
        category: 'Academics',
        department: 'Physics',
        status: 'pending-review',
        urgency: null,
        visibility: 'public',
        upvotes: 0,
        upvotedBy: [],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-001',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Physics Lab-3',
        adminResponse: null,
        proofImage: null,
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-18T16:30:00Z',
        deadline: null,
        resolvedAt: null,
    },
    {
        id: 'cmp-007',
        title: 'Harassment by senior students in Hostel-B',
        description: 'Details provided confidentially.',
        category: 'Safety',
        department: null,
        status: 'in-progress',
        urgency: 'high',
        visibility: 'private',
        upvotes: 0,
        upvotedBy: [],
        confirmations: 0,
        confirmedBy: [],
        submittedBy: 'stu-001',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'Hostel-B',
        adminResponse: 'We are investigating this matter with the hostel warden.',
        proofImage: null,
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-16T22:00:00Z',
        deadline: '2026-02-23T22:00:00Z',
        resolvedAt: null,
    },
    {
        id: 'cmp-008',
        title: 'Projector malfunction in Class CS-301',
        description:
            'The projector in CS-301 has been showing distorted colors for the past 3 days. Faculty members have raised this verbally but no action has been taken.',
        category: 'IT Services',
        department: 'Computer Science',
        status: 'resolved',
        urgency: 'low',
        visibility: 'public',
        upvotes: 12,
        upvotedBy: [],
        confirmations: 30,
        confirmedBy: ['stu-001'],
        submittedBy: 'stu-006',
        submitterName: 'Anonymous Student',
        image: null,
        location: 'CS-301, Block-D',
        adminResponse: 'Projector bulb replaced. Tested and verified working.',
        proofImage: '/proof-projector.jpg',
        extensions: 0,
        flagged: false,
        createdAt: '2026-02-05T08:45:00Z',
        deadline: '2026-02-12T08:45:00Z',
        resolvedAt: '2026-02-09T14:00:00Z',
    },
];

// ========================================
// Categories
// ========================================
export const CATEGORIES = [
    'Infrastructure',
    'IT Services',
    'Academics',
    'Safety',
    'Hostel',
    'Canteen',
    'Transport',
    'General',
];

// ========================================
// Complaint Data Context (local state store)
// ========================================
const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);

    // Add a new complaint
    const addComplaint = (complaint) => {
        const newComplaint = {
            ...complaint,
            id: `cmp-${Date.now()}`,
            status: 'pending-review',
            urgency: null,
            upvotes: 0,
            upvotedBy: [],
            confirmations: 0,
            confirmedBy: [],
            adminResponse: null,
            proofImage: null,
            extensions: 0,
            flagged: false,
            createdAt: new Date().toISOString(),
            deadline: null,
            resolvedAt: null,
        };
        setComplaints((prev) => [newComplaint, ...prev]);
        return newComplaint;
    };

    // Toggle upvote
    const toggleUpvote = (complaintId, userId) => {
        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== complaintId) return c;
                const hasUpvoted = c.upvotedBy.includes(userId);
                return {
                    ...c,
                    upvotes: hasUpvoted ? c.upvotes - 1 : c.upvotes + 1,
                    upvotedBy: hasUpvoted
                        ? c.upvotedBy.filter((id) => id !== userId)
                        : [...c.upvotedBy, userId],
                };
            })
        );
    };

    // Update complaint status
    const updateStatus = (complaintId, newStatus, response = null) => {
        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== complaintId) return c;
                return {
                    ...c,
                    status: newStatus,
                    adminResponse: response || c.adminResponse,
                    resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : c.resolvedAt,
                };
            })
        );
    };

    // Set urgency (Committee action)
    const setUrgency = (complaintId, urgency) => {
        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== complaintId) return c;
                return {
                    ...c,
                    urgency,
                    status: c.status === 'pending-review' ? 'open' : c.status,
                    deadline:
                        urgency === 'high'
                            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                            : c.deadline,
                };
            })
        );
    };

    // Reject complaint (Committee action)
    const rejectComplaint = (complaintId, reason) => {
        setComplaints((prev) =>
            prev.map((c) =>
                c.id === complaintId ? { ...c, status: 'rejected', adminResponse: reason } : c
            )
        );
    };

    // Confirm resolution (Student action)
    const confirmResolution = (complaintId, userId) => {
        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== complaintId || c.confirmedBy.includes(userId)) return c;
                return {
                    ...c,
                    confirmations: c.confirmations + 1,
                    confirmedBy: [...c.confirmedBy, userId],
                };
            })
        );
    };

    // Flag a resolved complaint
    const flagComplaint = (complaintId) => {
        setComplaints((prev) =>
            prev.map((c) =>
                c.id === complaintId ? { ...c, flagged: true, status: 'open' } : c
            )
        );
    };

    const value = {
        complaints,
        addComplaint,
        toggleUpvote,
        updateStatus,
        setUrgency,
        rejectComplaint,
        confirmResolution,
        flagComplaint,
    };

    return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};

export const useComplaints = () => {
    const context = useContext(ComplaintContext);
    if (!context) {
        throw new Error('useComplaints must be used within a ComplaintProvider');
    }
    return context;
};

export default ComplaintContext;
