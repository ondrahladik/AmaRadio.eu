let map;
let currentMarker;
let locatorLayers = L.layerGroup();
let drawnLayers = [];
let currentDrawnLayers = null;
let ituZoneLayer = L.layerGroup();
let cqZoneLayer = L.layerGroup();
let timeZoneLayer = L.layerGroup();
let currentLayer = 'none';

function latLonToLocator(lat, lon) {
    let fieldLon = Math.floor((lon + 180) / 20);
    let fieldLat = Math.floor((lat + 90) / 10);
    let squareLon = Math.floor(((lon + 180) % 20) / 2);
    let squareLat = Math.floor(((lat + 90) % 10));
    let subSquareLon = Math.floor(((lon + 180) % 2) * 12);
    let subSquareLat = Math.floor(((lat + 90) % 1) * 24);

    let locator = String.fromCharCode(fieldLon + 65) +
        String.fromCharCode(fieldLat + 65) +
        squareLon +
        squareLat +
        String.fromCharCode(subSquareLon + 65) +
        String.fromCharCode(subSquareLat + 65);

    return locator;
}

function convertToDMS(degrees) {
    let d = Math.floor(degrees);
    let minFloat = (degrees - d) * 60;
    let m = Math.floor(minFloat);
    let s = Math.round((minFloat - m) * 60);
    return `${d}° ${m}' ${s}"`;
}

function showMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let locator = latLonToLocator(latitude, longitude);

                let latitudeRounded = latitude.toFixed(6);
                let longitudeRounded = longitude.toFixed(6);
                let altitude = position.coords.altitude;
                let altitudeRounded = altitude !== null ? altitude.toFixed(0) : null;

                if (!map) {
                    map = L.map('map').setView([latitude, longitude], 14);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(map);
                } else {
                    map.setView([latitude, longitude], 14);
                }

                if (currentMarker) {
                    map.removeLayer(currentMarker);
                }

                let popupContent = '<div style="text-align: center;"><b>' + translations.position + '</b></div>' +
                    translations.lat + latitudeRounded + '<br>' +
                    translations.lon + longitudeRounded + '<br>' +
                    translations.loc + locator;
                if (altitudeRounded !== null) {
                    popupContent += '<br>' + translations.alt + altitudeRounded + ' m';
                }

                currentMarker = L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(popupContent)
                    .openPopup();
            },
            function (error) {
                alert('Error: ' + error.message);
            }
        );
    } else {
        alert(translations.errorGeoBrowser);
    }
}

function addLocationButton() {
    let locationButton = L.control({ position: 'topleft' });

    locationButton.onAdd = function () {
        let div = L.DomUtil.create('div', 'show-location-button');
        div.innerHTML = '<i class="fa-solid fa-location-dot"></i>';
        div.onclick = function () {
            showMyLocation();
        };
        return div;
    };

    locationButton.addTo(map);
}

function drawLocatorGrid() {
    if (currentLayer !== 'locator') return;

    if (currentDrawnLayers) {
        currentDrawnLayers.clearLayers();
    }
    drawnLayers.forEach(layer => layer.remove());
    drawnLayers = [];

    currentDrawnLayers = L.layerGroup();

    let zoomLevel = map.getZoom();
    let bounds = map.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();

    if (zoomLevel >= 11) {

        let startLon = Math.floor(southWest.lng / 0.083333) * 0.083333;
        let endLon = Math.ceil(northEast.lng / 0.083333) * 0.083333;
        let startLat = Math.floor(southWest.lat / 0.041666) * 0.041666;
        let endLat = Math.ceil(northEast.lat / 0.041666) * 0.041666;

        for (let fieldLon = startLon; fieldLon < endLon; fieldLon += 0.083333) {
            for (let fieldLat = startLat; fieldLat < endLat; fieldLat += 0.041666) {
                let lonCenter = fieldLon + 0.041666;
                let latCenter = fieldLat + 0.020833;
                let fieldName = latLonToLocator(latCenter, lonCenter).substring(0, 6);
                drawnLayers.push(L.marker([latCenter, lonCenter], {
                    icon: L.divIcon({
                        className: 'text-labels',
                        html: '<div>' + fieldName + '</div>',
                        iconSize: [100, 40],
                        iconAnchor: [50, 20]
                    })
                }).addTo(currentDrawnLayers));

                const offsetLat = 0.0008;

                drawnLayers.push(L.polyline([
                    [fieldLat + offsetLat, fieldLon],
                    [fieldLat + offsetLat, fieldLon + 0.083333]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat, fieldLon + 0.083333],
                    [fieldLat + 0.041666, fieldLon + 0.083333]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat + 0.041666 + offsetLat, fieldLon + 0.083333],
                    [fieldLat + 0.041666 + offsetLat, fieldLon]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat + 0.041666, fieldLon],
                    [fieldLat, fieldLon]
                ], { color: 'red' }).addTo(currentDrawnLayers));
            }
        }
    } else if (zoomLevel >= 6) {
        // Draw sub squares
        let startLon = Math.floor(southWest.lng / 2) * 2;
        let endLon = Math.ceil(northEast.lng / 2) * 2;
        let startLat = Math.floor(southWest.lat);
        let endLat = Math.ceil(northEast.lat);

        for (let fieldLon = startLon; fieldLon < endLon; fieldLon += 2) {
            for (let fieldLat = startLat; fieldLat < endLat; fieldLat += 1) {
                let lonCenter = fieldLon + 1;
                let latCenter = fieldLat + 0.5;
                let fieldName = latLonToLocator(latCenter, lonCenter).substring(0, 4);
                drawnLayers.push(L.marker([latCenter, lonCenter], {
                    icon: L.divIcon({
                        className: 'text-labels',
                        html: '<div>' + fieldName + '</div>',
                        iconSize: [100, 40],
                        iconAnchor: [50, 20]
                    })
                }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat, fieldLon],
                    [fieldLat, fieldLon + 2]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat, fieldLon + 2],
                    [fieldLat + 1, fieldLon + 2]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat + 1, fieldLon + 2],
                    [fieldLat + 1, fieldLon]
                ], { color: 'red' }).addTo(currentDrawnLayers));

                drawnLayers.push(L.polyline([
                    [fieldLat + 1, fieldLon],
                    [fieldLat, fieldLon]
                ], { color: 'red' }).addTo(currentDrawnLayers));
            }
        }
    } else {
        // Draw main squares
        for (let lon = -180; lon <= 180; lon += 20) {
            drawnLayers.push(L.polyline([
                [90, lon],
                [-90, lon]
            ], { color: 'red' }).addTo(currentDrawnLayers));
        }

        for (let lat = -90; lat <= 90; lat += 10) {
            drawnLayers.push(L.polyline([
                [lat, -180],
                [lat, 180]
            ], { color: 'red' }).addTo(currentDrawnLayers));
        }

        for (let fieldLon = -180; fieldLon < 180; fieldLon += 20) {
            for (let fieldLat = -90; fieldLat < 90; fieldLat += 10) {
                let lonCenter = fieldLon + 10;
                let latCenter = fieldLat + 5;
                let fieldName = String.fromCharCode((fieldLon + 180) / 20 + 65) +
                    String.fromCharCode((fieldLat + 90) / 10 + 65);
                drawnLayers.push(L.marker([latCenter, lonCenter], {
                    icon: L.divIcon({
                        className: 'text-labels',
                        html: '<div>' + fieldName + '</div>',
                        iconSize: [100, 40],
                        iconAnchor: [50, 20]
                    })
                }).addTo(currentDrawnLayers));
            }
        }
    }

    currentDrawnLayers.addTo(map);
}

function loadITUZone() {
    if (currentLayer !== 'itu') return; 

    ituZoneLayer.clearLayers();

    fetch('/assets/json/itu-border.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: 'green',
                        weight: 4,
                        opacity: 0.7,
                        fillOpacity: 0
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                    }
                }
            }).addTo(ituZoneLayer);
        })
        .catch(error => console.error(translations.errorGeo + ' ' + (error.message || error)));

    fetch('/assets/json/itu-marker.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.divIcon({
                            className: 'itu-div-icon',
                            html: feature.properties.name
                        })
                    });
                }
            }).addTo(ituZoneLayer);
        })
        .catch(error => console.error(translations.errorGeo + ' ' + (error.message || error)));

    ituZoneLayer.addTo(map);
}

function loadCQZone() {
    if (currentLayer !== 'cq') return;

    cqZoneLayer.clearLayers();

    fetch('/assets/json/cq-border.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: 'blue',
                        weight: 4
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                    }
                }
            }).addTo(cqZoneLayer);
        })
        .catch(error => console.error(translations.errorGeo + ' ' + (error.message || error)));

    fetch('/assets/json/cq-marker.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.divIcon({
                            className: 'cq-div-icon',
                            html: feature.properties.name
                        })
                    });
                }
            }).addTo(cqZoneLayer);
        })
        .catch(error => console.error(translations.errorGeo + ' ' + (error.message || error)));

    cqZoneLayer.addTo(map);
}

function loadTimeZone() {
    if (currentLayer !== 'time') return;

    timeZoneLayer.clearLayers();

    fetch('/assets/json/time.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: 'grey',
                        weight: 4,
                        opacity: 1,
                        fillOpacity: 0
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        layer.on({
                            mouseover: function (e) {
                                var layer = e.target;
                                layer.setStyle({
                                    color: 'grey',
                                    weight: 4,
                                    opacity: 1,
                                    fillColor: 'grey',
                                    fillOpacity: 0.5
                                });
                                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                    layer.bringToFront();
                                }

                                var tooltipContainer = document.getElementById('tooltip-container');
                                tooltipContainer.innerHTML = `<div class="zone-tooltip">${feature.properties.name}</div>`;
                            },
                            mouseout: function (e) {
                                var layer = e.target;
                                layer.setStyle({
                                    color: 'grey',
                                    weight: 4,
                                    opacity: 1,
                                    fillOpacity: 0
                                });

                                var tooltipContainer = document.getElementById('tooltip-container');
                                tooltipContainer.innerHTML = '';
                            }
                        });
                    }
                }
            }).addTo(timeZoneLayer);
        })
        .catch(error => console.error(translations.errorGeo + ' ' + (error.message || error)));

    timeZoneLayer.addTo(map);
}

window.onload = function () {
    if (!map) {
        map = L.map('map', {
            minZoom: 3,
            maxZoom: 18,
            doubleClickZoom: false
        }).setView([40, 10], 3);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.Control.geocoder({
            defaultMarkGeocode: true
        }).addTo(map);

        const southWest = L.latLng(-90, -180);
        const northEast = L.latLng(90, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.on('drag', function () {
            map.panInsideBounds(bounds, { animate: false });
        });
    }

    addLocationButton();

    let layerSelect = document.getElementById('layer-select');
    layerSelect.addEventListener('change', function () {
        currentLayer = this.value;

        if (currentDrawnLayers) {
            currentDrawnLayers.clearLayers();
        }
        if (cqZoneLayer) {
            cqZoneLayer.clearLayers();
        }
        if (timeZoneLayer) {
            timeZoneLayer.clearLayers();
        }
        if (ituZoneLayer) {
            ituZoneLayer.clearLayers();
        }

        if (currentLayer === 'locator') {
            drawLocatorGrid();
        } else if (currentLayer === 'cq') {
            loadCQZone();
        } else if (currentLayer === 'time') {
            loadTimeZone();
        } else if (currentLayer === 'itu') {
            loadITUZone();
        }
    });

    map.on('moveend', function () {
        if (currentLayer === 'locator') {
            drawLocatorGrid();
        }
    });

    map.on('zoomend', function () {
        if (currentLayer === 'locator') {
            drawLocatorGrid();
        }
    });

    map.on('mousemove', function (e) {
        let lat = e.latlng.lat;
        let lon = e.latlng.lng;
        let locator = latLonToLocator(lat, lon);
        let latiElement = document.getElementById('lati');
        let longElement = document.getElementById('long');
        let mouseLocatorElement = document.getElementById('mouse-locator');

        latiElement.innerHTML = `${convertToDMS(lat)}`;
        longElement.innerHTML = `${convertToDMS(lon)}`;
        mouseLocatorElement.innerHTML = `${locator}`;
    });
};
