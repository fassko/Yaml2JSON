const YAML = require('yaml');
const fs = require('fs');
const yaml = require('js-yaml');

const places = require('./places.js');


//// -- Convert YAML file to new JSON

const parseCategory = (category, language) => {
  switch (category) {
    case "fastFood":
      return "Fast food";
      break;
    case "cafe":
      switch (language) {
        case "lv":
          return "Kafejnīcas un konditorejas";
          break;
        case "en":
          return "Cafes and bakeries";
          break;
        case "ru":
          return "Кафе и кондитерские";
          break;
      }
      break;
    case "restaurants":
    default:
      switch (language) {
        case "lv":
          return "Restorāni un ēdnīcas";
          break;
        case "en":
          return "Restaurants and canteens";
          break;
        case "ru":
          return "Рестораны и столовые";
          break;
      }
      break;
  }
};

// const file = fs.readFileSync('./places.yml', 'utf8')
// let parsed = YAML.parse(file).map(place => {
//   place.category = {
//     lv: parseCategory(place.category, "lv"),
//     en: parseCategory(place.category, "en"),
//     ru: parseCategory(place.category, "ru")
//   }

//   return place;
// });

// let jsonString = JSON.stringify(parsed, null, 2);

// fs.writeFile("places_new.json", jsonString, (err) => {
//   if (err) {
//       console.error(err);
//       return;
//   };

//   console.log("Places NEW has been created");
// });




//// -- Convert YAML file to old JSON

const file = fs.readFileSync('./places.yml', 'utf8')
let parsed = YAML.parse(file);

const groupBy = (list, props) => {
  return list.reduce((a, b) => {
     (a[b[props]] = a[b[props]] || []).push(b);
     return a;
  }, {});
};

let grouped = groupBy(parsed, "name");

let converted = Object.keys(grouped).flatMap(key => {

  let tmpPlace = {
    name: key,
    description: [{
      lv: grouped[key][0].description.lv,
      en: grouped[key][0].description.en,
      ru: grouped[key][0].description.ru
    }],
    category: [{
      lv: parseCategory(grouped[key][0].category.lv, "lv"),
      en: parseCategory(grouped[key][0].category.en, "en"),
      ru: parseCategory(grouped[key][0].category.ru, "ru")
    }],
    website: grouped[key][0].website
  }

  if (grouped[key][0].wolt != null) {
    tmpPlace.wolt = grouped[key][0].wolt;
  }

  tmpPlace.position = grouped[key].map(place => {
    return {
      address: place.address,
      coords: {
        lat: place.coordinate.latitude,
        lng: place.coordinate.longitude
      }
    }
  });

  return tmpPlace;
});

let jsonString = JSON.stringify(converted, null, 2);

fs.writeFile("places_old.json", jsonString, (err) => {
  if (err) {
      console.error(err);
      return;
  };

  console.log("Places OLD has been created");
});


//// -- Convert old places file to YAML

// const parseCategory = (categoryArray) => {
//   switch (categoryArray[0].lv) {
//     case "Fast food":
//       return "fastFood";
//       break;
//     case "Kafejnīcas un konditorejas":
//       return "cafe";
//       break;
//     case "Restorāni un ēdnīcas":
//     default:
//       return "restaurants"
//       break
//   }
// };

// let convertedPlaces = places.flatMap(place => {

//   let places = place.position.map(position => {
//     var tmpPlace = {
//       name: place.name,
//       description: {
//         lv: place.description[0].lv,
//         en: place.description[0].en,
//         ru: place.description[0].ru,
//       },
//       category: parseCategory(place.category),
//       website: place.website,
//     };
  
//     if (place.wolt != null) {
//       tmpPlace.wolt = place.wolt;
//     }
  
//     tmpPlace.address = position.address;
    
//     tmpPlace.coordinate = {
//       latitude: position.coords.lat,
//       longitude: position.coords.lng
//     };
    
//     return tmpPlace
//   });

//   return places;
// });

// let parsedPlaces = yaml.safeDump(convertedPlaces);

// fs.writeFile('places.yml', parsedPlaces, (err) => {
//   if (err) {
//     throw err;
//   }

//   console.log('Places YML saved!');
// });