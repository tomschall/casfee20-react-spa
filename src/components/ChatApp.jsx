import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import Chat from './Chat';
import ChatInput from './ChatInput';
import OnlineUsers from './OnlineUsers';

const USER_IS_ONLINE = gql`
  mutation($userId: Int!) {
    update_user(_set: { last_seen: "now()" }, where: { id: { _eq: $userId } }) {
      affected_rows
    }
  }
`;

const ChatApp = (props) => {
  const [nameValue, setNameValue] = useState();

  useEffect(() => {
    console.log('ChickenFestChat did mount');
    const interval = setInterval(async () => {
      await props.client.mutate({
        mutation: USER_IS_ONLINE,
        variables: {
          userId: 3,
        },
      });
    }, 2000);

    return function cleanup() {
      console.log('ChickenFestChat did unmount');
      clearInterval(interval);
    };
  }, []);

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <form onSubmit={handleNameSubmit}>
        <label>
          Name:
          <input type="text" value={nameValue} onChange={handleNameChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <hr></hr>
      <OnlineUsers username={nameValue} userId={1} />
      <hr></hr>
      <Chat client={props.client} nameValue={nameValue} />
      <ChatInput username={nameValue} userId={1} />
    </React.Fragment>
  );
};

export default ChatApp;
