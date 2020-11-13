const fs = require("fs")
const path = require("path")

const csvParser = require("csv-parser")

function parseCSV(filePath, params = {}) {
	return new Promise((resolve, reject) => {
		let results = []
		fs.createReadStream(filePath)
		  .pipe(csvParser(params))
		  .on('data', (data) => results.push(data))
		  .on('end', () => {
			resolve(results)
		  });
	})
}

;(async function() {
	let results = []

	//https://github.com/nw-hacks2020/c-o-you/blob/master/carbon_data/c-o-you_foods.csv
	//https://raw.githubusercontent.com/nw-hacks2020/c-o-you/master/carbon_data/c-o-you_foods.csv
	//NOTE: Currently, CSV has no header. Add name,footprint at top
	let cuFoods = await parseCSV(path.join(__dirname, "data", "c-o-you_foods.csv"))
	cuFoods.forEach((obj) => {obj.footprint = Number(obj.footprint)})
	results = results.concat(cuFoods) //TODO: Normalize units. These are kg CO2e per kg, to retail gate.


	//https://www.vegansociety.com/sites/default/files/uploads/Campaigns/PlateUp/ingredients-updated-3.json
	let file = await fs.promises.readFile(path.join(__dirname, "data", "ingredients-updated-3.json"), {encoding: "utf-8"})
	let veganSociety = await JSON.parse(file)
	veganSociety.forEach((item) => {
		results.push({
			name: item.FOOD,
			footprint: item.Unknown
		})
	})


	//https://world.openfoodfacts.org/label/carbon-footprint
	//Search for the label "carbon-footprint" with advanced search instead, in order to get the download button.
	//Direct link doesn't show download.
	let foodFacts = await parseCSV(path.join(__dirname, "data", "openfoodfacts_search.csv"), { separator: '\t' })
	foodFacts = foodFacts.filter((item) => {
		return Boolean(item["carbon-footprint_100g"]) && (item["carbon-footprint_100g"] !== "0")
	})
	foodFacts = foodFacts.map((item) => {
		return {
			name: item.product_name,
			code: item.code,
			footprint: item["carbon-footprint_100g"] / 100 //Convert grams CO2e per 100g to kilograms CO2e per kg
		}
	})
	results = results.concat(foodFacts)


	console.log(results)
	fs.writeFileSync(path.join(__dirname, "data", "processed.json"), JSON.stringify(results, null, "\t"))
}())
