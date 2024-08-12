const timezones = Intl.supportedValuesOf('timeZone');
const timezoneSelector = document.getElementById('timezone-selector');
const searchInput = document.getElementById('timezone-search');
const timeDisplay = document.getElementById('time');
const timezoneContainer = document.getElementById('timezone-container');
const toggleButton = document.getElementById('toggle-button');
const fullButton = document.getElementById('full-button');
const toggleIcon = document.getElementById('toggle-icon');
const fullIcon = document.getElementById('full-icon');
const colorSelector = document.getElementById('color-selector');
const localTimezoneButton = document.getElementById('local-timezone-button');
const localTimezoneIcon = document.getElementById('local-timezone-icon');
const timeControlDisplay = document.getElementById('time-control'); // Nový element pro zobrazení stavu synchronizace

let isTimezoneContainerVisible = false;
let currentColorHex = 'ffffff'; // Default color

// Helper function to update icon color
function updateIconColor(iconElement, baseUrl) {
    const updatedSrc = baseUrl.replace(/color=[^&]+/, `color=${currentColorHex}`);
    iconElement.src = updatedSrc;
}

function updateUrl() {
    const timezone = timezoneSelector.value.replace(/\//g, '-'); // Replaces all occurrences '/' s '-'
    const color = colorSelector.value === 'default' ? 'light' : colorSelector.value; // Converts 'default' to 'light'
    const params = new URLSearchParams();
    if (color) params.set('style', color); // Adds the 'style' parameter first
    if (timezone) params.set('zone', timezone); // Adds the 'zone' parameter as the second one
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
    updateUrl(); // Ensure URL updates based on search input
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

    document.title = `Time is ${timeString}`;
}

timezoneSelector.addEventListener('change', () => {
    updateTime();
    updateUrl();
});

function applyColorStyle(color) {
    const container = document.getElementById('timezone-container');
    const elements = container.querySelectorAll('input, select');
    let bgColor, textColor;

    // First, we remove the .light-text class from body and all elements
    document.body.classList.remove('light-text');
    elements.forEach(element => {
        element.classList.remove('light-text');
    });

    switch (color) {
        case 'light':
        case 'default':
            bgColor = '#bfbfbf';  // Background color
            textColor = '#333333'; // Text color
            // We will add the .light-text class when light is selected
            document.body.classList.add('light-text');
            elements.forEach(element => {
                element.classList.add('light-text');
            });
            break;
        case 'dark':
            bgColor = '#333333'; // Background color
            textColor = '#bfbfbf'; // Text color
            break;
        case 'green':
            bgColor = '#28342a'; // Background color
            textColor = '#60fb9b'; // Text color
            break;
        case 'red':
            bgColor = '#342828'; // Background color
            textColor = '#f76060'; // Text color
            break;
        case 'blue':
            bgColor = '#282c34'; // Barva pozadí
            textColor = '#61dafb'; // Text color
            break;
    }

    container.style.backgroundColor = bgColor;
    elements.forEach(element => {
        element.style.backgroundColor = textColor; // The background color of the elements
        element.style.color = '#000000'; // Element text color
    });

    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    // Update icon color based on text color
    currentColorHex = textColor.replace('#', '');
    updateIconColor(toggleIcon, isTimezoneContainerVisible ? `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}` : `https://img.icons8.com/?size=100&id=2969&format=png&color=${currentColorHex}`);
    updateIconColor(fullIcon, document.fullscreenElement ? `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}` : `https://img.icons8.com/?size=100&id=38797&format=png&color=${currentColorHex}`);
    localTimezoneIcon.src = `https://img.icons8.com/?size=100&id=7880&format=png&color=${currentColorHex}`;
}

colorSelector.addEventListener('change', (e) => {
    const color = e.target.value;
    applyColorStyle(color);
    updateUrl(); // Ensure URL updates based on color selection
});

function initializeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let timezone = params.get('zone'); // Reads a value from 'zone'
    let color = params.get('style'); // Reads a value from 'style'

    if (timezone) {
        timezone = timezone.replace(/-/g, '/'); // Replaces all occurrences '-' s '/'
    }

    populateTimezones(); // Fills in the list of time zones

    if (timezone && timezones.includes(timezone)) {
        timezoneSelector.value = timezone;
    } else {
        timezoneSelector.value = timezones[0]; // Default time zone
    }

    if (color === 'light') {
        colorSelector.value = 'default'; // Shows 'default' as 'light'
    } else {
        colorSelector.value = color || 'default'; // If not defined, set to 'default'
    }
    applyColorStyle(colorSelector.value); // Uses the color profile from the URL

    updateTime(); // Updates the time based on the parameters
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
    updateIconColor(toggleIcon, isTimezoneContainerVisible ? `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}` : `https://img.icons8.com/?size=100&id=2969&format=png&color=${currentColorHex}`);
    updateUrl(); // Ensure URL updates based on container visibility
});

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
    updateIconColor(fullIcon, document.fullscreenElement ? `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}` : `https://img.icons8.com/?size=100&id=38797&format=png&color=${currentColorHex}`);
}

fullButton.addEventListener('click', toggleFullScreen);

// Function to set the timezone to the user's local timezone
function setLocalTimezone() {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localTimezone && timezones.includes(localTimezone)) {
        timezoneSelector.value = localTimezone;
        updateTime();
        updateUrl(); // Ensure URL updates with the new local timezone
    }
}

localTimezoneButton.addEventListener('click', setLocalTimezone);

let firstLoad = true; // Variable indicating the first load

async function checkTimeSynchronization() {
    const apiKey = '7CZZIQIP9FI2'; // Enter your API key here

    if (firstLoad) {
        timeControlDisplay.textContent = '...waiting...'; // Display loading message
    }

    try {
        // Získání časového pásma uživatele
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Use the TimeZoneDB API with the user's timezone and API key
        const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=${userTimeZone}`, { timeout: 5000 });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        const serverTime = new Date(data.formatted);  // Using formatted from response
        const localTime = new Date();

        let timeDifference = Math.abs(serverTime - localTime) / 1000; // Difference in seconds
        timeDifference = Math.round(timeDifference); // Rounding to whole seconds

        if (timeDifference <= 1) { // If the difference is 1 second or less
            timeControlDisplay.textContent = 'the clocks are synchronized';
        } else {
            timeControlDisplay.textContent = `the time difference is ${timeDifference} seconds`;
        }

        firstLoad = false; // Set to false after first load
    } catch (error) {
        timeControlDisplay.textContent = '';
    }
}

// Regular time sync checks every 30 seconds
setInterval(checkTimeSynchronization, 30000);

// The first check starts immediately
checkTimeSynchronization();
