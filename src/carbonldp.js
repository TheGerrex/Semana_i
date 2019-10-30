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
        return response
        	.bindings
        	.map(binding =>({
        		keyword: binding["keywordLabel"],
        		weight: binding["movieCount"],
        		})
        	);

    });
}
