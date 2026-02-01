/**
 * Formats seconds into MM:SS or HH:MM:SS
 * @param {number} seconds 
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const mDisplay = m < 10 ? `0${m}` : m;
  const sDisplay = s < 10 ? `0${s}` : s;

  if (h > 0) {
    return `${h}:${mDisplay}:${sDisplay}`;
  }
  return `${m}:${sDisplay}`; // 04:30
};

/**
 * Formats large numbers (e.g., 1200 -> 1.2k)
 * @param {number} num 
 */
export const formatCount = (num) => {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

/**
 * Formats date string to readable format (Jan 1, 2024)
 * @param {string} dateString 
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};