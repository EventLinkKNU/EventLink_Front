import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import MyPage from "./components/Mypage"; 
import CreateEvent from "./components/CreateEvent"; 
import { LoginProvider } from "./contexts/LoginContext";
import MyCreatedEvents from "./components/MyCreatedEvents";
import Layout from "./components/layout/layout"; 
import Chat from "./components/Chat"; 
import Notifications from "./components/Notifications";
import Main from "./components/Main";
import AllEvents from "./components/AllEvents";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyScrap from "./components/MyScrap";



function App() {
  return (
    <LoginProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/main" element={<Layout><Main /></Layout>} />
            <Route path="/welcome" element={<Layout><Welcome /></Layout>} />
            <Route path="/myscrap" element={<Layout><MyScrap /></Layout>} />
            <Route path="/mypage" element={<Layout><MyPage /></Layout>} />
            <Route path="/chat" element={<Layout><Chat /></Layout>} />
            <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
            <Route path="/event-create" element={<Layout><CreateEvent /></Layout>} />
            <Route path="/get-myEvents" element={<Layout><MyCreatedEvents /></Layout>} />
            <Route path="/get_allEvents" element={<Layout><AllEvents /></Layout>} />
          </Routes>
        </div>
      </Router>
    </LoginProvider>
  );
}

export default App;
