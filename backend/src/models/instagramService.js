const { IgApiClient, IgLoginTwoFactorRequiredError } = require('instagram-private-api');
const delay = require('../utils/delay');

class InstagramService {
  constructor() {
    this.client = new IgApiClient();
    this.isLoggedIn = false;
    this.twoFactorRequired = false;
    this.twoFactorCode = null;
  }

  async login(username, password) {
    try {
      await this.client.account.login(username, password);
      this.isLoggedIn = true;
      this.twoFactorRequired = false;
      return { success: true, twoFactor: false };
    } catch (error) {
      if (error instanceof IgLoginTwoFactorRequiredError) {
        this.twoFactorRequired = true;
        return { success: false, twoFactor: true };
      }
      throw error;
    }
  }

  async completeTwoFactorLogin(username, password, verificationCode) {
    try {
      await this.client.account.login(username, password, { twoFactorCode: verificationCode });
      this.isLoggedIn = true;
      this.twoFactorRequired = false;
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async getAccountByUsername(username) {
    const results = await this.client.user.search(username);
    return results[0] || null;
  }

  async getFollowers(userId, count) {
    const users = [];
    const pagination = { maxId: null };
    
    while (users.length < count) {
      const { users: chunk, nextMaxId } = await this.client.user.getFollowers(userId, {
        maxId: pagination.maxId,
        count: Math.min(200, count - users.length)
      });
      
      users.push(...chunk);
      pagination.maxId = nextMaxId;
      
      if (!nextMaxId) break;
      await delay(2000); // Be gentle with requests
    }
    
    return users.slice(0, count);
  }

  async getFollowing(userId, count) {
    const users = [];
    const pagination = { maxId: null };
    
    while (users.length < count) {
      const { users: chunk, nextMaxId } = await this.client.user.getFollowing(userId, {
        maxId: pagination.maxId,
        count: Math.min(200, count - users.length)
      });
      
      users.push(...chunk);
      pagination.maxId = nextMaxId;
      
      if (!nextMaxId) break;
      await delay(2000); // Be gentle with requests
    }
    
    return users.slice(0, count);
  }

  async sendMessage(recipientId, message) {
    await this.client.direct.send(message, recipientId);
  }
}

module.exports = new InstagramService();
