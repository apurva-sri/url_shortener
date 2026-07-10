import { useState } from "react";
import { motion } from "framer-motion";

import Container from "../../common/Container";

import logoDark from "../../../assets/logo/logo-dark.png";

import "./Navbar.css";

const navItems = ["Features", "Pricing", "FAQ"];

function Navbar() {
  const [active, setActive] = useState("Features");

  return (
    <header className="navbar-wrapper">
      <Container>
        <motion.nav
          className="navbar"
          initial={{
            opacity: 0,
            y: -60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          {/* Logo */}

          <a href="/" className="logo">
            <img src={logoDark} alt="LinkPilot" className="logo-image" />
          </a>

          {/* Navigation */}

          <ul className="nav-links">
            {navItems.map((item) => (
              <li
                key={item}
                className="nav-item"
                onMouseEnter={() => setActive(item)}
              >
                {active === item && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="nav-pill"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}

                <span className="nav-label">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}

          <button className="navbar-btn">Get Started</button>
        </motion.nav>
      </Container>
    </header>
  );
}

export default Navbar;
