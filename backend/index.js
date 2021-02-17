const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;
var allArtworks = null;

/*
// get 9 random artworks from entire list of artwork IDs returned from API
const getIDs = (allArtworks) => {
    var array = [];
    for (var i = 0; i < 9; i++) {
        let rand = Math.floor(Math.random() * Math.floor(allArtworks.length));
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

const validateData = (artworks) => {
    var dataIsGood = false;
    while (!dataIsGood) {
        for (let i = 0; i < 9; i++) {
            if (artworks.isHighlight == false || artworks.hasImage == false || artworks.artistDisplayName == null) {
                let rand = Math.floor(Math.random() * Math.floor(allArtworks.length));

            }
        }
    }
}
*/

const axiosCallforDetails = (artID) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artID}`)
        .then(response => {
            let art = response.data;
            console.log("successfully got details in axios call");
            resolve(art);
        })
        .catch(error => {
            let art = "An error getting art details occurred.";
            reject(art);
        });
    })
    
}

async function getArtDetails(allArtworks) {
    let rand = Math.floor(Math.random() * Math.floor(allArtworks.length));
    let artId = allArtworks[rand];
    let artPiece = await axiosCallforDetails(artId);
    console.log("After axiosCallforDetails");
    console.log(artPiece.isHighlight + " " + artPiece.primaryImage + " " + artPiece.artistDisplayName);
    let dataIsGood = false;
    while (!dataIsGood) {
        dataIsGood = true;
        if (artPiece.primaryImage === undefined || artPiece.primaryImage === "" ||
            artPiece.artistDisplayName === undefined) {
            artPiece = await axiosCallforDetails(artPiece.objectID);
            console.log("Bad data fixed after 2nd+ axios call");
            dataIsGood = false;
        }
    }

    return artPiece;
}

app.get('/getArtworks', (req, res) => {

    var objectArray = [];
    var artToSend = [];
    let promises = [];
    const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11';
    //Get list of all artwork object IDs
    axios.get(url)
    .then((response) => {
        allArtworks = response.data.objectIDs;
        console.log("inside axios 1");
        for (let i = 0; i < 9; i++) {
            console.log("for loop " + i);
            artToSend[i] = getArtDetails(allArtworks);
        }
        res.send(artToSend);
        /*
        objectArray = getIDs(allArtworks); //get 9 random artwork IDs
        getArtDetails(objectArray) //get details on 9 artworks and send to frontend
            .then((art) => {
                console.log("Art to send " + art[8].objectID);
                res.send(art);
            })
            .catch((error) => {
                console.log("Error fetching art details: " + error);
            }) 
        */
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({error:"An error occurred"});
    });
});

app.listen(port, () => {
    console.log('API is up and running');
})