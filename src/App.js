import './App.css';
import React, { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
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
        let curTime = new Date();
        localStorage.setItem("token", data.token);
        localStorage.setItem("startTime", curTime.toISOString());
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
    let savedTime = Date.parse(localStorage.getItem("startTime"));
    let curTime = new Date();
    curTime = curTime.getTime()
    console.log(curTime, savedTime, curTime - savedTime)
   if((curTime - savedTime) >= 19000){ 
    try {
      const response = await fetch('https://stagev2a.rechargkit.biz/member/token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

        const data = await response.json();
        if (data.token) {
        localStorage.setItem("startTime", curTime.toISOString);
        localStorage.setItem("token", data.token)
        setToken(data.token);
        scheduleTokenRefresh();
      } else {
      }
    } catch (error) {
    }}
  };

  const scheduleTokenRefresh = () => {
    const tokenRefreshInterval = setInterval(() => {
      refreshToken();
    }, 1000);
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