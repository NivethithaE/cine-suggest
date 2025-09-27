import React from 'react';
import SearchBar from '../components/searchbar';
import HomePage from './Homepage';
import ExplorePage from './Explorepage';


export default function Home() {
  return (
    <div className="home">
      <SearchBar />
      <HomePage/>
      <ExplorePage/>
    </div>
  );
}
