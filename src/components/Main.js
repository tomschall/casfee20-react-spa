import { ApolloConsumer } from 'react-apollo';
import React, { useState } from 'react';
import Chat from './Chat';
import '../App.css';

export default function Main() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  };

  return (
    <div className="app">
      <ApolloConsumer>
        {(client) => {
          return <Chat userId={userId} username={username} client={client} />;
        }}
      </ApolloConsumer>
    </div>
  );
}
