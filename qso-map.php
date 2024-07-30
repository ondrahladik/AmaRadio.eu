<?php

function getCoordinatesFromLocator($locator) {
    $fieldLon = ord($locator[0]) - 65;
    $fieldLat = ord($locator[1]) - 65;

    $squareLon = intval($locator[2]);
    $squareLat = intval($locator[3]);

    $subSquareLon = ord($locator[4]) - 65;
    $subSquareLat = ord($locator[5]) - 65;

    $longitude = ($fieldLon * 20) - 180 + ($squareLon * 2) + ($subSquareLon / 12) + (1 / 24);
    $latitude = ($fieldLat * 10) - 90 + $squareLat + ($subSquareLat / 24) + (1 / 48);

    $bottomLeftLon = ($fieldLon * 20) - 180 + ($squareLon * 2) + ($subSquareLon / 12);
    $bottomLeftLat = ($fieldLat * 10) - 90 + $squareLat + ($subSquareLat / 24);

    $topRightLon = $bottomLeftLon + (1 / 12);
    $topRightLat = $bottomLeftLat + (1 / 24);

    $bounds = [
        [$bottomLeftLat, $bottomLeftLon],
        [$topRightLat, $bottomLeftLon],
        [$topRightLat, $topRightLon],
        [$bottomLeftLat, $topRightLon]
    ];

    return [$latitude, $longitude, $bounds];
}

function calculateVincentyDistance($lat1, $lon1, $lat2, $lon2) {
    $a = 6378137.0;
    $f = 1 / 298.257223563;
    $b = (1 - $f) * $a;

    $L = deg2rad($lon2 - $lon1);
    $U1 = atan((1 - $f) * tan(deg2rad($lat1)));
    $U2 = atan((1 - $f) * tan(deg2rad($lat2)));
    $sinU1 = sin($U1);
    $cosU1 = cos($U1);
    $sinU2 = sin($U2);
    $cosU2 = cos($U2);

    $lambda = $L;
    $lambdaP;
    $iterLimit = 100;
    $sinSigma = 0;
    $cosSigma = 0;
    $sigma = 0;
    $sinAlpha = 0;
    $cos2Alpha = 0;
    $cos2SigmaM = 0;
    $C = 0;
    $uSq = 0;
    $A = 0;
    $B = 0;
    $deltaSigma = 0;
    $s = 0;

    do {
        $sinSigma = sqrt(pow($cosU2 * sin($lambda), 2) + pow($cosU1 * $sinU2 - $sinU1 * $cosU2 * cos($lambda), 2));
        if ($sinSigma == 0) return 0;  // co-incident points
        $cosSigma = $sinU1 * $sinU2 + $cosU1 * $cosU2 * cos($lambda);
        $sigma = atan2($sinSigma, $cosSigma);
        $sinAlpha = $cosU1 * $cosU2 * sin($lambda) / $sinSigma;
        $cos2Alpha = 1 - pow($sinAlpha, 2);
        $cos2SigmaM = $cosSigma - 2 * $sinU1 * $sinU2 / $cos2Alpha;
        if (is_nan($cos2SigmaM)) $cos2SigmaM = 0;  // equatorial line: cos²α=0 (6)
        $C = $f / 16 * $cos2Alpha * (4 + $f * (4 - 3 * $cos2Alpha));
        $lambdaP = $lambda;
        $lambda = $L + (1 - $C) * $f * $sinAlpha * ($sigma + $C * $sinSigma * ($cos2SigmaM + $C * $cosSigma * (-1 + 2 * pow($cos2SigmaM, 2))));
    } while (abs($lambda - $lambdaP) > 1e-12 && --$iterLimit > 0);

    if ($iterLimit == 0) return NaN;  // formula failed to converge

    $uSq = $cos2Alpha * ($a * $a - $b * $b) / ($b * $b);
    $A = 1 + $uSq / 16384 * (4096 + $uSq * (-768 + $uSq * (320 - 175 * $uSq)));
    $B = $uSq / 1024 * (256 + $uSq * (-128 + $uSq * (74 - 47 * $uSq)));
    $deltaSigma = $B * $sinSigma * ($cos2SigmaM + $B / 4 * ($cosSigma * (-1 + 2 * $cos2SigmaM * $cos2SigmaM) -
        $B / 6 * $cos2SigmaM * (-3 + 4 * $sinSigma * $sinSigma) * (-3 + 4 * $cos2SigmaM * $cos2SigmaM)));

    $s = $b * $A * ($sigma - $deltaSigma);

    return $s / 1000;  // convert to kilometers
}

$data = json_decode(file_get_contents('php://input'), true);

$mainLocator = $data['mainLocator'];
$locators = $data['locators'];

list($mainLat, $mainLon, $mainBounds) = getCoordinatesFromLocator($mainLocator);

$results = [];
foreach ($locators as $locator) {
    list($lat, $lon, $bounds) = getCoordinatesFromLocator($locator);
    $distance = calculateVincentyDistance($mainLat, $mainLon, $lat, $lon);
    $results[] = [
        'locator' => $locator,
        'latitude' => $lat,
        'longitude' => $lon,
        'bounds' => $bounds,
        'distance' => $distance
    ];
}

$response = [
    'main' => [
        'latitude' => $mainLat,
        'longitude' => $mainLon,
        'bounds' => $mainBounds
    ],
    'locators' => $results
];

header('Content-Type: application/json');
echo json_encode($response);
?>
