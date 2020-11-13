let container = document.createElement("div")
document.body.appendChild(container)

function createSelectorWithDatalist(items) {
	let datalist = document.getElementById("availableItems")
	if (!datalist) {
		datalist = document.createElement("datalist")
		datalist.id = 'availableItems'
		for (let itemName in items) {
			let item = items[itemName]
			let option = document.createElement("option")
			option.value = item.name
			option.innerHTML = item.name
			datalist.appendChild(option)
		}
		document.body.appendChild(datalist)
	}

	let selector = document.createElement("input")
	selector.setAttribute("list", "availableItems")
	selector.placeholder = "Enter Item"
	selector.type = "text"
	//Red border when set to something invalid.
	selector.addEventListener("change", function() {
		if (!selector.value || items[selector.value]) {
			selector.style.border = ""
		}
		else {
			selector.style.border = "2px solid red"
		}
	})

	return selector
}

let currentRows = []


;(async function load() {
	let response = await fetch("data/processed.json")
	let results = await response.json()
	window.results = results
	let backrefs = {}
	results.forEach((item) => {
		backrefs[item.name] = item //TODO: Possible overwrites.
	})
	window.backrefs = backrefs


	function Row() {
		this.elem = document.createElement("div")

		this.selector = createSelectorWithDatalist(backrefs)
		this.elem.appendChild(this.selector)

	}

	currentRows.push(new Row())
	currentRows.forEach((row) => {
		container.appendChild(row.elem)
	})

	let addRowButton = document.createElement("button")
	//addRowButton.addEventListener("click", createRow)
	document.body.appendChild(addRowButton)
}())
