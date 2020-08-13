import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import '../App.js';

const fetchMessages = gql`
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

export default function RenderMessages(props) {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState();
  const [refetchState, setRefetch] = useState();
  const [bottom, setBottom] = useState();

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

  // add message to state when text is entered
  const mutationCallback = (message) => {
    const messagesArr = [...messages, ...newMessages];
    messagesArr.push(message);
    setMessages(messages);
    setNewMessages([]);
  };

  // custom refetch to be passed to parent for refetching on event occurance
  const refetchData = async () => {
    console.log('hier');
    if (!loading) {
      const resp = await refetchState(getLastReceivedVars());
      if (resp.data) {
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

  if (!props.refetch && refetchState) {
    props.setRefetch(() => refetchData);
  }

  return (
    <div id="chatbox">
      <Query query={fetchMessages} variables={getLastReceivedVars()}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return null;
          }
          if (error) {
            return 'Error: ' + error;
          }
          // set refetch in local state to make a custom refetch
          if (!refetchState) {
            console.log('setRefetchState');
            setRefetch(() => refetch);
          }
          const receivedMessages = data.message;
          console.log('Query received Messages', data.message);
          console.log('Query received Messages', getLastReceivedVars());

          // load all messages to state in the beginning
          if (receivedMessages.length !== 0) {
            if (messages.length === 0) {
              addOldMessages(receivedMessages);
            }
          }

          // return null; real rendering happens below
          return null;
        }}
      </Query>
      <ul>
        {messages.map((m) => {
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
}
