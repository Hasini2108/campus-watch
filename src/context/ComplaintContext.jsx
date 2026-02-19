import { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    Timestamp,
    query,
    orderBy,
} from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
// Complaint Data Context (Firestore-backed)
// ========================================
const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real-time listener for complaints collection
    useEffect(() => {
        const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => {
                    const raw = d.data();
                    return {
                        id: d.id,
                        ...raw,
                        // Convert Firestore Timestamps to ISO strings for the UI
                        createdAt: raw.createdAt?.toDate?.()?.toISOString() || raw.createdAt,
                        deadline: raw.deadline?.toDate?.()?.toISOString() || raw.deadline || null,
                        resolvedAt: raw.resolvedAt?.toDate?.()?.toISOString() || raw.resolvedAt || null,
                    };
                });
                setComplaints(data);
                setLoading(false);
            },
            (error) => {
                console.error('Error listening to complaints:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Add a new complaint
    const addComplaint = async (complaint) => {
        const newComplaint = {
            ...complaint,
            status: 'pending-review',
            urgency: null,
            upvotes: 0,
            upvotedBy: [],
            confirmations: 0,
            confirmedBy: [],
            adminResponse: null,
            proofImage: null,
            imageUrl: null, // New field for real image URL
            imageName: complaint.imageName || null, // Keep original name for reference
            extensions: 0,
            flagged: false,
            createdAt: Timestamp.now(),
            deadline: null,
            resolvedAt: null,
        };

        const docRef = await addDoc(collection(db, 'complaints'), newComplaint);

        // Handle image upload if file is provided
        if (complaint.imageFile) {
            try {
                const storageRef = ref(storage, `complaints/${docRef.id}/${complaint.imageFile.name}`);
                await uploadBytes(storageRef, complaint.imageFile);
                const downloadURL = await getDownloadURL(storageRef);

                await updateDoc(docRef, {
                    imageUrl: downloadURL
                });

                newComplaint.imageUrl = downloadURL;
            } catch (error) {
                console.error("Error uploading image:", error);
                // Continue without image if upload fails
            }
        }

        return { ...newComplaint, id: docRef.id };
    };

    // Toggle upvote
    const toggleUpvote = async (complaintId, userId) => {
        const complaint = complaints.find((c) => c.id === complaintId);
        if (!complaint) return;

        const ref = doc(db, 'complaints', complaintId);
        const hasUpvoted = complaint.upvotedBy?.includes(userId);

        await updateDoc(ref, {
            upvotes: increment(hasUpvoted ? -1 : 1),
            upvotedBy: hasUpvoted ? arrayRemove(userId) : arrayUnion(userId),
        });
    };

    // Update complaint status
    const updateStatus = async (complaintId, newStatus, response = null) => {
        const ref = doc(db, 'complaints', complaintId);
        const updates = {
            status: newStatus,
        };

        if (response) {
            updates.adminResponse = response;
        }

        if (newStatus === 'resolved') {
            updates.resolvedAt = Timestamp.now();
        }

        await updateDoc(ref, updates);
    };

    // Set urgency (Committee action)
    const setUrgency = async (complaintId, urgency) => {
        const ref = doc(db, 'complaints', complaintId);
        const complaint = complaints.find((c) => c.id === complaintId);
        const updates = {
            urgency,
        };

        if (complaint?.status === 'pending-review') {
            updates.status = 'open';
        }

        if (urgency === 'high') {
            updates.deadline = Timestamp.fromDate(
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            );
        }

        await updateDoc(ref, updates);
    };

    // Reject complaint (Committee action)
    const rejectComplaint = async (complaintId, reason) => {
        const ref = doc(db, 'complaints', complaintId);
        await updateDoc(ref, {
            status: 'rejected',
            adminResponse: reason,
        });
    };

    // Confirm resolution (Student action)
    const confirmResolution = async (complaintId, userId) => {
        const complaint = complaints.find((c) => c.id === complaintId);
        if (!complaint || complaint.confirmedBy?.includes(userId)) return;

        const ref = doc(db, 'complaints', complaintId);
        await updateDoc(ref, {
            confirmations: increment(1),
            confirmedBy: arrayUnion(userId),
        });
    };

    // Flag a resolved complaint
    const flagComplaint = async (complaintId) => {
        const ref = doc(db, 'complaints', complaintId);
        await updateDoc(ref, {
            flagged: true,
            status: 'open',
        });
    };

    const value = {
        complaints,
        loading,
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
