const express = require('express')
const mysql = require('mysql2/promise')

const router = express.Router()
require('dotenv').config()
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

const validBuildings = ['SRR1', 'SRR2', 'SRR3', 'SRR4']
const maxFloors = 6
const maxRoomsPerFloor = 10
const validStatuses = ['free', 'occupied', 'maintenance']

// Create a new meeting room
router.post('/meeting-rooms', async (req, res) => {
  const { building, floor, room_number } = req.body

  if (!validBuildings.includes(building)) {
    return res.status(400).send('Invalid building name. Available buildings: SRR1, SRR2, SRR3, SRR4')
  }

  if (floor < 1 || floor > maxFloors) {
    return res.status(400).send(`Invalid floor number. Floors must be between 1 and ${maxFloors}`)
  }

  if (room_number < 1 || room_number > maxRoomsPerFloor) {
    return res.status(400).send(`Invalid room number for floor ${floor}. Room numbers must be between 1 and ${maxRoomsPerFloor}`)
  }

  try {
    const [result] = await pool.query('INSERT INTO meeting_room (building, floor, room_number, status) VALUES (?, ?, ?, ?)', [building, floor, room_number, 'free'])
    const insertedId = result.insertId
    res.status(201).send(`Meeting room ${insertedId} created successfully`)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating meeting room')
  }
})

// Get all meeting rooms
router.get('/meeting-rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meeting_room order by building,floor,room_number')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching meeting rooms')
  }
})

// Get a specific meeting room by ID
router.get('/meeting-rooms/:id', async (req, res) => {
  const id = req.params.id
  try {
    const [rows] = await pool.query('SELECT * FROM meeting_room WHERE id = ?', [id])
    if (rows.length > 0) {
      res.json(rows[0])
    } else {
      res.status(404).send('Meeting room not found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching meeting room')
  }
})

// Update a meeting room
router.put('/meeting-rooms/:id', async (req, res) => {
  const id = req.params.id
  const { building, floor, room_number, status } = req.body

  if (!validBuildings.includes(building)) {
    return res.status(400).send('Invalid building name. Available buildings: SRR1, SRR2, SRR3, SRR4')
  }

  if (floor < 1 || floor > maxFloors) {
    return res.status(400).send(`Invalid floor number. Floors must be between 1 and ${maxFloors}`)
  }

  if (room_number < 1 || room_number > maxRoomsPerFloor) {
    return res.status(400).send(`Invalid room number for floor ${floor}. Room numbers must be between 1 and ${maxRoomsPerFloor}`)
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status code. Available statuses are: free, occupied, maintenance')
  }

  try {
    await pool.query('UPDATE meeting_room SET building = ?, floor = ?, room_number = ?, status = ? WHERE id = ?', [building, floor, room_number, status, id])
    res.send('Meeting room updated successfully')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating meeting room')
  }
})

// Delete a meeting room
router.delete('/meeting-rooms/:id', async (req, res) => {
  const id = req.params.id
  try {
    await pool.query('DELETE FROM meeting_room WHERE id = ?', [id])
    res.send('Meeting room deleted successfully')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error deleting meeting room')
  }
})

module.exports = router
