/**
 * Bulletproof initials generator from User object or name string.
 * Examples:
 *   { firstName: 'Jagadeesh', lastName: 'Pinniboina' } -> 'JP'
 *   { name: 'Jagadeesh Pinniboina' } -> 'JP'
 *   { name: 'Jagadeesh' } -> 'JA'
 *   null / undefined -> 'SM'
 */
export const getInitials = (user) => {
  if (!user) return 'SM';

  if (user.firstName && user.lastName) {
    const f = String(user.firstName).trim()[0] || '';
    const l = String(user.lastName).trim()[0] || '';
    if (f && l) return `${f}${l}`.toUpperCase();
  }

  const raw = (user.name || user.email || 'SM').trim();
  const nameParts = raw.split(/\s+/).filter(Boolean);

  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0][0] || '';
    const secondInitial = nameParts[1][0] || '';
    return `${firstInitial}${secondInitial}`.toUpperCase();
  }

  if (nameParts.length === 1 && nameParts[0].length >= 2) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return (raw.slice(0, 2) || 'SM').toUpperCase();
};

export default getInitials;
