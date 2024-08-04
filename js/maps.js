        let map;
        let currentMarker;
        let locatorLayers = L.layerGroup();
        let drawnLayers = []; // Hold drawn layers for removal
        let currentDrawnLayers = null; // Track currently drawn layers
        let ituZoneLayer = L.layerGroup(); // Přidáme novou vrstvu pro ITU zóny
        let cqZoneLayer = L.layerGroup(); // Layer group for CQ zone
        let timeZoneLayer = L.layerGroup(); // Layer group for Time zones
        let currentLayer = 'none'; // Track current layer selection

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

                        if (!map) {
                            map = L.map('map').setView([latitude, longitude], 13);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }).addTo(map);
                        } else {
                            map.setView([latitude, longitude], 13);
                        }

                        if (currentMarker) {
                            map.removeLayer(currentMarker);
                        }

                        currentMarker = L.marker([latitude, longitude])
                            .addTo(map)
                            .bindPopup('<b>You are here!</b><br>Lat: ' + latitude + '<br>Lon: ' + longitude + '<br>Loc: ' + locator)
                            .openPopup();
                    },
                    function (error) {
                        alert('Error: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        }

        function addLocationButton() {
            let locationButton = L.control({ position: 'topleft' });

            locationButton.onAdd = function () {
                let div = L.DomUtil.create('div', 'show-location-button');
                div.innerHTML = '<img src="https://img.icons8.com/material-outlined/24/000000/marker.png" alt="My Location" />';
                div.onclick = function () {
                    showMyLocation();
                };
                return div;
            };

            locationButton.addTo(map);
        }

        function drawLocatorGrid() {
            if (currentLayer !== 'locator') return; // Skip if not the locator layer

            if (currentDrawnLayers) {
                currentDrawnLayers.clearLayers(); // Remove the previously drawn layers
            }
            drawnLayers.forEach(layer => layer.remove()); // Remove previous drawn layers
            drawnLayers = []; // Reset drawn layers

            currentDrawnLayers = L.layerGroup(); // Create new layer group for current draw

            let zoomLevel = map.getZoom();
            let bounds = map.getBounds();
            let southWest = bounds.getSouthWest();
            let northEast = bounds.getNorthEast();

            if (zoomLevel >= 11) {
                // Draw smallest squares (locators)
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

                        drawnLayers.push(L.polyline([
                            [fieldLat, fieldLon],
                            [fieldLat, fieldLon + 0.083333]
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat, fieldLon + 0.083333],
                            [fieldLat + 0.041666, fieldLon + 0.083333]
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat + 0.041666, fieldLon + 0.083333],
                            [fieldLat + 0.041666, fieldLon]
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat + 0.041666, fieldLon],
                            [fieldLat, fieldLon]
                        ], {color: 'red'}).addTo(currentDrawnLayers));
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
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat, fieldLon + 2],
                            [fieldLat + 1, fieldLon + 2]
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat + 1, fieldLon + 2],
                            [fieldLat + 1, fieldLon]
                        ], {color: 'red'}).addTo(currentDrawnLayers));

                        drawnLayers.push(L.polyline([
                            [fieldLat + 1, fieldLon],
                            [fieldLat, fieldLon]
                        ], {color: 'red'}).addTo(currentDrawnLayers));
                    }
                }
            } else {
                // Draw main squares
                for (let lon = -180; lon <= 180; lon += 20) {
                    drawnLayers.push(L.polyline([
                        [90, lon],
                        [-90, lon]
                    ], {color: 'red'}).addTo(currentDrawnLayers));
                }

                for (let lat = -90; lat <= 90; lat += 10) {
                    drawnLayers.push(L.polyline([
                        [lat, -180],
                        [lat, 180]
                    ], {color: 'red'}).addTo(currentDrawnLayers));
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
            if (currentLayer !== 'itu') return; // Skip if not ITU zone

            // Remove any existing ITU zone layers
            ituZoneLayer.clearLayers();

            // Load and display GeoJSON boundaries
            fetch('json/itu-border.json')
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
                .catch(error => console.error('Error loading GeoJSON:', error));

            // Load and display GeoJSON points with names
            fetch('json/itu-marker.json')
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
                .catch(error => console.error('Error loading GeoJSON:', error));

            ituZoneLayer.addTo(map);
        }

        function loadCQZone() {
            if (currentLayer !== 'cq') return; // Skip if not CQ zone

            // Remove any existing CQ zone layers
            cqZoneLayer.clearLayers();

            // Load and display GeoJSON boundaries
            fetch('json/cq-border.json')
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
                .catch(error => console.error('Error loading GeoJSON:', error));

            // Load and display GeoJSON points with names
            fetch('json/cq-marker.json')
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
                .catch(error => console.error('Error loading GeoJSON:', error));

            cqZoneLayer.addTo(map);
        }

        function loadTimeZone() {
            if (currentLayer !== 'time') return; // Skip if not the time zone

            // Remove any existing time zone layers
            timeZoneLayer.clearLayers();

            // Load and display GeoJSON boundaries
            fetch('json/time.geojson')
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
                                        
                                        // Zobrazení názvu zóny mimo zónu
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
                                        
                                        // Skrytí názvu zóny
                                        var tooltipContainer = document.getElementById('tooltip-container');
                                        tooltipContainer.innerHTML = '';
                                    }
                                });
                            }
                        }
                    }).addTo(timeZoneLayer);
                })
                .catch(error => console.error('Error loading GeoJSON:', error));

            timeZoneLayer.addTo(map);
        }

        window.onload = function () {
            map = L.map('map', {
                minZoom: 3,
                maxZoom: 14,
                maxBounds: [
                    [-85, -180],
                    [85, 180]
                ]
            }).setView([40, 0], 3);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            addLocationButton();

            // Attach event listener to the select element
            let layerSelect = document.getElementById('layer-select');
            layerSelect.addEventListener('change', function () {
                currentLayer = this.value; // Aktualizujeme aktuální výběr vrstvy

                // Odstraníme všechny vrstvy
                if (currentDrawnLayers) {
                    currentDrawnLayers.clearLayers(); // Odstraníme nakreslené vrstvy pro jiné volby než locator
                }
                if (cqZoneLayer) {
                    cqZoneLayer.clearLayers(); // Odstraníme CQ zóny
                }
                if (timeZoneLayer) {
                    timeZoneLayer.clearLayers(); // Odstraníme zóny času
                }
                if (ituZoneLayer) {
                    ituZoneLayer.clearLayers(); // Odstraníme ITU zóny
                }

                // Zobrazíme vybranou vrstvu
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

                // Update latitude and longitude in DMS format
                latiElement.innerHTML = `${convertToDMS(lat)}`;
                longElement.innerHTML = `${convertToDMS(lon)}`;
                mouseLocatorElement.innerHTML = `${locator}`;
            });
        };
