const fs = require('fs');
const path = require('path');

class LogService {
  constructor() {
    this.logFile = path.join(__dirname, '../../logs/activity.log');
    this.logs = [];
    this.total = 0;
    this.completed = 0;
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    
    // Load existing logs
    if (fs.existsSync(this.logFile)) {
      try {
        this.logs = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      } catch (err) {
        console.error('Error loading logs:', err);
      }
    }
  }

  setTotal(count) {
    this.total = count;
  }

  addLog(message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message
    };
    
    this.logs.unshift(logEntry);
    this.completed++;
    
    // Save to file
    fs.writeFileSync(this.logFile, JSON.stringify(this.logs, null, 2));
    
    return logEntry;
  }

  getLogs() {
    return this.logs.slice(0, 50); // Return only last 50 logs
  }

  getProgress() {
    return {
      percentage: Math.floor((this.completed / this.total) * 100),
      completed: this.completed,
      total: this.total
    };
  }
}

module.exports = new LogService();
