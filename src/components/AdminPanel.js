import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase-config';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'bookings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBookings(fetchedBookings);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: newStatus });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const filteredBookings = bookings.filter(booking => 
    booking.date === filterDate || filterDate === ''
  );

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <input type="date" onChange={(e) => setFilterDate(e.target.value)} />
      {filteredBookings.map(booking => (
        <div key={booking.id} className="booking-item">
          <p>Title: {booking.title}</p>
          <p>Date: {booking.date}</p>
          <p>Status: {booking.status}</p>
          {booking.status === 'pending' && (
            <>
              <button onClick={() => handleStatusChange(booking.id, 'approved')}>Accept</button>
              <button onClick={() => handleStatusChange(booking.id, 'rejected')}>Reject</button>
            </>
          )}
          {booking.status === 'approved' && (
            <button onClick={() => handleStatusChange(booking.id, 'cancelled')}>Cancel Booking</button>
          )}
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminPanel;
