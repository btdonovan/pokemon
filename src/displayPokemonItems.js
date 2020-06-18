import React from 'react';
import './App.css';

function DisplayPokemonItems(props) {
  return (
    <div className='pokethumb'>
      <img 
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`} 
        alt={'X'}
        name={props.name}
        onClick={props.handleGetDetail}
        />
      <div>{props.name}</div>
    </div>
  )
}

export default DisplayPokemonItems;