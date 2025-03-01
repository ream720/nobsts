import './App.css';
import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import styled from '@emotion/styled';

import { Button } from '@mui/material';


const PokemonRow = ({ pokemon, onSelect }) => (
  <tr>
    <td>{pokemon.name.english}</td>
    <td>{pokemon.type.join(', ')}</td>
    <td> <Button variant='contained' onClick={() => onSelect(pokemon)}>Select</Button> </td>
  </tr>
);

PokemonRow.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.shape({ english: PropTypes.string, }),
    type: PropTypes.arrayOf(PropTypes.string),
  }),
  onSelect: PropTypes.func,
};

const PokemonInfo = ({name, base }) => (
  <div>
    <h1>{name.english}</h1>
    <table>
      { Object.keys(base).map(key => (
        <tbody>
          <tr key={`${key.HP}_${name.english}`}>
            <td>{key}</td>
            <td>{base[key]}</td>
          </tr>
        </tbody>
      ))}
    </table>
  </div>
);

PokemonInfo.propTypes = {
  name: PropTypes.shape({ english: PropTypes.string, }),
  base: PropTypes.shape({ 
    HP: PropTypes.number.isRequired, 
    Attack: PropTypes.number.isRequired, 
    Defense: PropTypes.number.isRequired, 
    "Sp. Attack": PropTypes.number.isRequired, 
    "Sp. Defense": PropTypes.number.isRequired, 
    Speed: PropTypes.number.isRequired, }),
};

const Title = styled.h1`text-align: center;`;
const Container = styled.div`        
        margin: auto;
        width: 800px;
        paddingTop: 1rem;`;
const TwoColGridLayout = styled.div`
          display: grid;
          grid-template-columns: 60% 40%;
          grid-columnGap: 1rem;
        `;
const Input = styled.input`        
        width: 100%;
        font-size: x-large;
        padding: 0.2rem;
        `;


function App() {
  const [filter, filterSet] = useState("");
  const [selectedItem, selectedItemSet] = useState(null);
  const [ pokemon, pokemonSet ] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/nobsts/pokemondata.json")
    .then(response => response.json()).then(data => pokemonSet(data));
  }, []);

  return (
    <Container>
      <Title>Pokemon Search</Title>
      <TwoColGridLayout>
        <div>
          <div className='searchbox'>
            <Input
              value={filter}
              onChange={
                (event) => filterSet(event.target.value)
              }
            />
          </div>
          <table width={"100%"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.filter((pokemon) =>
                pokemon.name.english.toLowerCase().includes(filter.toLowerCase()))
                .slice(0, 20).map((pokemons) => (
                  <PokemonRow pokemon={pokemons} key={pokemons.id} onSelect={(pokemon) => selectedItemSet(pokemons)} />
                ))}
            </tbody>
          </table>
        </div>
        {selectedItem && (
          <PokemonInfo {...selectedItem} />
        )}
      </TwoColGridLayout>     
    </Container>
  );
}

export default App;
