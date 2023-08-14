const pool = require('../../db');

module.exports = {
  index: async (req, res) => {
    res.status(200).json('Hello from grammar l system endpoint');
  },
  init: async (req, res) => {
    res.status(200).json('Initializing tables');
  },
  createPreset: async (req, res) => {
    res.status(200).json('Posted l system preset');
  },
};
