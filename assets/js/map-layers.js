const MAP_LAYERS = {
    'carto': {
        name: 'Carto (Dark)',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    'carto-light': {
        name: 'Carto (Light)',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    'cartodb-voyager': {
        name: 'Carto Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    'osm': {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    'esri-satellite': {
        name: 'Esri Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    'esri-topo': {
        name: 'Esri World Topo',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    'stadia-smooth': {
        name: 'Stadia Alidade Smooth',
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
};

const MAPLAYER_STORAGE_KEY = 'maplayer';
const DEFAULT_MAPLAYER = 'carto';

function getMapLayer() {
    let savedLayer = localStorage.getItem(MAPLAYER_STORAGE_KEY);
    
    if (!savedLayer || !MAP_LAYERS[savedLayer]) {
        return DEFAULT_MAPLAYER;
    }
    
    return savedLayer;
}

function saveMapLayer(layerKey) {
    if (MAP_LAYERS[layerKey]) {
        localStorage.setItem(MAPLAYER_STORAGE_KEY, layerKey);
        return true;
    }
    return false;
}

function createTileLayer() {
    const layerKey = getMapLayer();
    const layer = MAP_LAYERS[layerKey];
    
    return L.tileLayer(layer.url, {
        attribution: layer.attribution
    });
}

function getAllMapLayers() {
    return MAP_LAYERS;
}
