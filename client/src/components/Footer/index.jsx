import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>James Holiday Inc.</h3>
          <p>Experience luxury and comfort</p>
          &copy; 2024 James Holiday Inc. All rights reserved.
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 123 Hotel Street, City</p>
          <p>📞 +1 234 567 890</p>
          <p>📧 info@jamesholiday.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
