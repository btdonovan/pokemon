import React from 'react';
import './App.css';
import DisplayPokemonItems from './displayPokemonItems'

function ViewAll(props) {
  if (!props.view) {
    return (null)
  }
  let sequence = 0
  return (
    <div>{props.pokelist.map(element => {
      sequence++
      return (
        <DisplayPokemonItems 
          key={sequence} 
          handleGetDetail={props.handleGetDetail} 
          name={element.name} 
          id={element.url.split('/')[6]}/>)}
      )}
    </div>
  )
}

export default ViewAll;