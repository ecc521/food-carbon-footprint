let container = document.createElement("div")
document.body.appendChild(container)

;(async function load() {
	let response = await fetch("data/processed.json")
	let results = await response.json()
	window.results = results


}())
