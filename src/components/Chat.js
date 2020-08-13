import React, { useState } from 'react';
import { Subscription } from 'react-apollo';
import RenderMessages from './RenderMessages';
import gql from 'graphql-tag';
import '../App.css';

const subscribeToNewMessages = gql`
  subscription {
    message(order_by: { id: desc }, limit: 1) {
      id
      username
      text
      timestamp
    }
  }
`;

const emitOnlineEvent = gql`
  mutation($userId: Int!) {
    update_user(_set: { last_seen: "now()" }, where: { id: { _eq: $userId } }) {
      affected_rows
    }
  }
`;

function Chat(props) {
  const [username, setUsername] = useState(props.username);
  const [refetch, setRefetch] = useState(null);

  return (
    <div>
      <Subscription subscription={subscribeToNewMessages}>
        {({ data, error, loading }) => {
          if (error || (data && data.message === null)) {
            console.error(error || `Unexpected response: ${data}`);
            return 'Error';
          }
          console.log('Subscription', data);
          if (refetch) {
            refetch();
            console.log('refetch', refetch);
          }
          return null;
        }}
      </Subscription>
      <RenderMessages refetch={refetch} setRefetch={setRefetch} />
    </div>
  );
}

export default Chat;
