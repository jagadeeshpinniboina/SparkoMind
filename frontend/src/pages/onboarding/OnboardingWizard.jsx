import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, ArrowRight, ArrowLeft, Brain, Cpu, Database, 
  Binary, Compass, Sparkles, Volume2, Globe, Sliders, CheckCircle2, Shield 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const OnboardingWizard = () => {
  const { demographic, setDemographic } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active step: 1 (Category), 2 (Interests), 3 (Preferences), 4 (Goals), 5 (Confirmation)
  const [currentStep, setCurrentStep] = useState(2);

  // Form states
  const [interests, setInterests] = useState(['Memory', 'Logical Thinking', 'Coding']);
  const [preferences, setPreferences] = useState({
    language: 'English',
    difficulty: 'Medium',
    soundEnabled: true,
    fontSize: 'Normal',
    themeMode: 'Light',
    highContrast: false
  });
  const [goals, setGoals] = useState(['Improve Problem Solving', 'Keep My Mind Active', 'Build Logical Thinking']);

  const stepsList = [
    { num: 1, label: 'Category', desc: 'Select Age Zone' },
    { num: 2, label: 'Interests', desc: 'Cognitive Topics' },
    { num: 3, label: 'Preferences', desc: 'Language & Accessibility' },
    { num: 4, label: 'Goals', desc: 'Target Outcomes' },
    { num: 5, label: 'Confirmation', desc: 'Profile Ready' }
  ];

  const availableInterests = [
    { id: 'Memory', icon: Brain, label: 'Memory' },
    { id: 'Logical Thinking', icon: Cpu, label: 'Logical Thinking' },
    { id: 'Mathematics', icon: Compass, label: 'Mathematics' },
    { id: 'Coding', icon: Binary, label: 'Coding' },
    { id: 'SQL', icon: Database, label: 'SQL & Data' },
    { id: 'Problem Solving', icon: Sparkles, label: 'Problem Solving' },
    { id: 'Attention', icon: Sliders, label: 'Attention' },
    { id: 'General Puzzles', icon: Brain, label: 'General Puzzles' }
  ];

  const availableGoals = [
    'Improve Problem Solving',
    'Learn Coding Skills',
    'Improve Memory',
    'Do Better in Academics',
    'Prepare for Interviews',
    'Keep My Mind Active',
    'Enjoy Fun Games',
    'Build Logical Thinking',
    'Improve Concentration'
  ];

  const languages = [
    'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Odia'
  ];

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleGoal = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
    );
  };

  const handleFinish = () => {
    const d = user?.demographic || demographic;
    if (d === 'kids') navigate('/dashboard/kids');
    else if (d === 'seniors') navigate('/dashboard/seniors');
    else navigate('/dashboard/adults');
  };

  return (
    <div className="container" style={{ maxWidth: '1080px', padding: '3.5rem 1.5rem' }}>
      <div
        className="card-base md:grid-cols-1"
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          padding: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(94, 92, 230, 0.08)'
        }}
      >
        {/* Left Step Tracker Sidebar (PART-2 Specification) */}
        <div
          style={{
            backgroundColor: '#0D1527',
            padding: '2.5rem 1.75rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2.25rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>SparkoMind</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Onboarding Progress
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {stepsList.map((s) => {
                const isCompleted = s.num < currentStep;
                const isActive = s.num === currentStep;

                return (
                  <div
                    key={s.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      opacity: isActive || isCompleted ? 1 : 0.45,
                      cursor: isCompleted ? 'pointer' : 'default'
                    }}
                    onClick={() => isCompleted && setCurrentStep(s.num)}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? 'var(--color-success)' : isActive ? 'var(--brand-primary)' : '#1E293B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      {isCompleted ? <Check size={16} /> : s.num}
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isActive ? '#FFFFFF' : '#CBD5E1' }}>
                        ({s.num}) {s.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {isCompleted ? 'Done' : isActive ? 'Active' : s.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748B', borderTop: '1px solid #1E293B', paddingTop: '1.25rem' }}>
            Current Zone: <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{demographic}</strong>
          </div>
        </div>

        {/* Right Step Content Container */}
        <div style={{ padding: '3rem 2.5rem', backgroundColor: '#FFFFFF' }}>
          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="demographic-pill" style={{ marginBottom: '0.4rem' }}>Step 1 of 5</span>
                <h2 style={{ fontSize: '1.8rem', color: '#1E293B', marginTop: '0.25rem' }}>Choose Your Category Zone</h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Select the age cohort that fits you best.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {[
                  { id: 'kids', label: 'Kids Zone (Ages 6–12)', desc: 'Playful adventures, stars, and colorful puzzles', color: '#FF8C42' },
                  { id: 'adults', label: 'Adult Zone (Ages 13–59)', desc: 'Logic, coding, data queries, and velocity challenges', color: '#0284C7' },
                  { id: 'seniors', label: 'Senior Zone (Ages 60+)', desc: 'Large high-contrast text, relaxed timers, and gentle memory', color: '#10B981' }
                ].map((cat) => {
                  const isSelected = demographic === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setDemographic(cat.id)}
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderRadius: '14px',
                        border: isSelected ? `2.5px solid ${cat.color}` : '1.5px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--bg-app)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>{cat.label}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{cat.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 size={22} color={cat.color} />}
                    </div>
                  );
                })}
              </div>

              <Button className="btn-brand" onClick={() => setCurrentStep(2)} style={{ width: '100%' }} icon={<ArrowRight size={18} />}>
                Next: Select Your Interests
              </Button>
            </div>
          )}

          {/* STEP 2: INTERESTS (PART-2 SPEC) */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="demographic-pill" style={{ marginBottom: '0.4rem' }}>Step 2 of 5</span>
                <h2 style={{ fontSize: '1.8rem', color: '#1E293B', marginTop: '0.25rem' }}>01. Select Your Interests</h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Select the cognitive topics and puzzle formats you enjoy most.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-3" style={{ marginBottom: '2.5rem' }}>
                {availableInterests.map((item) => {
                  const Icon = item.icon;
                  const isChecked = interests.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        border: isChecked ? '2px solid var(--brand-primary)' : '1.5px solid var(--border-subtle)',
                        backgroundColor: isChecked ? 'var(--color-primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ color: isChecked ? 'var(--brand-primary)' : '#64748B' }}>
                          <Icon size={20} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1E293B' }}>{item.label}</span>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--brand-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="secondary" onClick={() => setCurrentStep(1)} style={{ flex: 1 }}>
                  Back
                </Button>
                <Button className="btn-brand" onClick={() => setCurrentStep(3)} style={{ flex: 2 }} icon={<ArrowRight size={18} />}>
                  Next: Preferences
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES (PART-2 SPEC) */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="demographic-pill" style={{ marginBottom: '0.4rem' }}>Step 3 of 5</span>
                <h2 style={{ fontSize: '1.8rem', color: '#1E293B', marginTop: '0.25rem' }}>02. Set Your Preferences</h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Customize your sensory interface and regional language settings.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {/* Language Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="form-input"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty & Text Size */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      Difficulty Level
                    </label>
                    <select
                      value={preferences.difficulty}
                      onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                      className="form-input"
                    >
                      <option value="Easy">Easy (Relaxed)</option>
                      <option value="Medium">Medium (Balanced)</option>
                      <option value="Hard">Hard (Expert)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      Text Size
                    </label>
                    <select
                      value={preferences.fontSize}
                      onChange={(e) => setPreferences({ ...preferences, fontSize: e.target.value })}
                      className="form-input"
                    >
                      <option value="Normal">Normal (Standard)</option>
                      <option value="Large">Large (Enhanced readability)</option>
                      <option value="Extra Large">Extra Large (High accessibility)</option>
                    </select>
                  </div>
                </div>

                {/* Toggle Controls: Sound, Theme, Accessibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Sound Effects & Audio Cues</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Audio feedback when solving puzzles</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.soundEnabled}
                      onChange={(e) => setPreferences({ ...preferences, soundEnabled: e.target.checked })}
                      style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>High Contrast / Accessibility Mode</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Enhanced borders and relaxed timers</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.highContrast}
                      onChange={(e) => setPreferences({ ...preferences, highContrast: e.target.checked })}
                      style={{ accentColor: 'var(--brand-primary)', width: '20px', height: '20px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="secondary" onClick={() => setCurrentStep(2)} style={{ flex: 1 }}>
                  Back
                </Button>
                <Button className="btn-brand" onClick={() => setCurrentStep(4)} style={{ flex: 2 }} icon={<ArrowRight size={18} />}>
                  Next: Choose Goals
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: GOALS (PART-2 SPEC) */}
          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="demographic-pill" style={{ marginBottom: '0.4rem' }}>Step 4 of 5</span>
                <h2 style={{ fontSize: '1.8rem', color: '#1E293B', marginTop: '0.25rem' }}>03. Choose Your Goals</h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Select what you want to achieve on SparkoMind.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-3" style={{ marginBottom: '2.5rem' }}>
                {availableGoals.map((g) => {
                  const isChecked = goals.includes(g);
                  return (
                    <div
                      key={g}
                      onClick={() => toggleGoal(g)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.15rem',
                        borderRadius: '12px',
                        border: isChecked ? '2px solid var(--brand-primary)' : '1.5px solid var(--border-subtle)',
                        backgroundColor: isChecked ? 'var(--color-primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{g}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--brand-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="secondary" onClick={() => setCurrentStep(3)} style={{ flex: 1 }}>
                  Back
                </Button>
                <Button className="btn-brand" onClick={() => setCurrentStep(5)} style={{ flex: 2 }} icon={<ArrowRight size={18} />}>
                  Next: Confirmation
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION & SUMMARY (PART-2 SPEC) */}
          {currentStep === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#D1FAE5',
                  color: '#10B981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <h2 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                You're All Set!
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.98rem', marginBottom: '2rem' }}>
                Your SparkoMind profile is fully calibrated and ready for daily training.
              </p>

              {/* Summary Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFD',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-subtle)',
                  padding: '1.75rem',
                  textAlign: 'left',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B', marginBottom: '1rem' }}>
                  Profile Configuration Summary
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4" style={{ fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Age Group:</span>{' '}
                    <strong style={{ color: '#1E293B', textTransform: 'capitalize' }}>{demographic} Zone</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Language:</span>{' '}
                    <strong style={{ color: '#1E293B' }}>{preferences.language}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Difficulty:</span>{' '}
                    <strong style={{ color: '#1E293B' }}>{preferences.difficulty}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Accessibility:</span>{' '}
                    <strong style={{ color: '#1E293B' }}>{preferences.highContrast ? 'High Contrast On' : 'Standard'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.4rem' }}>Selected Goals ({goals.length}):</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {goals.slice(0, 4).map((g) => (
                      <span key={g} style={{ fontSize: '0.75rem', backgroundColor: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', color: '#334155' }}>
                        {g}
                      </span>
                    ))}
                    {goals.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>+{goals.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="btn-brand"
                size="lg"
                onClick={handleFinish}
                style={{ width: '100%', minHeight: '48px', fontSize: '1.05rem' }}
                icon={<ArrowRight size={20} />}
              >
                Go to Dashboard →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
