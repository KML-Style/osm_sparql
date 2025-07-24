import { formatWKT } from './utils.js';

// Request 1.1: Get all amenities of a specific type and their distance to the user’s coordinates.
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

// Request 1.2: Get all amenities of a specific type located less than 'distMax' meters from a public transport stop.
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
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
    return data;
}

// Request 1.3: Get all security camera located less than 'distMax' meters from a given object.
export async function getNearbySurveillance(endpointUrl, id, distMax){
  const sparqlQuery = `
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX osmnode: <https://www.openstreetmap.org/node/>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>
    SELECT DISTINCT ?item ?surveillance ?dist
    WHERE {
      {
        SELECT ?item ?item_loc ?tmp WHERE {
          BIND(${id} AS ?item)
          ?item geo:hasGeometry/geo:asWKT ?item_loc .
          BIND(1 AS ?tmp)
        }
        LIMIT 1
      }
      {
        SELECT ?surveillance ?surveillance_loc ?tmp WHERE {
          ?surveillance osmkey:surveillance ?value .
          ?surveillance geo:hasGeometry/geo:asWKT ?surveillance_loc .
          FILTER(?value != "no")
          BIND(1 AS ?tmp)
        }
      }
      BIND (geof:distance(?item_loc,?surveillance_loc,uom:metre) AS ?dist)
      FILTER(?dist <= ${distMax})
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

// Request 1.5: Get opening times for a given list of objects (characterized by an ID)
export async function getOpeningTime(endpointUrl, buildings){
    const valuesBuildings = buildings.join('\n        ');
    const sparqlQuery = `
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX osmnode: <https://www.openstreetmap.org/node/>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>

    SELECT ?element ?name ?opening_hours WHERE {
      VALUES ?element {
        ${valuesBuildings}
      }

      ?element osmkey:opening_hours ?opening_hours. 
      OPTIONAL { ?element osmkey:name ?name. }
     }
    `;

    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
  return data;
  }

// Request 1.5-bis: Get number of levels for a given list of objects (characterized by an ID)
export async function getNumberOfLevels(endpointUrl, buildings){
    const valuesBuildings = buildings.join('\n        ');
    const sparqlQuery = `
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX osmnode: <https://www.openstreetmap.org/node/>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>

    SELECT ?element ?name ?levels WHERE {
      VALUES ?element {
        ${valuesBuildings}
      }
      ?element osmkey:building:levels ?levels.
      OPTIONAL { ?element osmkey:name ?name. }
     }
    `;

    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
  
  return data;
  }

// Request 1.6: Get the elements (nodes and segments) that are inside an area delimitated by a list of buildings (characterized by an ID)
export async function getItemsInArea(endpointUrl, buildings){
    const valuesBuildings = buildings.join('\n        ');
    const sparqlQuery = `
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX osmnode: <https://www.openstreetmap.org/node/>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>
    PREFIX ogc: <http://www.opengis.net/rdf#>

    SELECT ?element ?name WHERE{
      VALUES ?area {
        ${valuesBuildings}
      }
      ?area ogc:sfCovers ?element .
      OPTIONAL { ?element osmkey:name ?name. } 
    }
    ORDER BY (!BOUND(?name)) ?name
    `;

    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
  return data;
  }

// Request 1.7: Get the elements (nodes and segments) that are inside an area delimitated by a polygon.
export async function getItemsInPolygon(endpointUrl, polygon){
    const formattedPolygon = formatWKT(polygon,"POLYGON");
    const sparqlQuery = `
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX osmway: <https://www.openstreetmap.org/way/>
    PREFIX osmnode: <https://www.openstreetmap.org/node/>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>

    SELECT ?element ?name WHERE {
      BIND(${formattedPolygon} AS ?area)
      ?element geo:hasGeometry/geo:asWKT ?geom .
      OPTIONAL { ?element osmkey:name ?name. }
    
      FILTER(geof:sfWithin(?geom,?area ))
      
    }
    ORDER BY (!BOUND(?name)) ?name
    `;
    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
    return data;
}

// Request 2.1 - Know if a footway crossing is nearby an user (reprsented by a point)
export async function isCrossingNearby(endpointUrl, user_loc, distMax) {
  const user_loc_formatted = formatWKT(user_loc, "POINT");
  const sparqlQuery = `
  PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
  PREFIX geo: <http://www.opengis.net/ont/geosparql#>
  PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
  PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
  
  ASK {
    BIND (${user_loc_formatted} AS ?wkt_user) 
    {
        ?crossing osmkey:highway 'crossing' .
        ?crossing geo:hasGeometry/geo:asWKT ?wkt_crossing .
    }
    UNION 
    {
        ?crossing osmkey:highway 'footway' .
        ?crossing osmkey:footway 'crossing' .
        ?crossing geo:hasCentroid/geo:asWKT ?wkt_crossing .
    }
    BIND (geof:distance(?wkt_user, ?wkt_crossing, uom:metre) AS ?dist)
    FILTER(?dist <= ${distMax})
    }
  `;
  const url = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  const headers = { "Accept": "application/sparql-results+json" };

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
  const data = await response.json();

  return !!data.boolean;
}

// Request 2.2 - Get the distance from a user (represented by a point) to an object (characterized by an id)
export async function getDistance(endpointUrl, user_loc, item) {
  const user_loc_formatted = formatWKT(user_loc, "POINT");
  const sparqlQuery = `
  PREFIX geo: <http://www.opengis.net/ont/geosparql#>
  PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
  PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
  PREFIX osmway: <https://www.openstreetmap.org/way/>
  PREFIX osmnode: <https://www.openstreetmap.org/node/>
  PREFIX osmrel: <https://www.openstreetmap.org/relation/>
  
  SELECT DISTINCT ?dist WHERE {
      BIND (${user_loc_formatted} AS ?wkt_user) 
      ${item} geo:hasGeometry/geo:asWKT ?wkt_item .
         
      BIND (geof:distance(?wkt_user, ?wkt_item, uom:metre) AS ?dist)
    }
  `;
  const url = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  const headers = { "Accept": "application/sparql-results+json" };

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
  const data = await response.json();

  return data.results.bindings.length > 0 ? parseFloat(data.results.bindings[0].dist.value): null; 
}

// Request 2.3 - Know if an amenity is located on a path (with an eventual tolerance distMax)
export async function isAmenityOnPath(endpointUrl, path, amenity, distMax = 0) {
  const formattedPath = formatWKT(path, "LINESTRING");

  const filterClause = distMax > 0
    ? `FILTER(geof:distance(?linestring_user, ?wkt_item, uom:metre) <= ${distMax})`
    : `FILTER(geof:sfIntersects(?linestring_user, ?wkt_item))`;

  const sparqlQuery = `
  PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
  PREFIX geo: <http://www.opengis.net/ont/geosparql#>
  PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
  PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>

  ASK {
      BIND(${formattedPath} AS ?linestring_user)
    
      ?item osmkey:amenity "${amenity}" .
      ?item geo:hasGeometry/geo:asWKT ?wkt_item .
    
      ${filterClause}
    }
  `;

  const url = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  const headers = { "Accept": "application/sparql-results+json" };

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
  const data = await response.json();

  return !!data.boolean;
}

// Request 2.4 - Get minimal distance from a geometry to a specific railway 
export async function getDistanceToRailway(endpointUrl, geometry, geometryType, railwayType){
    const formattedGeometry = formatWKT(geometry, geometryType.toUpperCase());
    const sparqlQuery = `
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>

    SELECT DISTINCT ?item ?name ?dist
    WHERE {
          BIND(${formattedGeometry} AS ?loc)
          
          ?item osmkey:railway "${railwayType}" .
          ?item geo:hasGeometry/geo:asWKT ?item_loc .
          OPTIONAL{?item osmkey:name ?name}
          
          BIND (geof:distance(?loc, ?item_loc, uom:metre) AS ?dist)
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

// Request 2.5 - Get path/area intersection
export async function getIntersection(endpointUrl, path, area){
    const formattedPath = formatWKT(path, "LINESTRING");
    const formattedArea = formatWKT(area, "POLYGON");
    const sparqlQuery = `
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>

    SELECT (geof:intersection(?way, ?area) AS ?intersectedSegments) WHERE {
    
    BIND(${formattedArea} AS ?area)
    BIND(${formattedPath} AS ?way)
    }
    `;
    
    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };

    const response = await fetch(fullUrl, { headers });
  
    if (!response.ok) throw new Error(`SPARQL Error: ${response.status}`);
    const data = await response.json();
    
    return data;
}
