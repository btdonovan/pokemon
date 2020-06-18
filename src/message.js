import React from 'react';
import './App.css';

function Message(props) {
  if (!props.viewMessage) {
    return null;
  }
  return (
    <p>{props.name} has been added to your collection.</p>
  )
}

export default Message