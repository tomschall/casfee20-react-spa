import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import OnlineUsers from './OnlineUsers';

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

const USER_IS_ONLINE = gql`
  mutation($userId: Int!) {
    update_user(_set: { last_seen: "now()" }, where: { id: { _eq: $userId } }) {
      affected_rows
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

    const interval = setInterval(async () => {
      await props.client.mutate({
        mutation: USER_IS_ONLINE,
        variables: {
          userId: 1,
        },
      });
    }, 2000);

    return function cleanup() {
      console.log('component did unmount');
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="chatbox">
      <OnlineUsers userId={1} username={'Tom'} />
      <hr></hr>
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
