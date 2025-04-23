class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  createSession(data) {
    const sessionId = Math.random().toString(36).substr(2, 9);
    this.sessions.set(sessionId, {
      ...data,
      createdAt: new Date()
    });
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId, data) {
    if (this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        ...this.sessions.get(sessionId),
        ...data,
        updatedAt: new Date()
      });
      return true;
    }
    return false;
  }

  clearExpiredSessions() {
    const now = new Date();
    this.sessions.forEach((session, id) => {
      if (now - session.updatedAt > 30 * 60 * 1000) { // 30 minutes
        this.sessions.delete(id);
      }
    });
  }
}

module.exports = new SessionService();
