const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'PORT',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET'
];

const checkEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { checkEnv };