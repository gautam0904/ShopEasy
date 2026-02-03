import React from 'react';
import {Phone ,Mail,  YouTube, Instagram} from '@mui/icons-material'
import '../componentStyles/Footer.css'

function Footer() {
  return (
   <footer className="footer">
    <div className="footer-container">
        {/* Section1 */}
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone : 9875088313</p>
            <p><Mail fontSize='small'/>Email : nileshgandhani4@gamil.com</p>
        </div>

        {/* Section2 */}
        <div className="footer-section social">
            <h3>Follow me</h3>
            <div className="social-links">
               
                <a href="" target="_blank">
                    <YouTube className='social-icon'/>
                </a>
                <a href="" target="_blank">
                    <Instagram className='social-icon'/>
                </a>
            </div>
        </div>

        {/* Section3 */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>local online grocerry store in surat </p>
        </div>
    </div>
    <div className="footer-bottom">
        <p>&copy; 2026 jamvanta.com. All rights reserved</p>
    </div>
   </footer>
  )
}

export default Footer
