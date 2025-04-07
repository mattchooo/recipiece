import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from './AuthContext';
import './Navbar.css';

function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        closeMobileMenu();
    };
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, [])

    window.addEventListener('resize', showButton);

    return (
        <div>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to="/" className='navbar-logo' onClick={closeMobileMenu}>
                        recipiece
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/search' className='nav-links' onClick={closeMobileMenu}>
                                Search
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/recipes' className='nav-links' onClick={closeMobileMenu}>
                                Recipes
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/about' className='nav-links' onClick={closeMobileMenu}>
                                About
                            </Link>
                        </li>
                        <li className='nav-item'>
                            {isAuthenticated ? (
                                <Link to='/' className='nav-links' onClick={handleLogout}>
                                    Logout
                                </Link>
                            ) : (
                                <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
