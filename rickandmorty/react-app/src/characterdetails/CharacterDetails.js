import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CharacterDetails = ({ characters }) => {
  const [character, setCharacter] = useState(null);
  const { id } = useParams();
// veri çekme kısmı
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/characters');
        const data = await response.json();
        const foundCharacter = data.characters.find(char => char.id === parseInt(id));
        setCharacter(foundCharacter);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!character) {
    return <div>Character not found!</div>;
  }
// karakteri yzdırma
  return (
    <div>
<div className="search-main">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              
            />
            <button className="btn-search custom-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div>
          </div>
        </div> 
        <div className='line' style={{ marginTop: '175px', borderBottom: '1px solid gray' }}></div>

        <div className='specialCharacter'> 
  <div className='sch-Image'>
  
    <img src={character.image} style={{ height: '504px', height: '441px' }} />
  </div>
  <div className='ch-Details' style={{ padding:'40px 40px'}}> 
    <h2 style={{ fontWeight: 600}}>{character.name}</h2>
    <span className='ch-Status-special'style={{ fontWeight: 600}}>
      {character.status === 'Alive' && <span className='ch-Icon-Alive'></span>}
      {character.status === 'Dead' && <span className='ch-Icon-Dead'></span>}
      {character.status === 'unknown' && <span className='ch-Icon-unknown'></span>}
      {character.status}-{character.species}
    </span>
    <div className='Lastknowlocation-special'style={{paddingTop:'10px' }}>
      Last know location:
      <div className='text-black'style={{ fontWeight: 600}}>
        {character.location}
      </div>
    </div>
    <div className='Firstseenin-special'style={{paddingTop:'10px' }}>
      First seen in:
      <div className='text-black' style={{ fontWeight: 600 }}>
        {character.firstSeenLocation}
      </div>
    </div>
  </div>
</div>
         <div className="footer-special"></div>
     </div>
  );
};

export default CharacterDetails;
