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
import SslgDashboard from "./dashboard/sslgDashboard"; // ✅ renamed
import ClubAnnouncement from "./pages/ClubAnnouncement";
import Sslg from "./pages/sslg"; // ✅ new page for SSLG announcements

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/teacher" ||
    location.pathname === "/create-post" ||
    location.pathname === "/create-club-post" ||
    location.pathname.startsWith("/club/") ||
    location.pathname === "/" ||
    location.pathname === "/enrollment" ||
    location.pathname === "/sslg-dashboard"; 

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      {isLandingPage && (
        <Routes>
          <Route path="/" element={<Landingpage />} />
        </Routes>
      )}

      {!isLandingPage && (
        <div className="container">
          <Routes>
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/announcements" element={<Home />} />

            {/* CLUB FLOW */}
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:clubName" element={<ClubAnnouncement />} />

            <Route path="/login" element={<Login />} />
            <Route path="/enrollment" element={<Enrollement />} />
            <Route path="/sslg" element={<Sslg />} />

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

            {/* Club Officer - ROLE UPDATED TO MATCH FIRESTORE */}
            <Route
              path="/create-club-post"
              element={
                <ProtectedRoute role="clubpresident"> {/* Matches Firestore "clubpresident" */}
                  <CreateClubPost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/club/:clubName"
              element={
                <ProtectedRoute role="clubpresident"> {/* Matches Firestore "clubpresident" */}
                  <ClubDashboard />
                </ProtectedRoute>
              }
            />

            {/* SSLG Dashboard */}
            <Route
              path="/sslg-dashboard"
              element={
                <ProtectedRoute role="sslg">
                  <SslgDashboard />
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