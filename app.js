'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// constants
const RESPONSE_BLOCK_LENGTH = 400;
const AVAILABLE_CHARACTERS = 'R8UFPKDJ2C0QVBSA3ZH6W95Y4TMO7EING1LX'; // shuffled alphanum
const code = (process.env.CODE || '').split('');
const randomCharacterLength = RESPONSE_BLOCK_LENGTH - code.length;

// helpers
const getAllIndexes = (arr, val) => {
    const indexes = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indexes.push(i);
        }
    }
    return indexes;
}

const getRandomCharacter = () => {
	const index = Math.floor(AVAILABLE_CHARACTERS.length * Math.random());
	return AVAILABLE_CHARACTERS[index];
}

const shuffle = (array) => {
	const arrayClone = array.slice();
	for(let i = array.length - 1; i > 0; i--){
	  const j = Math.floor(Math.random() * i)
	  const temp = arrayClone[i]
	  arrayClone[i] = arrayClone[j]
	  arrayClone[j] = temp
	}
	return arrayClone;
}

// app
app.use(cors());
app.use((req, res, next) => {
  if (req.xhr) {
    next()
  } else {
    res.status(400).end('400 Bad Request')
  }
});
app.set('title', 'Season One Episode 3');

app.get('/', (req, res) => {
	const shuffledCodeIndices = [];
	// take code
	// shuffle it into blank spots
	let blankResponseShuffled = shuffle(shuffle([...Array(randomCharacterLength)].concat(code)));
	// for each letter in code
	code.forEach((character) => {
		const characterIndices = getAllIndexes(blankResponseShuffled, character);
		// store index within shuffled blank spots
		for (let i = 0; i < characterIndices.length; i++) {
			if (!shuffledCodeIndices.includes(characterIndices[i])) {
				shuffledCodeIndices.push(characterIndices[i]);
				break;
			}
		}
	});
	// fill blank spots with random available characters
	blankResponseShuffled = blankResponseShuffled.map((character) => {
		if (character) {
			return character;
		}
		return getRandomCharacter();
	}).join('');
	const data = `${shuffledCodeIndices.join('|')}|${blankResponseShuffled}`;
	res.status(200).json({ data }).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log('Press Ctrl+C to quit.');
});

module.exports = app;