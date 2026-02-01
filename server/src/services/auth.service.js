const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const registerUser = async (userData) => {
  const { full_name, email, password, role, avatar_url } = userData;

  // 1. Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Insert User
  // SCHEMA MATCH: Default role must be 'explorer' to match your DB CHECK constraint
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([
      {
        full_name,
        email,
        password: hashedPassword, 
        role: role || 'explorer', // UPDATED: Matches your schema's check constraint
        avatar_url: avatar_url || null,
        // id is now handled by DEFAULT gen_random_uuid() in DB
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // 4. Generate Token
  const token = generateToken(newUser.id, newUser.role);

  return {
    user: {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      avatar_url: newUser.avatar_url,
    },
    token,
  };
};

const loginUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.role);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};