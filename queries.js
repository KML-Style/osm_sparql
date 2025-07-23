// Request 1: Get all amenities of a specific type and their distance to the user’s coordinates.
export async function getNearbyAmenities(endpointUrl, latUser, lonUser, amenity) {
  const sparqlQuery = `
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
    SELECT DISTINCT ?item ?name ?dist
    WHERE {
      BIND("POINT(${lonUser} ${latUser})"^^geo:wktLiteral AS ?user_loc)
      ?item osmkey:amenity "${amenity}" .
      ?item osmkey:name ?name .
      ?item geo:hasGeometry/geo:asWKT ?item_loc .
      BIND (geof:distance(?item_loc,?user_loc,uom:metre) AS ?dist)
    }
    ORDER BY ASC(?dist)
  `;
  const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  const headers = { "Accept": "application/sparql-results+json" };

  const response = await fetch(fullUrl, { headers });
  
  if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
  const data = await response.json();
  return data;
}

// Request 2: Get all amenities of a specific type located less than 'distMax' meters from a public transport stop.
export async function getAmenitiesNextToTransport(endpointUrl, amenity, distMax) {
    const sparqlQuery = `
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX osm: <https://www.openstreetmap.org/>
    SELECT DISTINCT ?item ?item_name ?stop ?stop_name (AVG(?dist) AS ?avg_dist) WHERE {
      {
        SELECT ?item ?item_name ?item_loc ?tmp WHERE {
          ?item osmkey:amenity "${amenity}" .
          ?item osmkey:name ?item_name .         
          ?item geo:hasGeometry ?item_geo .
          ?item_geo geo:asWKT ?item_loc .
          BIND (1 AS ?tmp)
        }
      }
      {
        SELECT ?stop ?stop_name ?stop_loc ?tmp WHERE {
          ?stop rdf:type osm:node .
          ?stop osmkey:public_transport "stop_position" .
          ?stop osmkey:name ?stop_name .
          ?stop geo:hasGeometry ?stop_geo .
          ?stop_geo geo:asWKT ?stop_loc .   
          BIND (1 AS ?tmp)
        }
      }
      BIND (geof:distance(?item_loc,?stop_loc,uom:metre) AS ?dist)
    }
    GROUP BY ?item ?item_name ?stop ?stop_name
    HAVING (AVG(?dist) < ${distMax})
    ORDER BY ASC(?avg_dist)
    `;
    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    console.log(fullUrl);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
    return data;
}
