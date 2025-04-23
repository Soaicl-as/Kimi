const LogService = require('../models/logService');

exports.getLogs = (req, res) => {
  res.json(LogService.getLogs());
};

exports.getProgress = (req, res) => {
  res.json(LogService.getProgress());
};
