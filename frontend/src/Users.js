import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user/users/');
      setUsers(response.data);
      setMessage({ text: 'List updated', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response.data, type: 'error' });
    }
  };

  const createUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/user/users', {
        username: name
      });
      setMessage({ text: 'User created successfully', type: 'success' });
      setName('');
      fetchUserData(); // Update the user list after creation
    } catch (error) {
      setMessage({ text: error.response.data, type: 'error' });
    }
  };

  const deleteUser = async (username) => {
    try {
      const response = await axios.delete(`http://localhost:8000/user/user/${username}`);
      setMessage({ text: 'User deleted successfully', type: 'success' });
      fetchUserData(); // Update the user list after deletion
    } catch (error) {
      setMessage({ text: error.response.data, type: 'error' });
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Create User</h4>
        <form onSubmit={createUser} className="mb-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">User List</h4>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">ID: {user.id}, Name: {user.username}</span>
                <button
                  onClick={() => deleteUser(user.username)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {message.text && (
        <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Users;