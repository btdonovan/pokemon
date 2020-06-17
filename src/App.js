import React, { Component, useContext } from 'react';


// As a user I want to click on a
//  “View similar types” button for a 
//  specific pokemon and I will see a 
//  list of other pokemon with the same 
//  type.

// Put button in PokemonDetail
// on click we need to go to a list view similar to view all
// except the url https://pokeapi.co/api/v2/type/{id or name}/

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
  let primaryType = context.state.currentPokemon.types[0].type.name
  let primaryAbility = context.state.currentPokemon.abilities[0].ability.name
  return (
    <React.Fragment>
      My Pokemon Details<br />
      Name: {context.state.currentPokemon.name}<br />
      Primary Type: {primaryType}<br />
      Primary Ability: {primaryAbility}<br />
      <button name={primaryType} onClick={context.loadAllSimilarTypes}>Find Similar Types</button>
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
            <input type="submit" value="Search" />
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
    await this.setState({currentPokemon: json})
  }

  // async componentDidMount() {
  //   this.doSearch(this.state.url)
  // }

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
        },
        loadAllSimilarTypes: (event) => {
          let url = 'https://pokeapi.co/api/v2/type/' + event.target.name
          this.setState({
            url: url,
          })
          this.doSearch(this.state.url)
        }
      }}>
        {this.props.children}
      </PokeContext.Provider>
    )
  }
}
//https://pokeapi.co/api/v2/type/{id or name}/
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