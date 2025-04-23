const InstagramService = require('../models/instagramService');
const LogService = require('../models/logService');
const SessionService = require('../models/sessionService');
const config = require('../config');

exports.getTarget = async (req, res) => {
  try {
    const { username } = req.body;
    const account = await InstagramService.getAccountByUsername(username);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    res.json({ id: account.pk, username: account.username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get account' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { accountId, count } = req.body;
    const users = await InstagramService.getFollowers(accountId, count);
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get followers' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { accountId, count } = req.body;
    const users = await InstagramService.getFollowing(accountId, count);
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get following' });
  }
};

exports.sendMessages = async (req, res) => {
  try {
    const { users, message, delay } = req.body;
    const logs = [];
    let completed = 0;
    
    LogService.setTotal(users.length);
    
    for (const userId of users) {
      try {
        await InstagramService.sendMessage(userId, message);
        logs.push(LogService.addLog(`Message sent to user ${userId}`));
        completed++;
      } catch (error) {
        logs.push(LogService.addLog(`Failed to send message to ${userId}: ${error.message}`));
      }
      
      // Add random delay between messages
      const randomDelay = Math.floor(Math.random() * (config.MAX_DELAY - config.MIN_DELAY)) + config.MIN_DELAY;
      await new Promise(resolve => setTimeout(resolve, randomDelay));
    }
    
    res.json({ success: true, logs, completed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send messages' });
  }
};
