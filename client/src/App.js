import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Signup from './components/pages/Signup';
import Recipes from './components/pages/Recipes';
import Search from './components/pages/Search';
import Login from './components/pages/Login';
import Upload from './components/pages/Upload';
import ForgotPassword from './components/pages/ForgotPassword';
import Cheeseburger from './components/pages/Cheeseburger';
import Recipe from './components/pages/Recipe';
import Confirm from './components/pages/Confirm';
import ForgotPasswordRedirect from './components/pages/ForgotPasswordRedirect';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/pages/NotFound';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/sign-up' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/about' element={<About />} />
            
            <Route
              path='/recipes'
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path='/upload'
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path='/confirm'
              element={
                <ProtectedRoute>
                  <Confirm />
                </ProtectedRoute>
              }
            />
            <Route
              path='/recipes/meal/:mealId'
              element={
                <ProtectedRoute>
                  <Recipe />
                </ProtectedRoute>
              }
            />
            <Route path='/cheeseburger' element={<Cheeseburger />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token/:id' element={<ForgotPasswordRedirect />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
