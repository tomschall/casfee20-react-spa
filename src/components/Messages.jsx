import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';

const MESSAGE_CREATED = gql`
  subscription {
    message(order_by: { id: desc }, limit: 1) {
      id
      username
      text
      timestamp
    }
  }
`;

const Messages = (props) => {
  useEffect(() => {
    console.log('component did mount');
    const unsubscribe = props.subscribeToMore({
      document: MESSAGE_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        console.log('updateQuery', subscriptionData);

        props.refetch();

        return null;
      },
    });
    return function cleanup() {
      console.log('component did unmount');
      unsubscribe();
    };
  }, []);

  return (
    <div id="chatbox">
      <ul>
        {props.messages.map((m) => {
          return (
            <li key={m.id}>
              <p>{m.username}</p>
              <p>{m.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
