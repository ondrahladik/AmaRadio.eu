function search() {
    var searchInput = document.getElementById('searchInput').value.trim();
    var stateName = document.getElementById('stateName');
    var stateFlag = document.getElementById('stateFlag');
    var ituValue = document.getElementById('ituValue');
    var cqValue = document.getElementById('cqValue');
    var dxccValue = document.getElementById('dxccValue');
    var qrzcq = document.getElementById('qrzcq');
    var qrz = document.getElementById('qrz');
    var eqsl = document.getElementById('eqsl');

    fetch('/assets/json/itu-prefix.json')
        .then(response => response.json())
        .then(jsonData => {
            var found = false;

            jsonData.forEach(function(item) {
                var regex = new RegExp(item.prefix, 'i');
                if (regex.test(searchInput)) {
                    found = true;

                    if (stateName.textContent !== item.name) {
                        stateName.textContent = item.name;
                    }

                    var flagUrl = `https://flagsapi.com/${item.flag.toUpperCase()}/flat/64.png`;
                    if (!stateFlag.firstChild || stateFlag.firstChild.firstChild?.src !== flagUrl) {
                        stateFlag.innerHTML = ''; 

                        var img = document.createElement('img');
                        img.src = flagUrl;
                        img.alt = `${item.name} flag`;

                        stateFlag.appendChild(img);
                    }

                    if (ituValue.textContent !== item.itu) {
                        ituValue.textContent = item.itu;
                    }
                    if (cqValue.textContent !== item.cq) {
                        cqValue.textContent = item.cq;
                    }
                    if (dxccValue.textContent !== item.dxcc) {
                        dxccValue.textContent = item.dxcc;
                    }

                    if (searchInput !== '') {
                        qrzcq.innerHTML = `<a href="https://www.qrzcq.com/call/${searchInput}" target="_blank">QRZCQ.com</a>`;
                        qrzcq.title = translations.newWindow;
                        qrz.innerHTML = `<a href="https://www.qrz.com/db/${searchInput}" target="_blank">QRZ.com</a>`;
                        qrz.title = translations.newWindow;
                        eqsl.innerHTML = `<a href="https://www.eqsl.cc/Member.cfm?${searchInput}" target="_blank">EQSL.cc</a>`;
                        eqsl.title = translations.newWindow;
                    } else {
                        qrzcq.textContent = '';
                        qrz.textContent = '';
                        eqsl.textContent = '';
                    }
                }
            });

            if (!found) {
                if (stateName.textContent !== translations.noResults) {
                    stateName.textContent = translations.noResults;
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
                qrzcq.textContent = 'QRZCQ.com';
                qrz.textContent = 'QRZ.com';
                eqsl.textContent = 'EQSL.cc';
            }
        })
        .catch(error => {
            console.error(translations.searchError + ': ', error);
            if (stateName.textContent !== translations.searchError) {
                stateName.textContent = translations.searchError;
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
            qrzcq.textContent = '';
            qrz.textContent = '';
            eqsl.textContent = '';
        });
}

document.getElementById('searchInput').addEventListener('input', search);

search();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').focus();
});
