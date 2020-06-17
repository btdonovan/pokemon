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

function PokemonDetail() {

  const context = useContext(PokeContext);
  console.log(context.state.currentPokemon)
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
  
  async doSearch() {
    const response = await fetch(this.state.url)
    const json = await response.json()
    this.setState({currentPokemon: json})
  }

  async componentDidMount() {
    this.doSearch()
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
          this.doSearch()
          event.preventDefault()
          this.render()
        },
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
      </div>
    </MyProvider>
  );
}


export default App;