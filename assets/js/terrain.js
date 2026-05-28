let map;
let terrainPoints = [];   
let markers = [];
let pathLine = null;
let locationMarker = null;
let chartInstance = null;
let modalChartInstance = null;
let lastChartArgs = null;
let profileData = null;   
let chartCrosshair = null;
let analyzeTimer = null;

function haversineJS(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2)
            + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function initMap() {
    const layerKey = getMapLayer();
    const layer = MAP_LAYERS[layerKey] || MAP_LAYERS['carto'];

    map = L.map('map', {
        center: [40, 10],
        zoom: 3,
        zoomControl: false
    });

    L.tileLayer(layer.url, {
        attribution: layer.attribution,
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.Control.geocoder({
        defaultMarkGeocode: false,
        position: 'topright',
        collapsed: true
    }).on('markgeocode', function(e) {
        map.setView(e.geocode.center, 12);
    }).addTo(map);

    const locationBtn = L.control({ position: 'topright' });
    locationBtn.onAdd = function() {
        const div = L.DomUtil.create('div', 'show-location-button');
        div.innerHTML = '<i class="fa-solid fa-location-dot"></i>';
        div.onclick = function() { addFromGPS(); };
        L.DomEvent.disableClickPropagation(div);
        return div;
    };
    locationBtn.addTo(map);

    map.on('click', function(e) {
        addPoint(e.latlng.lat, e.latlng.lng);
    });
}

function addPoint(lat, lon) {
    if (terrainPoints.length >= 2) return;
    terrainPoints.push({
        lat: parseFloat(parseFloat(lat).toFixed(6)),
        lon: parseFloat(parseFloat(lon).toFixed(6))
    });
    rebuildMarkers();
    if (terrainPoints.length >= 2) {
        scheduleAnalyze();
    }
}

function removePoint(index) {
    terrainPoints.splice(index, 1);
    rebuildMarkers();
    hideResults();
}

function clearAll() {
    terrainPoints = [];
    rebuildMarkers();
    hideResults();
}

function rebuildMarkers() {
    markers.forEach(function(m) { map.removeLayer(m); });
    markers = [];

    if (pathLine) { map.removeLayer(pathLine); pathLine = null; }

    const labels = ['A', 'B'];
    terrainPoints.forEach(function(pt, idx) {
        const icon = L.divIcon({
            html: '<div class="terrain-marker">' + labels[idx] + '</div>',
            className: '',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        const marker = L.marker([pt.lat, pt.lon], {icon: icon, draggable: true});

        const locStr = latLonToLocator(pt.lat, pt.lon);
        marker.bindTooltip(
            pt.lat.toFixed(4) + ', ' + pt.lon.toFixed(4) + ' (' + locStr + ')',
            {permanent: false, direction: 'top', className: 'terrain-tooltip', offset: [0, -14]}
        );

        marker.on('contextmenu', function(e) {
            L.DomEvent.stopPropagation(e);
            removePoint(idx);
        });

        marker.on('drag', function(e) {
            const ll = e.target.getLatLng();
            terrainPoints[idx] = {
                lat: parseFloat(ll.lat.toFixed(6)),
                lon: parseFloat(ll.lng.toFixed(6))
            };
            if (pathLine && terrainPoints.length >= 2) {
                pathLine.setLatLngs(terrainPoints.map(function(p) { return [p.lat, p.lon]; }));
            }

            const loc2 = latLonToLocator(terrainPoints[idx].lat, terrainPoints[idx].lon);
            marker.setTooltipContent(
                terrainPoints[idx].lat.toFixed(4) + ', ' + terrainPoints[idx].lon.toFixed(4) + ' (' + loc2 + ')'
            );
        });

        marker.on('dragend', function() {
            if (terrainPoints.length >= 2) scheduleAnalyze();
        });

        marker.addTo(map);
        markers.push(marker);
    });

    if (terrainPoints.length >= 2) {
        const latlngs = terrainPoints.map(function(p) { return [p.lat, p.lon]; });
        pathLine = L.polyline(latlngs, {
            color: '#00ffe0',
            weight: 2,
            dashArray: '6, 4',
            opacity: 0.65
        }).addTo(map);
    }
}

function parseInput(str) {
    str = str.trim().toUpperCase();

    if (/^[A-R][A-R][0-9][0-9][A-X][A-X]$/.test(str)) {
        return locatorToLatLon(str);
    }

    const normalized = str.replace(/[;\s]+/g, ',');
    const parts = normalized.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s !== ''; });
    if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            return {lat: lat, lon: lon};
        }
    }

    return null;
}

function locatorToLatLon(loc) {
    loc = loc.toUpperCase();
    const lon = (loc.charCodeAt(0) - 65) * 20 - 180
              + parseInt(loc[2]) * 2
              + (loc.charCodeAt(4) - 65) / 12
              + 1 / 24;
    const lat = (loc.charCodeAt(1) - 65) * 10 - 90
              + parseInt(loc[3])
              + (loc.charCodeAt(5) - 65) / 24
              + 1 / 48;
    return {lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6))};
}

function latLonToLocator(lat, lon) {
    lat += 90; lon += 180;
    const A = String.fromCharCode(65 + Math.floor(lon / 20));
    const B = String.fromCharCode(65 + Math.floor(lat / 10));
    const C = String(Math.floor((lon % 20) / 2));
    const D = String(Math.floor(lat % 10));
    const E = String.fromCharCode(65 + Math.floor((lon % 2) * 12));
    const F = String.fromCharCode(65 + Math.floor((lat % 1) * 24));
    return A + B + C + D + E + F;
}

function addFromInput() {
    const input = document.getElementById('pointInput');
    const val = input.value.trim();
    if (!val) return;

    const result = parseInput(val);
    if (!result) {
        alert(translations.invalidInput);
        return;
    }

    addPoint(result.lat, result.lon);
    input.value = '';
}

function addPointFromGPS() {
    if (!navigator.geolocation) {
        alert(translations.geoBrowser);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            addPoint(pos.coords.latitude, pos.coords.longitude);
        },
        function(err) {
            alert(translations.geoError + err.message);
        }
    );
}

function addFromGPS() {
    if (!navigator.geolocation) {
        alert(translations.geoBrowser);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const altitude = pos.coords.altitude;
            const locator = latLonToLocator(lat, lon);

            map.setView([lat, lon], 14);

            if (locationMarker) {
                map.removeLayer(locationMarker);
            }

            let popupContent = '<div style="text-align:center;"><b>' + translations.position + '</b></div>' +
                translations.lat + lat.toFixed(6) + '<br>' +
                translations.lon + lon.toFixed(6) + '<br>' +
                translations.loc + locator;
            if (altitude !== null) {
                popupContent += '<br>' + translations.alt + altitude.toFixed(0) + ' m';
            }

            locationMarker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(popupContent)
                .openPopup();
        },
        function(err) {
            alert(translations.geoError + err.message);
        }
    );
}

function toggleRFSettings() {
    const body    = document.getElementById('rfSettingsBody');
    const chevron = document.getElementById('rfChevron');
    const isOpen  = body.classList.toggle('open');
    chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
}

function scheduleAnalyze() {
    clearTimeout(analyzeTimer);
    analyzeTimer = setTimeout(analyze, 600);
}

async function analyze() {
    if (terrainPoints.length < 2) return;

    showLoading(true);

    const pts = terrainPoints.map(function(p) { return p.lat + ',' + p.lon; }).join('|');
    const url = 'terrain.php?pts=' + encodeURIComponent(pts);

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();

        if (!data.success) {
            alert(translations.loadError + (data.error ? ' (' + data.error + ')' : ''));
            showLoading(false);
            return;
        }

        showLoading(false);
        renderResults(data);

    } catch(e) {
        alert(translations.loadError + ' (' + e.message + ')');
        showLoading(false);
    }
}

function renderResults(data) {
    const pts       = data.points;
    const distances = pts.map(function(p) { return p.distance_km; });
    const terrain   = pts.map(function(p) { return p.elevation_m; });
    const totalDist = data.total_distance_km * 1000;

    const freqMHz = parseFloat(document.getElementById('rfFreq').value) || 144;
    const antA    = parseFloat(document.getElementById('rfAntA').value)  || 0;
    const antB    = parseFloat(document.getElementById('rfAntB').value)  || 0;

    const n = terrain.length;

    const startH = terrain[0] + antA;
    const endH   = terrain[n - 1] + antB;
    const los = terrain.map(function(_, i) {
        return startH + (endH - startH) * (i / (n - 1));
    });

    const effEarth = 6371000 * (4 / 3);
    const corrected = terrain.map(function(elev, i) {
        const d     = distances[i] * 1000;
        const bulge = (d * (totalDist - d)) / (2 * effEarth);
        return elev + Math.max(0, bulge);
    });

    const lambda = 300 / freqMHz;
    const fresnelTop = [];
    const fresnelBot = [];
    distances.forEach(function(dk, i) {
        const d1 = dk * 1000;
        const d2 = totalDist - d1;
        const radius = (d1 > 0 && d2 > 0) ? Math.sqrt((lambda * d1 * d2) / (d1 + d2)) : 0;
        fresnelTop.push(los[i] + radius);
        fresnelBot.push(los[i] - radius);
    });

    let losBlocked = false;
    for (let i = 1; i < n - 1; i++) {
        if (corrected[i] > los[i]) { losBlocked = true; break; }
    }

    const maxFresnel = Math.max.apply(null, fresnelTop.map(function(t, i) { return t - fresnelBot[i]; }));

    document.getElementById('statDistance').textContent = data.total_distance_km.toFixed(1) + ' km';
    document.getElementById('statMaxElev').textContent  = Math.max.apply(null, terrain).toFixed(0) + ' m';
    document.getElementById('statMinElev').textContent  = Math.min.apply(null, terrain).toFixed(0) + ' m';

    const losEl = document.getElementById('statLOS');
    losEl.textContent = losBlocked ? translations.losBlocked : translations.losClear;
    losEl.style.color = losBlocked ? '#ff6b6b' : '#4cff88';

    document.getElementById('statFresnel').textContent = (maxFresnel / 2).toFixed(0) + ' m';

    document.getElementById('terrainStats').classList.add('stats-visible');

    profileData = {
        distances: distances,
        totalDistKm: data.total_distance_km,
        points: terrainPoints.slice()
    };

    renderChart(distances, corrected, los, fresnelTop, fresnelBot);
}

function buildChartOnCanvas(canvas, distances, terrain, los, fresnelTop, fresnelBot, animate) {
    if (animate === undefined) animate = true;
    const ctx = canvas.getContext('2d');

    const terrGrad = ctx.createLinearGradient(0, 0, 0, 300);
    terrGrad.addColorStop(0,   'rgba(220,170,90,0.95)');
    terrGrad.addColorStop(0.5, 'rgba(160,110,45,0.85)');
    terrGrad.addColorStop(1,   'rgba(70,45,20,1)');

    const fresnelGrad = ctx.createLinearGradient(0, 0, 0, 300);
    fresnelGrad.addColorStop(0, 'rgba(0,255,180,0.18)');
    fresnelGrad.addColorStop(1, 'rgba(0,255,180,0.02)');

    const allY = terrain.concat(fresnelTop).concat(fresnelBot);
    const maxY = Math.max.apply(null, allY) + 25;
    const minY = Math.max(0, Math.min.apply(null, allY) - 15);

    const verticalLinePlugin = {
        id: 'verticalLine',
        afterDraw: function(chart) {
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const ctx2 = chart.ctx;
                const x = chart.tooltip._active[0].element.x;
                const topY    = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;
                ctx2.save();
                ctx2.beginPath();
                ctx2.moveTo(x, topY);
                ctx2.lineTo(x, bottomY);
                ctx2.lineWidth = 1;
                ctx2.setLineDash([4, 3]);
                ctx2.strokeStyle = 'rgba(255,255,255,0.25)';
                ctx2.stroke();
                ctx2.restore();
            }
        }
    };

    return new Chart(ctx, {
        type: 'line',
        plugins: [verticalLinePlugin],
        data: {
            labels: distances,
            datasets: [
                {
                    label: 'Terrain',
                    data: terrain,
                    borderColor: '#c89245',
                    backgroundColor: terrGrad,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    order: 3
                },
                {
                    label: 'Fresnel',
                    data: fresnelTop,
                    borderColor: 'rgba(0,255,180,0.5)',
                    backgroundColor: fresnelGrad,
                    borderWidth: 1,
                    fill: '+1',
                    tension: 0.2,
                    pointRadius: 0,
                    order: 2
                },
                {
                    label: '',
                    data: fresnelBot,
                    borderColor: 'rgba(0,255,180,0.5)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.2,
                    pointRadius: 0,
                    order: 2
                },
                {
                    label: 'LOS',
                    data: los,
                    borderColor: '#00d9ff',
                    borderDash: [8, 5],
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                    order: 1
                }
            ]
        },
        options: {
            responsive: !animate ? false : true,
            maintainAspectRatio: false,
            animation: animate ? {duration: 500} : false,
            devicePixelRatio: animate ? (window.devicePixelRatio || 1) : 1,
            layout: { padding: 0 },
            interaction: {mode: 'index', intersect: false},
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#d8e1ea',
                        boxWidth: 18,
                        font: {size: 9},
                        padding: 8,
                        filter: function(item) { return item.text !== ''; }
                    }
                },
                tooltip: {
                    backgroundColor: '#0d1117',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#d8e1ea',
                    padding: 7,
                    callbacks: {
                        title: function(items) {
                            return items[0].parsed.x.toFixed(2) + ' km';
                        },
                        label: function(ctx) {
                            if (!ctx.dataset.label) return null;
                            return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' m';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: Math.ceil(distances[distances.length - 1]),
                    afterFit: !animate ? function(scale) { scale.paddingLeft = 0; scale.paddingRight = 0; } : undefined,
                    ticks: {
                        color: '#7e8a97',
                        maxTicksLimit: 7,
                        font: {size: 9},
                        stepSize: 1,
                        callback: function(v) { return Math.round(v); }
                    },
                    grid: {color: 'rgba(255,255,255,0.04)'},
                    title: {display: false}
                },
                y: {
                    min: minY,
                    max: maxY,
                    afterFit: !animate ? function(scale) { scale.width = 0; } : undefined,
                    ticks: {
                        display: false
                    },
                    grid: {color: 'rgba(255,255,255,0.04)'},
                    title: {display: false}
                }
            }
        }
    });
}

function renderChart(distances, terrain, los, fresnelTop, fresnelBot) {
    lastChartArgs = { distances: distances, terrain: terrain, los: los, fresnelTop: fresnelTop, fresnelBot: fresnelBot };

    const canvas = document.getElementById('terrainChart');
    if (chartInstance) chartInstance.destroy();
    chartInstance = buildChartOnCanvas(canvas, distances, terrain, los, fresnelTop, fresnelBot);

    document.getElementById('terrainChartWrap').style.display = 'block';

    canvas.addEventListener('mousemove', onChartMouseMove);
    canvas.addEventListener('mouseleave', onChartMouseLeave);
}

function exportChartPNG() {
    if (!lastChartArgs) return;

    const W = 2400, HEADER = 44, CH = 900;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width  = W;
    exportCanvas.height = HEADER + CH;
    exportCanvas.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
    document.body.appendChild(exportCanvas);

    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, HEADER + CH);
    ctx.textBaseline = 'middle';

    const ROW_Y = HEADER / 2;

    ctx.textAlign = 'left';
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = '#7e8a97';
    const prefix = translations.generatedOn.replace('AMARADIO.eu', '');
    ctx.fillText(prefix, 30, ROW_Y);
    const prefixW = ctx.measureText(prefix).width;
    ctx.fillStyle = '#00ffe0';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText('AMARADIO.eu', 30 + prefixW, ROW_Y);

    const stats = [
        { label: translations.statLabels.distance, el: 'statDistance' },
        { label: translations.statLabels.maxElev,  el: 'statMaxElev'  },
        { label: translations.statLabels.minElev,  el: 'statMinElev'  },
        { label: translations.statLabels.los,      el: 'statLOS'      },
        { label: translations.statLabels.fresnel,  el: 'statFresnel'  },
    ];
    const SEP = '   |   ';

    ctx.font = '18px Arial, sans-serif';
    let totalW = 0;
    stats.forEach(function(s, i) {
        const val = document.getElementById(s.el) ? document.getElementById(s.el).textContent : '–';
        totalW += ctx.measureText(s.label + ': ').width;
        ctx.font = 'bold 18px Arial, sans-serif';
        totalW += ctx.measureText(val).width;
        ctx.font = '18px Arial, sans-serif';
        if (i < stats.length - 1) totalW += ctx.measureText(SEP).width;
    });

    let x = (W - totalW) / 2;
    stats.forEach(function(s, i) {
        const domEl = document.getElementById(s.el);
        const val = domEl ? domEl.textContent : '–';
        const valColor = (s.el === 'statLOS' && domEl && domEl.style.color)
            ? domEl.style.color : '#e8e8e8';

        ctx.font = '18px Arial, sans-serif';
        ctx.fillStyle = '#7e8a97';
        const labelPart = s.label + ': ';
        ctx.fillText(labelPart, x, ROW_Y);
        x += ctx.measureText(labelPart).width;

        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillStyle = valColor;
        ctx.fillText(val, x, ROW_Y);
        x += ctx.measureText(val).width;

        if (i < stats.length - 1) {
            ctx.font = '18px Arial, sans-serif';
            ctx.fillStyle = '#3a3a3a';
            ctx.fillText(SEP, x, ROW_Y);
            x += ctx.measureText(SEP).width;
        }
    });

    const chartCanvas = document.createElement('canvas');
    chartCanvas.width  = W;
    chartCanvas.height = CH;
    chartCanvas.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
    document.body.appendChild(chartCanvas);

    const ctx2 = chartCanvas.getContext('2d');
    ctx2.fillStyle = '#0a0a0a';
    ctx2.fillRect(0, 0, W, CH);

    const a = lastChartArgs;
    const tempChart = buildChartOnCanvas(chartCanvas, a.distances, a.terrain, a.los, a.fresnelTop, a.fresnelBot, false);

    ctx.drawImage(chartCanvas, 0, HEADER);

    if (terrainPoints.length >= 2) {
        const ptA = terrainPoints[0];
        const ptB = terrainPoints[1];
        const locA = latLonToLocator(ptA.lat, ptA.lon);
        const locB = latLonToLocator(ptB.lat, ptB.lon);

        const PAD = 7, FONT_LBL = 'bold 18px Arial, sans-serif', FONT_VAL = '18px Arial, sans-serif';
        const boxHeight = 19; 

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, HEADER + CH - boxHeight, W, boxHeight);

        const lineY = HEADER + CH - PAD;

        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#ffffff';

        ctx.textAlign = 'left';
        ctx.font = FONT_LBL;
        ctx.fillStyle = '#7e8a97';  
        ctx.fillText('A: ', PAD, lineY);
        const aLabelW = ctx.measureText('A: ').width;
        ctx.font = FONT_VAL;
        ctx.fillStyle = '#ffffff';
        const aCoords = ptA.lat.toFixed(4) + ', ' + ptA.lon.toFixed(4) + ' (' + locA + ')';
        ctx.fillText(aCoords, PAD + aLabelW, lineY);

        ctx.font = FONT_VAL;
        const bCoords = ptB.lat.toFixed(4) + ', ' + ptB.lon.toFixed(4) + ' (' + locB + ')';
        const bCoordsW = ctx.measureText(bCoords).width;
        ctx.font = FONT_LBL;
        const bLabelW = ctx.measureText('B: ').width;
        const bStartX = W - PAD - bLabelW - bCoordsW;
        ctx.fillStyle = '#7e8a97'; 
        ctx.fillText('B: ', bStartX, lineY);
        ctx.fillStyle = '#ffffff'; 
        ctx.font = FONT_VAL;
        ctx.fillText(bCoords, bStartX + bLabelW, lineY);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    const link = document.createElement('a');
    link.download = 'terrain-profile.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();

    tempChart.destroy();
    document.body.removeChild(exportCanvas);
    document.body.removeChild(chartCanvas);
}

function openChartModal() {
    if (!lastChartArgs) return;
    const modal = document.getElementById('chartModal');
    modal.style.display = 'flex';
    if (modalChartInstance) { modalChartInstance.destroy(); modalChartInstance = null; }
    requestAnimationFrame(function() {
        const canvas = document.getElementById('terrainChartModal');
        const a = lastChartArgs;
        modalChartInstance = buildChartOnCanvas(canvas, a.distances, a.terrain, a.los, a.fresnelTop, a.fresnelBot);
    });
}

function closeChartModal() {
    document.getElementById('chartModal').style.display = 'none';
    if (modalChartInstance) { modalChartInstance.destroy(); modalChartInstance = null; }
}

function onChartMouseMove(e) {
    if (!chartInstance || !profileData) return;
    const elems = chartInstance.getElementsAtEventForMode(e, 'index', {intersect: false}, true);
    if (!elems.length) return;

    const dataIdx = elems[0].index;
    const distKm  = profileData.distances[dataIdx];
    const ll      = interpolatePosition(distKm);
    if (!ll) return;

    if (!chartCrosshair) {
        chartCrosshair = L.circleMarker(ll, {
            radius: 7,
            color: '#00ffe0',
            fillColor: '#fff',
            fillOpacity: 0.9,
            weight: 2,
            interactive: false
        }).addTo(map);
    } else {
        chartCrosshair.setLatLng(ll);
    }
}

function onChartMouseLeave() {
    if (chartCrosshair) {
        map.removeLayer(chartCrosshair);
        chartCrosshair = null;
    }
}

function interpolatePosition(distKm) {
    if (!profileData || profileData.points.length < 2) return null;

    const pts = profileData.points;
    let cumDists = [0];
    for (let i = 1; i < pts.length; i++) {
        cumDists.push(cumDists[i-1] + haversineJS(pts[i-1].lat, pts[i-1].lon, pts[i].lat, pts[i].lon));
    }

    const d = Math.max(0, Math.min(distKm, cumDists[cumDists.length - 1]));

    for (let i = 1; i < cumDists.length; i++) {
        if (d <= cumDists[i] || i === cumDists.length - 1) {
            const segLen = cumDists[i] - cumDists[i-1];
            const t = segLen < 0.0001 ? 0 : (d - cumDists[i-1]) / segLen;
            return L.latLng(
                pts[i-1].lat + (pts[i].lat - pts[i-1].lat) * t,
                pts[i-1].lon + (pts[i].lon - pts[i-1].lon) * t
            );
        }
    }
    return null;
}

function showLoading(show) {
    const overlay   = document.getElementById('chartOverlay');
    const chartWrap = document.getElementById('terrainChartWrap');
    if (show) {
        chartWrap.style.display = 'block';
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function hideResults() {
    document.getElementById('terrainStats').classList.remove('stats-visible');
    document.getElementById('terrainChartWrap').style.display = 'none';
    closeChartModal();
    profileData = null;
    lastChartArgs = null;
    if (chartCrosshair) { map.removeLayer(chartCrosshair); chartCrosshair = null; }
    if (chartInstance)  { chartInstance.destroy(); chartInstance = null; }
}

function onRFChange() {
    if (terrainPoints.length >= 2 && profileData) scheduleAnalyze();
}

window.addEventListener('DOMContentLoaded', function() {
    initMap();

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            openHelpModal();
        }
        if (e.key === 'Escape') {
            closeChartModal();
        }
    });

    document.getElementById('pointInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addFromInput();
    });

    ['rfFreq', 'rfAntA', 'rfAntB'].forEach(function(id) {
        document.getElementById(id).addEventListener('change', onRFChange);
    });
});
