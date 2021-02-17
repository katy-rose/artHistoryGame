import React, { useState, useEffect } from 'react';
import GamePlay from './GamePlay'
import axios from 'axios';

function Home() {
    const [artWorks, setArtWorks] = useState([]);
    const [loadComponent, setLoadComponent] = useState(false);

    useEffect(() => {
        console.log("use effect running");
        axios.get('/getArtworks')
        .then(res => {
            setArtWorks(res.data);
            setLoadComponent(true);
        });
    },[]);
    
    return(
        <div>
            <h1>Art History Game</h1>
            {loadComponent ? (
                (< GamePlay art={artWorks} />)
            ) : (<div></div>)
            }                      
        </div>
    );
}

export default Home;