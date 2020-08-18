import React from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const ONLINE_USERS = gql`
  subscription {
    user_online(order_by: { username: asc }) {
      id
      username
    }
  }
`;

const OnlineUsers = (props) => {
  const subscriptionData = () => (
    <Subscription subscription={ONLINE_USERS}>
      {({ data, error, loading }) => {
        if (loading) {
          return null;
        }
        if (error) {
          return 'Error loading online users';
        }
        return (
          <div>
            <p>
              Online Users ({!data.user_online ? 0 : data.user_online.length})
            </p>
            <ul>
              {data.user_online.map((u) => {
                return <li key={u.id}>{u.username}</li>;
              })}
            </ul>
          </div>
        );
      }}
    </Subscription>
  );

  return (
    <div>
      <div>{subscriptionData()}</div>
    </div>
  );
};

export default OnlineUsers;
