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

        let isTimezoneContainerVisible = false;
        let currentColorHex = '61dafb'; // Default color
        const toggleIconVisibleSrc = `https://img.icons8.com/?size=100&id=2969&format=png&color=${currentColorHex}`;
        const toggleIconHiddenSrc = `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}`;
        const fullIconVisibleSrc = `https://img.icons8.com/?size=100&id=38797&format=png&color=${currentColorHex}`;
        const fullIconHiddenSrc = `https://img.icons8.com/?size=100&id=71200&format=png&color=${currentColorHex}`;

        function updateUrl() {
            const timezone = timezoneSelector.value.replace(/\//g, '-'); // Replaces all occurrences '/' s '-'
            const color = colorSelector.value === 'default' ? 'blue' : colorSelector.value; // Converts 'default' to 'blue'
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

            switch (color) {
                case 'blue':
                case 'default':
                    bgColor = '#282c34';  // Background color
                    textColor = '#61dafb'; // Text color
                    break;
                case 'black':
                    bgColor = '#000000'; // Background color
                    textColor = '#ffffff'; // Text color
                    break;
                case 'green':
                    bgColor = '#28342a'; // Background color
                    textColor = '#60fb9b'; // Text color
                    break;
                case 'red':
                    bgColor = '#342828'; // Background color
                    textColor = '#f76060'; // Text color
                    break;
            }

            container.style.backgroundColor = bgColor;
            elements.forEach(element => {
                element.style.backgroundColor = textColor; // Background color of elements
                element.style.color = '#000000'; // Text color of elements
            });

            document.body.style.backgroundColor = bgColor;
            document.body.style.color = textColor;

            // Update icon colors based on textColor
            currentColorHex = textColor.replace('#', '');
            toggleIcon.src = isTimezoneContainerVisible 
                ? toggleIconHiddenSrc.replace(/color=[^&]+/, `color=${currentColorHex}`)
                : toggleIconVisibleSrc.replace(/color=[^&]+/, `color=${currentColorHex}`);
            fullIcon.src = fullIconVisibleSrc.replace(/color=[^&]+/, `color=${currentColorHex}`);
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

            if (color === 'blue') {
                colorSelector.value = 'default'; // Shows 'default' as 'blue'
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
                toggleIcon.src = toggleIconHiddenSrc.replace(/color=[^&]+/, `color=${currentColorHex}`); // Change to new icon
                isTimezoneContainerVisible = true;
            } else {
                timezoneContainer.style.display = 'none';
                toggleIcon.src = toggleIconVisibleSrc.replace(/color=[^&]+/, `color=${currentColorHex}`); // Revert to original icon
                isTimezoneContainerVisible = false;
            }
            updateUrl(); // Ensure URL updates based on container visibility
        });

        function toggleFullScreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                fullIcon.src = fullIconVisibleSrc.replace(/color=[^&]+/, `color=${currentColorHex}`); 
            } else {
                document.documentElement.requestFullscreen();
                fullIcon.src = fullIconHiddenSrc.replace(/color=[^&]+/, `color=${currentColorHex}`); 
            }
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