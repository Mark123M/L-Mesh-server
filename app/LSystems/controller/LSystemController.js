const pool = require('../../../db');

module.exports = {
  index: async (req, res) => {
    res.status(200).json('Hello from l system controller');
  },
  init: async (req, res) => {
    res.status(200).json('Initializing tables');
  },
  createPreset: async (req, res) => {
    res.status(200).json(req.user);
  },
};
