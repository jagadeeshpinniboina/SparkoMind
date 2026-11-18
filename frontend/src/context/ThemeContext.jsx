import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [demographic, setDemographicState] = useState(() => {
    return localStorage.getItem('sparkomind_active_zone') || localStorage.getItem('sparkomind_demographic') || 'adults';
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('sparkomind_theme') || 'dark';
  });

  // Apply data-attributes dynamically to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-demographic', demographic);
    root.setAttribute('data-theme', theme);

    localStorage.setItem('sparkomind_demographic', demographic);
    localStorage.setItem('sparkomind_active_zone', demographic);
    localStorage.setItem('sparkomind_theme', theme);
  }, [demographic, theme]);

  const setDemographic = useCallback((newDemographic) => {
    if (['kids', 'adults', 'seniors'].includes(newDemographic)) {
      setDemographicState(newDemographic);
      localStorage.setItem('sparkomind_active_zone', newDemographic);
      localStorage.setItem('sparkomind_demographic', newDemographic);
    }
  }, []);

  const setTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const demographicMeta = {
    kids: {
      name: 'Kids Mode',
      ageRange: '6–12',
      badge: 'Explorer',
      tagline: 'Playful adventures & sparkling curious minds'
    },
    adults: {
      name: 'Adult Mode',
      ageRange: '13–59',
      badge: 'Focus',
      tagline: 'Peak cognitive sharpness & analytical velocity'
    },
    seniors: {
      name: 'Senior Mode',
      ageRange: '60+',
      badge: 'Vitality',
      tagline: 'Calm pacing, brain vitality & crystal clarity'
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        demographic,
        setDemographic,
        theme,
        setTheme,
        toggleTheme,
        demographicMeta: demographicMeta[demographic],
        allDemographics: demographicMeta
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
