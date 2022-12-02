
import { FontLoader, TextGeometry } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

function startGame() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);


	camera.position.z = -10;
	camera.position.y = 2;
	camera.lookAt(scene.position);
	camera.position.y += 1;


	var lastScene = scene;

	function render(scene) {
		lastScene = scene;
		renderer.render(scene, camera);
	}


	var loader = new THREE.ObjectLoader();
	async function loadScene(nameScene) {
		var jo = await fetch("scenes/scene_1_portes.json");
		if (jo.ok) {
			var jj = await jo.json();
			const newScene = loader.parse(jj);


			render(newScene);
		}
	}

	function loadObj(objName) {
		loader.load(objName, function (obj) {
			lastScene.add(obj);
			render(lastScene);
		});
	}



	loadScene('./assets/scenes/scene_1_portes.json');




	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

	function onPointerMove(event) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

		hoverPorte();
	}
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('click', clickObj);

	var colorToReset = []
	var currentPorte = null;
	function hoverPorte() {
		raycaster.setFromCamera(pointer, camera);

		const intersects = raycaster.intersectObjects(lastScene.children);
		for (const color of colorToReset) {//resete color
			color.set(0x000000);
		}
		colorToReset = []
		currentPorte = null;
		for (const obj of intersects) {
			if (obj.object && obj.object.geometry && obj.object.geometry.name) {
				currentPorte = obj;//for click porte
				colorToReset.push(obj.object.material.color);
				obj.object.material.color.set(0xffffff);
			}
		}

		renderer.render(lastScene, camera);
	}
	function clickObj() {
		if (currentPorte != null) {
			console.log(currentPorte.object.geometry.name);
		}
	}


	// const loaderFont = new THREE.FontLoader();
	// const text = "Hello World"
	// loaderFont.load('/fonts/Open_Sans_Bold.json', function (font: THREE.Font) {
	// 	const geometry = new THREE.TextGeometry(text);
	// });f


	const loaderFont = new FontLoader();
	const text = "Hello World"
	loaderFont.load('/font/roboto_regular.json', function (font) {
		const geometry = new TextGeometry(text, {
			font: font,
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelOffset: 0,
			bevelSegments: 5
		});
	});

}


startGame()