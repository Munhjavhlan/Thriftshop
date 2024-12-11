const pool = require('../db'); 
const bcrypt = require('bcryptjs');

const registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [username, email, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const loginUser = async (email, enteredPassword) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(enteredPassword, user.password);
  return isMatch ? user : null;
};

module.exports = { registerUser, loginUser };
