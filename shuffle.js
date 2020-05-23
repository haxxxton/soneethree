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

module.exports = shuffle;