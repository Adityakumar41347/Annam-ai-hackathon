import React from "react";

const Help: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Help & Support</h1>

      
      <p style={styles.text}>
        Welcome to <strong>Krishi-Route</strong> 🌾 — your smart farming assistant
        for maximizing profit and optimizing mandi routes.
      </p>

    
      <section>
        <h2 style={styles.subHeading}>How to Use</h2>
        <ul style={styles.list}>
          <li>Select your location</li>
          <li>Choose crop type</li>
          <li>Enter quantity and unit</li>
          <li>Select vehicle type</li>
          <li>Click <strong>Analyze</strong></li>
        </ul>
        <p style={styles.text}>
          The app will suggest the best mandi based on profit, distance, and cost.
        </p>
      </section>

      <section>
        <h2 style={styles.subHeading}>Features</h2>
        <ul style={styles.list}>
          <li>📍 Route optimization</li>
          <li>📊 Profit comparison across mandis</li>
          <li>🚚 Transport cost calculation</li>
          <li>⚠️ Perishability alerts</li>
          <li>📈 Price trend analysis</li>
        </ul>
      </section>

      <section>
        <h2 style={styles.subHeading}>Frequently Asked Questions</h2>

        <p style={styles.question}>❓ How are prices calculated?</p>
        <p style={styles.text}>
          Prices are currently simulated based on market trends. Real API
          integration can provide live mandi prices.
        </p>

        <p style={styles.question}>❓ What is the best mandi?</p>
        <p style={styles.text}>
          The best mandi is selected based on maximum profit after deducting
          transport and handling costs.
        </p>

        <p style={styles.question}>❓ Why is perishability shown?</p>
        <p style={styles.text}>
          Some crops spoil quickly. We alert you if distance may reduce quality.
        </p>
      </section>

      <section>
        <h2 style={styles.subHeading}>Need More Help?</h2>
        <p style={styles.text}>
          📧 Email: support_Krishi-Route@gmail.com <br />
          📞 Phone: +91 98765 43210
        </p>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1.25rem",
    lineHeight: "1.6",
     backgroundColor: "#DCFCE7",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "1rem",
    color: "#15803D", 
  },
  subHeading: {
    fontSize: "20px",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
    color: "#166534",
  },
  text: {
    fontSize: "14px",
    color: "#333",
  },
  list: {
    paddingLeft: "20px",
  },
  question: {
    fontWeight: 600,
    marginTop: "10px",
  },
};

export default Help;