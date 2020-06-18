import React from 'react';
import './App.css';
import Message from './message'

function Detail(props) {
  if (!props.view) {
    return (null)
  }
  return (
    <div>
      <p>Name: {props.pokemon.name}</p>
      <p>Primary Type: {props.pokemon.type}</p>
      <img src={props.pokemon.pictureUrl} alt={props.pokemon.name} /><br />
      <button 
        type='button' 
        name={props.pokemon.type}
        onClick={props.handleGetSimilar}
        value="View Same Type">view same type</button>
      <button 
        type='button' 
        name={props.pokemon.name}
        onClick={props.addToCollection}
        value="collect">Add to Collection</button>
        
      <Message viewMessage={props.viewMessage} name={props.pokemon.name} />
    </div>
  )
}

export default Detail;