    let map;
    let currentMarker;
    let currentMarker1;
    let currentMarker2;
    let currentPolygon;
    let currentPolygon1;
    let currentPolygon2;
    let currentLine;
    let distanceControl;
    let isLocatorASet = false;
    let isLocatorBSet = false;

    function calculateSingleLocatorCoordinates() {
        clearMap(); 

        let locator = document.getElementById("locator").value.toUpperCase();
        let regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}$/;

        if (!regex.test(locator)) {
            alert("The locator must be in the format e.g. JO70QD.");
            return;
        }

        let [latitude, longitude, bounds] = getCoordinatesFromLocator(locator);
        showSingleLocatorMap(latitude, longitude, locator, bounds);
    }

    function calculateTwoLocatorsCoordinates() {
        clearMap(); // Clear existing map data before adding new

        let locator1 = document.getElementById("locator1").value.toUpperCase();
        let locator2 = document.getElementById("locator2").value.toUpperCase();
        let regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}$/;

        if (!regex.test(locator1) || !regex.test(locator2)) {
            alert("Both locators must be in the format e.g. JO70QD.");
            return;
        }

        // Check if the two locators are the same
        if (locator1 === locator2) {
            alert("Both locators are the same. Please enter different locators.");
            return;
        }

        let [lat1, lon1, bounds1] = getCoordinatesFromLocator(locator1);
        let [lat2, lon2, bounds2] = getCoordinatesFromLocator(locator2);

        let distance = calculateVincentyDistance(lat1, lon1, lat2, lon2);

        showTwoLocatorsMap(lat1, lon1, lat2, lon2, locator1, locator2, bounds1, bounds2, distance);
    }

    function getCoordinatesFromLocator(locator) {
        let fieldLon = locator.charCodeAt(0) - 65;
        let fieldLat = locator.charCodeAt(1) - 65;

        let squareLon = parseInt(locator[2]);
        let squareLat = parseInt(locator[3]);

        let subSquareLon = locator.charCodeAt(4) - 65;
        let subSquareLat = locator.charCodeAt(5) - 65;

        let longitude = (fieldLon * 20) - 180 + (squareLon * 2) + (subSquareLon / 12) + (1 / 24);
        let latitude = (fieldLat * 10) - 90 + squareLat + (subSquareLat / 24) + (1 / 48);

        let bottomLeftLon = (fieldLon * 20) - 180 + (squareLon * 2) + (subSquareLon / 12);
        let bottomLeftLat = (fieldLat * 10) - 90 + squareLat + (subSquareLat / 24);

        let topRightLon = bottomLeftLon + (1 / 12);
        let topRightLat = bottomLeftLat + (1 / 24);

        let bounds = [
            [bottomLeftLat, bottomLeftLon],
            [topRightLat, bottomLeftLon],
            [topRightLat, topRightLon],
            [bottomLeftLat, topRightLon]
        ];

        return [latitude, longitude, bounds];
    }

    function calculateVincentyDistance(lat1, lon1, lat2, lon2) {
        const a = 6378137; 
        const f = 1 / 298.257223563;
        const b = (1 - f) * a; 

        const L = (lon2 - lon1) * (Math.PI / 180);
        const U1 = Math.atan((1 - f) * Math.tan(lat1 * (Math.PI / 180)));
        const U2 = Math.atan((1 - f) * Math.tan(lat2 * (Math.PI / 180)));
        const sinU1 = Math.sin(U1);
        const cosU1 = Math.cos(U1);
        const sinU2 = Math.sin(U2);
        const cosU2 = Math.cos(U2);
        
        let lambda = L;
        let lambdaP;
        let iterLimit = 100;
        let sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaM, C, uSq, A, B, deltaSigma, s;
        
        do {
            sinSigma = Math.sqrt(Math.pow(cosU2 * Math.sin(lambda), 2) +
                                 Math.pow(cosU1 * sinU2 - sinU1 * cosU2 * Math.cos(lambda), 2));
            cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * Math.cos(lambda);
            sigma = Math.atan2(sinSigma, cosSigma);
            sinAlpha = cosU1 * cosU2 * Math.sin(lambda) / sinSigma;
            cos2Alpha = 1 - Math.pow(sinAlpha, 2);
            cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cos2Alpha;
            C = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
            lambdaP = lambda;
            lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * Math.pow(cos2SigmaM, 2))));
        } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
        
        A = 1 + (b / a - 1) * (cos2Alpha / 2);
        B = (b / a - 1) * (cos2Alpha / 4);
        uSq = cos2Alpha * Math.pow(a / b, 2) - 1;
        deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * Math.pow(cos2SigmaM, 2)) -
                    B / 6 * cos2SigmaM * (-3 + 4 * Math.pow(sinSigma, 2)) * (-3 + 4 * Math.pow(cos2SigmaM, 2))));
        s = b * A * (sigma - deltaSigma);

        return (s / 1000).toFixed(2);
    }

    function showSingleLocatorMap(latitude, longitude, locator, bounds) {
        if (!map) {
            map = L.map('map');
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            map.fitWorld();
        }

        clearMap(); 

        currentMarker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup('Loc: ' + locator)
            .openPopup();

        currentPolygon = L.polygon(bounds, { color: 'red', fillOpacity: 0.1 }).addTo(map);

        map.setView([latitude, longitude], 12);
    }

    function showTwoLocatorsMap(lat1, lon1, lat2, lon2, locator1, locator2, bounds1, bounds2, distance) {
        if (!map) {
            map = L.map('map');
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            map.fitWorld();
        }

        clearMap(); 

        let redIcon = L.divIcon({
            html: '<div style="background-color: red; color: white; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">A</div>',
            className: '',
            iconSize: [20, 20]
        });

        let blueIcon = L.divIcon({
            html: '<div style="background-color: blue; color: white; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">B</div>',
            className: '',
            iconSize: [20, 20]
        });

        currentMarker1 = L.marker([lat1, lon1], { icon: redIcon }).addTo(map);
        currentMarker2 = L.marker([lat2, lon2], { icon: blueIcon }).addTo(map);

        currentLine = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'green' }).addTo(map);

        function updateDistanceDisplay() {
            let distanceElement = document.getElementById('distance');
            if (distanceElement) {
                let roundedDistance = Math.round(distance);
                distanceElement.innerHTML = 'Distance: ' + roundedDistance + ' km';
            }
        }

        updateDistanceDisplay();

        const bounds = L.latLngBounds(
            [lat1, lon1],
            [lat2, lon2]
        );

        map.fitBounds(bounds, { padding: [50, 50] });
    }

    function clearMap() {
        if (currentMarker) map.removeLayer(currentMarker);
        if (currentMarker1) map.removeLayer(currentMarker1);
        if (currentMarker2) map.removeLayer(currentMarker2);

        if (currentPolygon) map.removeLayer(currentPolygon);
        if (currentPolygon1) map.removeLayer(currentPolygon1);
        if (currentPolygon2) map.removeLayer(currentPolygon2);

        if (currentLine) map.removeLayer(currentLine);

        if (distanceControl) map.removeControl(distanceControl);

        let distanceElement = document.getElementById('distance');
        if (distanceElement) {
            distanceElement.innerHTML = '';
        }
    }


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

    function showMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;
                    let altitude = position.coords.altitude;

                    let locator = latLonToLocator(latitude, longitude);

                    clearMap(); 

                    if (!map) {
                        map = L.map('map').setView([latitude, longitude], 13);
                    } else {
                        map.setView([latitude, longitude], 13);
                    }

                    if (currentMarker) {
                        map.removeLayer(currentMarker);
                    }

                    let popupContent = '<b>You are here!</b><br>Lat: ' + latitude.toFixed(6) + '<br>Lon: ' + longitude.toFixed(6) + '<br>Loc: ' + locator;
                    if (altitude !== null && !isNaN(altitude)) {
                        popupContent += '<br>Alt: ' + altitude.toFixed(0) + ' m';
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
            alert('Geolocation is not supported by this browser.');
        }
    }

    function updateLocatorFromGPS() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let gpsLocator = latLonToLocator(latitude, longitude);

                let locator1Input = document.getElementById('locator1');
                let locator2Input = document.getElementById('locator2');

                let currentLocator2 = locator2Input.value.trim();

                // Ladící výstupy
                console.log('GPS Locator:', gpsLocator);
                console.log('Current locator2 value:', currentLocator2);

                if (currentLocator2 === gpsLocator) {
                    console.log('Clearing locator2 because it matches GPS locator');
                    locator2Input.value = '';
                }

                locator1Input.value = gpsLocator;
                isLocatorASet = true;
            }, function(error) {
                alert('Error: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    function updateLocatorToBFromGPS() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let gpsLocator = latLonToLocator(latitude, longitude);

                let locator1Input = document.getElementById('locator1');
                let locator2Input = document.getElementById('locator2');

                let currentLocator1 = locator1Input.value.trim();

                console.log('GPS Locator:', gpsLocator);
                console.log('Current locator1 value:', currentLocator1);

                if (currentLocator1 === gpsLocator) {
                    console.log('Clearing locator1 because it matches GPS locator');
                    locator1Input.value = '';
                }

                locator2Input.value = gpsLocator;
                isLocatorBSet = true;
            }, function(error) {
                alert('Error: ' + error.message);
            });
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

        let addLocatorAButton = L.control({ position: 'topleft' });

        addLocatorAButton.onAdd = function () {
            let div = L.DomUtil.create('div', 'show-location-button add-locator');
            div.innerHTML = '<img src="https://img.icons8.com/?size=100&id=38670&format=png&color=ff0000&background=ff0000" alt="Add Locator A" />';
            div.onclick = function () {
                updateLocatorFromGPS();
            };
            return div;
        };

        addLocatorAButton.addTo(map);

        let addLocatorBButton = L.control({ position: 'topleft' });

        addLocatorBButton.onAdd = function () {
            let div = L.DomUtil.create('div', 'show-location-button add-locator-b');
            div.innerHTML = '<img src="https://img.icons8.com/?size=100&id=111063&format=png&color=0000ff" alt="Add Locator B" />';
            div.onclick = function () {
                updateLocatorToBFromGPS();
            };
            return div;
        };

        addLocatorBButton.addTo(map);
    }

    let clickCount = 0;
    let clickTimer;
    const doubleClickThreshold = 300; 

    function updateLocatorAFromMap(lat, lon) {
        let locatorAInput = document.getElementById('locator1');
        let locator = latLonToLocator(lat, lon);

        locatorAInput.value = locator;
        isLocatorASet = true;
    }

    function updateLocatorBFromMap(lat, lon) {
        let locatorBInput = document.getElementById('locator2');  
        let locator = latLonToLocator(lat, lon);

        locatorBInput.value = locator;
        isLocatorBSet = true; 
    }

    window.onload = function () {
    if (!map) {
        map = L.map('map', {
            minZoom: 3,
            maxZoom: 15
        }).setView([40, 0], 3);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const southWest = L.latLng(-90, -180);
        const northEast = L.latLng(90, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.on('drag', function() {
            map.panInsideBounds(bounds, { animate: false });
        });
    }

    addLocationButton();

    map.on('mousemove', function (e) {
        let lat = e.latlng.lat;
        let lon = e.latlng.lng;
        let locator = latLonToLocator(lat, lon);
        let mouseLocatorElement = document.getElementById('mouse-locator');
        if (locator) {
            mouseLocatorElement.innerText = locator;
            mouseLocatorElement.style.display = 'flex'; 
        } else {
            mouseLocatorElement.style.display = 'none'; 
        }
    });

    map.on('mouseout', function () {
        let mouseLocatorElement = document.getElementById('mouse-locator');
        mouseLocatorElement.style.display = 'none'; 
    });

    map.on('contextmenu', function(e) {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                let lat = e.latlng.lat;
                let lon = e.latlng.lng;
                updateLocatorAFromMap(lat, lon);

                clickCount = 0;
            }, doubleClickThreshold);
        } else if (clickCount === 2) {

            clearTimeout(clickTimer);
            let lat = e.latlng.lat;
            let lon = e.latlng.lng;
            updateLocatorBFromMap(lat, lon);

            clickCount = 0;
        }

        e.originalEvent.preventDefault();
    });
};

