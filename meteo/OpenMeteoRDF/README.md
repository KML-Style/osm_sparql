# OpenMeteo Microservice Setup

## 1. Create openmeteo directory :
```bash
mkdir openmeteo
cd openmeteo
```

## 2. Install node.js and dependencies :
```bash
npm init -y
npm install express node-fetch
```

## 3. Download server.js
```bash
curl -L -o server.js https://raw.githubusercontent.com/KML-Style/osm_sparql/main/meteo/OpenMeteoRDF/server.js
```

## 4. Create microservice directory
```bash
cd ..
mkdir microservice
cd microservice
```

## 5. Download and unzip environment.zip
```bash
url -L -o environment.zip https://github.com/frmichel/sparql-micro-service/raw/master/deployment/docker/environment.zip
unzip environment.zip
```

## 6. Set files access
```bash
chmod -R 755 services
chmod -R 755 config
chmod -R 777 logs
chmod -R 755 html
```

## 7. Download and unzip OpenMeteo microservice directory
```bash
cd services
curl -L -o openmeteo.zip https://raw.githubusercontent.com/KML-Style/osm_sparql/main/meteo/OpenMeteoRDF/openmeteo.zip
unzip openmeteo.zip
```

## 8. Run
```bash
cd ..
docker compose up -d
```

## 9. To test the services
```bash
URL-encoded query: construct where {?s ?p ?o}
CONSTRUCT=construct%20WHERE%20%7B%20%3Fs%20%3Fp%20%3Fo%20%7D%20

curl --header "Accept: text/turtle" \
  "http://localhost/service/openmeteo/getForecast?lat=52.52&lon=13.41&days=3&query=${CONSTRUCT}"

URL-encoded query: select * where {?s ?p ?o}
SELECT='select%20*%20where%20%7B%3Fs%20%3Fp%20%3Fo%7D'

curl --header "Accept: application/sparql-results+json" \
  "http://localhost/service/openmeteo/getForecast?lat=52.52&lon=13.41&days=3&query=${SELECT}"
```
