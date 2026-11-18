import React, { useState } from 'react';
import { Mail, MapPin, Building, Send, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'kids',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate network submission with instant graceful feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'kids',
        message: ''
      });
    }, 700);
  };

  return (
    <section id="contact" className={styles.contactSection}>
      {/* Section Header */}
      <div className={styles.headerBlock}>
        <span className={styles.sectionBadge}>✦ REACH OUT TO US ✦</span>
        <h2 className={styles.sectionTitle}>
          We'd Love to <span className={styles.gradientText}>Hear From You</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Have questions about our cognitive architecture, age-adaptive drills, or institutional partnerships? Drop us a note.
        </p>
      </div>

      {/* Two-Column Split Architecture */}
      <div className={styles.splitGrid}>
        {/* Left Form Container: Send an Inquiry */}
        <div className={styles.formCard}>
          <h3 className={styles.inquiryTitle}>Send an Inquiry</h3>

          {isSuccess ? (
            <div className={styles.successMessageBlock}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={36} />
              </div>
              <h4 className={styles.successHeading}>Inquiry Dispatched!</h4>
              <p className={styles.successText}>
                Thank you for reaching out. A SparkoMind cognitive specialist will respond to your inquiry within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className={styles.resetFormBtn}
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.inquiryForm} noValidate>
              {/* Full Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="contact-name" className={styles.label}>
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Address */}
              <div className={styles.inputGroup}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={isSubmitting}
                />
              </div>

              {/* Demographic Category Dropdown */}
              <div className={styles.inputGroup}>
                <label htmlFor="contact-category" className={styles.label}>
                  Demographic Category
                </label>
                <select
                  id="contact-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.selectInput}
                  disabled={isSubmitting}
                >
                  <option value="kids">Kids Zone (Ages 6–12)</option>
                  <option value="adults">Adults Arena (Ages 13–59)</option>
                  <option value="seniors">Senior Sanctuary (Ages 60+)</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div className={styles.inputGroup}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your learning goals, partnership queries, or feedback..."
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textareaField}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button with Electric Violet Gradient */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className={styles.spinning} />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Card: Glassmorphic Contact Card */}
        <div className={styles.infoCard}>
          <div>
            <h3 className={styles.infoCardTitle}>Get in Touch</h3>
            <p className={styles.infoCardSubtitle}>
              Connect directly with our research teams, developer advocates, or community coordinators.
            </p>

            <div className={styles.infoList}>
              {/* Item 1: Direct Support */}
              <div className={styles.infoItem}>
                <div className={styles.infoIconBox}>
                  <Mail size={20} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Direct Support</span>
                  <a href="mailto:pinniboinajagadeesh76@gmail.com" className={styles.contactEmail}>
                    pinniboinajagadeesh76@gmail.com
                  </a>
                </div>
              </div>

              {/* Item 2: Global Headquarters */}
              <div className={styles.infoItem}>
                <div className={styles.infoIconBox}>
                  <MapPin size={20} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Global Headquarters</span>
                  <span className={styles.infoValue}>HITEC City, Hyderabad</span>
                  <span className={styles.infoSubtext}>Telangana, India • NeuroTech Center</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Callout: Enterprise & Institutional Licensing */}
          <div className={styles.enterpriseCallout}>
            <div className={styles.enterpriseIconBox}>
              <Building size={20} />
            </div>
            <div className={styles.enterpriseText}>
              <strong>Enterprise & Institutional Licensing:</strong> We support schools, universities, and healthcare clinics with custom deployments.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
