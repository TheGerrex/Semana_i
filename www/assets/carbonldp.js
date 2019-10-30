import { CarbonLDP } from "carbonldp";
/*export default function init() {
	const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/");

	carbonldp.documents.$getChildren("genres/").then((response) => {
		console.log(response);
		const genresDiv = document.querySelector("#genres");
		response.forEach((genre) => {
			const p = document.createElement("p");
			p.appendChild(document.createTextNode(genre.originalValue));
			genresDiv.appendChild(p);
		});
	});
}*/
export default function init() {
	const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/")
	const destin = document.querySelector("#genres");
	const genresDiv = document.createElement("div");
	destin.appendChild(genresDiv);
	const ul = document.createElement("ul");
	genresDiv.appendChild(ul);
	
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
        //console.log(response);
        return response
        	.bindings
        	.map(function(binding){
        		const lis = document.createElement("li");
				lis.innerHTML = `<a href="#" data-weight=` + binding["movieCount"]+ `>` + binding["keywordLabel"] + `</a>`;
				ul.appendChild(lis);
        	}
        );

    });
}
