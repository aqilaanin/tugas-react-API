import React, { useState, useEffect } from 'react';
import './App.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Ambil daftar Pokémon dengan limit 10
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await response.json();
        
        // Ambil detail tambahan untuk tiap Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            const detailsData = await detailsResponse.json();
            return {
              name: pokemon.name,
              image: detailsData.sprites.front_default,
              height: detailsData.height,
              weight: detailsData.weight,
              abilities: detailsData.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', '),
            };
          })
        );
        
        setPokemons(pokemonDetails);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="pokemon-container">
      <h1>Pokémon List</h1>
      <ul className="pokemon-list">
        {pokemons.map((pokemon, index) => (
          <li key={index} className="pokemon-item">
            <h2>{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} />
            <p><strong>Height:</strong> {pokemon.height}</p>
            <p><strong>Weight:</strong> {pokemon.weight}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <PokemonList />
    </div>
  );
};

export default App;
