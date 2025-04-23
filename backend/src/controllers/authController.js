const InstagramService = require('../models/instagramService');
const SessionService = require('../models/sessionService');
const LogService = require('../models/logService');
const config = require('../config');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    await InstagramService.login(username, password);
    
    const sessionId = SessionService.createSession({
      username,
      lastActivity: new Date()
    });
    
    LogService.addLog(`User ${username} logged in successfully`);
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({ success: true });
  } catch (error) {
    if (error.message.includes('two-factor')) {
      return res.status(401).json({
        success: false,
        twoFactor: true,
        message: 'Two-factor authentication required'
      });
    }
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.completeTwoFactorLogin = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const sessionId = req.cookies.sessionId;
    const session = SessionService.getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }
    
    await InstagramService.completeTwoFactorLogin(
      session.username,
      session.password,
      verificationCode
    );
    
    SessionService.updateSession(sessionId, { twoFactorCompleted: true });
    LogService.addLog(`Two-factor authentication completed for ${session.username}`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid verification code' });
  }
};
