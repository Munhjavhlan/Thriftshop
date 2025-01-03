const pool = require("../db");
const bcrypt = require("bcryptjs");


const registerUser = async (lastname, firstname, username, email, phone, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (lastname, firstname, username, email, phone, password)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [lastname, firstname, username, email, phone, hashedPassword];
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

const getUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const result = await pool.query(query, [userId]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const getUserRole = async (userId) => {
  const query = `SELECT role FROM users WHERE id = $1;`;
  const result = await pool.query(query, [userId]);
  if (result.rows.length === 0) return null;
  return result.rows[0].role;  
};

const getUserDataById = async (userId) => {
  const query = `SELECT lastname, firstname, email, phone FROM users WHERE id = $1;`;
  const result = await pool.query(query, [userId]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

module.exports = { registerUser, loginUser, getUserById, getUserRole, getUserDataById };
