import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChampionshipList from './Pages/Championships';
import Profile from './Pages/Profile';
import Register from './Components/Register';
import Login from './Components/Login';
import './App.css';
import { Toaster } from 'react-hot-toast';
import HomePage from './Pages/HomePage';

const ProtectedRoute = ({ element }) => {
  const user = useSelector(state => state.auth.token);
  console.log('ProtectedRoute - user:', user);
  return user ? element : <Navigate to="/register" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Pubbliche */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        {/* Protette */}
        <Route path='/championships' element={<ProtectedRoute element={<ChampionshipList />} />} />
        <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
        <Route path='/homepage' element={<ProtectedRoute element={<HomePage />} />} />
      </Routes>
      <Toaster />
    </Router>

  );
}

export default App;
