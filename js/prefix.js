function search() {
    var searchInput = document.getElementById('searchInput').value.trim();
    var stateName = document.getElementById('stateName');
    var stateFlag = document.getElementById('stateFlag');
    var ituValue = document.getElementById('ituValue');
    var cqValue = document.getElementById('cqValue');
    var dxccValue = document.getElementById('dxccValue');
    var qrzcq = document.getElementById('qrzcq');
    var qrz = document.getElementById('qrz');
    var info = document.getElementById('info');
    var eqsl = document.getElementById('eqsl');

    // Fetch JSON data from data.json file
    fetch('json/data.json')
        .then(response => response.json())
        .then(jsonData => {
            var found = false;

            // Find the matching result
            jsonData.forEach(function(item) {
                var regex = new RegExp(item.prefix, 'i');
                if (regex.test(searchInput)) {
                    found = true;

                    // Update state name if changed
                    if (stateName.textContent !== item.name) {
                        stateName.textContent = item.name;
                    }

                    // Update state flag if changed
                    var flagUrl = `https://flagsapi.com/${item.flag.toUpperCase()}/flat/64.png`; /* doubled from 32.png */
                    if (!stateFlag.firstChild || stateFlag.firstChild.src !== flagUrl) {
                        stateFlag.innerHTML = ''; // Clear previous content
                        var img = document.createElement('img');
                        img.src = flagUrl;
                        img.alt = `${item.name} flag`;
                        stateFlag.appendChild(img);
                    }

                    // Update ITU, CQ, and DXCC values if changed
                    if (ituValue.textContent !== item.itu) {
                        ituValue.textContent = item.itu;
                    }
                    if (cqValue.textContent !== item.cq) {
                        cqValue.textContent = item.cq;
                    }
                    if (dxccValue.textContent !== item.dxcc) {
                        dxccValue.textContent = item.dxcc;
                    }

                    // Update QRZCQ link
                    if (found && searchInput !== '') {
                        qrzcq.innerHTML = `<a href="https://www.qrzcq.com/call/${searchInput}" target="_blank">OPEN</a>`;
                    } else {
                        qrzcq.textContent = '-'; // Set to '-' if no results or input is empty
                    }

                    // Update QRZ.COM link
                    if (found && searchInput !== '') {
                        qrz.innerHTML = `<a href="https://www.qrz.com/db/${searchInput}" target="_blank">OPEN</a>`;
                    } else {
                        qrz.innerHTML = '-'; // Set to '-' if no results or input is empty
                    }

                    // Update EQSL link
                    if (found && searchInput !== '') {
                        eqsl.innerHTML = `<a href="https://www.eqsl.cc/Member.cfm?${searchInput}" target="_blank">OPEN</a>`;
                    } else {
                        eqsl.innerHTML = '-'; // Set to '-' if no results or input is empty
                    }

                    // Update MORE INFO link
                    if (found && searchInput !== '') {
                        info.innerHTML = `<a href="more.html?country=${encodeURIComponent(item.name)}" target="_blank">OPEN</a>`;
                    } else {
                        info.innerHTML = '-'; // Set to '-' if no results or input is empty
                    }
                }
            });

            // If no results found
            if (!found) {
                if (stateName.textContent !== 'No results') {
                    stateName.textContent = 'No results';
                }
                if (stateFlag.innerHTML !== '-') {
                    stateFlag.innerHTML = '-';
                }
                if (ituValue.textContent !== '-') {
                    ituValue.textContent = '-';
                }
                if (cqValue.textContent !== '-') {
                    cqValue.textContent = '-';
                }
                if (dxccValue.textContent !== '-') {
                    dxccValue.textContent = '-';
                }
                if (qrzcq.textContent !== '-') {
                    qrzcq.textContent = '-'; // Set to '-' if no results
                }
                if (qrz.innerHTML !== '-') {
                    qrz.innerHTML = '-'; // Set to '-' if no results
                }
                if (eqsl.innerHTML !== '-') {
                    eqsl.innerHTML = '-'; // Set to '-' if no results
                }
                if (info.innerHTML !== '-') {
                    info.innerHTML = '-'; // Set to '-' if no results
                }
            }
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
            if (stateName.textContent !== 'Error loading data') {
                stateName.textContent = 'Error loading data';
            }
            if (stateFlag.innerHTML !== '-') {
                stateFlag.innerHTML = '-';
            }
            if (ituValue.textContent !== '-') {
                ituValue.textContent = '-';
            }
            if (cqValue.textContent !== '-') {
                cqValue.textContent = '-';
            }
            if (dxccValue.textContent !== '-') {
                dxccValue.textContent = '-';
            }
            if (qrzcq.textContent !== '-') {
                qrzcq.textContent = '-'; // Set to '-' in case of error
            }
            if (qrz.innerHTML !== '-') {
                qrz.innerHTML = '-'; // Set to '-' in case of error
            }
            if (eqsl.innerHTML !== '-') {
                eqsl.innerHTML = '-'; // Set to '-' in case of error
            }
            if (info.innerHTML !== '-') {
                info.innerHTML = '-'; // Set to '-' in case of error
            }
        });
}

// Event listener for input change
document.getElementById('searchInput').addEventListener('input', search);

// Initial load
search();

// Set focus to search input after page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').focus();
});