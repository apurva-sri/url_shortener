import { motion } from "framer-motion";
import { useState } from "react";
import "./Navbar.css";

import logoDark from "../../../assets/logo/logo-dark.png";

const navItems = ["Features", "Analytics", "Pricing", "FAQ"];

function Navbar() {
  const [active, setActive] = useState("");

  return (
    <header className="navbar-wrapper">
      <motion.nav
        className="navbar"
        initial={{
          y: -70,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        {/* Logo */}

        <a href="/" className="navbar-logo">
          <img src={logoDark} alt="LinkPilot" />
        </a>

        {/* Center */}

        <ul className="navbar-links">
          {navItems.map((item) => (
            <li
              key={item}
              className="navbar-item"
              onMouseEnter={() => setActive(item)}
              onMouseLeave={() => setActive("")}
            >
              {active === item && (
                <motion.div
                  layoutId="navbar-pill"
                  className="navbar-pill"
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 28,
                  }}
                />
              )}

              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Button */}

        <button className="navbar-button">Get Started</button>
      </motion.nav>
    </header>
  );
}

export default Navbar;
