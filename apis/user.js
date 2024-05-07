const express=require('express');
const mysql=require('mysql2/promise');

const router=express.Router();
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

//creating new user

router.post('/users', async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).send('Username is required');
    }
  
    try {
      // Check if username already exists
      const [existingUsers] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
      if (existingUsers.length > 0) {
        return res.status(409).send('Username already exists');
      }
  
      // Insert new user if username is unique
      const [result] = await pool.query('INSERT INTO user (username) VALUES (?)', [username]);
      const insertedId = result.insertId;
      res.status(201).send(`User ${insertedId} created successfully`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    }
  });
  
  
  //Update a use
  router.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).send('Username is required');
    }
  
    try {
      // Check if new username is already in use by another user
      const [existingUsers] = await pool.query('SELECT * FROM user WHERE username = ? AND id <> ?', [username, id]);
      if (existingUsers.length > 0) {
        return res.status(409).send('Username already exists');
      }
  
      // Update user's username if it's unique
      await pool.query('UPDATE user SET username = ? WHERE id = ?', [username, id]);
      res.send('User updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user');
    }
  });
  
  
  // Get all users
  router.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM user');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    }
  });
  
  // Get a specific user by ID
  router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
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


  
  // Delete a user
router.delete('/user/:namee', async (req, res) => {
  const namee = req.params.namee; // Use req.params.namee to get the username from the URL

  try {
    // Check if the user exists
    const [userResult] = await pool.query('SELECT * FROM user WHERE username = ?', [namee]);
    if (userResult.length === 0) {
      return res.status(404).send('User not found');
    }

    // Get the user's ID
    const userId = userResult[0].id;

    // Check if the user has any bookings
    const [bookingResult] = await pool.query('SELECT * FROM booking WHERE user_id = ?', [userId]);
    if (bookingResult.length > 0) {
      const bookingId = bookingResult[0].id;
      const roomId = bookingResult[0].room_id;

      // Update the meeting room status to 'free'
      await pool.query('UPDATE meeting_room SET status = "free" WHERE id = ?', [roomId]);

      // Delete the user
      await pool.query('DELETE FROM user WHERE id = ?', [userId]);

      res.send('User deleted successfully');
    } else {
      // If no bookings found, simply delete the user
      await pool.query('DELETE FROM user WHERE id = ?', [userId]);
      res.send('User deleted successfully');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});

    router.delete('/user/:username', async (req, res) => {
      const  username  = req.params.username; // Get the username from the URL parameter
      try {
        // Execute a SELECT query to check if the user exists
        const [users] = await pool.query('select * from user where username = ?', [username]);
        console.log(username); // Log the number of users found
    
        // If no users are found, send a 404 response
        if (users.length === 0) {
          return res.status(404).send('User not found');
        }
    
        // If a user is found, execute a DELETE query to remove the user
        await pool.query('DELETE FROM user WHERE username = ?', [username]);
        res.send('User deleted successfully');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
      }
    });

  module.exports=router;