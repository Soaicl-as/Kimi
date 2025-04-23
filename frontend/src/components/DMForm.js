import React from 'react';

const DMForm = ({ message, setMessage }) => {
  return (
    <div className="dm-form">
      <h3>Message Composer</h3>
      <div className="form-group">
        <label>Message</label>
        <textarea
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          placeholder="Enter your message here..."
        />
      </div>
    </div>
  );
};

export default DMForm;
