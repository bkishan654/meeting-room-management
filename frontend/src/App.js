// import React, { useEffect, useState } from 'react';

// import axios from 'axios';
// //const axios = require('axios');



// const App=()=>{
//     const [name,setName]=useState('');
//     const [message, setMessage] = useState('');
//     const [userdata,setUserdata]=useState([]);
//     //const [del,setDel]=useState('');
// // const fetchdata=async()=>{
// //     axios.request(config)
// //     .then((response) => {
// //       console.log(JSON.stringify(response.data));
// //     })
// //     .catch((error) => {
// //       console.log(error);
// //     });
// //   }

// useEffect(()=>{
//     fetchdata();
// },[message]);

// const fetchdata=async(event)=>{
//    // event.preventDefault();
//     try {
//         const response=await axios.get('http://localhost:8000/user/users/');
//         setUserdata(response.data);
//         console.log(message);
//         setName('');
//         setMessage('fetch sucessful')
//     } catch (error) {
//         if(error.response)
//         {
//             setMessage(error.response.data);
//         }else
//         {
//             setMessage('error in fetching user data');
//         }
//     }

// }
// const deleteUser=async(event)=>{
//     event.preventDefault();
//     try {
//         const response=await axios.delete(`http://localhost:8000/user/user/${name}`)
//         setMessage('User deleted successfully');
//         //setName('');
//     } catch (error) {
//         if(error.response)
//         {
//             setMessage(error.message.data);
//         }else{
//             setMessage('error deleting user');
//         }
//     }
//     setName('');
// }
// const createUser=async (event)=>{
//     event.preventDefault();
//     try {
//         const response = await axios.post('http://localhost:8000/user/users',{
//         username:name
//         });
//         setMessage(response.data);
        
//     } catch (err) {
//         if(err.response)
//         {
//             setMessage(err.response.data);
//         }else
//         {
//             setMessage('error creating user');
//         }
//     }
//     setName('');
// }

// const changeval=(event)=>{
//     setName(event.target.value);
// }

// // const changeval1=(event)=>{
// //     setDel  (event.target.value);
// // }

//   return(
//     <>
    
//     <div>
//         <form onSubmit={createUser}>
        
//         <h4>create user</h4>
//         <label for="fname">Name:</label><br></br>
//         <input type="text" id="fname" name="fname" onChange={changeval}></input><br></br>
        
//         <button type='submit'>submit</button>
//         </form><br></br><br></br>
//         <h4>delete user</h4>
//         <form onSubmit={deleteUser}>
//         <label for="fname">Name:</label><br></br>
//         <input type="text" id="fname" name="fname" onChange={changeval}></input><br></br>

//         <button type='submit'>submit</button>
//         </form>
//         <h2>user data</h2>
//         <button onClick={()=>{fetchdata()}}>reload</button>
//         {userdata && userdata.map((user, index) => (
//             <p key={index}>{user.id }&ensp;{user.username }</p> // Replace 'username' with the actual property name if different
//         ))}
//         {message && <p>{message}</p>} 

//     </div>
//     </>

//   )
// }

// export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './Users';
import MeetingRooms from './MeetingRooms';
import MeetingRoomBooking from './MeetingRoomBooking';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/meeting-rooms" element={<MeetingRooms />} />
          <Route path="/book-meeting-room" element={<MeetingRoomBooking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;