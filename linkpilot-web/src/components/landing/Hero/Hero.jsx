import { motion } from "framer-motion";
import "./Hero.css";

import dashboard from "../../../assets/images/dashboard-preview.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT */}

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-tag">Modern URL Management Platform</span>

          <h1>
            Every
            <br />
            Click Has
            <br />A Story.
          </h1>

          <p>
            Shorten links, generate QR codes, protect URLs, track visitor
            analytics and manage everything from one beautiful dashboard.
          </p>

          <div className="hero-actions">
            <button className="hero-primary">Start Free</button>

            <button className="hero-secondary">Live Demo</button>
          </div>

          <div className="hero-shortener">
            <input type="text" placeholder="Paste your long URL here..." />

            <button>Shorten</button>
          </div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="hero-preview"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={dashboard} alt="Dashboard" />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
