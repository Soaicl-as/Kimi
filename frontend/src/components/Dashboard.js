import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState('followers');
  const [message, setMessage] = useState('');
  const [dmCount, setDmCount] = useState(10);
  const [delay, setDelay] = useState(60);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };

    fetchLogs();
  }, []);

  const startMessaging = async () => {
    if (!target || !message || dmCount <= 0 || delay <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setLoading(true);

    try {
      // Get target account
      const accountRes = await axios.post('/api/dm/target', { username: target });
      const accountId = accountRes.data.id;

      // Get followers or following
      let users;
      if (targetType === 'followers') {
        users = await axios.post('/api/dm/followers', { accountId, count: dmCount });
      } else {
        users = await axios.post('/api/dm/following', { accountId, count: dmCount });
      }

      setAccounts(users.data);
      
      // Start sending messages
      const messageData = {
        users: users.data.map(user => user.pk),
        message,
        delay: delay * 1000 // Convert minutes to milliseconds
      };

      const messageRes = await axios.post('/api/dm/send', messageData);
      
      setLogs(prevLogs => [...prevLogs, ...messageRes.data.logs]);
      setProgress(100);
      
    } catch (err) {
      console.error('Error starting messaging:', err);
      setError(err.response?.data?.error || 'Failed to start messaging');
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {loading && <LoadingSpinner />}
      
      <h1 className="dashboard-title">Instagram DM Bot Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="dashboard-grid">
        <div className="settings-column">
          <TargetForm 
            target={target} 
            targetType={targetType} 
            setTarget={setTarget} 
            setTargetType={setTargetType} 
          />
          
          <DMForm 
            message={message} 
            setMessage={setMessage} 
          />
          
          <SettingsPanel 
            dmCount={dmCount} 
            delay={delay} 
            setDmCount={setDmCount} 
            setDelay={setDelay} 
          />
          
          <button 
            className={`btn btn-primary ${isProcessing ? 'disabled' : ''}`}
            onClick={startMessaging}
            disabled={isProcessing || loading}
          >
            {isProcessing ? 'Processing...' : 'Start Messaging'}
          </button>
        </div>
        
        <div className="logs-column">
          <ActivityLogs logs={logs} accounts={accounts} />
          
          {progress > 0 && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              <span className="progress-text">{progress}% Complete</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
