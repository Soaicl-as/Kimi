import React from 'react';

const SettingsPanel = ({ dmCount, delay, setDmCount, setDelay }) => {
  return (
    <div className="settings-panel">
      <h3>Settings</h3>
      <div className="form-group">
        <label>Number of Messages</label>
        <input
          type="number"
          className="form-control"
          value={dmCount}
          onChange={(e) => setDmCount(parseInt(e.target.value))}
          min="1"
          max="50"
        />
      </div>
      <div className="form-group">
        <label>Delay between messages (minutes)</label>
        <input
          type="number"
          className="form-control"
          value={delay}
          onChange={(e) => setDelay(parseInt(e.target.value))}
          min="1"
          max="5"
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
