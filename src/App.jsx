import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ChampionshipList from "./Pages/Championships";
import Profile from "./Pages/Profile";
import Register from "./Components/Register";
import Login from "./Components/Login";
import "./App.css";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/HomePage";
import News from "./Pages/News";
import NuoviAlbum from "./Pages/NuoviAlbum";
import ChampionshipsPages from "./Pages/ChampionshipsPages";

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.token);
  console.log("ProtectedRoute - user:", user);
  return user ? element : <Navigate to="/register" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Pubbliche */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Route per Join Championship (Accessibile da chiunque) */}
        <Route path="/join/:name/:id" element={<ChampionshipsPages />} />

        {/* Protette */}
        <Route
          path="/championships"
          element={<ProtectedRoute element={<ChampionshipList />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/homepage"
          element={<ProtectedRoute element={<HomePage />} />}
        />
        <Route path="/news" element={<ProtectedRoute element={<News />} />} />
        <Route
          path="/nuovialbum"
          element={<ProtectedRoute element={<NuoviAlbum />} />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
