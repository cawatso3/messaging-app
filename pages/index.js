import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID, messagesByChannelId } from '../src/graphql/queries';

const Home = () => {
  // Placeholder function for handling changes to our chat bar
  const handleChange = () => {};
  
  // Placeholder function for handling the form submission
  const handleSubmit = () => {};

  const [messages, setMessages] = useState([]);

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
            value={''}
          />
        </form>
      </div>
    </div>
  );
};
export default Home