import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Chat from './components/Chat';

const App = () => {
  return (
    <div className="app">
      <Chat />
    </div>
  );
};

export default App;
