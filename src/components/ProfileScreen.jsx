import React from 'react';

export default function ProfileScreen({ setScreen }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>
      <p>Тут буде інформація про користувача.</p>
      <button onClick={() => setScreen && setScreen('/home')}>Back</button>
    </div>
  );
}
