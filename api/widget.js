

(function() {
    // Funkce pro načtení externího CSS
    function loadCSS(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = function() {
            console.log('CSS loaded successfully:', url);
        };
        link.onerror = function() {
            console.error('Failed to load CSS:', url);
        };
        document.head.appendChild(link);
    }

    // Funkce pro načtení externího JS
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = function() {
            console.log('Script loaded successfully:', url);
            if (callback) callback();
        };
        script.onerror = function() {
            console.error('Failed to load script:', url);
        };
        document.head.appendChild(script);
    }

    // HTML pro widget
    var widgetHTML = `
        <div class="widget-container">
            <input type="text" id="widgetSearchInput" placeholder="Enter the prefix...">
            <div id="widgetResultsContainer">
                <table>
                    <thead>
                        <tr>
                            <th colspan="2" class="state-column">STATE</th>
                            <th class="flag-column">FLAG</th>
                        </tr>
                    </thead>
                    <tbody id="widgetResults">
                        <tr id="widgetStateRow">
                            <td id="widgetStateName" colspan="2" class="state-column"></td>
                            <td id="widgetStateFlag" class="flag-column"></td>
                        </tr>
                        <tr id="widgetLabelsRow1">
                            <th class="itu-label">ITU</th>
                            <th class="cq-label">CQ</th>
                            <th class="dxcc-label">DXCC</th>
                        </tr>
                        <tr id="widgetValuesRow1">
                            <td id="widgetItuValue" class="itu-value"></td>
                            <td id="widgetCqValue" class="cq-value"></td>
                            <td id="widgetDxccValue" class="dxcc-value"></td>
                        </tr>
                        <tr id="widgetValuesRow2">
                            <td id="widgetQrz" class="qrz-value"></td>
                            <td id="widgetQrzcq" class="qrzcq-value"></td>
                            <td id="widgetEqsl" class="eqsl-value"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Definování dat přímo v kódu
    var jsonData = [
    {
      "name": "Afghanistan",
      "flag": "af",
      "itu": "40",
      "cq": "21",
      "dxcc": "003",
      "prefix": "^T6.*"
    },
    {
      "name": "Afghanistan",
      "flag": "af",
      "itu": "40",
      "cq": "21",
      "dxcc": "003",
      "prefix": "^YA.*"
    },
    {
      "name": "Albania",
      "flag": "al",
      "itu": "28",
      "cq": "15",
      "dxcc": "007",
      "prefix": "^ZA.*"
    },
    {
      "name": "Algeria",
      "flag": "dz",
      "itu": "37",
      "cq": "33",
      "dxcc": "400",
      "prefix": "^7R.*"
    },
    {
      "name": "Algeria",
      "flag": "dz",
      "itu": "37",
      "cq": "33",
      "dxcc": "400",
      "prefix": "^7[T-Y].*"
    },
    {
      "name": "Andorra",
      "flag": "ad",
      "itu": "27",
      "cq": "14",
      "dxcc": "203",
      "prefix": "^C3.*"
    },
    {
      "name": "Angola",
      "flag": "ao",
      "itu": "52",
      "cq": "36",
      "dxcc": "401",
      "prefix": "^D[2-3].*"
    },
    {
      "name": "Antigua and Barbuda",
      "flag": "ag",
      "itu": "11",
      "cq": "08",
      "dxcc": "094",
      "prefix": "^V2.*"
    },
    {
      "name": "Argentina",
      "flag": "ar",
      "itu": "14,16",
      "cq": "13",
      "dxcc": "100",
      "prefix": "^A[Y-Z].*"
    },
    {
      "name": "Argentina",
      "flag": "ar",
      "itu": "14,16",
      "cq": "13",
      "dxcc": "100",
      "prefix": "^L[O-W].*"
    },
    {
      "name": "Argentina",
      "flag": "ar",
      "itu": "14,16",
      "cq": "13",
      "dxcc": "100",
      "prefix": "^L[2-9].*"
    },
    {
      "name": "Armenia",
      "flag": "am",
      "itu": "29",
      "cq": "21",
      "dxcc": "014",
      "prefix": "^EK.*"
    },
    {
      "name": "Aruba",
      "flag": "aw",
      "itu": "11",
      "cq": "09",
      "dxcc": "091",
      "prefix": "^P4.*"
    },
    {
      "name": "Australia",
      "flag": "au",
      "itu": "55,58,59",
      "cq": "29,30",
      "dxcc": "150",
      "prefix": "^AX.*"
    },
    {
      "name": "Australia",
      "flag": "au",
      "itu": "55,58,59",
      "cq": "29,30",
      "dxcc": "150",
      "prefix": "^V[H-N].*"
    },
    {
      "name": "Australia",
      "flag": "au",
      "itu": "55,58,59",
      "cq": "29,30",
      "dxcc": "150",
      "prefix": "^VZ.*"
    },
    {
      "name": "Austria",
      "flag": "at",
      "itu": "28",
      "cq": "15",
      "dxcc": "206",
      "prefix": "^OE.*"
    },
    {
      "name": "Azerbaijan",
      "flag": "az",
      "itu": "29",
      "cq": "21",
      "dxcc": "018",
      "prefix": "^4[J-K].*"
    },
    {
      "name": "The Bahamas",
      "flag": "bs",
      "itu": "11",
      "cq": "08",
      "dxcc": "060",
      "prefix": "^C6.*"
    },
    {
      "name": "Bahrain",
      "flag": "bh",
      "itu": "39",
      "cq": "21",
      "dxcc": "304",
      "prefix": "^A9.*"
    },
    {
      "name": "Bangladesh",
      "flag": "bd",
      "itu": "41",
      "cq": "22",
      "dxcc": "305",
      "prefix": "^S[2-3].*"
    },
    {
      "name": "Barbados",
      "flag": "bb",
      "itu": "11",
      "cq": "08",
      "dxcc": "062",
      "prefix": "^8P.*"
    },
    {
      "name": "Belarus",
      "flag": "by",
      "itu": "29",
      "cq": "16",
      "dxcc": "027",
      "prefix": "^E[U-W].*"
    },
    {
      "name": "Belgium",
      "flag": "be",
      "itu": "27",
      "cq": "14",
      "dxcc": "209",
      "prefix": "^O[N-T].*"
    },
    {
      "name": "Belize",
      "flag": "bz",
      "itu": "11",
      "cq": "07",
      "dxcc": "066",
      "prefix": "^V3.*"
    },
    {
      "name": "Benin",
      "flag": "bj",
      "itu": "46",
      "cq": "35",
      "dxcc": "416",
      "prefix": "^TY.*"
    },
    {
      "name": "Bhutan",
      "flag": "bt",
      "itu": "41",
      "cq": "21",
      "dxcc": "306",
      "prefix": "^A5.*"
    },
    {
      "name": "Bolivia",
      "flag": "bo",
      "itu": "12,14",
      "cq": "10",
      "dxcc": "104",
      "prefix": "^CP.*"
    },
    {
      "name": "Bosnia and Herzegovina",
      "flag": "ba",
      "itu": "28",
      "cq": "15",
      "dxcc": "501",
      "prefix": "^E7.*"
    },
    {
      "name": "Botswana",
      "flag": "bw",
      "itu": "57",
      "cq": "38",
      "dxcc": "402",
      "prefix": "^A2.*"
    },
    {
      "name": "Botswana",
      "flag": "bw",
      "itu": "57",
      "cq": "38",
      "dxcc": "402",
      "prefix": "^8O.*"
    },
    {
      "name": "Brazil",
      "flag": "br",
      "itu": "12,13,15",
      "cq": "11",
      "dxcc": "108",
      "prefix": "^P[P-Y].*"
    },
    {
      "name": "Brazil",
      "flag": "br",
      "itu": "12,13,15",
      "cq": "11",
      "dxcc": "108",
      "prefix": "^Z[V-Z].*"
    },
    {
      "name": "Brunei",
      "flag": "bn",
      "itu": "54",
      "cq": "28",
      "dxcc": "345",
      "prefix": "^V8.*"
    },
    {
      "name": "Bulgaria",
      "flag": "bg",
      "itu": "28",
      "cq": "20",
      "dxcc": "212",
      "prefix": "^LZ.*"
    },
    {
      "name": "Burkina Faso",
      "flag": "bf",
      "itu": "46",
      "cq": "35",
      "dxcc": "480",
      "prefix": "^XT.*"
    },
    {
      "name": "Burundi",
      "flag": "bi",
      "itu": "52",
      "cq": "36",
      "dxcc": "404",
      "prefix": "^9U.*"
    },
    {
      "name": "Cambodia",
      "flag": "kh",
      "itu": "49",
      "cq": "26",
      "dxcc": "312",
      "prefix": "^XU.*"
    },
    {
      "name": "Cameroon",
      "flag": "cm",
      "itu": "47",
      "cq": "36",
      "dxcc": "406",
      "prefix": "^TJ.*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "02-04,09",
      "cq": "01-05",
      "dxcc": "001",
      "prefix": "^C[F-K].*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "02-04,09",
      "cq": "01-05",
      "dxcc": "001",
      "prefix": "^C[Y-Z].*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "02-04,09",
      "cq": "01-05",
      "dxcc": "001",
      "prefix": "^V[A-G].*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "02,09",
      "cq": "01,05",
      "dxcc": "001",
      "prefix": "^V[X-Y].*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "02-04,09",
      "cq": "01-05",
      "dxcc": "001",
      "prefix": "^X[J-O].*"
    },
    {
      "name": "Canada",
      "flag": "ca",
      "itu": "09",
      "cq": "02,05",
      "dxcc": "001",
      "prefix": "^VO.*"
    },
    {
      "name": "Cape Verde",
      "flag": "cv",
      "itu": "46",
      "cq": "35",
      "dxcc": "409",
      "prefix": "^D4.*"
    },
    {
      "name": "Central African Republic",
      "flag": "cf",
      "itu": "47",
      "cq": "36",
      "dxcc": "408",
      "prefix": "^TL.*"
    },
    {
      "name": "Chad",
      "flag": "td",
      "itu": "47",
      "cq": "36",
      "dxcc": "410",
      "prefix": "^TT.*"
    },
    {
      "name": "Chile",
      "flag": "cl",
      "itu": "14,16",
      "cq": "12",
      "dxcc": "110",
      "prefix": "^C[A-E].*"
    },
    {
      "name": "Chile",
      "flag": "cl",
      "itu": "14,16",
      "cq": "12",
      "dxcc": "110",
      "prefix": "^X[Q-R].*"
    },
    {
      "name": "Chile",
      "flag": "cl",
      "itu": "14,16",
      "cq": "12",
      "dxcc": "110",
      "prefix": "^3G.*"
    },
    {
      "name": "China",
      "flag": "cn",
      "itu": "33,42-44",
      "cq": "23,24",
      "dxcc": "318",
      "prefix": "^B.*"
    },
    {
      "name": "China",
      "flag": "cn",
      "itu": "33,42-44",
      "cq": "23,24",
      "dxcc": "318",
      "prefix": "^XS.*"
    },
    {
      "name": "China",
      "flag": "cn",
      "itu": "33,42-44",
      "cq": "23,24",
      "dxcc": "318",
      "prefix": "^3[H-U].*"
    },
    {
      "name": "Colombia",
      "flag": "co",
      "itu": "12",
      "cq": "09",
      "dxcc": "116",
      "prefix": "^H[J-K].*"
    },
    {
      "name": "Colombia",
      "flag": "co",
      "itu": "12",
      "cq": "09",
      "dxcc": "116",
      "prefix": "^5[J-K].*"
    },
    {
      "name": "Comoros",
      "flag": "km",
      "itu": "53",
      "cq": "39",
      "dxcc": "411",
      "prefix": "^D6.*"
    },
    {
      "name": "Cook Islands",
      "flag": "ck",
      "itu": "62",
      "cq": "32",
      "dxcc": "191,234",
      "prefix": "^E5.*"
    },
    {
      "name": "Costa Rica",
      "flag": "cr",
      "itu": "11",
      "cq": "07",
      "dxcc": "308",
      "prefix": "^TE.*"
    },
    {
      "name": "Costa Rica",
      "flag": "cr",
      "itu": "11",
      "cq": "07",
      "dxcc": "308",
      "prefix": "^TI.*"
    },
    {
      "name": "Croatia",
      "flag": "hr",
      "itu": "28",
      "cq": "15",
      "dxcc": "497",
      "prefix": "^9A.*"
    },
    {
      "name": "Cuba",
      "flag": "cu",
      "itu": "11",
      "cq": "08",
      "dxcc": "070",
      "prefix": "^C[L-M].*"
    },
    {
      "name": "Cuba",
      "flag": "cu",
      "itu": "11",
      "cq": "08",
      "dxcc": "070",
      "prefix": "^CO.*"
    },
    {
      "name": "Cuba",
      "flag": "cu",
      "itu": "11",
      "cq": "08",
      "dxcc": "070",
      "prefix": "^T4.*"
    },
    {
      "name": "Cyprus",
      "flag": "cy",
      "itu": "39",
      "cq": "20",
      "dxcc": "215",
      "prefix": "^C4.*"
    },
    {
      "name": "Cyprus",
      "flag": "cy",
      "itu": "39",
      "cq": "20",
      "dxcc": "215",
      "prefix": "^H2.*"
    },
    {
      "name": "Cyprus",
      "flag": "cy",
      "itu": "39",
      "cq": "20",
      "dxcc": "215",
      "prefix": "^P3.*"
    },
    {
      "name": "Cyprus",
      "flag": "cy",
      "itu": "39",
      "cq": "20",
      "dxcc": "215",
      "prefix": "^5B.*"
    },
    {
      "name": "Czech Republic",
      "flag": "cz",
      "itu": "28",
      "cq": "15",
      "dxcc": "503",
      "prefix": "^O[K-L].*"
    },
    {
      "name": "Democratic Republic of the Congo",
      "flag": "cd",
      "itu": "52",
      "cq": "36",
      "dxcc": "414",
      "prefix": "^9[O-T].*"
    },
    {
      "name": "Denmark",
      "flag": "dk",
      "itu": "18",
      "cq": "14",
      "dxcc": "221",
      "prefix": "^O[U-Z].*"
    },
    {
      "name": "Denmark",
      "flag": "dk",
      "itu": "18",
      "cq": "14",
      "dxcc": "221",
      "prefix": "^XP.*"
    },
    {
      "name": "Denmark",
      "flag": "dk",
      "itu": "18",
      "cq": "14",
      "dxcc": "221",
      "prefix": "^5[P-Q].*"
    },
    {
      "name": "Djibouti",
      "flag": "dj",
      "itu": "48",
      "cq": "37",
      "dxcc": "382",
      "prefix": "^J2.*"
    },
    {
      "name": "Dominica",
      "flag": "dm",
      "itu": "11",
      "cq": "08",
      "dxcc": "095",
      "prefix": "^J7.*"
    },
    {
      "name": "Dominican Republic",
      "flag": "do",
      "itu": "11",
      "cq": "08",
      "dxcc": "072",
      "prefix": "^HI.*"
    },
    {
      "name": "Ecuador",
      "flag": "ec",
      "itu": "12",
      "cq": "10",
      "dxcc": "120",
      "prefix": "^H[C-D].*"
    },
    {
      "name": "Egypt",
      "flag": "eg",
      "itu": "38",
      "cq": "34",
      "dxcc": "478",
      "prefix": "^SS[A-M].*"
    },
    {
      "name": "Egypt",
      "flag": "eg",
      "itu": "38",
      "cq": "34",
      "dxcc": "478",
      "prefix": "^SU.*"
    },
    {
      "name": "Egypt",
      "flag": "eg",
      "itu": "38",
      "cq": "34",
      "dxcc": "478",
      "prefix": "^6[A-B].*"
    },
    {
      "name": "El Salvador",
      "flag": "sv",
      "itu": "11",
      "cq": "07",
      "dxcc": "074",
      "prefix": "^HU.*"
    },
    {
      "name": "El Salvador",
      "flag": "sv",
      "itu": "11",
      "cq": "07",
      "dxcc": "074",
      "prefix": "^YS.*"
    },
    {
      "name": "Equatorial Guinea",
      "flag": "gq",
      "itu": "47",
      "cq": "36",
      "dxcc": "049",
      "prefix": "^3C.*"
    },
    {
      "name": "Eritrea",
      "flag": "er",
      "itu": "48",
      "cq": "37",
      "dxcc": "051",
      "prefix": "^E3.*"
    },
    {
      "name": "Estonia",
      "flag": "ee",
      "itu": "29",
      "cq": "15",
      "dxcc": "052",
      "prefix": "^ES.*"
    },
    {
      "name": "Ethiopia",
      "flag": "et",
      "itu": "48",
      "cq": "37",
      "dxcc": "053",
      "prefix": "^ET.*"
    },
    {
      "name": "Ethiopia",
      "flag": "et",
      "itu": "48",
      "cq": "37",
      "dxcc": "053",
      "prefix": "^9[E-F].*"
    },
    {
      "name": "Federated States of Micronesia",
      "flag": "fm",
      "itu": "65",
      "cq": "27",
      "dxcc": "173",
      "prefix": "^V6.*"
    },
    {
      "name": "Fiji",
      "flag": "fj",
      "itu": "56",
      "cq": "32",
      "dxcc": "176",
      "prefix": "^3D[N-Z].*"
    },
    {
      "name": "Finland",
      "flag": "fi",
      "itu": "18",
      "cq": "15",
      "dxcc": "224",
      "prefix": "^O[F-J].*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^F.*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^H[W-Y].*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^TH.*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^TK.*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^TM.*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^T[O-Q].*"
    },
    {
      "name": "France",
      "flag": "fr",
      "itu": "27",
      "cq": "14",
      "dxcc": "227",
      "prefix": "^T[V-X].*"
    },
    {
      "name": "Gabon",
      "flag": "ga",
      "itu": "52",
      "cq": "36",
      "dxcc": "420",
      "prefix": "^TR.*"
    },
    {
      "name": "Gambia",
      "flag": "gm",
      "itu": "46",
      "cq": "35",
      "dxcc": "422",
      "prefix": "^C5.*"
    },
    {
      "name": "Georgia",
      "flag": "ge",
      "itu": "29",
      "cq": "21",
      "dxcc": "075",
      "prefix": "^4L.*"
    },
    {
      "name": "Germany",
      "flag": "de",
      "itu": "28",
      "cq": "14",
      "dxcc": "230",
      "prefix": "^D[A-R].*"
    },
    {
      "name": "Germany",
      "flag": "de",
      "itu": "28",
      "cq": "14",
      "dxcc": "230",
      "prefix": "^Y[2-9].*"
    },
    {
      "name": "Ghana",
      "flag": "gh",
      "itu": "46",
      "cq": "35",
      "dxcc": "424",
      "prefix": "^9G.*"
    },
    {
      "name": "Greece",
      "flag": "gr",
      "itu": "28",
      "cq": "20",
      "dxcc": "236",
      "prefix": "^J4.*"
    },
    {
      "name": "Greece",
      "flag": "gr",
      "itu": "28",
      "cq": "20",
      "dxcc": "236",
      "prefix": "^S[V-Z].*"
    },
    {
      "name": "Grenada",
      "flag": "gd",
      "itu": "11",
      "cq": "08",
      "dxcc": "077",
      "prefix": "^J3.*"
    },
    {
      "name": "Guatemala",
      "flag": "gt",
      "itu": "12",
      "cq": "07",
      "dxcc": "076",
      "prefix": "^TD.*"
    },
    {
      "name": "Guatemala",
      "flag": "gt",
      "itu": "12",
      "cq": "07",
      "dxcc": "076",
      "prefix": "^TG.*"
    },
    {
      "name": "Guinea",
      "flag": "gn",
      "itu": "46",
      "cq": "35",
      "dxcc": "107",
      "prefix": "^3X.*"
    },
    {
      "name": "Guinea-Bissau",
      "flag": "gw",
      "itu": "46",
      "cq": "35",
      "dxcc": "109",
      "prefix": "^J5.*"
    },
    {
      "name": "Guyana",
      "flag": "gy",
      "itu": "12",
      "cq": "09",
      "dxcc": "129",
      "prefix": "^8R.*"
    },
    {
      "name": "Haiti",
      "flag": "ht",
      "itu": "11",
      "cq": "08",
      "dxcc": "078",
      "prefix": "^HH.*"
    },
    {
      "name": "Haiti",
      "flag": "ht",
      "itu": "11",
      "cq": "08",
      "dxcc": "078",
      "prefix": "^4V.*"
    },
    {
      "name": "Honduras",
      "flag": "hn",
      "itu": "11",
      "cq": "07",
      "dxcc": "080",
      "prefix": "^H[Q-R].*"
    },
    {
      "name": "Hong Kong (China)",
      "flag": "hk",
      "itu": "44",
      "cq": "24",
      "dxcc": "321",
      "prefix": "^VR.*"
    },
    {
      "name": "Hungary",
      "flag": "hu",
      "itu": "28",
      "cq": "15",
      "dxcc": "239",
      "prefix": "^HA.*"
    },
    {
      "name": "Hungary",
      "flag": "hu",
      "itu": "28",
      "cq": "15",
      "dxcc": "239",
      "prefix": "^HG.*"
    },
    {
      "name": "Iceland",
      "flag": "is",
      "itu": "17",
      "cq": "40",
      "dxcc": "242",
      "prefix": "^TF.*"
    },
    {
      "name": "India",
      "flag": "in",
      "itu": "41",
      "cq": "22",
      "dxcc": "324",
      "prefix": "^A[T-W].*"
    },
    {
      "name": "India",
      "flag": "in",
      "itu": "41",
      "cq": "22",
      "dxcc": "324",
      "prefix": "^V[T-W].*"
    },
    {
      "name": "India",
      "flag": "in",
      "itu": "41",
      "cq": "22",
      "dxcc": "324",
      "prefix": "^8[T-Y].*"
    },
    {
      "name": "Indonesia",
      "flag": "id",
      "itu": "51,54",
      "cq": "28",
      "dxcc": "327",
      "prefix": "^JZ.*"
    },
    {
      "name": "Indonesia",
      "flag": "id",
      "itu": "51,54",
      "cq": "28",
      "dxcc": "327",
      "prefix": "^P[K-O].*"
    },
    {
      "name": "Indonesia",
      "flag": "id",
      "itu": "51,54",
      "cq": "28",
      "dxcc": "327",
      "prefix": "^Y[B-H].*"
    },
    {
      "name": "Indonesia",
      "flag": "id",
      "itu": "51,54",
      "cq": "28",
      "dxcc": "327",
      "prefix": "^7[A-I].*"
    },
    {
      "name": "Indonesia",
      "flag": "id",
      "itu": "51,54",
      "cq": "28",
      "dxcc": "327",
      "prefix": "^8[A-I].*"
    },
    {
      "name": "Iran",
      "flag": "ir",
      "itu": "40",
      "cq": "21",
      "dxcc": "330",
      "prefix": "^E[P-Q].*"
    },
    {
      "name": "Iran",
      "flag": "ir",
      "itu": "40",
      "cq": "21",
      "dxcc": "330",
      "prefix": "^9[B-D].*"
    },
    {
      "name": "Iraq",
      "flag": "iq",
      "itu": "39",
      "cq": "21",
      "dxcc": "333",
      "prefix": "^HN.*"
    },
    {
      "name": "Iraq",
      "flag": "iq",
      "itu": "39",
      "cq": "21",
      "dxcc": "333",
      "prefix": "^YI.*"
    },
    {
      "name": "Ireland",
      "flag": "ie",
      "itu": "27",
      "cq": "14",
      "dxcc": "245",
      "prefix": "^E[I-J].*"
    },
    {
      "name": "Israel",
      "flag": "il",
      "itu": "39",
      "cq": "20",
      "dxcc": "336",
      "prefix": "^4X.*"
    },
    {
      "name": "Israel",
      "flag": "il",
      "itu": "39",
      "cq": "20",
      "dxcc": "336",
      "prefix": "^4Z.*"
    },
    {
      "name": "Italy",
      "flag": "it",
      "itu": "28",
      "cq": "15,33",
      "dxcc": "248",
      "prefix": "^I.*"
    },
    {
      "name": "Ivory Coast",
      "flag": "ci",
      "itu": "46",
      "cq": "35",
      "dxcc": "428",
      "prefix": "^TU.*"
    },
    {
      "name": "Jamaica",
      "flag": "jm",
      "itu": "11",
      "cq": "08",
      "dxcc": "082",
      "prefix": "^6Y.*"
    },
    {
      "name": "Japan",
      "flag": "jp",
      "itu": "45",
      "cq": "25",
      "dxcc": "339",
      "prefix": "^J[A-S].*"
    },
    {
      "name": "Japan",
      "flag": "jp",
      "itu": "45",
      "cq": "25",
      "dxcc": "339",
      "prefix": "^7[J-N].*"
    },
    {
      "name": "Japan",
      "flag": "jp",
      "itu": "45",
      "cq": "25",
      "dxcc": "339",
      "prefix": "^8[J-N].*"
    },
    {
      "name": "Jordan",
      "flag": "jo",
      "itu": "39",
      "cq": "20",
      "dxcc": "342",
      "prefix": "^JY.*"
    },
    {
      "name": "Kazakhstan",
      "flag": "kz",
      "itu": "29-31",
      "cq": "17",
      "dxcc": "130",
      "prefix": "^U[N-Q].*"
    },
    {
      "name": "Kenya",
      "flag": "ke",
      "itu": "48",
      "cq": "37",
      "dxcc": "430",
      "prefix": "^5[Y-Z].*"
    },
    {
      "name": "Kiribati",
      "flag": "ki",
      "itu": "65",
      "cq": "31",
      "dxcc": "301",
      "prefix": "^T3.*"
    },
    {
      "name": "Kuwait",
      "flag": "kw",
      "itu": "39",
      "cq": "21",
      "dxcc": "348",
      "prefix": "^9K.*"
    },
    {
      "name": "Kyrgyzstan",
      "flag": "kg",
      "itu": "30,31",
      "cq": "17",
      "dxcc": "135",
      "prefix": "^EX.*"
    },
    {
      "name": "Laos",
      "flag": "la",
      "itu": "49",
      "cq": "26",
      "dxcc": "143",
      "prefix": "^XW.*"
    },
    {
      "name": "Latvia",
      "flag": "lv",
      "itu": "29",
      "cq": "15",
      "dxcc": "145",
      "prefix": "^YL.*"
    },
    {
      "name": "Lebanon",
      "flag": "lb",
      "itu": "39",
      "cq": "20",
      "dxcc": "354",
      "prefix": "^OD.*"
    },
    {
      "name": "Lesotho",
      "flag": "ls",
      "itu": "57",
      "cq": "38",
      "dxcc": "432",
      "prefix": "^7P.*"
    },
    {
      "name": "Liberia",
      "flag": "lr",
      "itu": "46",
      "cq": "35",
      "dxcc": "434",
      "prefix": "^A8.*"
    },
    {
      "name": "Liberia",
      "flag": "lr",
      "itu": "46",
      "cq": "35",
      "dxcc": "434",
      "prefix": "^D5.*"
    },
    {
      "name": "Liberia",
      "flag": "lr",
      "itu": "46",
      "cq": "35",
      "dxcc": "434",
      "prefix": "^EL.*"
    },
    {
      "name": "Liberia",
      "flag": "lr",
      "itu": "46",
      "cq": "35",
      "dxcc": "434",
      "prefix": "^5[L-M].*"
    },
    {
      "name": "Liberia",
      "flag": "lr",
      "itu": "46",
      "cq": "35",
      "dxcc": "434",
      "prefix": "^6Z.*"
    },
    {
      "name": "Libya",
      "flag": "ly",
      "itu": "38",
      "cq": "34",
      "dxcc": "436",
      "prefix": "^5A.*"
    },
    {
      "name": "Liechtenstein",
      "flag": "li",
      "itu": "28",
      "cq": "14",
      "dxcc": "251",
      "prefix": "^HB((0)|(3Y)|(L)).*"
    },
    {
      "name": "Lithuania",
      "flag": "lt",
      "itu": "29",
      "cq": "15",
      "dxcc": "146",
      "prefix": "^LY.*"
    },
    {
      "name": "Luxembourg",
      "flag": "lu",
      "itu": "27",
      "cq": "14",
      "dxcc": "254",
      "prefix": "^LX.*"
    },
    {
      "name": "Macao (China)",
      "flag": "mo",
      "itu": "44",
      "cq": "24",
      "dxcc": "152",
      "prefix": "^XX.*"
    },
    {
      "name": "Madagascar",
      "flag": "mg",
      "itu": "53",
      "cq": "39",
      "dxcc": "438",
      "prefix": "^5[R-S].*"
    },
    {
      "name": "Madagascar",
      "flag": "mg",
      "itu": "53",
      "cq": "39",
      "dxcc": "438",
      "prefix": "^6X.*"
    },
    {
      "name": "Malawi",
      "flag": "mw",
      "itu": "53",
      "cq": "37",
      "dxcc": "440",
      "prefix": "^7Q.*"
    },
    {
      "name": "Malaysia",
      "flag": "my",
      "itu": "54",
      "cq": "28",
      "dxcc": "046,299",
      "prefix": "^9M.*"
    },
    {
      "name": "Malaysia",
      "flag": "my",
      "itu": "54",
      "cq": "28",
      "dxcc": "046,299",
      "prefix": "^9W.*"
    },
    {
      "name": "Maldives",
      "flag": "mv",
      "itu": "41",
      "cq": "22",
      "dxcc": "159",
      "prefix": "^8Q.*"
    },
    {
      "name": "Mali",
      "flag": "ml",
      "itu": "46",
      "cq": "35",
      "dxcc": "442",
      "prefix": "^TZ.*"
    },
    {
      "name": "Malta",
      "flag": "mt",
      "itu": "28",
      "cq": "15",
      "dxcc": "257",
      "prefix": "^9H.*"
    },
    {
      "name": "Marshall Islands",
      "flag": "mh",
      "itu": "65",
      "cq": "31",
      "dxcc": "168",
      "prefix": "^V7.*"
    },
    {
      "name": "Mauritania",
      "flag": "mr",
      "itu": "46",
      "cq": "35",
      "dxcc": "444",
      "prefix": "^5T.*"
    },
    {
      "name": "Mauritius",
      "flag": "mu",
      "itu": "53",
      "cq": "39",
      "dxcc": "165",
      "prefix": "^3B.*"
    },
    {
      "name": "Mexico",
      "flag": "mx",
      "itu": "10",
      "cq": "06",
      "dxcc": "050",
      "prefix": "^X[A-I].*"
    },
    {
      "name": "Mexico",
      "flag": "mx",
      "itu": "10",
      "cq": "06",
      "dxcc": "050",
      "prefix": "^4[A-C].*"
    },
    {
      "name": "Mexico",
      "flag": "mx",
      "itu": "10",
      "cq": "06",
      "dxcc": "050",
      "prefix": "^6[D-J].*"
    },
    {
      "name": "Moldova",
      "flag": "md",
      "itu": "29",
      "cq": "16",
      "dxcc": "179",
      "prefix": "^ER.*"
    },
    {
      "name": "Monaco",
      "flag": "mc",
      "itu": "27",
      "cq": "14",
      "dxcc": "260",
      "prefix": "^3A.*"
    },
    {
      "name": "Mongolia",
      "flag": "mn",
      "itu": "32,33",
      "cq": "23",
      "dxcc": "363",
      "prefix": "^J[T-V].*"
    },
    {
      "name": "Montenegro",
      "flag": "me",
      "itu": "28",
      "cq": "15",
      "dxcc": "514",
      "prefix": "^4O.*"
    },
    {
      "name": "Morocco",
      "flag": "ma",
      "itu": "37",
      "cq": "33",
      "dxcc": "446",
      "prefix": "^CN.*"
    },
    {
      "name": "Morocco",
      "flag": "ma",
      "itu": "37",
      "cq": "33",
      "dxcc": "446",
      "prefix": "^5[C-G].*"
    },
    {
      "name": "Mozambique",
      "flag": "mz",
      "itu": "53",
      "cq": "37",
      "dxcc": "181",
      "prefix": "^C[8-9].*"
    },
    {
      "name": "Myanmar",
      "flag": "mm",
      "itu": "49",
      "cq": "26",
      "dxcc": "309",
      "prefix": "^X[Y-Z].*"
    },
    {
      "name": "Namibia",
      "flag": "na",
      "itu": "57",
      "cq": "38",
      "dxcc": "464",
      "prefix": "^V5.*"
    },
    {
      "name": "Nauru",
      "flag": "nr",
      "itu": "65",
      "cq": "31",
      "dxcc": "157",
      "prefix": "^C2.*"
    },
    {
      "name": "Nepal",
      "flag": "np",
      "itu": "42",
      "cq": "22",
      "dxcc": "369",
      "prefix": "^9N.*"
    },
    {
      "name": "Netherlands",
      "flag": "nl",
      "itu": "27",
      "cq": "14",
      "dxcc": "263",
      "prefix": "^P[A-I].*"
    },
    {
      "name": "Netherlands",
      "flag": "nl",
      "itu": "27",
      "cq": "14",
      "dxcc": "263",
      "prefix": "^PJ.*"
    },
    {
      "name": "New Zealand",
      "flag": "nz",
      "itu": "60",
      "cq": "32",
      "dxcc": "170",
      "prefix": "^Z[K-M].*"
    },
    {
      "name": "Nicaragua",
      "flag": "ni",
      "itu": "11",
      "cq": "07",
      "dxcc": "086",
      "prefix": "^HT.*"
    },
    {
      "name": "Nicaragua",
      "flag": "ni",
      "itu": "11",
      "cq": "07",
      "dxcc": "086",
      "prefix": "^H[6-7].*"
    },
    {
      "name": "Nicaragua",
      "flag": "ni",
      "itu": "11",
      "cq": "07",
      "dxcc": "086",
      "prefix": "^YN.*"
    },
    {
      "name": "Niger",
      "flag": "ne",
      "itu": "46",
      "cq": "35",
      "dxcc": "187",
      "prefix": "^5U.*"
    },
    {
      "name": "Nigeria",
      "flag": "ng",
      "itu": "46",
      "cq": "35",
      "dxcc": "450",
      "prefix": "^5[N-O].*"
    },
    {
      "name": "Niue",
      "flag": "nu",
      "itu": "62",
      "cq": "32",
      "dxcc": "188",
      "prefix": "^E6.*"
    },
    {
      "name": "North Korea",
      "flag": "kp",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^HM.*"
    },
    {
      "name": "North Korea",
      "flag": "kp",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^P[5-9].*"
    },
    {
      "name": "Macedonia",
      "flag": "mk",
      "itu": "28",
      "cq": "15",
      "dxcc": "502",
      "prefix": "^Z3.*"
    },
    {
      "name": "Norway",
      "flag": "no",
      "itu": "18",
      "cq": "14",
      "dxcc": "266",
      "prefix": "^J[W-X].*"
    },
    {
      "name": "Norway",
      "flag": "no",
      "itu": "18",
      "cq": "14",
      "dxcc": "266",
      "prefix": "^L[A-N].*"
    },
    {
      "name": "Norway",
      "flag": "no",
      "itu": "18",
      "cq": "14",
      "dxcc": "266",
      "prefix": "^3Y.*"
    },
    {
      "name": "Oman",
      "flag": "om",
      "itu": "39",
      "cq": "21",
      "dxcc": "370",
      "prefix": "^A4.*"
    },
    {
      "name": "Pakistan",
      "flag": "pk",
      "itu": "41",
      "cq": "21",
      "dxcc": "372",
      "prefix": "^A[P-S].*"
    },
    {
      "name": "Pakistan",
      "flag": "pk",
      "itu": "41",
      "cq": "21",
      "dxcc": "372",
      "prefix": "^6[P-S].*"
    },
    {
      "name": "Palau",
      "flag": "pw",
      "itu": "64",
      "cq": "27",
      "dxcc": "022",
      "prefix": "^T8.*"
    },
    {
      "name": "Palestine",
      "flag": "ps",
      "itu": "39",
      "cq": "20",
      "dxcc": "510",
      "prefix": "^E4.*"
    },
    {
      "name": "Panama",
      "flag": "pa",
      "itu": "11",
      "cq": "07",
      "dxcc": "088",
      "prefix": "^H[O-P].*"
    },
    {
      "name": "Panama",
      "flag": "pa",
      "itu": "11",
      "cq": "07",
      "dxcc": "088",
      "prefix": "^H3.*"
    },
    {
      "name": "Panama",
      "flag": "pa",
      "itu": "11",
      "cq": "07",
      "dxcc": "088",
      "prefix": "^H[8-9].*"
    },
    {
      "name": "Panama",
      "flag": "pa",
      "itu": "11",
      "cq": "07",
      "dxcc": "088",
      "prefix": "^3[E-F].*"
    },
    {
      "name": "Papua New Guinea",
      "flag": "pg",
      "itu": "51",
      "cq": "28",
      "dxcc": "163",
      "prefix": "^P2.*"
    },
    {
      "name": "Paraguay",
      "flag": "py",
      "itu": "14",
      "cq": "11",
      "dxcc": "132",
      "prefix": "^ZP.*"
    },
    {
      "name": "Peru",
      "flag": "pe",
      "itu": "12",
      "cq": "10",
      "dxcc": "136",
      "prefix": "^O[A-C].*"
    },
    {
      "name": "Peru",
      "flag": "pe",
      "itu": "12",
      "cq": "10",
      "dxcc": "136",
      "prefix": "^4T.*"
    },
    {
      "name": "Philippines",
      "flag": "ph",
      "itu": "50",
      "cq": "27",
      "dxcc": "375",
      "prefix": "^D[U-Z].*"
    },
    {
      "name": "Philippines",
      "flag": "ph",
      "itu": "50",
      "cq": "27",
      "dxcc": "375",
      "prefix": "^4[D-I].*"
    },
    {
      "name": "Poland",
      "flag": "pl",
      "itu": "28",
      "cq": "15",
      "dxcc": "269",
      "prefix": "^HF.*"
    },
    {
      "name": "Poland",
      "flag": "pl",
      "itu": "28",
      "cq": "15",
      "dxcc": "269",
      "prefix": "^S[N-R].*"
    },
    {
      "name": "Poland",
      "flag": "pl",
      "itu": "28",
      "cq": "15",
      "dxcc": "269",
      "prefix": "^3Z.*"
    },
    {
      "name": "Portugal",
      "flag": "pt",
      "itu": "37",
      "cq": "14",
      "dxcc": "272",
      "prefix": "^C[Q-U].*"
    },
    {
      "name": "Qatar",
      "flag": "qa",
      "itu": "39",
      "cq": "21",
      "dxcc": "376",
      "prefix": "^A7.*"
    },
    {
      "name": "Republic of the Congo",
      "flag": "cd",
      "itu": "52",
      "cq": "36",
      "dxcc": "414",
      "prefix": "^TN.*"
    },
    {
      "name": "Romania",
      "flag": "ro",
      "itu": "28",
      "cq": "20",
      "dxcc": "275",
      "prefix": "^Y[O-R].*"
    },
    {
      "name": "Russia",
      "flag": "ru",
      "itu": "19-26,29-35",
      "cq": "16-19,23",
      "dxcc": "015,054",
      "prefix": "^R.*"
    },
    {
      "name": "Russia",
      "flag": "ru",
      "itu": "19-26,29-35",
      "cq": "16-19,23",
      "dxcc": "015,054",
      "prefix": "^U[A-I].*"
    },
    {
      "name": "Rwanda",
      "flag": "rw",
      "itu": "52",
      "cq": "36",
      "dxcc": "454",
      "prefix": "^9X.*"
    },
    {
      "name": "Saint Kitts and Nevis",
      "flag": "kn",
      "itu": "11",
      "cq": "08",
      "dxcc": "249",
      "prefix": "^V4.*"
    },
    {
      "name": "Saint Lucia",
      "flag": "lc",
      "itu": "11",
      "cq": "08",
      "dxcc": "097",
      "prefix": "^J6.*"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "flag": "vc",
      "itu": "11",
      "cq": "08",
      "dxcc": "098",
      "prefix": "^J8.*"
    },
    {
      "name": "Samoa",
      "flag": "ws",
      "itu": "62",
      "cq": "32",
      "dxcc": "190",
      "prefix": "^5W.*"
    },
    {
      "name": "San Marino",
      "flag": "sm",
      "itu": "28",
      "cq": "15",
      "dxcc": "278",
      "prefix": "^T7.*"
    },
    {
      "name": "São Tomé and Príncipe",
      "flag": "st",
      "itu": "47",
      "cq": "36",
      "dxcc": "219",
      "prefix": "^S9.*"
    },
    {
      "name": "Saudi Arabia",
      "flag": "sa",
      "itu": "39",
      "cq": "21",
      "dxcc": "378",
      "prefix": "^HZ.*"
    },
    {
      "name": "Saudi Arabia",
      "flag": "sa",
      "itu": "39",
      "cq": "21",
      "dxcc": "378",
      "prefix": "^7Z.*"
    },
    {
      "name": "Saudi Arabia",
      "flag": "sa",
      "itu": "39",
      "cq": "21",
      "dxcc": "378",
      "prefix": "^8Z.*"
    },
    {
      "name": "Senegal",
      "flag": "sn",
      "itu": "46",
      "cq": "35",
      "dxcc": "456",
      "prefix": "^6[V-W].*"
    },
    {
      "name": "Republic of Serbia",
      "flag": "rs",
      "itu": "28",
      "cq": "15",
      "dxcc": "296",
      "prefix": "^Y[T-U].*"
    },
    {
      "name": "Seychelles",
      "flag": "sc",
      "itu": "53",
      "cq": "39",
      "dxcc": "379",
      "prefix": "^S7.*"
    },
    {
      "name": "Sierra Leone",
      "flag": "sl",
      "itu": "46",
      "cq": "35",
      "dxcc": "458",
      "prefix": "^9L.*"
    },
    {
      "name": "Singapore",
      "flag": "sg",
      "itu": "54",
      "cq": "28",
      "dxcc": "381",
      "prefix": "^S6.*"
    },
    {
      "name": "Singapore",
      "flag": "sg",
      "itu": "54",
      "cq": "28",
      "dxcc": "381",
      "prefix": "^9V.*"
    },
    {
      "name": "Slovakia",
      "flag": "sk",
      "itu": "28",
      "cq": "15",
      "dxcc": "504",
      "prefix": "^OM.*"
    },
    {
      "name": "Slovenia",
      "flag": "si",
      "itu": "28",
      "cq": "15",
      "dxcc": "499",
      "prefix": "^S5.*"
    },
    {
      "name": "Solomon Islands",
      "flag": "sb",
      "itu": "51",
      "cq": "28",
      "dxcc": "185",
      "prefix": "^H4.*"
    },
    {
      "name": "Somalia",
      "flag": "so",
      "itu": "48",
      "cq": "37",
      "dxcc": "232",
      "prefix": "^T5.*"
    },
    {
      "name": "Somalia",
      "flag": "so",
      "itu": "48",
      "cq": "37",
      "dxcc": "232",
      "prefix": "^6O.*"
    },
    {
      "name": "South Africa",
      "flag": "za",
      "itu": "57",
      "cq": "38",
      "dxcc": "462",
      "prefix": "^S8.*"
    },
    {
      "name": "South Africa",
      "flag": "za",
      "itu": "57",
      "cq": "38",
      "dxcc": "462",
      "prefix": "^Z[R-U].*"
    },
    {
      "name": "South Korea",
      "flag": "kr",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^D[S-T].*"
    },
    {
      "name": "South Korea",
      "flag": "kr",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^D[7-9].*"
    },
    {
      "name": "South Korea",
      "flag": "kr",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^HL.*"
    },
    {
      "name": "South Korea",
      "flag": "kr",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^6[K-N].*"
    },
    {
      "name": "South Sudan",
      "flag": "ss",
      "itu": "44",
      "cq": "25",
      "dxcc": "344",
      "prefix": "^Z8.*"
    },
    {
      "name": "Spain",
      "flag": "es",
      "itu": "37",
      "cq": "14",
      "dxcc": "281",
      "prefix": "^A[M-O].*"
    },
    {
      "name": "Spain",
      "flag": "es",
      "itu": "37",
      "cq": "14",
      "dxcc": "281",
      "prefix": "^E[A-H].*"
    },
    {
      "name": "Sri Lanka",
      "flag": "lk",
      "itu": "41",
      "cq": "22",
      "dxcc": "315",
      "prefix": "^4[P-S].*"
    },
    {
      "name": "Sudan",
      "flag": "sd",
      "itu": "47,48",
      "cq": "34",
      "dxcc": "466",
      "prefix": "^S((S[N-Z])|(T[A-Z])).*"
    },
    {
      "name": "Sudan",
      "flag": "sd",
      "itu": "47,48",
      "cq": "34",
      "dxcc": "466",
      "prefix": "^6[T-U].*"
    },
    {
      "name": "Suriname",
      "flag": "sr",
      "itu": "12",
      "cq": "09",
      "dxcc": "140",
      "prefix": "^PZ.*"
    },
    {
      "name": "Swaziland",
      "flag": "sz",
      "itu": "57",
      "cq": "38",
      "dxcc": "468",
      "prefix": "^3D[A-M].*"
    },
    {
      "name": "Sweden",
      "flag": "se",
      "itu": "18",
      "cq": "14",
      "dxcc": "284",
      "prefix": "^S[A-M].*"
    },
    {
      "name": "Sweden",
      "flag": "se",
      "itu": "18",
      "cq": "14",
      "dxcc": "284",
      "prefix": "^7S.*"
    },
    {
      "name": "Sweden",
      "flag": "se",
      "itu": "18",
      "cq": "14",
      "dxcc": "284",
      "prefix": "^8S.*"
    },
    {
      "name": "Switzerland",
      "flag": "ch",
      "itu": "28",
      "cq": "14",
      "dxcc": "287",
      "prefix": "^HB((1)|(2)|(4)|(5)|(6)|(7)|(8)|(9)|(3[A-X])|(3[Z])).*"
    },
    {
      "name": "Switzerland",
      "flag": "ch",
      "itu": "28",
      "cq": "14",
      "dxcc": "287",
      "prefix": "^HE.*"
    },
    {
      "name": "Syria",
      "flag": "sy",
      "itu": "39",
      "cq": "20",
      "dxcc": "384",
      "prefix": "^YK.*"
    },
    {
      "name": "Syria",
      "flag": "sy",
      "itu": "39",
      "cq": "20",
      "dxcc": "384",
      "prefix": "^6C.*"
    },
    {
      "name": "Taiwan",
      "flag": "tw",
      "itu": "44",
      "cq": "24",
      "dxcc": "386",
      "prefix": "^B(([M-Q])|([U-X])).*"
    },
    {
      "name": "Tajikistan",
      "flag": "tj",
      "itu": "30",
      "cq": "17",
      "dxcc": "262",
      "prefix": "^EY.*"
    },
    {
      "name": "United Republic of Tanzania",
      "flag": "tz",
      "itu": "53",
      "cq": "37",
      "dxcc": "470",
      "prefix": "^5[H-I].*"
    },
    {
      "name": "Thailand",
      "flag": "th",
      "itu": "49",
      "cq": "26",
      "dxcc": "387",
      "prefix": "^E2.*"
    },
    {
      "name": "Thailand",
      "flag": "th",
      "itu": "49",
      "cq": "26",
      "dxcc": "387",
      "prefix": "^HS.*"
    },
    {
      "name": "Timor-Leste",
      "flag": "tl",
      "itu": "54",
      "cq": "28",
      "dxcc": "511",
      "prefix": "^4W.*"
    },
    {
      "name": "Togo",
      "flag": "tg",
      "itu": "46",
      "cq": "35",
      "dxcc": "483",
      "prefix": "^5V.*"
    },
    {
      "name": "Tonga",
      "flag": "to",
      "itu": "62",
      "cq": "32",
      "dxcc": "160",
      "prefix": "^A3.*"
    },
    {
      "name": "Trinidad and Tobago",
      "flag": "tt",
      "itu": "11",
      "cq": "09",
      "dxcc": "090",
      "prefix": "^9[Y-Z].*"
    },
    {
      "name": "Tunisia",
      "flag": "tn",
      "itu": "37",
      "cq": "33",
      "dxcc": "474",
      "prefix": "^TS.*"
    },
    {
      "name": "Tunisia",
      "flag": "tn",
      "itu": "37",
      "cq": "33",
      "dxcc": "474",
      "prefix": "^3V.*"
    },
    {
      "name": "Turkey",
      "flag": "tr",
      "itu": "39",
      "cq": "20",
      "dxcc": "390",
      "prefix": "^T[A-C].*"
    },
    {
      "name": "Turkey",
      "flag": "tr",
      "itu": "39",
      "cq": "20",
      "dxcc": "390",
      "prefix": "^YM.*"
    },
    {
      "name": "Turkmenistan",
      "flag": "tm",
      "itu": "30",
      "cq": "17",
      "dxcc": "280",
      "prefix": "^EZ.*"
    },
    {
      "name": "Tuvalu",
      "flag": "tv",
      "itu": "65",
      "cq": "31",
      "dxcc": "282",
      "prefix": "^T2.*"
    },
    {
      "name": "Uganda",
      "flag": "ug",
      "itu": "48",
      "cq": "37",
      "dxcc": "286",
      "prefix": "^5X.*"
    },
    {
      "name": "Ukraine",
      "flag": "ua",
      "itu": "29",
      "cq": "16",
      "dxcc": "288",
      "prefix": "^E[M-O].*"
    },
    {
      "name": "Ukraine",
      "flag": "ua",
      "itu": "29",
      "cq": "16",
      "dxcc": "288",
      "prefix": "^U[R-Z].*"
    },
    {
      "name": "United Arab Emirates",
      "flag": "ae",
      "itu": "39",
      "cq": "21",
      "dxcc": "391",
      "prefix": "^A6.*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^VS.*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^G.*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^M.*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^V[P-Q].*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^Z[B-J].*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^Z[N-O].*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^ZQ.*"
    },
    {
      "name": "United Kingdom",
      "flag": "gb",
      "itu": "27",
      "cq": "14",
      "dxcc": "223",
      "prefix": "^2.*"
    },
    {
      "name": "United States of America",
      "flag": "us",
      "itu": "06,07,08",
      "cq": "03,04,05",
      "dxcc": "291",
      "prefix": "^A[A-L].*"
    },
    {
      "name": "United States of America",
      "flag": "us",
      "itu": "06,07,08",
      "cq": "03,04,05",
      "dxcc": "291",
      "prefix": "^K.*"
    },
    {
      "name": "United States of America",
      "flag": "us",
      "itu": "06,07,08",
      "cq": "03,04,05",
      "dxcc": "291",
      "prefix": "^N.*"
    },
    {
      "name": "United States of America",
      "flag": "us",
      "itu": "06,07,08",
      "cq": "03,04,05",
      "dxcc": "291",
      "prefix": "^W.*"
    },
    {
      "name": "Uruguay",
      "flag": "uy",
      "itu": "14",
      "cq": "13",
      "dxcc": "144",
      "prefix": "^C[V-X].*"
    },
    {
      "name": "Uzbekistan",
      "flag": "uz",
      "itu": "30",
      "cq": "17",
      "dxcc": "292",
      "prefix": "^U[J-M].*"
    },
    {
      "name": "Vanuatu",
      "flag": "vu",
      "itu": "59",
      "cq": "32",
      "dxcc": "158",
      "prefix": "^YJ.*"
    },
    {
      "name": "Vatican",
      "flag": "va",
      "itu": "28",
      "cq": "15",
      "dxcc": "295",
      "prefix": "^HV.*"
    },
    {
      "name": "Venezuela",
      "flag": "ve",
      "itu": "12",
      "cq": "09",
      "dxcc": "148",
      "prefix": "^Y[V-Y].*"
    },
    {
      "name": "Venezuela",
      "flag": "ve",
      "itu": "12",
      "cq": "09",
      "dxcc": "148",
      "prefix": "^4M.*"
    },
    {
      "name": "Vietnam",
      "flag": "vn",
      "itu": "49",
      "cq": "26",
      "dxcc": "293",
      "prefix": "^XV.*"
    },
    {
      "name": "Vietnam",
      "flag": "vn",
      "itu": "49",
      "cq": "26",
      "dxcc": "293",
      "prefix": "^3W.*"
    },
    {
      "name": "Yemen",
      "flag": "ye",
      "itu": "39",
      "cq": "21",
      "dxcc": "492",
      "prefix": "^7O.*"
    },
    {
      "name": "Zambia",
      "flag": "zm",
      "itu": "53",
      "cq": "36",
      "dxcc": "482",
      "prefix": "^9[I-J].*"
    },
    {
      "name": "Zimbabwe",
      "flag": "zw",
      "itu": "53",
      "cq": "38",
      "dxcc": "452",
      "prefix": "^Z2.*"
    }
    ];

    // Vložení widgetu do stránky
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded and parsed.');
        var container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container);

        // Nastavení výchozích hodnot
        function setDefaultValues() {
            var stateName = document.getElementById('widgetStateName');
            var stateFlag = document.getElementById('widgetStateFlag');
            var ituValue = document.getElementById('widgetItuValue');
            var cqValue = document.getElementById('widgetCqValue');
            var dxccValue = document.getElementById('widgetDxccValue');
            var qrzcq = document.getElementById('widgetQrzcq');
            var qrz = document.getElementById('widgetQrz');
            var eqsl = document.getElementById('widgetEqsl');

            stateName.textContent = 'No results';
            stateFlag.innerHTML = '-';
            ituValue.textContent = '-';
            cqValue.textContent = '-';
            dxccValue.textContent = '-';
            qrzcq.textContent = '-';
            qrz.textContent = '-';
            eqsl.textContent = '-';
        }

        setDefaultValues(); // Nastaví výchozí hodnoty při načtení

        // Načtení externích stylů
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
        loadCSS('https://prefix.ok1kky.cz/api/api.css'); // Zkontrolujte URL

        // Načtení externího JavaScriptu
        loadScript('https://prefix.ok1kky.cz/api/prefix.js', function() {
            console.log('External script loaded.');
            // Přidání event listeneru pro input
            document.getElementById('widgetSearchInput').addEventListener('input', function() {
                var searchInput = document.getElementById('widgetSearchInput').value.trim();
                console.log('Search input:', searchInput);

                var stateName = document.getElementById('widgetStateName');
                var stateFlag = document.getElementById('widgetStateFlag');
                var ituValue = document.getElementById('widgetItuValue');
                var cqValue = document.getElementById('widgetCqValue');
                var dxccValue = document.getElementById('widgetDxccValue');
                var qrzcq = document.getElementById('widgetQrzcq');
                var qrz = document.getElementById('widgetQrz');
                var eqsl = document.getElementById('widgetEqsl');

                var found = false;

                jsonData.forEach(function(item) {
                    console.log('Checking item:', item);
                    var regex = new RegExp(item.prefix, 'i');
                    if (regex.test(searchInput)) {
                        found = true;
                        stateName.textContent = item.name;
                        stateFlag.innerHTML = `<img src="https://flagsapi.com/${item.flag.toUpperCase()}/flat/64.png" alt="${item.name} flag">`;
                        ituValue.textContent = item.itu;
                        cqValue.textContent = item.cq;
                        dxccValue.textContent = item.dxcc;
                        qrzcq.innerHTML = `<a href="https://www.qrzcq.com/call/${searchInput}" target="_blank">QRZCQ.COM</a>`;
                        qrz.innerHTML = `<a href="https://www.qrz.com/db/${searchInput}" target="_blank">QRZ.COM</a>`;
                        eqsl.innerHTML = `<a href="https://www.eqsl.cc/Member.cfm?${searchInput}" target="_blank">EQSL.CC</a>`;
                    }
                });

                if (!found) {
                    setDefaultValues(); // Obnoví výchozí hodnoty, pokud nejsou nalezeny žádné výsledky
                }
            });
        });
    });
})();