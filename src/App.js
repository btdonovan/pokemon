import React, { Component, useContext } from 'react';

const PokeContext = React.createContext();

function PokemonURL() {
  const context = useContext(PokeContext);
  return (
    <React.Fragment>
      <h3>
        My Pokemon URL:
      </h3>
      <p>
        {context.state.url}
      </p>
    </React.Fragment>
  );
}
function PokemonList() {
  const context = useContext(PokeContext);
  if (!context.state.currentPokemon.results) {
    return null;
  }
  let allPokemon = context.state.currentPokemon.results
  return (
    <div>{allPokemon.map(element => <DisplayPokemonItems name={element.name} id={element.url.split('/')[6]}/>)}</div>
  )
}
function DisplayPokemonItems(props) {
  const context = useContext(PokeContext);
  return (
    
    <div>
      <img 
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`} 
        alt={props.name + ' image not found'}
        name={props.name}
        onClick={ context.loadFromViewAll } />
      <div>{props.name}</div>
    </div>
  )
}


function PokemonDetail() {

  const context = useContext(PokeContext);
  if (!context.state.currentPokemon.types) {
    return null;
  }
  if (!context.state.currentPokemon.abilities) {
    return null;
  }
  return (
    <React.Fragment>
      My Pokemon Details<br />
      Name: {context.state.currentPokemon.name}<br />
      Primary Type: {context.state.currentPokemon.types[0].type.name}<br />
      Primary Ability: {context.state.currentPokemon.abilities[0].ability.name}
    </React.Fragment>
  )
}    /* //data.types[0].type.name */


function NewPokemon() {
  const context = useContext(PokeContext);  
  return (
    <React.Fragment>
        <form onSubmit={ context.handleSubmit }>
            <label>
                New pokemon:
                <input type="text" name="name" onChange={ context.handleChange }/>
            </label>
            <input type="submit" value="Submit"/>
            <input type="button" value="View All" onClick={ context.handleViewAll } />
        </form>
    </React.Fragment>
  );
}

class MyProvider extends Component {
  state = {
    pokemon: {
      name: ''
    },
    currentPokemon: [],
    url: ''
  }
  
  async doSearch(url) {
    const response = await fetch(url)
    const json = await response.json()
    this.setState({currentPokemon: json})
  }

  async componentDidMount() {
    this.doSearch(this.state.url)
  }

  render() {
    return (
      <PokeContext.Provider value={{
        state: this.state,
        handleChange: (event) => {
          this.setState({
            pokemon: {
              name: event.target.value
            }
          })
        },
        handleSubmit: (event) => {
          this.setState({
            url: 'https://pokeapi.co/api/v2/pokemon/' + this.state.pokemon['name'],
            pokemon: {
              name: ''
            }
          })
          this.doSearch(this.state.url)
          event.preventDefault()
          this.render()
        },
        handleViewAll: (event) => {
          this.setState({
            url: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000',
            pokemon: {
              name: ''
            }
          })
          this.doSearch(this.state.url)
          event.preventDefault()
          this.render()
        },
        loadFromViewAll: (event) => {
          this.setState({
            url: 'https://pokeapi.co/api/v2/pokemon/' + event.target.name,
          })
          this.doSearch(this.state.url)
          this.render()
        }
      }}>
        {this.props.children}
      </PokeContext.Provider>
    )
  }
}

function App() {
  return (
    <MyProvider>
      <div className="App">
        <PokemonURL />
        <NewPokemon />
        <PokemonDetail />
        <PokemonList />
      </div>
    </MyProvider>
  );
}


export default App;