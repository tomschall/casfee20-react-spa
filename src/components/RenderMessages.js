import React from 'react';
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

export default class RenderMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      newMessages: [],
      error: null,
    };
  }

  // get appropriate query variables
  getLastReceivedVars = () => {
    const { messages, newMessages } = this.state;
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
  addNewMessages = (messages) => {
    const newMessages = [...this.state.newMessages];
    messages.forEach((m) => {
      // do not add new messages from self
      if (m.username !== this.props.username) {
        newMessages.push(m);
      }
    });
    this.setState({
      newMessages,
    });
  };

  // add old (read) messages to state
  addOldMessages = (messages) => {
    const oldMessages = [...this.state.messages, ...messages];
    this.setState({
      messages: oldMessages,
      newMessages: [],
    });
  };

  // add message to state when text is entered
  mutationCallback = (message) => {
    const messages = [...this.state.messages, ...this.state.newMessages];
    messages.push(message);
    this.setState({
      messages,
      newMessages: [],
    });
  };

  // custom refetch to be passed to parent for refetching on event occurance
  refetch = async () => {
    console.log('hier');
    if (!this.state.loading) {
      const resp = await this.state.refetch(this.getLastReceivedVars());
      if (resp.data) {
        if (!this.isViewScrollable()) {
          this.addOldMessages(resp.data.message);
        } else {
          if (this.state.bottom) {
            this.addOldMessages(resp.data.message);
          } else {
            this.addNewMessages(resp.data.message);
          }
        }
      }
    }
  };

  // check if the view is scrollable
  isViewScrollable = () => {
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

  render() {
    const { messages, newMessages, bottom } = this.state;
    // set refetch in parent component for refetching data whenever an event occurs
    if (!this.props.refetch && this.state.refetch) {
      console.log('RenderMessages setRefetch', this.props.setRefetch);
      this.props.setRefetch({ refetch: this.refetch });
    }
    return (
      <div id="chatbox">
        <Query query={fetchMessages} variables={this.getLastReceivedVars()}>
          {({ data, loading, error, refetch }) => {
            if (loading) {
              return null;
            }
            if (error) {
              return 'Error: ' + error;
            }
            // set refetch in local state to make a custom refetch
            if (!this.state.refetch) {
              this.setState({
                refetch,
              });
            }
            const receivedMessages = data.message;

            // load all messages to state in the beginning
            if (receivedMessages.length !== 0) {
              if (messages.length === 0) {
                this.addOldMessages(receivedMessages);
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
}
