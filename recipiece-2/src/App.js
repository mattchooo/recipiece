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
import Cheeseburger from './components/pages/Cheeseburger';


function App() {
  return (
    <div className="App">
      <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/search' Component={Search} />
        <Route path='/sign-up' Component={Signup} />
        <Route path='/login' Component={Login} />
        <Route path='/about' Component={About} />
        <Route path='/recipes' Component={Recipes} />
        <Route path='/upload' Component={Upload} />
        <Route path='/cheeseburger' Component={Cheeseburger} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
