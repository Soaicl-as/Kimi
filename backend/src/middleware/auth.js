const SessionService = require('../models/sessionService');

const authMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const session = SessionService.getSession(sessionId);
  
  if (!session || !session.twoFactorCompleted) {
    return res.status(401).json({ success: false, message: 'Session invalid or incomplete' });
  }
  
  req.session = session;
  next();
};

module.exports = authMiddleware;
