import React from 'react';
import Footer from '../Footer';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <h1 className="about-title">About Recipiece</h1>
      <p className="about-description">
        Recipiece is a smart recipe discovery app that helps reduce food waste and simplify meal planning.
        Just upload a picture of your fridge or pantry, and our AI-powered image recognition system identifies
        the ingredients you have. Based on what's available, Recipiece instantly generates personalized recipe
        suggestions from a vast online database.
      </p>
      <p className="about-description">
        Whether you're short on time, trying to clean out your fridge, or looking for culinary inspiration,
        Recipiece makes cooking easier and more sustainable. Save your favorite recipes, explore what others
        are making, and enjoy more with less.
      </p>
      <Footer />
    </div>
  );
}

export default About;
