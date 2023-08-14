const jwt = require('jsonwebtoken');
const pool = require('../../../db');

module.exports = {
  index: async (req, res) => {
    res.status(200).json('Hello from users endpoint');
  },
  init: async (req, res) => {
    res.status(200).json('Initializing tables');
  },
  createUser: async (req, res) => {
    try {
      const {username, password, isadmin} = req.body;
      const newUser = await pool.query(
          `INSERT INTO public."Profile"(username, password, isadmin) 
          VALUES ($1, $2, $3);`,
          [username, password, isadmin],
      );
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  login: async (req, res) => {
    try {
      const {username, password} = req.body;
      const data = await pool.query(
          `SELECT * FROM public."Profile" p
          WHERE p.username = $1`,
          [username],
      );
      const user = data.rows[0];
      if (password == user.password) {
        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({token: token});
      } else {
        res.status(401).json('Invalid login');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};