document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burger");
    const sidebar = document.getElementById("sidebar");

    burger.addEventListener("click", function() {
        if (sidebar.classList.contains("open")) {
            // Close sidebar first, then show leaflet elements
            sidebar.classList.remove("open");
            setTimeout(function() {
                toggleLeafletClasses(false);
            }, 300); // Adjust the timeout duration to match CSS transition duration
        } else {
            // Hide leaflet elements first, then open sidebar
            toggleLeafletClasses(true);
            setTimeout(function() {
                sidebar.classList.add("open");
            }, 0); // No delay needed here, or adjust if required
        }
    });

    document.addEventListener("click", function(event) {
        const isClickInside = sidebar.contains(event.target) || burger.contains(event.target);
        if (!isClickInside && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
            setTimeout(function() {
                toggleLeafletClasses(false);
            }, 300); // Adjust the timeout duration to match CSS transition duration
        }
    });

    function toggleLeafletClasses(hide) {
        const leafletElements = document.querySelectorAll('.leaflet-top, .leaflet-left, .leaflet-control, .form-container, .distance-info');
        leafletElements.forEach(function(element) {
            if (hide) {
                element.style.display = 'none';
            } else {
                element.style.display = '';
            }
        });
    }
});
