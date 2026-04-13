import React from "react";

const About: React.FC = () => {
  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>🌾 About Krishi Route</h1>

      <p style={styles.text}>
        Krishi Route is a smart agricultural logistics and profit optimization platform
        designed to empower farmers with data-driven decisions. Our goal is simple —
        <strong> help farmers earn more by choosing the right mandi and the most efficient route.</strong>
      </p>

      <div style={styles.card}>
        <h2 style={styles.heading}>🚀 What We Do</h2>
        <ul style={styles.list}>
          <li>📍 Location-based mandi selection</li>
          <li>💰 Real-time price comparison</li>
          <li>🚚 Transportation cost optimization</li>
          <li>📊 Profit breakdown and analysis</li>
          <li>⚠️ Perishability risk alerts</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>🌱 Our Mission</h2>
        <p style={styles.text}>
          To digitally empower farmers with accessible, reliable, and intelligent tools
          that simplify decision-making and increase profitability.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>🌍 Our Vision</h2>
        <p style={styles.text}>
          We envision a future where every farmer has access to accurate market insights,
          optimized logistics, and fair pricing opportunities — regardless of location.
        </p>
      </div>

      <div style={styles.highlight}>
        💚 <strong>Built for Farmers</strong> — Because when farmers grow, the nation grows.
      </div>

    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  title: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#2d5016",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#2d5016",
    marginBottom: "0.5rem",
  },
  text: {
    fontSize: "15px",
    color: "#444",
    lineHeight: 1.7,
    marginBottom: "1rem",
  },
  card: {
    background: "#edf5e1",
    padding: "1.2rem 1.5rem",
    borderRadius: "12px",
    marginBottom: "1.2rem",
    border: "1px solid rgba(74,124,35,0.2)",
  },
  list: {
    paddingLeft: "1.2rem",
    marginTop: "0.5rem",
    lineHeight: 1.8,
    color: "#333",
  },
  highlight: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#2d5016",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "15px",
  },
};

export default About;