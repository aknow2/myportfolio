import React from 'react';
import './App.css';
import Background from './Background';
import Profile from './Profile';

function App() {
  return (
    <div className="App">
      <Background />
			<div className="mask">
				<Profile />
			</div>
    </div>
  );
}

export default App;
