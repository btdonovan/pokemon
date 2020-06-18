import React from 'react';
import './App.css';

// Todo:
// Add collection sidebar that shows pokemon in our collection

function Search(props) {
  return (
    <React.Fragment>
      <form onSubmit={ props.handleSubmit }>
          <input type="text" name="name" onChange={ props.handleChange } placeholder="Search for a Pokemon"/>
          <input type="submit" name="search" value="Search" />
          <input type="button" name="viewall" value="View All" onClick={props.handleViewAll}/>
          <input type="button" name="viewCollection" value="View Collection" onClick={props.handleViewCollection}/>

      </form>
    </React.Fragment>
  )
}

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

function Message(props) {
  if (!props.viewMessage) {
    return null;
  }
  return (
    <p>{props.name} has been added to your collection.</p>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myCollection: [],
      search: '',
      viewPokemon: false,
      viewAll: false,
      viewMessage: false,
      url: '',
      pokeList: [],
      pokemon: {
        name: '',
        types: '',
        id: '',
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/200px-ProhibitionSign2.svg.png'
      }
    }
    this.handleChange = this.handleChange.bind(this); // Not super sure what is happening here yet
    this.handleSubmit = this.handleSubmit.bind(this); // same
    this.handleViewAll = this.handleViewAll.bind(this); // Still don't know what this does.
    this.handleGetDetail = this.handleGetDetail.bind(this);
    this.handleGetSimilar = this.handleGetSimilar.bind(this);
    this.addToCollection = this.addToCollection.bind(this);
    this.handleViewCollection = this.handleViewCollection.bind(this);
  }

  async addToCollection(){
    let newPokemon = {name: this.state.pokemon.name, url:'https://pokeapi.co/api/v2/pokemon/' + this.state.pokemon.id}
    await this.setState({
      myCollection: [...this.state.myCollection, newPokemon],
      viewMessage: true
    })
    console.log(this.state.myCollection)
  }

  handleChange(event) {
    let searchTerm = event.target.value
    let newUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    this.setState({
      search: searchTerm,
      url: newUrl.toLowerCase(),
    })
  }

  async handleGetDetail(event) {
    let searchTerm = event.target.name
    let newUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    await this.setState({
      search: searchTerm,
      url: newUrl,
      viewAll: false,
      viewPokemon: false,
      viewMessage: false,
    })
    
    await fetch(this.state.url)
      .then((response) => response.json())
      .then((json) => {this.setState({found: json})})
    
    this.setState({
      pokemon: {
        name: this.state.found.name,
        type: this.state.found.types[0].type.name,
        id: this.state.found.id,
        pictureUrl: this.state.found.sprites.front_default
      },
      viewPokemon: true,
      found: '',
    })
  }

  async handleSubmit(event) {
    this.setState({
      viewAll: false,
      viewPokemon: false,
      viewMessage: false,
    })
    event.preventDefault()
    await fetch(this.state.url)
      .then((response) => response.json())
      .then((json) => {this.setState({found: json})})
    this.setState({
      pokemon: {
        name: this.state.found.name,
        type: this.state.found.types[0].type.name,
        id: this.state.found.id,
        pictureUrl: this.state.found.sprites.front_default
      },
      viewPokemon: true,
      found: '',
    })
  }

  handleViewCollection(){
    this.setState({
      viewAll: true,
      viewPokemon: false,
      viewMessage: false,
      pokeList: this.state.myCollection
    })

  }

  async handleViewAll(event) {
    this.setState({
      viewAll: false,
      viewPokemon: false,
      viewMessage: false,
    })
    event.preventDefault()
    await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000')
      .then((response)=> response.json())
      .then((json) => {this.setState({found: json.results})})
    this.setState({
      pokeList: this.state.found,
      viewAll: true,
      found: '',
    })
  }

  async handleGetSimilar(event) {
    let newUrl = `https://pokeapi.co/api/v2/type/${event.target.name}`
    
    await this.setState({
      url: newUrl,
      viewAll: false,
      viewPokemon: false,
    })
    await fetch(this.state.url)
      .then((response) => response.json())
      .then((json) => json.pokemon)
      .then((pokemon) => pokemon.map(element => element.pokemon))
      .then((types) => {this.setState({found: types})})
    this.setState({
      pokeList: this.state.found,
      viewAll: true,
      found: '',
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Our Pokemon App</h1>
        <Search 
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleViewAll={this.handleViewAll}
          handleViewCollection={this.handleViewCollection}
        />
        <Detail 
          pokemon={this.state.pokemon} 
          view={this.state.viewPokemon}
          viewMessage={this.state.viewMessage}
          handleGetSimilar={this.handleGetSimilar} 
          addToCollection={this.addToCollection}
        />
        <ViewAll 
          view={this.state.viewAll} 
          pokelist={this.state.pokeList}
          handleGetDetail={this.handleGetDetail}
        />
      </div>
    );
  }
}

export default App;
