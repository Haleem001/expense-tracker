import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AllExpenses from './components/AllExpenses';
import { useSelector } from 'react-redux';
import LoginForm from './components/loginForm';
import SignupForm from './components/signupForm';
import UserProfile from './components/UserProfile';
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupForm />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/all-expenses" 
          element={isAuthenticated ? <AllExpenses /> : <Navigate to="/login" />} 
        />
         <Route 
          path="/user-profile" 
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />

      </Routes>
    </Router>
  );
}
export default App;
