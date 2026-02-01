import React from 'react';
import '../pageStyles/About.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function About() {
  return (
    <>
      <PageTitle title="About Us - ShopEasy" />
      <Navbar />
      <div className="about-container">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            Welcome to <strong>ShopEasy</strong>, your number one source for all things groceries and daily needs. 
            We're dedicated to giving you the very best of products, with a focus on dependability, customer service, and uniqueness.
          </p>
          <p>
            Founded in 2026, ShopEasy has come a long way from its beginnings. When we first started out, our passion for 
            "Eco-friendly and sustainable products" drove us to do tons of research so that ShopEasy can offer you 
            the world's most advanced organic grocery marketplace. We now serve customers all over the city and are thrilled 
            that we're able to turn our passion into our own website.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, 
            please don't hesitate to contact us.
          </p>
          <br />
          <p>Sincerely,</p>
          <p><strong>The ShopEasy Team</strong></p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
