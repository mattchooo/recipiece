import React, { useContext } from 'react';
import { Button } from './Button';
import { AuthContext } from './AuthContext';
import './Hero.css';
import '../App.css';

function Hero() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    return (
        <div className='hero-container'>
            {loading ? (
                <h3>Loading user...</h3>
            ) : (
                isAuthenticated && user?.name && <h3>Welcome back, {user.name}!</h3>
            )}
            <h1>
                <span className="reci">reci</span>
                <span className="piece">piece</span>
            </h1>
            <h2>from the fridge to your phone</h2>
            <p>Snap. Scan. Savor.</p>
            <p>Let your fridge decide!</p>
            <p className='smaller-p'>Just upload a picture and we'll do the rest!</p>
            <div className='hero-btns'>
                <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large' to='/upload'>
                    Upload Fridge
                </Button>
                <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large' to='/recipes'>
                    View Past Recipes
                </Button>
            </div>
        </div>
    )
}

export default Hero
