import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../index.css";

export default function FeedbackModal({ onClose }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                const fbData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    let dateStr = "Just now";
                    if (data.timestamp && data.timestamp.toDate) {
                        const dateObj = data.timestamp.toDate();
                        dateStr = dateObj.toLocaleDateString();
                    } else if (data.date) {
                        dateStr = data.date;
                    }
                    fbData.push({ id: doc.id, ...data, displayDate: dateStr });
                });
                setFeedbacks(fbData);
            } catch (e) {
                console.error("Error fetching feedbacks", e);
                // Fallback for missing permissions
                if (e.message.includes("Missing or insufficient permissions")) {
                    alert("Your Firestore Database needs to be pushed into Test Mode to read public data. Check your Firebase console rules!");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newFeedback = {
            name: name.trim() || "Anonymous Student",
            rating,
            message,
            date: new Date().toLocaleDateString(),
            timestamp: serverTimestamp()
        };

        // Optimistic UI update
        const optimistic = { id: Date.now(), displayDate: "Just now", ...newFeedback };
        setFeedbacks([optimistic, ...feedbacks]);

        setMessage("");
        setName("");
        setRating(5);

        try {
            await addDoc(collection(db, "feedbacks"), newFeedback);
        } catch (e) {
            console.error("Error adding doc", e);
            alert("Failed to post fully to cloud network. Make sure your Firestore rules are in Test Mode.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Community Feedback & Ratings</h3>
                    <button onClick={onClose} className="close-btn">✖</button>
                </div>

                <div className="feedback-layout">
                    {/* Submission Form */}
                    <form className="feedback-form" onSubmit={handleSubmit}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Leave a Review</h4>

                        <div className="rating-select" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer', opacity: star <= rating ? 1 : 0.3, fontSize: '28px', transition: 'opacity 0.2s' }}
                                >
                                    ⭐
                                </span>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="Your Name (optional)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="feedback-input"
                        />

                        <textarea
                            placeholder="What do you think about Focus Player? (Required)"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="feedback-input"
                            style={{ height: '100px', resize: 'none' }}
                            required
                        />

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Post Publicly
                        </button>
                    </form>

                    {/* Feedback List */}
                    <div className="feedback-list">
                        {loading ? (
                            <div style={{ color: 'var(--text-muted)' }}>Connecting to Firebase Cloud network...</div>
                        ) : (
                            feedbacks.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)' }}>Be the first to leave a review!</div>
                            ) : (
                                feedbacks.map(fb => (
                                    <div key={fb.id} className="feedback-card">
                                        <div className="feedback-card-header">
                                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fb.name}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>{fb.displayDate}</span>
                                        </div>
                                        <div style={{ margin: '6px 0', fontSize: '12px' }}>
                                            {"⭐".repeat(fb.rating)}
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>
                                            {fb.message}
                                        </p>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
