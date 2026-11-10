import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, 
  Sparkles, Shield, Trophy, Globe, MessageSquare 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'Getting Started',
      q: 'How does SparkoMind adapt to different age demographics?',
      a: 'SparkoMind features three distinct cognitive zones: Kids (6–12), Adults (13–59), and Seniors (60+). Each zone features tailored sensory design, typography scaling, color psychology, and specifically calibrated game engines (such as gentle botanical memory for seniors and high-velocity algorithmic sequences for adults).'
    },
    {
      category: 'Getting Started',
      q: 'Can I switch between demographic zones anytime?',
      a: 'Yes! You can switch your active experience mode at any time via your Profile page or through the Age Zones selector. Your overall XP and achievements are preserved across all zones.'
    },
    {
      category: 'Scoring & XP',
      q: 'How are XP, Streaks, and Level stars calculated?',
      a: 'XP is calculated strictly by the backend server using a formula that weights: Base Challenge XP + Latency Speed Bonus (solving faster than par time) + Accuracy Percentage + Streak Multiplier (up to 1.5x for continuous daily training).'
    },
    {
      category: 'Scoring & XP',
      q: 'What are Daily Missions and how do they reset?',
      a: 'Daily Missions are calibrated 24-hour tasks that refresh at midnight UTC. Completing missions awards bonus XP that accelerates your global ranking on the leaderboard.'
    },
    {
      category: 'Technical & Security',
      q: 'What is Zero-Trust Client Game Logic?',
      a: 'Traditional browser games often store answer keys in JavaScript memory where they can be inspected. SparkoMind uses a zero-trust model: the client receives only the interactive puzzle layout, and answers are evaluated on our secure Node.js backend connected to MongoDB Atlas.'
    },
    {
      category: 'Accessibility',
      q: 'What accessibility options are supported for seniors?',
      a: 'SparkoMind complies with WCAG 2.1 AAA accessibility standards. In Senior mode and Settings, you can enable High Contrast mode, enlarge typography, toggle sound chimes, and enjoy relaxed timers designed to eliminate frustration.'
    },
    {
      category: 'Localization',
      q: 'Which languages are supported?',
      a: 'SparkoMind currently supports 9 languages: English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), and Odia (ଓଡ଼ିଆ).'
    }
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
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
          <HelpCircle size={16} /> Knowledge Base & FAQ
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1E293B', marginBottom: '0.75rem' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
          Find answers to common questions about games, demographic calibration, cognitive scores, and account settings.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: '1.75rem', maxWidth: '520px', margin: '1.75rem auto 0' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search help topics (e.g. XP, zero-trust, seniors)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem 0.85rem 3rem',
              borderRadius: '12px',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-card)'
            }}
          />
        </div>
      </div>

      {/* FAQs List */}
      <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                border: isOpen ? '1.5px solid var(--brand-primary)' : '1.5px solid var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(94, 92, 230, 0.08)',
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                      display: 'inline-block'
                    }}
                  >
                    {faq.category}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>
                    {faq.q}
                  </h3>
                </div>
                <div style={{ color: isOpen ? 'var(--brand-primary)' : '#94A3B8' }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Need more help banner */}
      <Card
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#F8FAFD',
          border: '1.5px dashed var(--border-subtle)'
        }}
      >
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.4rem' }}>
          Still have questions?
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Our cognitive support engineers and curriculum specialists are here to help.
        </p>
        <Link to="/contact">
          <button className="btn-brand" style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}>
            Contact Support Team →
          </button>
        </Link>
      </Card>
    </div>
  );
};

export default HelpPage;
