import { CarbonLDP } from "carbonldp";


export default function init() {
	const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/")





  carbonldp.documents.$executeSELECTQuery(
    `
    SELECT ?keywordLabel (COUNT (?Movie) AS ?movieCount)
    WHERE {
     ?keyword a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Keyword> .
     ?keyword <http://www.w3.org/2000/01/rdf-schema#label> ?keywordLabel .
     ?keyword ?Movie ?object .
   } GROUP BY ?keywordLabel
   `
   ).then((response) => {
    console.log("Raw SPARQL query result");
    console.log(response);
    const movielist = response;
    return movielist
  });
 }

  const tags = document.querySelector("#tags");
  const ul = document.createElement("ul");
  ul.appendChild(tags);
  for(var i = 0; i < movielist.length; ++i) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.innerHTML = movielist[i].Movie;
    a.appendChild(movielist[i].movieCount);
    a.appendChild(movielist[i].href);
    li.appendChild(a);
    ul.appendChild(li);
  }
  tags.appendChild(ul);
