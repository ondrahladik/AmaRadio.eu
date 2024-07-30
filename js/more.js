        // Initialize the map
        var map = L.map('map').setView([20, 0], 2); // Global view

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Function to get URL parameter
        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        // Get the country name from URL parameter
        var countryName = getUrlParameter('country');
        if (!countryName) {
            alert('Please provide a country name in the URL parameter, e.g., ?country=Czech Republic');
        } else {
            // Fetch and display GeoJSON data for the specified country
            fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
                .then(response => response.json())
                .then(data => {
                    var countryLayer = L.geoJSON(data, {
                        filter: function(feature) {
                            return feature.properties.ADMIN === countryName;
                        },
                        style: function(feature) {
                            return {
                                color: "#ff0000", // Border color
                                weight: 4, // Border thickness
                                opacity: 0.8, // Border opacity
                                fillOpacity: 0.1 // Fill opacity
                            };
                        }
                    }).addTo(map);

                    // Zoom to the bounds of the country
                    if (countryLayer.getLayers().length > 0) {
                        map.fitBounds(countryLayer.getBounds());
                    } else {
                        alert('Country not found in GeoJSON data.');
                    }

                    // Fetch country information from RestCountries API
                    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                        .then(response => response.json())
                        .then(countryData => {
                            if (countryData.length > 0) {
                                var country = countryData[0];
                                var infoDiv = document.getElementById('info');
                                var pageTitle = document.getElementById('page-title');
                                
                                // Update the page title with the country name
                                pageTitle.innerHTML = `Country: ${country.name.common}`;
                                
                                // Update the info section with a table
                                infoDiv.innerHTML = `
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Official Name</td>
                                                <td>${country.name.official}</td>
                                                <td>Capital</td>
                                                <td>${country.capital ? country.capital[0] : 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>Population</td>
                                                <td>${country.population.toLocaleString()}</td>
                                                <td>Area</td>
                                                <td>${country.area.toLocaleString()} km²</td>
                                            </tr>
                                            <tr>
                                                <td>Region</td>
                                                <td>${country.region}</td>
                                                <td>Subregion</td>
                                                <td>${country.subregion}</td>
                                            </tr>
                                            <tr>
                                                <td>Languages</td>
                                                <td>${Object.values(country.languages).join(', ')}</td>
                                                <td>Currencies</td>
                                                <td>${Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <td>Timezones</td>
                                                <td>${country.timezones.join(', ')}</td>
                                                <td>Top-level Domain</td>
                                                <td>${country.tld.join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <td>Calling Codes</td>
                                                <td>${country.idd.root}${country.idd.suffixes.join(', +')}</td>
                                                <td>Borders</td>
                                                <td>${country.borders ? country.borders.join(', ') : 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                `;
                            } else {
                                console.log('No information available for this country.');
                            }
                        })
                        .catch(error => console.error('Error fetching country data:', error));
                })
                .catch(error => console.error('Error fetching GeoJSON data:', error));
        }
