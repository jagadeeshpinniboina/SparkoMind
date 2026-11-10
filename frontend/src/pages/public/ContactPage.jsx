import React, { useState } from 'react';
import { 
  Mail, MessageSquare, Phone, MapPin, Send, 
  CheckCircle2, Sparkles, HelpCircle 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Adult Zone',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(94, 92, 230, 0.1)',
            color: 'var(--brand-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          <Mail size={16} /> Get In Touch
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1E293B', marginBottom: '0.75rem' }}>
          We’d Love to Hear From You
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
          Have questions about our age-adaptive cognitive architecture, research partnerships, or curriculum licensing? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-1 gap-8">
        {/* Left Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(94, 92, 230, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '1rem' }}>Direct Email</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Quick response within 24h</div>
              </div>
            </div>
            <a href="mailto:support@sparkomind.org" style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.92rem' }}>
              support@sparkomind.org
            </a>
          </Card>

          <Card style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '1rem' }}>Cognitive Research Labs</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Academic & Clinical Inquiries</div>
              </div>
            </div>
            <div style={{ color: '#475569', fontSize: '0.88rem' }}>
              research@sparkomind.org
            </div>
          </Card>

          <Card style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '1rem' }}>Global HQ</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Hyderabad & Mountain View</div>
              </div>
            </div>
            <div style={{ color: '#475569', fontSize: '0.88rem' }}>
              SparkoMind Cognitive Systems Inc.<br />
              Cyber Towers, HITEC City, Hyderabad
            </div>
          </Card>
        </div>

        {/* Right Contact Form */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card style={{ padding: '2.5rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                  Message Received!
                </h3>
                <p style={{ color: '#64748B', maxWidth: '450px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                  Thank you for reaching out, {formData.name}. Our cognitive advisory team will review your message and reply to {formData.email} shortly.
                </p>
                <button
                  className="btn-brand"
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', category: 'Adult Zone', subject: '', message: '' }); }}
                  style={{ padding: '0.7rem 1.5rem' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                  Send an Inquiry
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Please fill out the form below and we will get back to you within 24 business hours.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jagadeesh Pinniboyina"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', backgroundColor: '#F8FAFD' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', backgroundColor: '#F8FAFD' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Relevant Demographic Zone
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', backgroundColor: '#F8FAFD' }}
                    >
                      <option value="Kids Zone">Kids Zone (Ages 6–12)</option>
                      <option value="Adult Zone">Adult Zone (Ages 13–59)</option>
                      <option value="Senior Zone">Senior Zone (Ages 60+)</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question about curriculum"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', backgroundColor: '#F8FAFD' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you with SparkoMind?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', backgroundColor: '#F8FAFD' }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-brand"
                    style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
