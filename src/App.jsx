import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Login from "./pages/Login";
import TeacherDashboard from "./dashboard/TeacherDashboard";
import CreatePost from "./dashboard/CreatePost";
import CreateClubPost from "./dashboard/CreateClubPost";
import ClubDashboard from "./dashboard/ClubDashboard";
import Enrollement from "./pages/Enrollement";
import ProtectedRoute from "./components/ProtectedRoute";
import Landingpage from "./pages/landingpage";
import ClubAnnouncement from "./pages/ClubAnnouncement"; // 👈 ADD THIS

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/teacher" ||
    location.pathname === "/create-post" ||
    location.pathname === "/create-club-post" ||
    location.pathname.startsWith("/club/") || // dashboard only
    location.pathname === "/" ||
    location.pathname === "/enrollment";

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      {/* Landing page */}
      {isLandingPage && (
        <Routes>
          <Route path="/" element={<Landingpage />} />
        </Routes>
      )}

      {/* App pages */}
      {!isLandingPage && (
        <div className="container">
          <Routes>
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/announcements" element={<Home />} />

            {/* 👇 CLUB FLOW */}
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:clubName" element={<ClubAnnouncement />} />

            <Route path="/login" element={<Login />} />
            <Route path="/enrollment" element={<Enrollement />} />

            {/* Teacher */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-post"
              element={
                <ProtectedRoute role="teacher">
                  <CreatePost role="teacher" />
                </ProtectedRoute>
              }
            />

            {/* Club Officer */}
            <Route
              path="/create-club-post"
              element={
                <ProtectedRoute role="club">
                  <CreateClubPost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/club/:clubName"
              element={
                <ProtectedRoute role="club">
                  <ClubDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
