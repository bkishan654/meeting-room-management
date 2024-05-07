const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Get all free meeting rooms
router.get('/meeting-room/free', async (req, res) => {
  try {
    const [freeRooms] = await pool.query('SELECT * FROM meeting_room WHERE status = "free" order by building,floor,room_number');
    res.json(freeRooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching free meeting room');
  }
});

// Book a meeting room
router.post('/book', async (req, res) => {
  const { username, roomId } = req.body;

  try {
    // Check if the meeting room is free
    const [room] = await pool.query('SELECT * FROM meeting_room WHERE id = ? AND status = "free"', [roomId]);
    if (!room) {    
      return res.status(400).send('Meeting room is not available for booking');
    }
    //checking if room already booked
    const [existingBooking] = await pool.query('SELECT * FROM booking WHERE room_id = ?', [roomId]);
    if (existingBooking.length > 0) {
      return res.status(400).send('room already has a booking');
    }
    const [[result]]=await pool.query('select * from user where username=?',[username])
    const userid=result.id;
    // Check if the user already has a booking
    const [existingBooking1] = await pool.query('SELECT * FROM booking WHERE user_id = ?', [userid]);
    if (existingBooking1.length > 0) {
      return res.status(400).send('User already has a booking');
    }
    
    // Book the meeting room
    await pool.query('UPDATE meeting_room SET status = "occupied" WHERE id = ?', [roomId]);
    await pool.query('INSERT INTO booking (user_id, room_id) VALUES (?, ?)', [userid, roomId]);

    res.status(201).send('Meeting room booked successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error booking meeting room');
  }
});


router.get('/user_detail/:name', async (req, res) => {
    const name = req.params.name;
    try {
        let [user]=await pool.query('select user.id from user where user.username=?',[name]);
        user=user[0].id;
        let booking = await pool.query('SELECT id, room_id FROM booking WHERE user_id = ?', [user]);
        if (!booking) {
          return res.status(404).send('Booking not found for user');
        }
       // console.log(booking);
        const bookings = booking[0][0].id;
        const room =booking[0][0].room_id;
        console.log(user," ",bookings," ",room);
    
      const [rows] = await pool.query(`
                        SELECT
                        booking.id,
                        meeting_room.id as meeting_room_id,
                        user.username,
                        meeting_room.building,
                        meeting_room.floor,
                        meeting_room.room_number
                        FROM
                        user
                        INNER JOIN booking ON user.id = booking.user_id
                        INNER JOIN meeting_room ON meeting_room.id = booking.room_id
                        WHERE
                        user.id = ? AND meeting_room.id = ?;
    `, [user,room]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user');
    }
  });

// Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Fetch booking details
    const [booking] = await pool.query('SELECT * FROM booking WHERE id = ?', [bookingId]);
    //console.log(booking," ",booking.room_Id);
    if (booking.length==0) {
      return res.status(404).send('Booking not found');
    }

    const [roomId]=await pool.query('SELECT room_id FROM booking WHERE id=?',[bookingId]);
    const room=roomId[0].room_id;
    console.log(roomId,"  ",room);
    // Delete booking and update meeting room status
    await pool.query('DELETE FROM booking WHERE id = ?', [bookingId]);
    await pool.query('UPDATE meeting_room SET status = "free" WHERE id = ?', [room]);
    //console.log(booking.room_id);
    res.send('Booking deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting booking');
  }
});

module.exports = router;
