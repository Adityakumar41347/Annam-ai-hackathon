import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        

        <div style={styles.section}>
          <h2 style={styles.logo}>Krishi-Route</h2>
          <p style={styles.text}>
            Profit & Logistics Optimizer · किसान का मार्गदर्शक
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}> Home </Link></li>
            <li><Link to="/about" style={styles.link}>About</Link></li>
            <li><Link to="/help" style={styles.link}>Help</Link></li>
         
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Contact</h3>
          <p style={styles.text}>Email: support_Krishi-Route@gmail.com</p>
          <p style={styles.text}>Phone: +91 98765 43210</p>
        </div>
      </div>

 
      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} Krishi-Route . All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: "#22400e",
    color: "#fff",
    padding: "40px 20px 10px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },
  section: {
    flex: "1",
    minWidth: "200px",
  },
  logo: {
    marginBottom: "10px",
  },
  heading: {
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    display: "block",
    marginBottom: "6px",
  },
  bottom: {
    marginTop: "20px",
    borderTop: "1px solid #333",
    textAlign: "center",
    paddingTop: "10px",
    fontSize: "14px",
  },
};

export default Footer;