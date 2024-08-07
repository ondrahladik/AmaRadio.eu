        const map = L.map('map', { 
                center: [35, 0], 
                zoom: 3, 
                layers: [], 
                maxZoom: 10, 
                minZoom: 3  
            });

            let geoJsonLayer;
            let tileLayer;
            let currentMarkers = [];
            let currentLines = [];
            let mainLatitude, mainLongitude;

            async function loadGeoJson() {
                try {
                    const response = await fetch('json/geo.json');
                    const data = await response.json();
                    geoJsonLayer = L.geoJson(data, {
                        style: {
                            color: 'black',
                            weight: 2,
                            opacity: 1
                        }
                    }).addTo(map);

                    const geoJsonBounds = geoJsonLayer.getBounds();
                    map.setMaxBounds(geoJsonBounds);
                } catch (error) {
                    console.error('Error loading GeoJSON:', error);
                }
            }

            loadGeoJson();

            const redDotIcon = L.icon({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });

            const mainLocIcon = L.icon({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                iconSize: [40, 40],
                iconAnchor: [16, 32]
            });

            function calculateDistance(lat1, lon1, lat2, lon2) {
                const R = 6371;
                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLon = (lon2 - lon1) * (Math.PI / 180);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            }

            let locatorCount = 0;

            function calculateMultipleLocatorCoordinates() {
                clearMap();

                const mainLocator = document.getElementById("locator").value.toUpperCase();
                const locators = document.getElementById("multiple-locators").value.trim().split("\n").map(loc => loc.trim().toUpperCase());
                const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}$/;

                if (!regex.test(mainLocator)) {
                    alert("The main locator must be in the format e.g. JO70QD.");
                    return;
                }

                if (locators.length === 0 || (locators.length === 1 && locators[0] === "")) {
                    alert("Please enter at least one secondary locator.");
                    return;
                }

                fetch('../qso-map.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        mainLocator: mainLocator,
                        locators: locators
                    })
                })
                .then(response => response.json())
                .then(data => {
                    mainLatitude = data.main.latitude;
                    mainLongitude = data.main.longitude;
                    showSingleLocatorMap(mainLatitude, mainLongitude, mainLocator);

                    let allBounds = [...data.main.bounds];
                    let maxDistance = 0;
                    let maxLocator = '';

                    data.locators.forEach(loc => {
                        const distance = Math.round(calculateDistance(mainLatitude, mainLongitude, loc.latitude, loc.longitude));
                        showMultipleLocatorsMap(loc.latitude, loc.longitude, loc.locator, distance);
                        allBounds.push(...loc.bounds);

                        const line = L.polyline([[mainLatitude, mainLongitude], [loc.latitude, loc.longitude]], { color: 'red', weight: 1 });
                        currentLines.push(line);
                        map.addLayer(line);

                        if (distance > maxDistance) {
                            maxDistance = distance;
                            maxLocator = loc.locator;
                        }
                    });

                    if (allBounds.length > 0) {
                        map.fitBounds(allBounds);
                    }

                    locatorCount = data.locators.length; 
                    updateDistanceInfo(mainLocator, maxLocator, maxDistance);
                })
                .catch(error => console.error('Error:', error));
            }


            function showSingleLocatorMap(latitude, longitude, locator) {
                const marker = L.marker([latitude, longitude], { icon: mainLocIcon }).addTo(map)
                    .bindPopup('Loc: ' + locator);
                currentMarkers.push(marker);

                map.setView([latitude, longitude], 12);
            }

            function showMultipleLocatorsMap(latitude, longitude, locator, distance) {
                const marker = L.marker([latitude, longitude], { icon: redDotIcon }).addTo(map)
                    .bindPopup(`Loc: ${locator}<br>Dist: ${distance} km`);
                currentMarkers.push(marker);
            }

            function clearMap() {
                currentMarkers.forEach(marker => map.removeLayer(marker));
                currentLines.forEach(line => map.removeLayer(line));
                currentMarkers = [];
                currentLines = [];
            }

            function updateDistanceInfo(mainLocator, maxLocator, maxDistance) {
                const distanceInfo = document.getElementById('distance-info');
                
                if (maxLocator && maxDistance !== undefined) {
                    distanceInfo.innerHTML = `QSO: ${locatorCount}<br>QTH: ${mainLocator}<br>QRB: ${maxLocator} (${maxDistance} km)`;
                    distanceInfo.classList.remove('hidden');
                    distanceInfo.classList.add('show');
                } else {
                    distanceInfo.classList.add('hidden');
                    distanceInfo.classList.remove('show');
                }
            }

            document.getElementById('map-toggle').addEventListener('click', function() {
                if (tileLayer) {
                    if (map.hasLayer(tileLayer)) {
                        map.removeLayer(tileLayer);
                        this.classList.remove('active');
                        this.innerHTML = '<i class="fas fa-map"></i>';
                    } else {
                        map.addLayer(tileLayer);
                        this.classList.add('active');
                        this.innerHTML = '<i class="fas fa-map"></i>';
                    }
                } else {
                    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(map);
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-map"></i>';
                }
            });

            document.getElementById('map-toggle').classList.remove('active');

            document.getElementById('location-btn').addEventListener('click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        const locator = convertCoordsToLocator(latitude, longitude);
                        document.getElementById('locator').value = locator;
                    }, function(error) {
                        alert('Geolocation error: ' + error.message);
                    });
                } else {
                    alert('Geolocation is not supported by this browser.');
                }
            });

            function convertCoordsToLocator(lat, lon) {
                return 'JO70QD'; 
            }