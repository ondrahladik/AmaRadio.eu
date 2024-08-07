document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burger");
    const sidebar = document.getElementById("sidebar");

    burger.addEventListener("click", function() {
        if (sidebar.classList.contains("open")) {

            sidebar.classList.remove("open");
            setTimeout(function() {
                toggleLeafletClasses(false);
            }, 300); 
        } else {
           
            toggleLeafletClasses(true);
            setTimeout(function() {
                sidebar.classList.add("open");
            }, 0); 
        }
    });

    document.addEventListener("click", function(event) {
        const isClickInside = sidebar.contains(event.target) || burger.contains(event.target);
        if (!isClickInside && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
            setTimeout(function() {
                toggleLeafletClasses(false);
            }, 300); 
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
