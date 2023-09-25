import './App.css';
import React, { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    console.log("login api called");
    try {
      const response = await fetch('https://stagev2a.rechargkit.biz/member/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

        const data = await response.json();
        if(data.token){
        setToken(data.token);
        scheduleTokenRefresh();
      } else {
        window.alert("Something went wrong, please try again.");
      }
    } catch (error) {
      window.alert("Something went wrong, please try again.");
    }
  };

  const refreshToken = async () => {
    console.log("refresh token called");
    try {
      const response = await fetch('https://stagev2a.rechargkit.biz/member/token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        const data = await response.json();
        if (data.token) {
        setToken(data.token);
        scheduleTokenRefresh();
      } else {
      }
    } catch (error) {
    }
  };

  const scheduleTokenRefresh = () => {
    const tokenRefreshInterval = setInterval(() => {
      refreshToken();
    }, 10000);
    return () => clearInterval(tokenRefreshInterval);
  };

  useEffect(() => {
    if (token) {
      scheduleTokenRefresh();
    }
  }, [token]);

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;