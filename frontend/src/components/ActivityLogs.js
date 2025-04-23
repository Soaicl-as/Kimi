import React from 'react';

const ActivityLogs = ({ logs, accounts }) => {
  return (
    <div className="logs-container">
      <h3>Activity Logs</h3>
      <div className="logs-list">
        {logs.map((log, index) => (
          <div key={index} className="log-item">
            <span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
      
      {accounts.length > 0 && (
        <div className="accounts-preview">
          <h4>Accounts ({accounts.length}):</h4>
          <ul>
            {accounts.slice(0, 5).map((account, index) => (
              <li key={index}>{account.username}</li>
            ))}
            {accounts.length > 5 && <li>... {accounts.length - 5} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
