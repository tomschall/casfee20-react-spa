import React, { useState, useEffect } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Chat from './components/Chat';

const App = () => {
  return (
    <div className="app">
      <ApolloConsumer>
        {(client) => {
          return <Chat client={client} />;
        }}
      </ApolloConsumer>
    </div>
  );
};

export default App;
