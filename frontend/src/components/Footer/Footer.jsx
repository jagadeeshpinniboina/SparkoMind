import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, MessageSquare, Twitter } from 'lucide-react';
import logoTransparent from '../../assets/images/logo-transparent.png';
import styles from './Footer.module.css';

const COGNITIVE_WORKSPACES = [
  'Kids Universe (6-12)',
  'Adult Matrix (13-64)',
  'Senior Sanctuary (65+)',
  'Cognitive Drills Engine'
];

const PLATFORM_RESEARCH = [
  'How It Works',
  'Neuroplasticity Science',
  'Research Citations',
  'About Us'
];

const SUPPORT_INQUIRIES = [
  'Contact Us',
  'Documentation',
  'System Status',
  'Security & Privacy'
];

export const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        {/* 4-Column Layout Grid */}
        <div className={styles.columnsGrid}>
          {/* Column 1: Brand Overview */}
          <div className={styles.brandCol}>
            <Link
              to="/"
              className={styles.brandLockup}
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <img
                src={logoTransparent}
                alt="SparkoMind Logo"
                className={styles.brandLogoImg}
                draggable="false"
              />
              <span className={styles.brandTitle}>
                Sparko<span className={styles.brandAccent}>Mind</span>
              </span>
            </Link>
            <p className={styles.brandBio}>
              Age-adaptive neural training platform empowering cognitive development from childhood to seniority.
            </p>
            <div className={styles.socialRow}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://discord.gg/sparkomind"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="Discord"
              >
                <MessageSquare size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="Twitter / X"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Cognitive Workspaces (Non-navigational with hover shift) */}
          <div className={styles.linksCol}>
            <h4 className={styles.colHeading}>Cognitive Workspaces</h4>
            <ul className={styles.linksList}>
              {COGNITIVE_WORKSPACES.map((item) => (
                <li key={item}>
                  <span
                    className={styles.footerInteractiveItem}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform & Research (Non-navigational with hover shift) */}
          <div className={styles.linksCol}>
            <h4 className={styles.colHeading}>Platform & Research</h4>
            <ul className={styles.linksList}>
              {PLATFORM_RESEARCH.map((item) => (
                <li key={item}>
                  <span
                    className={styles.footerInteractiveItem}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Inquiries (Non-navigational with hover shift) */}
          <div className={styles.linksCol}>
            <h4 className={styles.colHeading}>Support & Inquiries</h4>
            <ul className={styles.linksList}>
              {SUPPORT_INQUIRIES.map((item) => (
                <li key={item}>
                  <span
                    className={styles.footerInteractiveItem}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Pill button removed; single circular floating button on page bottom-right) */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © 2026 SparkoMind Cognitive Systems Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
