
function openPage(page) {
	fetch("views/" + page).then((res) => {
		return res.text();
	})
		.then((html) => {
			document.body.innerHTML = html
		});
}