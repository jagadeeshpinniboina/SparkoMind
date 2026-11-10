import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Brain, Shield, Award, Users, HeartHandshake, 
  Zap, Compass, ArrowRight, CheckCircle2 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> The SparkoMind Philosophy
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1E293B', lineHeight: 1.2, marginBottom: '1.25rem' }}>
          Spark Your Mind. <br />
          <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Shape Your Future.
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#64748B', lineHeight: 1.6 }}>
          SparkoMind is a first-of-its-kind, age-adaptive, generation-aware brain training and skill development platform. 
          We bridge neuroscience, game engineering, and modern pedagogy across three distinct generations.
        </p>
      </div>

      {/* The Generational Triad */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
            The Generational Triad
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Tailored cognitive stimulation engineered specifically for each developmental phase of human life.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
          {/* Kids Zone */}
          <Card
            style={{
              padding: '2rem',
              borderTop: '5px solid #FF8C42',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#FFF2EB',
                  color: '#FF8C42',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Kids Zone (Ages 6–12)
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Cultivating spatial intuition, working memory, and foundational computational logic through tactile, playful, and frustration-free experiences.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#FF8C42" /> Memory Match & Pattern Planet</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#FF8C42" /> Maze Explorer & Robo Rescue</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#FF8C42" /> Star Rewards & Wonder Badges</li>
              </ul>
            </div>
          </Card>

          {/* Adult Zone */}
          <Card
            style={{
              padding: '2rem',
              borderTop: '5px solid #0284C7',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Adult Zone (Ages 13–59)
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Sharpening analytical velocity, algorithmic sequence debugging, SQL querying, and high-pressure logical deduction for career and intellectual peak.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#0284C7" /> Code Sprint & SQL Quest</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#0284C7" /> Logic Arena & Cyber Detective</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#0284C7" /> Latency & Reaction Telemetry</li>
              </ul>
            </div>
          </Card>

          {/* Senior Zone */}
          <Card
            style={{
              padding: '2rem',
              borderTop: '5px solid #10B981',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#D1FAE5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Senior Zone (Ages 60+)
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Maintaining neuroplasticity, working memory, and mental agility through calm, botanical mindfulness, large high-contrast typography, and relaxed pacing.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10B981" /> Memory Garden & Word Garden</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10B981" /> Picture Puzzle & Sequence Steps</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10B981" /> WCAG AAA Accessible Typography</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Zero Trust Architecture Highlight */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #0D1527 0%, #162038 100%)',
          color: '#FFFFFF',
          padding: '2.5rem',
          borderRadius: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Shield size={16} /> Enterprise Zero-Trust Verification
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Zero-Trust Client Game Logic
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Unlike naive web games that leak answer keys in the browser bundle, SparkoMind strictly separates layout challenges from solutions. 
              All answers, algorithmic evaluations, streak multipliers, and XP awards run on authenticated Node.js services connected to MongoDB Atlas.
            </p>
          </div>
          <Link to="/onboarding/category">
            <button className="btn-brand" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Start Your Journey →
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
