import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useRecoilState } from 'recoil';
import { messagesState, newMessagesState } from '../atom.js';

import '../App.css';

const INSERT_MESSAGE = gql`
  mutation insert_message($message: message_insert_input!) {
    insert_message(objects: [$message]) {
      returning {
        id
        timestamp
        text
        username
      }
    }
  }
`;

const ChatInput = (props) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useRecoilState(messagesState);
  const [newMessages, setNewMessages] = useRecoilState(newMessagesState);

  const handleTyping = (text) => {
    setText(text);
  };

  const form = (sendMessage) => {
    return (
      <form onSubmit={sendMessage}>
        <div className="chatinput_wrapper">
          <input
            className="textbox chatinput"
            value={text}
            autoFocus={true}
            onChange={(e) => {
              handleTyping(e.target.value);
            }}
            autoComplete="off"
          />
          <button className="sendButton buttonTextbox" onClick={sendMessage}>
            Send
          </button>
        </div>
      </form>
    );
  };

  const updateMessages = (message) => {
    const messagesArr = [...messages, ...newMessages];
    messagesArr.push(message);
    setMessages(messagesArr);
    setNewMessages([]);
  };

  return (
    <Mutation
      mutation={INSERT_MESSAGE}
      variables={{
        message: {
          username: props.username,
          text: text,
        },
      }}
      update={(cache, { data: { insert_message } }) => {
        const message = {
          id: insert_message.returning[0].id,
          timestamp: insert_message.returning[0].timestamp,
          username: insert_message.returning[0].username,
          text: insert_message.returning[0].text,
        };
        updateMessages(message);
      }}
    >
      {(insert_message, { data, loading, error }) => {
        const sendMessage = (e) => {
          e.preventDefault();
          if (text === '') {
            return;
          }
          insert_message();
          setText('');
        };
        return form(sendMessage);
      }}
    </Mutation>
  );
};

export default ChatInput;
