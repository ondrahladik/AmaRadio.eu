const timezones = Intl.supportedValuesOf('timeZone');
const timezoneSelector = document.getElementById('timezone-selector');
const searchInput = document.getElementById('timezone-search');
const timeDisplay = document.getElementById('time');
const timezoneContainer = document.getElementById('timezone-container');
const toggleButton = document.getElementById('toggle-button');
const fullButton = document.getElementById('full-button');
const localTimezoneButton = document.getElementById('local-timezone-button');
const timeControlDisplay = document.getElementById('time-control');

let isTimezoneContainerVisible = false;

function updateUrl() {
    const timezone = timezoneSelector.value.replace(/\//g, '-'); 
    const params = new URLSearchParams();
    if (timezone) params.set('zone', timezone); 
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

function populateTimezones(filter = '') {
    timezoneSelector.innerHTML = '';

    timezones
        .filter(timezone => timezone.toLowerCase().includes(filter.toLowerCase()))
        .forEach(timezone => {
            const option = document.createElement('option');
            option.value = timezone;
            option.textContent = timezone;
            timezoneSelector.appendChild(option);
        });
}

searchInput.addEventListener('input', (e) => {
    populateTimezones(e.target.value);
    updateUrl();
});

function updateTime() {
    const timezone = timezoneSelector.value;
    if (!timezone) return;
    const now = new Date().toLocaleString('en-US', { timeZone: timezone });
    const currentTime = new Date(now);
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    timeDisplay.textContent = timeString;

    document.title = translations.timeIs + `${timeString}`;
}

timezoneSelector.addEventListener('change', () => {
    updateTime();
    updateUrl();
});

function initializeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let timezone = params.get('zone'); 

    if (timezone) {
        timezone = timezone.replace(/-/g, '/'); 
    }

    populateTimezones(); 

    if (timezone && timezones.includes(timezone)) {
        timezoneSelector.value = timezone;
    } else {
        timezoneSelector.value = timezones[0];
    }

    updateTime(); 
}

initializeFromUrl();
setInterval(updateTime, 1000);

toggleButton.addEventListener('click', () => {
    if (timezoneContainer.style.display === 'none' || timezoneContainer.style.display === '') {
        timezoneContainer.style.display = 'flex';
        isTimezoneContainerVisible = true;
    } else {
        timezoneContainer.style.display = 'none';
        isTimezoneContainerVisible = false;
    }
    updateUrl(); 
});

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

fullButton.addEventListener('click', toggleFullScreen);

function setLocalTimezone() {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localTimezone && timezones.includes(localTimezone)) {
        timezoneSelector.value = localTimezone;
        updateTime();
        updateUrl(); 
    }
}

localTimezoneButton.addEventListener('click', setLocalTimezone);

let firstLoad = true; 

async function checkTimeSynchronization() {
    const apiKey = '7CZZIQIP9FI2';

    if (firstLoad) {
        timeControlDisplay.textContent = translations.timeWaiting; 
    }

    try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=${userTimeZone}`, { timeout: 5000 });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        const serverTime = new Date(data.formatted); 
        const localTime = new Date();

        let timeDifference = Math.abs(serverTime - localTime) / 1000;
        timeDifference = Math.round(timeDifference);

        if (timeDifference <= 1) { 
            timeControlDisplay.textContent = translations.timeSyncOk;
        } else {
            timeControlDisplay.textContent = translations.timeSyncError + timeDifference + translations.timeSeconds;
        }

        firstLoad = false; 
    } catch (error) {
        timeControlDisplay.textContent = '';
    }
}

setInterval(checkTimeSynchronization, 30000);
checkTimeSynchronization();
