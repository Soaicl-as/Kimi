module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 5000,
  MAX_DM_COUNT: 20, // Limited for free tier
  MIN_DELAY: 90000, // 1.5 minutes minimum delay
  MAX_DELAY: 180000 // 3 minutes maximum delay
};
