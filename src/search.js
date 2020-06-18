import React from 'react';
import './App.css';

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

export default Search