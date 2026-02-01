import React, { useState } from 'react';
import axios from 'axios';
import '../pageStyles/Contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { toast } from 'react-toastify';
import { Email, LocationOn, Phone } from '@mui/icons-material';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      await axios.post(`/api/v1/contact`, formData, config);
      toast.success('Message sent successfully! We will get back to you soon.', { position: 'top-center' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Contact Us - ShopEasy" />
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <div className="contact-wrapper">
          
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="info-item">
              <LocationOn className="info-icon" />
              <div>
                <h3>Address</h3>
                <p>123 Grocery Street, Market City, Ahmedabad, Gujarat - 380001</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="info-icon" />
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="info-item">
              <Email className="info-icon" />
              <div>
                <h3>Email</h3>
                <p>support@shopeasy.com</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send Message</h2>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="Your Email"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button type="submit" className="btn-send" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
