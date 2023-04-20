import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID, messagesByChannelId } from '../src/graphql/queries';

import '@aws-amplify/pubsub';
import { onCreateMessage } from '../src/graphql/subscriptions';

const Home = () => {
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);

  // Placeholder function for handling changes to our chat bar
  const handleChange = (event) => {
    setMessageBody(event.target.value);
    
  };
  
  // Placeholder function for handling the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
  
  //DELETE
  const input = {
    channelID: '1',
    author: 'Dave',
    body: messageBody.trim()
    
  };

  try {
    setMessageBody('');
    await API.graphql(graphqlOperation(createMessage, { input }))
  } catch (error) {
    console.warn(error);
  }


//DELETE ^
}


useEffect(() => {
  API
    .graphql(graphqlOperation(messagesByChannelID,{
      channelID: '1',
      sortDirection: 'ASC'
    }))
    .then((response) => {
      const items = response.data?.messagesByChannelID?.items;
      
      if (items) {
        setMessages(items);
      }
    });
}, []);

useEffect(() => {
  const subscription = API
    .graphql(graphqlOperation(onCreateMessage))
    .subscribe({
      next: (event) => {
        setMessages([...messages, event.value.data.onCreateMessage]);
      }
    });
  
  return () => {
    subscription.unsubscribe();
  };
}, [messages]);
  
  return (
    <div className="container">
      <div className="messages">
        <div className="messages-scroller">
        {messages.map((message) => (
  <div
    key={message.id}
    className={message.author === 'Dave' ? 'message me' : 'message'}>{message.body}</div>
))}
        </div>
      </div>
      <div className="chat-bar">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="messageBody"
            placeholder="Type your message here"
            onChange={handleChange}
            value={messageBody}
          />
        </form>
      </div>
    </div>
  );
};
export default Home