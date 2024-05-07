import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const MeetingRooms = () => {
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    building: '',
    floor: '',
    room_number: '',
    status: 'free' // Default status for new rooms
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const fetchMeetingRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/meeting-room/meeting-rooms');
      setMeetingRooms(response.data); // Pass the data to setMeetingRooms
      setMessage({ text: 'Meeting rooms fetched successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response.data, type: 'error' });
      console.error('Error fetching meeting rooms:', error);
    }
  };
  

  useEffect(() => {
    fetchMeetingRooms();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const createMeetingRoom = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/meeting-room/meeting-rooms', newRoom);
      fetchMeetingRooms(); // Refresh meeting rooms after creating a new one
      setNewRoom({ building: '', floor: '', room_number: '', status: 'free' });
      setMessage({ text: 'Room created successfully', type: 'success' });
      
    } catch (error) {
        setMessage({ text: error.response.data, type: 'error' });
      
    }
  };

  const deleteMeetingRoom = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/meeting-room/meeting-rooms/${id}`);
      fetchMeetingRooms(); // Refresh meeting rooms after deleting
      
      setMessage({ text: 'room deleted', type: 'success' });
    } catch (error) {
      console.error('Error deleting meeting room:', error);
      setMessage({ text: error.response.data, type: 'error' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Meeting Rooms</h2>
      <form onSubmit={createMeetingRoom} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <label className="block">
            Building:
            <input
              type="text"
              name="building"
              value={newRoom.building}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
          <label className="block">
            Floor:
            <input
              type="number"
              name="floor"
              value={newRoom.floor}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
          <label className="block">
            Room Number:
            <input
              type="number"
              name="room_number"
              value={newRoom.room_number}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Create Room
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-4">All Meeting Rooms</h3>
      <ul className="list-disc pl-5">
        {meetingRooms.map((room) => (
          <li key={room.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>
                ID: {room.id}, Building: {room.building}, Floor: {room.floor}, Room Number: {room.room_number}, Status: {room.status}
              </span>
              <button
                onClick={() => deleteMeetingRoom(room.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {message.text && (
  <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
    {message.text}
  </p>
)}
    </div>
  );
};


export default MeetingRooms;