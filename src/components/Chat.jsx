import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Messages from './Messages';
import ChatInput from './ChatInput';

const GET_MESSAGES = gql`
  query($last_received_id: Int, $last_received_ts: timestamptz) {
    message(
      order_by: { timestamp: asc }
      where: {
        _and: {
          id: { _neq: $last_received_id }
          timestamp: { _gte: $last_received_ts }
        }
      }
    ) {
      id
      text
      username
      timestamp
    }
  }
`;

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState();
  const [refetchState, setRefetch] = useState();
  const [bottom, setBottom] = useState();

  useEffect(() => {
    console.log('component Chat did mount');

    return function cleanup() {
      console.log('component Chat did unmount');
    };
  }, []);

  // get appropriate query variables
  const getLastReceivedVars = () => {
    if (newMessages.length === 0) {
      if (messages.length !== 0) {
        return {
          last_received_id: messages[messages.length - 1].id,
          last_received_ts: messages[messages.length - 1].timestamp,
        };
      } else {
        return {
          last_received_id: -1,
          last_received_ts: '2018-08-21T19:58:46.987552+00:00',
        };
      }
    } else {
      return {
        last_received_id: newMessages[newMessages.length - 1].id,
        last_received_ts: newMessages[newMessages.length - 1].timestamp,
      };
    }
  };
  // add new (unread) messages to state
  const addNewMessages = (messages) => {
    const newMessagesArr = [...newMessages];
    messages.forEach((m) => {
      // do not add new messages from self
      if (m.username !== this.props.username) {
        newMessagesArr.push(m);
      }
    });
    setNewMessages(newMessagesArr);
  };

  // add old (read) messages to state
  const addOldMessages = (msgs) => {
    const oldMessages = [...messages, ...msgs];
    setMessages(oldMessages);
    setNewMessages([]);
  };

  const refetchData = async () => {
    console.log('hier');
    if (!loading && refetchState) {
      const resp = await refetchState(getLastReceivedVars());
      if (resp.data) {
        console.log('resp.data', resp.data);
        if (!isViewScrollable()) {
          console.log('is not scrollable');
          addOldMessages(resp.data.message);
        } else {
          if (this.state.bottom) {
            console.log('this.state.bottom');
            addOldMessages(resp.data.message);
          } else {
            console.log('!this.state.bottom');
            addNewMessages(resp.data.message);
          }
        }
      }
    }
  };

  // check if the view is scrollable
  const isViewScrollable = () => {
    const isInViewport = (elem) => {
      const bounding = elem.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    if (document.getElementById('lastMessage')) {
      return !isInViewport(document.getElementById('lastMessage'));
    }
    return false;
  };

  return (
    <React.Fragment>
      <Query query={GET_MESSAGES} variables={getLastReceivedVars()}>
        {({ data, loading, subscribeToMore, refetch }) => {
          if (!data) {
            return null;
          }

          if (loading) {
            return <span>Loading ...</span>;
          }

          if (!refetchState) {
            console.log('setRefetchState');
            setRefetch(() => refetch);
          }

          console.log('Query received Messages', data.message);
          console.log('Query received Messages', getLastReceivedVars());

          // load all messages to state in the beginning
          if (data.message.length !== 0) {
            if (messages.length === 0) {
              addOldMessages(data.message);
            }
          }

          return (
            <React.Fragment>
              <Messages
                messages={messages}
                subscribeToMore={subscribeToMore}
                refetch={refetchData}
                client={props.client}
              />
              <ChatInput username={'yoman'} userId={3} />
            </React.Fragment>
          );
        }}
      </Query>
    </React.Fragment>
  );
};

export default Chat;
