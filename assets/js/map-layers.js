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
    'osm': {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
