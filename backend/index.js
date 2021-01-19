const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;
var allArtworks = null;

// get 9 random artworks from entire list of artwork IDs
const getIDs = (allArtworks) => {
    var array = [];
    for (var i = 0; i < 9; i++) {
        const rand = Math.floor(Math.random() * Math.floor(allArtworks.length));
        array[i] = allArtworks[rand];
    }
    return array;
}

//Get details of artworks
const getArtDetails = (artIDs) => {
    return new Promise((resolve, reject) => {
        let promises = [];
        var artworks = [];

        for (i = 0; i < 9; i++) {
            promises.push(
                axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artIDs[i]}`)
                .then((response) => {
                    artworks.push(response.data);
                })
            )
        }

        Promise.all(promises).then(() => {
            console.log("inside promise " + artworks[8].objectID);
            resolve(artworks);
        })
    })
    
}

app.get('/getArtworks', (req, res) => {

    var objectArray = [];
    var artToSend = [];
    const url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&hasImages=true&departmentIds=11&q=European Paintings';
    //Get list of all artwork object IDs
    axios.get(url)
    .then((response) => {
        allArtworks = response.data.objectIDs;
        console.log("inside axios 1");
        objectArray = getIDs(allArtworks); //get 9 random artwork IDs
        getArtDetails(objectArray) //get details on 9 artworks and send to frontend
            .then((art) => {
                console.log("Art to send " + art[8].objectID);
                res.send(art);
            })
            .catch((error) => {
                console.log("Error fetching art details: " + error);
            })
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({error:"An error occurred"});
    });
});

app.listen(port, () => {
    console.log('API is up and running');
})