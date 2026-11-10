import React, { useState } from 'react';
import { 
  User, Mail, Calendar, Shield, Award, Flame, 
  Sparkles, Brain, Cpu, Compass, Layers, CheckCircle2, 
  Edit3, Save, RefreshCw, BarChart2 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ProfilePage = () => {
  const { user, progress, updateProfileProgress } = useAuth();
  const { demographic, setDemographic } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Jagadeesh Pinniboyina',
    email: user?.email || 'pinniboinajagadeesh76@gmail.com',
    avatar: '🚀',
    bio: 'Software engineer and cognitive fitness enthusiast dedicated to keeping mental sharpness peak.'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const avatarsList = ['🚀', '🧠', '⚡', '👑', '🌟', '🎯', '🌿', '💻', '🎨', '🧸', '🌸'];

  const cognitiveDimensions = [
    { dimension: 'Algorithmic Sequence', score: 94, icon: Cpu, color: 'var(--brand-primary)' },
    { dimension: 'Working Memory', score: 92, icon: Brain, color: '#FF8C42' },
    { dimension: 'Logical Reasoning', score: 88, icon: Award, color: '#0284C7' },
    { dimension: 'Processing Velocity', score: 85, icon: Flame, color: '#EF4444' },
    { dimension: 'Spatial Orientation', score: 78, icon: Compass, color: '#10B981' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDemographicChange = (zone) => {
    setDemographic(zone);
    if (updateProfileProgress && progress) {
      updateProfileProgress({ demographic: zone });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <User style={{ color: 'var(--brand-primary)' }} size={32} />
          My Profile & Cognitive Identity
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
          Manage your personal learner credentials, demographic experience mode, and cognitive index.
        </p>
      </div>

      {saveSuccess && (
        <div
          style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '0.9rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={18} />
          Profile preferences updated successfully!
        </div>
      )}

      {/* Main Profile Header Card */}
      <Card
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFD 100%)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '24px',
                  backgroundColor: '#EEF2FF',
                  border: '3px solid var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  boxShadow: '0 8px 24px rgba(94, 92, 230, 0.2)'
                }}
              >
                {formData.avatar}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>
                  {formData.name}
                </h2>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    backgroundColor: demographic === 'kids' ? '#FFF2EB' : demographic === 'seniors' ? '#D1FAE5' : '#E0F2FE',
                    color: demographic === 'kids' ? '#FF8C42' : demographic === 'seniors' ? '#10B981' : '#0284C7',
                    border: '1px solid currentColor',
                    textTransform: 'capitalize'
                  }}
                >
                  {demographic} Zone Mode
                </span>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '500px', lineHeight: 1.5 }}>
                {formData.bio}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.65rem', fontSize: '0.82rem', color: '#94A3B8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> {formData.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Joined October 2026
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Edit3 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid var(--border-subtle)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid var(--border-subtle)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Bio</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid var(--border-subtle)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Choose Avatar</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {avatarsList.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: av })}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: formData.avatar === av ? '2px solid var(--brand-primary)' : '1px solid #E2E8F0',
                      backgroundColor: formData.avatar === av ? 'rgba(94, 92, 230, 0.1)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                style={{
                  padding: '0.7rem 1.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </Card>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>
            {(progress?.totalXp || 3850).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total Cognitive XP</div>
        </Card>

        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FF8C42', marginBottom: '0.2rem' }}>
            🔥 {progress?.currentStreak || 5}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Day Training Streak</div>
        </Card>

        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284C7', marginBottom: '0.2rem' }}>
            #4
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Global Rank</div>
        </Card>

        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10B981', marginBottom: '0.2rem' }}>
            12 / 15
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Core Games Explored</div>
        </Card>
      </div>

      {/* Cognitive Dimensions Radar / Progress Breakdown */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={22} color="var(--brand-primary)" />
          Cognitive Mastery Index
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Dimension scores adapt dynamically through zero-trust algorithmic performance logging.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cognitiveDimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <div key={dim.dimension}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#334155' }}>
                    <Icon size={18} color={dim.color} />
                    <span>{dim.dimension}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: dim.color }}>{dim.score} / 100</div>
                </div>
                <div style={{ width: '100%', height: '9px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${dim.score}%`,
                      height: '100%',
                      backgroundColor: dim.color,
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Demographic Zone Switcher */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
          Demographic Experience Switcher
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Seamlessly switch your active UI layout, typography scaling, and curated games catalogue.
        </p>

        <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
          {[
            { id: 'kids', name: 'Kids Zone', age: 'Ages 6–12', color: '#FF8C42', desc: 'Bouncy visuals, playful stars, spatial adventure games.' },
            { id: 'adults', name: 'Adult Zone', age: 'Ages 13–59', color: '#0284C7', desc: 'High-velocity logic, coding challenges, reaction meters.' },
            { id: 'seniors', name: 'Senior Zone', age: 'Ages 60+', color: '#10B981', desc: 'Comfortable contrast, botanical memory, relaxed pacing.' }
          ].map((z) => (
            <div
              key={z.id}
              onClick={() => handleDemographicChange(z.id)}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                border: '2px solid',
                borderColor: demographic === z.id ? z.color : '#E2E8F0',
                backgroundColor: demographic === z.id ? `${z.color}0D` : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '1rem' }}>{z.name}</span>
                {demographic === z.id && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: z.color, color: '#FFFFFF' }}>
                    Active
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: z.color, fontWeight: 700, marginBottom: '0.4rem' }}>{z.age}</div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>{z.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
