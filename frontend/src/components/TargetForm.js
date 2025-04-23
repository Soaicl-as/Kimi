import React from 'react';

const TargetForm = ({ target, targetType, setTarget, setTargetType }) => {
  return (
    <div className="target-form">
      <h3>Target Account</h3>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Enter target username"
        />
      </div>
      <div className="form-group">
        <label>Select Target Type</label>
        <select
          className="form-control"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        >
          <option value="followers">Followers</option>
          <option value="following">Following</option>
        </select>
      </div>
    </div>
  );
};

export default TargetForm;
