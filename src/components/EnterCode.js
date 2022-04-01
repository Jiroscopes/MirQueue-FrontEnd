import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isSession } from '../utils';

export default function EnterCode() {
  const [sessionCode, setSessionCode] = useState(null);
  const history = useHistory();

  function handleInput(e) {
    if (e.target.value === '') {
      setSessionCode(null);
    }

    setSessionCode(e.target.value);
  }

  async function handleClick(e) {
    e.preventDefault();

    if (await isSession(sessionCode)) {
      history.push(`/session/${sessionCode}`);
      return;
    }

    return;
  }

  return (
    <div className="login">
      <div className="code-dialog">
        <label htmlFor="session-code">Session Code:</label>
        <input
          name="session-code"
          type="text"
          placeholder="Code"
          onChange={handleInput}
        />
        <button onClick={handleClick}>Submit</button>
      </div>
    </div>
  );
}
