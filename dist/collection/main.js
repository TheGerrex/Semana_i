import init from './carbonldp';

init()


export default function init() {
    const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/");


    // Executing a SPARQL query built with SPARQLer

    return carbonldp.documents.$executeSELECTQuery(
        `
        SELECT ?keywordLabel (COUNT (?Movie) AS ?movieCount)
    WHERE {
      ?keyword a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Keyword> .
      ?keyword <http://www.w3.org/2000/01/rdf-schema#label> ?keywordLabel .
      ?keyword ?Movie ?object .
    } GROUP BY ?keywordLabel
      LIMIT 30
      `
    ).then((response) => {
        console.log("Raw SPARQL query result");
        return response;
        });
}


