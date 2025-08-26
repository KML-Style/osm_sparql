# osm_sparql

## 📖 Documentation

### 1. Urban data access

#### `getNearbyAmenities(endpointUrl, latUser, lonUser, amenity)`

- Get all amenities of a specific type and their distance to the user's coordinates.
- Returns an array of objects having the following structure : (item, name, dist).
- <sub> eg. of use : getNearbyAmenities('http://localhost:7200/repositories/1', 45.784797, 4.876642, 'restaurant') </code></sub>
---

#### `getAmenitiesNextToTransport(endpointUrl, amenity, distMax)`

- Get all amenities of a specific type located less than `distMax` meters from a public transport stop.
- Returns an array of objects having the following structure : (item, item_name, stop, stop_name, dist). Item and stop names can be NULL if undefined in OSM.
- <sub> eg. of use :  <code> getAmenitiesNextToTransport('http://localhost:7200/repositories/1', 'restaurant', 200) </code></sub>

---

#### `getNearbySurveillance(endpointUrl, id, distMax)`

- Get all surveillance cameras located less than `distMax` meters from a given OSM object.
- Returns an array of objects having the following structure : (item, surveillance, dist).
- <sub> eg. of use : <code> getNearbySurveillance('http://localhost:7200/repositories/1', 'osmway:85000377', 200) </code></sub>

---

#### `getOpeningTime(endpointUrl, buildings)`

- Get opening times for a list of buildings.
- - Returns an array of objects having the following structure : (item, name, opening_hours). Name and opening_hours can be null if undefined in OSM.
- <sub> eg. of use : <code> getOpeningTime('http://localhost:7200/repositories/1', ["osmway:237651700", "osmway:85041048", "osmnode:10807822849", "osmnode:4411791557"]) </code></sub>

#### `getNumberOfLevels(endpointUrl, buildings)`

- Get the number of levels for a list of OSM buildings.
- Returns an array of objects having the following structure : (item, name, levels). Name and levels can be null if undefined in OSM.
- <sub> eg. of use : <code> getNumberOfLevels('http://localhost:7200/repositories/1', ["osmway:237651700", "osmway:85041048", "osmnode:10807822849", "osmnode:4411791557"]) </code></sub>

#### `getItemsInArea(endpointUrl, buildings)`

- Get all elements (nodes/ways) inside the area delimited by a list of building IDs.
- Returns an array of objects having the following structure : (item, name).  Name can be null if undefined in OSM.
- <sub> eg. of use : <code> getItemsInArea('http://localhost:7200/repositories/1', ["osmway:237651700"]) </code></sub>

#### `getItemsInPolygon(endpointUrl, polygon)`

- Get all elements (nodes/ways) inside a custom polygon area.
- Returns an array of objects having the following structure : (item, name). Name can be null if undefined in OSM.
- <sub>eg. of use : <code>getItemsInPolygon('http://localhost:7200/repositories/1', "((4.8651301 45.7821498,4.8651635 45.782077,4.8651822 45.7820342,4.8651982 45.7820005,4.8652644 45.7820155,4.865272 45.7819992,4.8652966 45.7820041,4.8653646 45.7820199,4.8654831 45.7820464,4.8655199 45.7820558,4.8656041 45.7820735,4.8656725 45.7820888,4.8657436 45.7821047,4.865736 45.7821209,4.8657581 45.7821267,4.8658042 45.7821376,4.8658478 45.782147,4.8660656 45.7821958,4.8661089 45.7822054,4.8661509 45.7822144,4.8661912 45.7822231,4.8661656 45.7822793,4.8661521 45.7823084,4.8661513 45.782311,4.8661454 45.7823235,4.8661233 45.7823716,4.8660566 45.782356,4.8660489 45.7823553,4.8660424 45.7823535,4.8660086 45.7823463,4.8659923 45.7823419,4.8659679 45.7823372,4.8659626 45.7823357,4.86593 45.7823282,4.865928 45.7823283,4.865889 45.7823197,4.8658656 45.782313,4.8657977 45.7822991,4.865564 45.7822467,4.865476 45.7822268,4.8655024 45.7822332,4.8654528 45.7822216,4.8654089 45.7822123,4.8653011 45.7821881,4.8652591 45.7821785,4.8651301 45.7821498))" )</code></sub>

---

### 2. Spatial proximity analysis

#### `isCrossingNearby(endpointUrl, user_loc, distMax)`

- Returns a boolean : `true` if there is a crossing or footway crossing within `distMax` meters of the user (POINT geometry).
- <sub> eg. of use : <code> isCrossingNearby('http://localhost:7200/repositories/1', '(4.8766485 45.7847625)', 50) </code></sub>

#### `getDistance(endpointUrl, user_loc, item)`

- Get the distance in meters from a user's location (POINT) to a given object.
- Returns a float.
- <sub> eg. of use : <code> getDistance('http://localhost:7200/repositories/1', '(4.8766485 45.7847625)', "osmnode:10807822849") </code></sub>

#### `isAmenityOnPath(endpointUrl, path, amenity, distMax = 0)`

- Returns a boolean :  `true` if an amenity is located on or near (within `distMax` meters) a given path (LINESTRING geometry).
- <sub> eg. of use : <code> isAmenityOnPath('http://localhost:7200/repositories/1', '(4.8712942 45.7825353,4.8712781 45.7825318,4.8712394 45.7825236,4.8711957 45.7825205,4.8711139 45.7825148,4.8710693 45.7825064,4.87068 45.7824329,4.8702728 45.7823399,4.87025 45.7823347,4.8702336 45.7823307,4.8700828 45.7822942,4.8700371 45.7822766,4.8699845 45.7822395,4.8699645 45.7822,4.8699542 45.7821331,4.869959 45.7820394,4.8699561 45.7820226,4.8699443 45.7819661,4.8698961 45.7818372,4.8698187 45.7817759,4.8697547 45.7817252)', 'toilets')
               isAmenityOnPath('http://localhost:7200/repositories/1', '(4.8712942 45.7825353,4.8712781 45.7825318,4.8712394 45.7825236,4.8711957 45.7825205,4.8711139 45.7825148,4.8710693 45.7825064,4.87068 45.7824329,4.8702728 45.7823399,4.87025 45.7823347,4.8702336 45.7823307,4.8700828 45.7822942,4.8700371 45.7822766,4.8699845 45.7822395,4.8699645 45.7822,4.8699542 45.7821331,4.869959 45.7820394,4.8699561 45.7820226,4.8699443 45.7819661,4.8698961 45.7818372,4.8698187 45.7817759,4.8697547 45.7817252)', 'toilets', 50) </code></sub>

#### `getDistanceToRailway(endpointUrl, geometry, geometryType, railwayType)`

- Get the minimal distance from a geometry to each railway from a specific type.
- Returns an array of objects having the following structure : (item, name, dist). Name can be null if undefined in OSM.
- <sub> eg. of use : <code> getDistanceToRailway('http://localhost:7200/repositories/1', '((4.8651301 45.7821498,4.8651635 45.782077,4.8651822 45.7820342,4.8651982 45.7820005,4.8652644 45.7820155,4.865272 45.7819992,4.8652966 45.7820041,4.8653646 45.7820199,4.8654831 45.7820464,4.8655199 45.7820558,4.8656041 45.7820735,4.8656725 45.7820888,4.8657436 45.7821047,4.865736 45.7821209,4.8657581 45.7821267,4.8658042 45.7821376,4.8658478 45.782147,4.8660656 45.7821958,4.8661089 45.7822054,4.8661509 45.7822144,4.8661912 45.7822231,4.8661656 45.7822793,4.8661521 45.7823084,4.8661513 45.782311,4.8661454 45.7823235,4.8661233 45.7823716,4.8660566 45.782356,4.8660489 45.7823553,4.8660424 45.7823535,4.8660086 45.7823463,4.8659923 45.7823419,4.8659679 45.7823372,4.8659626 45.7823357,4.86593 45.7823282,4.865928 45.7823283,4.865889 45.7823197,4.8658656 45.782313,4.8657977 45.7822991,4.865564 45.7822467,4.865476 45.7822268,4.8655024 45.7822332,4.8654528 45.7822216,4.8654089 45.7822123,4.8653011 45.7821881,4.8652591 45.7821785,4.8651301 45.7821498))', 'POLYGON', 'tram') </code></sub>

#### `getIntersection(endpointUrl, path, area)`

- Get the intersection between a path and an area.
- Returns a LINESTRING.
- <sub> eg. of use : <code> getIntersection('http://localhost:7200/repositories/1','(4.8712942 45.7825353,4.8712781 45.7825318,4.8712394 45.7825236,4.8711957 45.7825205,4.8711139 45.7825148,4.8710693 45.7825064,4.87068 45.7824329,4.8702728 45.7823399,4.87025 45.7823347,4.8702336 45.7823307,4.8700828 45.7822942,4.8700371 45.7822766,4.8699845 45.7822395,4.8699645 45.7822,4.8699542 45.7821331,4.869959 45.7820394,4.8699561 45.7820226,4.8699443 45.7819661,4.8698961 45.7818372,4.8698187 45.7817759,4.8697547 45.7817252)','((4.8683676 45.7824128,4.8683821 45.7823836,4.8683946 45.7823582,4.8687298 45.7816229,4.8687445 45.7815799,4.8689635 45.7816277,4.8696959 45.781794,4.869726 45.7818008,4.8697488 45.781806,4.869768 45.7818104,4.8697922 45.781816,4.8698689 45.7818312,4.8698961 45.7818372,4.8699128 45.7818412,4.8700201 45.7818601,4.8701484 45.78191,4.8702211 45.7819146,4.8701499 45.7820892,4.8701061 45.7821967,4.8702853 45.7822363,4.8702408 45.782319,4.8702304 45.7823461,4.8702137 45.7823883,4.8702051 45.782406,4.8701198 45.7825933,4.8700822 45.7825955,4.8700515 45.7826659,4.8700289 45.7827169,4.8700045 45.7827679,4.869995 45.7827911,4.8699767 45.7828308,4.869796 45.7827905,4.8697921 45.782807,4.8688195 45.7825926,4.8687668 45.7825184,4.8683676 45.7824128))') </code></sub>

---

### 3. Accessibility and Mobility

#### `getWheelchairFriendlyBuildings(endpointUrl)`

- Get all buildings that are wheelchair-accessible.
- Returns an array of objects having the following structure : (item, name). Name can be null if undefined in OSM.
- <sub> eg. of use : <code> getWheelchairFriendlyBuildings('http://localhost:7200/repositories/1') </code></sub>

#### `getWheelchairFriendlyToilets(endpointUrl)`

- Get all toilets tagged as wheelchair-accessible (with info about gender, if available).
- Returns an array of objects having the following structure : (item, genre). Genre can be null if undefined in OSM.
- <sub> eg. of use : <code> getWheelchairFriendlyToilets('http://localhost:7200/repositories/1') </code></sub>

#### `getStairsWithRamp(endpointUrl)`

- Get the list of stairs equipped with a ramp.
- Returns an array of objects having the following structure : (item, item_ramp, wheelchair_accessible_ramp).
- <sub> eg. of use : <code> getStairsWithRamp('http://localhost:7200/repositories/1') </code></sub>

#### `getMaximumGradient(endpointUrl, path)`

- Get the maximum gradient (in %) along a path defined by a list of OSM segment IDs.
- Returns a float.
- <sub> eg. of use : <code> getMaximumGradient('http://localhost:7200/repositories/1',  ["osmway:43013911", "osmway:1113003348", "osmway:128973167", "osmway:1113003347", "osmway:643215532", "osmway:1342103505", "osmway:1342103503"]) </code></sub>

#### `getFloorTransitions(endpointUrl, building)`

- Get the elements (nodes and segments) that model vertical connections (stairs, elevators, ramps) in a building.
- Returns an array of objects having the following structure : (item, highway, level).
- <sub> eg. of use : <code> getFloorTransitions('http://localhost:7200/repositories/1', 'osmway:85000377') </code></sub>

---

## 🗺️ Geometry Formatting Utility

See `formatWKT(input, type)` in `utils.js`  
This helper function formats coordinates or WKT strings for safe injection into SPARQL.
Valid formats for points are `(x y)`, `x y`, `POINT(x y)` or `POINT(x y)^^geo:wktLiteral`.
Valid formats for linestrings are `(x y, x2 y2)`, `LINESTRING(x y, x2 y2)` or `LINESTRING(x y, x2 y2)^^geo:wktLiteral`.
Valid formats for polygons are `(x y, x2 y2, x3 y3)`, `((x y, x2 y2, x3 y3))`, `POLYGON((x y, x2 y2, x3 y3))` or `POLYGON((x y, x2 y2, x3 y3))^^geo:wktLiteral`.
 
---

## 📝 Notes

- The queries have been tested with a GraphDB local endpoint.
- If you encounter CORS issues when you run a query, ensure that your `.cfg` file includes the following lines under `[JavaOptions]`:
  `java-options=-Dgraphdb.workbench.cors.enable=true`
  `java-options=-Dgraphdb.workbench.cors.origin=*` 

