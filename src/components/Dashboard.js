import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase-config';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';
import { signOut } from 'firebase/auth';

function Dashboard() {
  const [newBooking, setNewBooking] = useState({ title: '', date: '', startTime: '', endTime: '' });
  const [userBookings, setUserBookings] = useState([]); // Combined state for user bookings
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      // Fetch bookings created by the user
      const q = query(collection(db, 'bookings'), where("createdBy", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserBookings(bookings);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'bookings'), {
          ...newBooking,
          status: 'pending',
          createdBy: auth.currentUser.uid, // Include the user's unique ID
        });
        alert('Booking request submitted.');
        setNewBooking({ title: '', date: '', startTime: '', endTime: '', createdBy: '' }); // Reset form
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      alert('You must be logged in to submit a booking.');
    }
  };
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate('/login');
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  // Helper function to filter bookings by status
  const filterBookingsByStatus = (status) => {
    return userBookings.filter(booking => booking.status === status);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={newBooking.title} onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })} required />
        <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} required />
        <input type="time" placeholder="Start Time" value={newBooking.startTime} onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })} required />
        <input type="time" placeholder="End Time" value={newBooking.endTime} onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })} required />
        <button type="submit">Submit Booking Request</button>
      </form>
      <div>
        <h2>Pending Requests</h2>
        {filterBookingsByStatus('pending').map((request) => (
          <div key={request.id}>
            <p>Title: {request.title}</p>
            <p>Date: {request.date}</p>
            <p>Time: {request.startTime} to {request.endTime}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Approved Requests</h2>
        {filterBookingsByStatus('approved').map((request) => (
          <div key={request.id}>
            <p>Title: {request.title}</p>
            <p>Date: {request.date}</p>
            <p>Time: {request.startTime} to {request.endTime}</p>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
