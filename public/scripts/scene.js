
import { FontLoader, TextGeometry } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

function backReturn(str) {
	let strFin = str;
	if (str.length >= 30) {
		strFin = str.substring(0, 30) + "\n" + str.substring(30);
	}
	if (str.length >= 60) {
		strFin += "\n" + str.substring(60);
	}
	return strFin;
}
async function startGame() {
	var dataQuestion;
	var currQuestion = 0;
	var jo = await fetch("reponse/reponse.json");
	if (jo.ok) {
		dataQuestion = await jo.json();
	}


	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);


	camera.position.z = -8;
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
		var jo = await fetch(nameScene);
		if (jo.ok) {
			var jj = await jo.json();
			const newScene = loader.parse(jj);


			render(newScene);
			reloadText()
		}
	}

	function loadObj(objName) {
		loader.load(objName, function (obj) {
			lastScene.add(obj);
			render(lastScene);
		});
	}



	loadScene('scenes/question.json');





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
			var rep;
			switch (currentPorte.object.geometry.name) {
				case "p_bleue":
					rep = dataQuestion[currQuestion].gauche.rep;
					break;
				case "p_verte":
					rep = dataQuestion[currQuestion].millieu.rep;
					break;
				case "p_rouge":
					rep = dataQuestion[currQuestion].droite.rep;
					break;

				default:
					break;
			}
			console.log(rep);
			if (rep) {
				currQuestion++;

				if (currQuestion >= dataQuestion.length) {
					console.log("wine");
					while (lastScene.children.length > 0) {
						lastScene.remove(lastScene.children[0]);
					}

					loadScene("scenes/win.json");
					camera.position.z -= 3;
					camera.position.y += 3;
					camera.position.x += 1;
					camera.rotation.x -= 0.5;
					camera.rotation.y += 0.5;
					texts = []
					reloadText();
				} else {
					let d = dataQuestion[currQuestion];

					setTexts(d.question, d.gauche.txt, d.millieu.txt, d.droite.txt);
					render(lastScene)
				}


			} else {
				alert("Faux!");
			}

		}
	}


	// const loaderFont = new THREE.FontLoader();
	// const text = "Hello World"
	// loaderFont.load('/fonts/Open_Sans_Bold.json', function (font: THREE.Font) {
	// 	const geometry = new THREE.TextGeometry(text);
	// });f

	const PI = 3.1415;
	const loaderFont = new FontLoader();
	var texts = [];




	function setTexts(question, gauche, milleu, droite) {
		for (const txt of texts) {
			lastScene.remove(txt);
		}



		addMillieu(milleu, 0, 6, 0, PI, false);//milleiu
		addGauche(gauche, 4, 4.5, -3.5, PI / 4 + PI, false);//gauche
		addDroite(droite, -1, 3.5, -6, 2.55 * PI, false);//sdroite

		addQuestion(question, 0, 0.30, -5.5, PI, true);//questoin
	}

	let d = dataQuestion[currQuestion];

	setTexts(d.question, d.gauche.txt, d.millieu.txt, d.droite.txt);




	function getCenterPoint(mesh) {
		var geometry = mesh.geometry;
		geometry.computeBoundingBox();
		var center = new THREE.Vector3();
		geometry.boundingBox.getCenter(center);

		mesh.localToWorld(center);
		return center;
	}

	function addText(str, x, y, z, rot, question) {
		loaderFont.load('/font/roboto_regular.json', function (font) {
			const textGeometry = new TextGeometry(backReturn(str.replaceAll(" ", "\r\r")), {
				font: font,
				size: 0.2,
				height: 0.001,
				bevelEnabled: true,
				bevelSize: 0.00001,
				bevelThickness: 0.01,

			});


			var textMesh = new THREE.Mesh(textGeometry, [
				new THREE.MeshPhongMaterial({ emissive: "blue" }), new THREE.MeshPhongMaterial({ emissive: "blue" })
			]);


			texts.push(textMesh);
			var center = getCenterPoint(textMesh);
			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			if (!question)
				textMesh.rotation.set(0, rot, 0);
			else
				textMesh.rotation.set(PI / 3, rot, 0);


			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			lastScene.add(textMesh);
			textMesh.position.set(x - center.x, y - center.y, z - center.z); // position text here x, y, z

			textMesh.castShadow = true; // object can cast shadows (default = false)
			textMesh.receiveShadow = true; // object can receive shadows (default= false)

			render(lastScene)
		});
	}
	function addMillieu(str, x, y, z, rot, question) {
		loaderFont.load('/font/roboto_regular.json', function (font) {
			const textGeometry = new TextGeometry(backReturn(str.replaceAll(" ", "\r\r")), {
				font: font,
				size: 0.35,
				height: 0.001,
				bevelEnabled: true,
				bevelSize: 0.01,
				bevelThickness: 0.01,

			});


			var textMesh = new THREE.Mesh(textGeometry, [
				new THREE.MeshPhongMaterial({ emissive: "yellow" }), new THREE.MeshPhongMaterial({ emissive: "yellow" })
			]);


			texts.push(textMesh);
			var center = getCenterPoint(textMesh);
			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			if (!question)
				textMesh.rotation.set(0, rot, 0);
			else
				textMesh.rotation.set(PI / 3, rot, 0);


			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			lastScene.add(textMesh);
			textMesh.position.set(x - center.x, y - center.y, z - center.z); // position text here x, y, z

			textMesh.castShadow = true; // object can cast shadows (default = false)
			textMesh.receiveShadow = true; // object can receive shadows (default= false)

			render(lastScene)
		});
	}
	function addGauche(str, x, y, z, rot, question) {
		loaderFont.load('/font/roboto_regular.json', function (font) {
			const textGeometry = new TextGeometry(backReturn(str.replaceAll(" ", "\r\r")), {
				font: font,
				size: 0.2,
				height: 0.001,
				bevelEnabled: true,
				bevelSize: 0.00001,
				bevelThickness: 0.05,

			});


			var textMesh = new THREE.Mesh(textGeometry, [
				new THREE.MeshPhongMaterial({ emissive: "blue" }), new THREE.MeshPhongMaterial({ emissive: "blue" })
			]);


			texts.push(textMesh);
			var center = getCenterPoint(textMesh);
			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			if (!question)
				textMesh.rotation.set(0, rot, 0);
			else
				textMesh.rotation.set(PI / 3, rot, 0);


			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			lastScene.add(textMesh);
			textMesh.position.set(x - center.x, y - center.y, z - center.z); // position text here x, y, z

			textMesh.castShadow = true; // object can cast shadows (default = false)
			textMesh.receiveShadow = true; // object can receive shadows (default= false)

			render(lastScene)
		});
	}
	function addDroite(str, x, y, z, rot, question) {
		loaderFont.load('/font/roboto_regular.json', function (font) {
			const textGeometry = new TextGeometry(backReturn(str.replaceAll(" ", "\r\r")), {
				font: font,
				size: 0.2,
				height: 0.01,
				bevelEnabled: true,
				bevelSize: 0.00001,
				bevelThickness: 0.01,

			});


			var textMesh = new THREE.Mesh(textGeometry, [
				new THREE.MeshPhongMaterial({ emissive: "white" }), new THREE.MeshPhongMaterial({ emissive: "white" })
			]);


			texts.push(textMesh);
			var center = getCenterPoint(textMesh);
			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			if (!question)
				textMesh.rotation.set(0, rot, 0);
			else
				textMesh.rotation.set(PI / 3, rot, 0);


			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			lastScene.add(textMesh);
			textMesh.position.set(x - center.x, y - center.y, z - center.z); // position text here x, y, z

			textMesh.castShadow = true; // object can cast shadows (default = false)
			textMesh.receiveShadow = true; // object can receive shadows (default= false)

			render(lastScene)
		});
	}
	function addQuestion(str, x, y, z, rot, question) {
		loaderFont.load('/font/roboto_regular.json', function (font) {
			const textGeometry = new TextGeometry(backReturn(str.replaceAll(" ", "\r\r")), {
				font: font,
				size: 0.2,
				height: 0.001,
				bevelEnabled: true,
				bevelSize: 0.00001,
				bevelThickness: 0.01,

			});


			var textMesh = new THREE.Mesh(textGeometry, [
				new THREE.MeshPhongMaterial({ emissive: "white" }), new THREE.MeshPhongMaterial({ emissive: "white" })
			]);


			texts.push(textMesh);
			var center = getCenterPoint(textMesh);
			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			if (!question)
				textMesh.rotation.set(0, rot, 0);
			else
				textMesh.rotation.set(PI / 3, rot, 0);


			textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

			lastScene.add(textMesh);
			textMesh.position.set(x - center.x, y - center.y, z - center.z); // position text here x, y, z

			textMesh.castShadow = true; // object can cast shadows (default = false)
			textMesh.receiveShadow = true; // object can receive shadows (default= false)

			render(lastScene);
		});
	}








	function reloadText() {
		for (const tt of texts) {
			lastScene.add(tt);
		}
		render(lastScene)

	}



}


startGame()