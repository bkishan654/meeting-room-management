import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'tailwindcss/tailwind.css'

const MeetingRoomBooking = () => {
  const [freeMeetingRooms, setFreeMeetingRooms] = useState([])
  const [bookingDetails, setBookingDetails] = useState(null)
  const [formData, setFormData] = useState({ userId: '', roomId: '', username: '' })
  const [message, setMessage] = useState({ text: '', type: 'success' })

  // Fetch free meeting rooms on component mount
  useEffect(() => {
    fetchFreeMeetingRooms()
  }, [])

  const fetchFreeMeetingRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/booking/meeting-room/free')
      setFreeMeetingRooms(response.data)
      setMessage({ text: 'list updated', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response.data, type: 'error' })

      // (error.response.data);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const bookMeetingRoom = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/booking/book', formData)

      // setMessage(response.data);
      setMessage({ text: response.data, type: 'success' })
      fetchFreeMeetingRooms() // Refresh available meeting rooms after booking
    } catch (error) {
      // console.error('Error booking meeting room:', error);
      console.log(error.response.data)
      setMessage({ text: error.response.data, type: 'error' })
    }
  }

  const fetchBookingDetails = async (username) => {
    try {
      setBookingDetails('')
      const response = await axios.get(`http://localhost:8000/booking/user_detail/${username}`)
      setBookingDetails(response.data)
      setMessage({ text: 'fetch successful', type: 'success' })
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setMessage({ text: error.response.data, type: 'error' })
    }
  }

  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/booking/bookings/${id}`)
      setMessage({ text: response.data, type: 'success' })
      fetchFreeMeetingRooms() // Refresh available meeting rooms after deleting booking
    } catch (error) {
      console.error('Error deleting booking:', error)
      setMessage({ text: error.response.data, type: 'error' })
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Meeting Room Booking</h2>

      <div className='mb-8'>
        <form onSubmit={bookMeetingRoom} className='mb-4'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              User Name:
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </label>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Room ID:
              <input
                type='text'
                name='roomId'
                value={formData.roomId}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </label>
          </div>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            Book Room
          </button>
        </form>
      </div>

      <div className='mb-8'>
        <h3 className='text-lg font-semibold mb-4'>Available Meeting Rooms</h3>
        <ul className='list-disc pl-5'>
          {freeMeetingRooms.map((room) => (
            <li key={room.id} className='mb-2'>
              ID: {room.id}, Building: {room.building}, Floor: {room.floor}, Room Number: {room.room_number}
            </li>
          ))}
        </ul>
      </div>

      <hr className='my-6' />

      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-6'>Booking Details</h2>
        <form onSubmit={(e) => { e.preventDefault(); fetchBookingDetails(formData.username) }} className='mb-4'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              User Name:
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </label>
          </div>
          <button
            type='submit'
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
          >
            Fetch Booking Details
          </button>
        </form>
      </div>

      {bookingDetails && (
        <div className='mb-4 p-4 bg-gray-100 rounded-md'>
          <p className='text-sm'>
            User: {formData.username}, Booking ID: {bookingDetails.id}, Room ID: {bookingDetails.meeting_room_id}, Building: {bookingDetails.building}, Floor: {bookingDetails.floor}, Room Number: {bookingDetails.room_number}
          </p>
          <button
            onClick={() => deleteBooking(bookingDetails.id)}
            className='mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
          >
            Delete Booking
          </button>
        </div>
      )}

      {message.text && (
        <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}

export default MeetingRoomBooking
