import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // you already have this
import HomePage from "./pages/HomePage"; 
import ProfilePage from "./pages/ProfilePage";// this is the new HomePage component
import ProtectedRoute from "./components/ProtectedRoute";

// function HomePage() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Home</h1>
//       {user ? (
//         <p className="mt-2">Welcome, {user.firstName} {user.lastName} ({user.userType})</p>
//       ) : (
//         <p className="mt-2">No user loaded</p>
//       )}
//     </div>
//   );
// }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
                
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
                
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
