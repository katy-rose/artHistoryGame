import React, { useState, useEffect } from 'react';
import './GamePlay.css'
import {listOfNames} from './ArtistNames'

const GamePlay = props => {
    var artists = [];
    var artistOptions = [];
    const [artWorks, setArtWorks] = useState(props.art);
    const [count, setCount] = useState(0);
    const [listOfArtists, setListOfArtists] = useState([]);

    const nextImage = () => {
        setCount(count + 1);
    }

    //Get random artist names
    useEffect(() => {
        console.log("use effect going for artists")
        var randNum, i;
        for (i = 0; i < 3; i++) {
            randNum = Math.floor(Math.random() * 207);
            artists[i] = listOfNames[randNum];
            //console.log(artists[i].name);
        }

        artists[3] = { name: artWorks[count].artistDisplayName, isCorrect: true };
        // for (i = 0; i < 4; i++){
        //     console.log(artists[i].name);
        // }
        //Randomize artist names in array
        for (let i = artists.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = artists[i]
            artists[i] = artists[j]
            artists[j] = temp
          }

        setListOfArtists(artists);
        
        
    },[count]);

    return (
        <div>
            <img className='artImage' src={artWorks[count].primaryImage} alt="artwork" />
            <ul>{listOfArtists.map(artist => <li>{artist.name}</li>)}</ul>
            {/* <h3>{listOfNames[0].name}</h3>
            <h3>{listOfNames[1].name}</h3>
            <h3>{listOfNames[45].name}</h3> */}
            <button onClick={nextImage}>Next</button>
        </div>
    );
}

export default GamePlay;