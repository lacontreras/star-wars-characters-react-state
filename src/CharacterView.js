import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import endpoint from './endpoint';

const CharacterView = () => {
  const params = useParams();
  const [character, setCharacter] = useState({});
  useEffect(() => {
    fetch(endpoint + '/characters/' + params.id)
      .then((response) => response.json())
      .then((response) => setCharacter(response.character));
  }, [params.id]);
  console.log(character);
  return (
    <section className="CharacterView">
      <h2>{character.name}</h2>
      <ul className="CharacterDetails">
        <li>
          <strong>Birth Year</strong>: {character.birthYear}
        </li>
        <li>
          <strong>Eye Color</strong>: {character.eyeColor}
        </li>
        <li>
          <strong>Gender</strong>: {character.gender}
        </li>
        <li>
          <strong>Hair Color</strong>: {character.hairColor}
        </li>
        <li>
          <strong>Heigh</strong>: {character.height}
        </li>
        <li>
          <strong>Mass</strong>: {character.mass}
        </li>
        <li>
          <strong>Skin Color</strong>: {character.skinColor}
        </li>
      </ul>
    </section>
  );
};

export default CharacterView;
