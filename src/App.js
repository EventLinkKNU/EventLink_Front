import { useEffect } from "react";
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
import EventDetail from "./components/EventDetail";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyScrap from "./components/MyScrap";
import MyInfo from "./components/MyInfo";
import SearchResult from "./components/SearchResult";
import SearchPanel from "./components/SearchPanel";
import MyApplicationEvent from "./components/MyApplicationEvent";
import MyComplaint from "./components/MyComplaint";
import ChatRoom from "./components/ChatRoom";


function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("✅ Token 저장 (App.js):", token);
      localStorage.setItem("Authorization", "Bearer " + token);
    }
  }, []);
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
            <Route path="/myinfo" element={<Layout><MyInfo /></Layout>} />
            <Route path="/myapplication" element={<Layout><MyApplicationEvent /></Layout>} />
            <Route path="/mycomplaint" element={<Layout><MyComplaint /></Layout>} />
            <Route path="/chat" element={<Layout><Chat /></Layout>} />
            <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
            <Route path="/event-create" element={<Layout><CreateEvent /></Layout>} />
            <Route path="/get-myEvents" element={<Layout><MyCreatedEvents /></Layout>} />
            <Route path="/get_allEvents" element={<Layout><AllEvents /></Layout>} />
            <Route path="/event-detail/:id" element={<Layout><EventDetail /></Layout>} />
            <Route path="/search" element={<Layout><SearchResult /></Layout>} />
            <Route path="/search" element={<Layout><SearchPanel /></Layout>} />
            <Route path="/chatroom/:chatId/:senderId/:receiverId" element={<Layout><ChatRoom /></Layout>} />

          </Routes>
        </div>
      </Router>
    </LoginProvider>
  );
}

export default App;
