import {startGame} from './scene.js';

document.getElementById("game").addEventListener("click", async (ev) => {
	let body = document.querySelector("body")
	var child = body.lastElementChild;
	while (child) {
		body.removeChild(child);
		child = body.lastElementChild;
	}


	startGame();
})