const fs = require('fs');

let plants = [];
let species_csv = fs.readFileSync('data/SearchResults.csv', 'utf8');

let species = species_csv.split("\n");

species.forEach(function(organism) {
  let species_info = organism.split(',');
  let plant = {};
  plant['name'] = species_info[1];
  plant['genus'] = species_info[0];
  plant['rarity'] = species_info[2][1]; //only saving second character;
  plant['image'] = "link";

  plants.push(plant);
});

fs.writeFileSync('data/plants2.json', JSON.stringify(plants), 'utf8');
