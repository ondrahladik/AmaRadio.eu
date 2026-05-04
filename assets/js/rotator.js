let map;
let storedLocator = localStorage.getItem('mylocator');
let myLocatorMarker = null;
let dxLocatorMarker = null;
let directionLayers = [];
let zoomLevel = 7;

localStorage.removeItem('rotator-zoomLevel');

window.addEventListener('DOMContentLoaded', function () {
    map = L.map('map', { 
        minZoom: 2, 
        maxZoom: 15,
        zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.Control.geocoder({
        defaultMarkGeocode: false
    }).addTo(map);

    const locationBtn = L.control({ position: 'topright' });
    locationBtn.onAdd = function () {
        const div = L.DomUtil.create('div', 'show-location-button');
        div.innerHTML = '<i class="fa-solid fa-location-dot"></i>';
        div.onclick = function () {
            showMyLocation();
        };
        L.DomEvent.disableClickPropagation(div);
        return div;
    };
    locationBtn.addTo(map);

    const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
    map.setMaxBounds(bounds);
    map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));

    if (storedLocator) {
        const [lat, lon] = getCoordinatesFromLocator(storedLocator);
        map.setView([lat, lon], 3);
        addMyLocatorMarker(lat, lon);
    } else {
        map.setView([40, 10], 3);
    }

    updateLocatorButton();

    document.getElementById('locatorButton').addEventListener('click', setMyLocator);
    document.getElementById('directionButton').addEventListener('click', triggerDirection);

    document.getElementById('mylocator').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); setMyLocator(); }
    });

    document.getElementById('dxlocator').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); triggerDirection(); }
    });

    map.on('contextmenu', function (e) {
        e.originalEvent.preventDefault();
    });
});

function setMyLocator() {
    const locator = document.getElementById('mylocator').value.toUpperCase();
    if (!validateLocator(locator)) { alert(translations.invalidLocator); return; }
    localStorage.setItem('mylocator', locator);
    storedLocator = locator;
    updateLocatorButton();
    const [lat, lon] = getCoordinatesFromLocator(locator);
    if (myLocatorMarker) { map.removeLayer(myLocatorMarker); myLocatorMarker = null; }
    addMyLocatorMarker(lat, lon);
}

function triggerDirection() {
    if (!storedLocator) { alert(translations.noMyLocator); return; }
    const dxLocator = document.getElementById('dxlocator').value.toUpperCase();
    if (!validateLocator(dxLocator)) { alert(translations.invalidLocator); return; }
    showDirection(dxLocator);
}

function showDirection(dxLocator) {
    const myCoords = getCoordinatesFromLocator(storedLocator);
    const dxCoords = getCoordinatesFromLocator(dxLocator);

    const angle = calculateBearing(myCoords, dxCoords);
    const distance = calculateDistance(myCoords, dxCoords);
    const cardinal = getCardinalDirection(angle);

    // Rotate compass needle
    document.getElementById('needleWrap').style.transform = `rotate(${angle}deg)`;

    // Update info panel
    document.getElementById('distanceValue').textContent = formatDistance(distance);
    document.getElementById('azimuthValue').textContent = Math.round(angle) + '°\u00A0' + cardinal;

    // Remove previous map layers
    clearDirectionLayers();

    // Great-circle path
    const gcPoints = calculateGreatCircle(myCoords, dxCoords, 80);
    const gcLine = L.polyline(gcPoints, {
        color: '#ff8800', weight: 4, opacity: 0.9, dashArray: '9,5'
    }).addTo(map);

    directionLayers = [gcLine];

    // DX marker
    if (dxLocatorMarker) { map.removeLayer(dxLocatorMarker); dxLocatorMarker = null; }
    const dxIcon = L.divIcon({
        className: '',
        html: '<div class="dx-marker"><i class="fas fa-satellite-dish"></i></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
    });
    dxLocatorMarker = L.marker(dxCoords, { icon: dxIcon }).addTo(map);

    map.panTo(myCoords);
}

function clearDirectionLayers() {
    directionLayers.forEach(l => map.removeLayer(l));
    directionLayers = [];
}

function addMyLocatorMarker(lat, lon) {
    const icon = L.divIcon({
        className: '',
        html: '<div class="home-marker"><i class="fas fa-home"></i></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
    });
    myLocatorMarker = L.marker([lat, lon], { icon }).addTo(map);
}

function updateLocatorButton() {
    const btn = document.getElementById('locatorButton');
    if (storedLocator) {
        btn.textContent = translations.editButton;
        document.getElementById('mylocator').value = storedLocator;
    } else {
        btn.textContent = translations.setButton;
    }
}

function validateLocator(loc) {
    return /^[A-Z]{2}\d{2}[A-Z]{2}$/.test(loc);
}

function getCardinalDirection(angle) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(angle / 22.5) % 16];
}

function formatDistance(km) {
    return Math.round(km) + ' km';
}

function getCoordinatesFromLocator(locator) {
    locator = locator.toUpperCase();
    const lon = (locator.charCodeAt(0) - 65) * 20
              - 180
              + parseInt(locator[2]) * 2
              + (locator.charCodeAt(4) - 65) / 12
              + 1 / 24;
    const lat = (locator.charCodeAt(1) - 65) * 10
              - 90
              + parseInt(locator[3])
              + (locator.charCodeAt(5) - 65) / 24
              + 1 / 48;
    return [lat, lon];
}

function calculateBearing(from, to) {
    const lat1 = from[0] * Math.PI / 180;
    const lat2 = to[0]   * Math.PI / 180;
    const dLon = (to[1] - from[1]) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function calculateDistance(from, to) {
    const R = 6371;
    const dLat = (to[0] - from[0]) * Math.PI / 180;
    const dLon = (to[1] - from[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
            + Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180)
            * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateGreatCircle(from, to, steps) {
    const lat1 = from[0] * Math.PI / 180, lon1 = from[1] * Math.PI / 180;
    const lat2 = to[0]   * Math.PI / 180, lon2 = to[1]   * Math.PI / 180;
    const d = 2 * Math.asin(Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
    ));
    if (d < 1e-9) return [from, to];
    const pts = [];
    for (let i = 0; i <= steps; i++) {
        const f = i / steps;
        const A = Math.sin((1 - f) * d) / Math.sin(d);
        const B = Math.sin(f * d) / Math.sin(d);
        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);
        pts.push([
            Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI,
            Math.atan2(y, x) * 180 / Math.PI
        ]);
    }
    return pts;
}

let currentLocationMarker = null;

function latLonToLocator(lat, lon) {
    let fieldLon = Math.floor((lon + 180) / 20);
    let fieldLat = Math.floor((lat + 90) / 10);
    let squareLon = Math.floor(((lon + 180) % 20) / 2);
    let squareLat = Math.floor(((lat + 90) % 10));
    let subSquareLon = Math.floor(((lon + 180) % 2) * 12);
    let subSquareLat = Math.floor(((lat + 90) % 1) * 24);
    return String.fromCharCode(fieldLon + 65) +
        String.fromCharCode(fieldLat + 65) +
        squareLon + squareLat +
        String.fromCharCode(subSquareLon + 65) +
        String.fromCharCode(subSquareLat + 65);
}

function showMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let locator = latLonToLocator(latitude, longitude);
                let altitude = position.coords.altitude;

                map.setView([latitude, longitude], 14);

                if (currentLocationMarker) {
                    map.removeLayer(currentLocationMarker);
                }

                let popupContent = '<div style="text-align: center;"><b>' + translations.position + '</b></div>' +
                    translations.lat + latitude.toFixed(6) + '<br>' +
                    translations.lon + longitude.toFixed(6) + '<br>' +
                    translations.loc + locator;
                if (altitude !== null && !isNaN(altitude)) {
                    popupContent += '<br>' + translations.alt + altitude.toFixed(0) + ' m';
                }

                currentLocationMarker = L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(popupContent)
                    .openPopup();
            },
            function (error) {
                alert(translations.error + error.message);
            }
        );
    } else {
        alert(translations.errorGeoBrowser);
    }
}