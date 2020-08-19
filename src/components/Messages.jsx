import React, { useState, useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';

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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

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

  useEffect(() => {
    console.log('update');
    scrollToBottom();
  });

  const renderAvatar = (user) => {
    let image;
    if (user === 'roli') {
      image = <img class="avatar" src="https://placeimg.com/50/50/people?1" />;
    } else {
      image = <img class="avatar" src="https://placeimg.com/50/50/people?2" />;
    }
    return image;
  };

  return (
    <div class="container">
      <div class="chat-container">
        {props.messages.map((m) => {
          return (
            <div class="message">
              {renderAvatar(m.username)}

              <div class="datetime">
                {m.username}: <i>{moment(m.timestamp).fromNow()}</i>
              </div>
              <p>{m.text}</p>
            </div>
          );
        })}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
