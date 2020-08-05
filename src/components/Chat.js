import React from 'react';
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

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      refetch: null,
    };
  }

  setRefetch = (refetch) => {
    this.setState({
      refetch,
    });
    console.log('set state refetch!!');
  };

  render() {
    const { refetch, username } = this.state;
    return (
      <div>
        <Subscription subscription={subscribeToNewMessages}>
          {({ data, error, loading }) => {
            if (error || (data && data.message === null)) {
              console.error(error || `Unexpected response: ${data}`);
              return 'Error';
            }
            if (refetch) {
              refetch();
              console.log('refetch');
            }
            return null;
          }}
        </Subscription>
        <RenderMessages
          refetch={this.state.refetch}
          setRefetch={this.setRefetch}
        />
      </div>
    );
  }
}

export default Chat;
