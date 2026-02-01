const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ----------------------
// 1. SIGNUP FUNCTION
// ----------------------
const signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // 1. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Auto-generate Username (e.g., "john.doe" from "john.doe@email.com")
    const baseUsername = email.split('@')[0]; 
    const username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          full_name, 
          email, 
          password: hashedPassword,
          username: username,
          role: 'explorer',    // Default role
          is_admin: false
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // 4. Generate Token
    const token = jwt.sign(
      { id: data.id, email: data.email, is_admin: data.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        username: data.username,
        role: data.role,
        is_admin: data.is_admin
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------------
// 2. LOGIN FUNCTION
// ----------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
        username: user.username,
        bio: user.bio
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// 3. EXPORTS
// ----------------------
module.exports = { 
  signup, 
  login 
};