document.addEventListener('DOMContentLoaded', function() {
    fetch('json/data.json')
        .then(response => response.json())
        .then(jsonData => {
            const results = document.getElementById('results');
            const seenStates = new Set(); // Use a Set to track seen states

            jsonData.forEach(item => {
                // Check if this state has already been processed
                if (!seenStates.has(item.name)) {
                    seenStates.add(item.name);

                    const tr = document.createElement('tr');

                    // Prefix cell
                    const tdPrefix = document.createElement('td');
                    let prefix;

                    // Apply special case for Switzerland
                    if (item.name === 'Switzerland') {
                        prefix = 'HB';
                    } else if (item.name === 'Taiwan' && item.prefix === '^B(([M-Q])|([U-X])).*') {
                        prefix = 'B[M-Q] B[U-X]';
                    } else if (item.name === 'Sudan' && item.prefix === '^S((S[N-Z])|(T[A-Z])).*') {
                        prefix = 'SS[N-Z] ST[A-Z]';
                    } else if (item.name === 'Liechtenstein' && item.prefix === '^HB((0)|(3Y)|(L)).*') {
                        prefix = 'HB0';
                    } else {
                        prefix = item.prefix.slice(1, -2); // Remove ^ at start and .* at end
                    }
                    tdPrefix.textContent = prefix;
                    tr.appendChild(tdPrefix);

                    // State name cell
                    const tdName = document.createElement('td');
                    tdName.textContent = item.name;
                    tr.appendChild(tdName);

                    // Flag cell
                    const tdFlag = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = `https://flagsapi.com/${item.flag.toUpperCase()}/flat/32.png`;
                    img.alt = `${item.name} flag`;
                    tdFlag.appendChild(img);
                    tr.appendChild(tdFlag);

                    // ITU, CQ, and DXCC cells
                    const tdITU = document.createElement('td');
                    tdITU.textContent = item.itu;
                    tr.appendChild(tdITU);

                    const tdCQ = document.createElement('td');
                    tdCQ.textContent = item.cq;
                    tr.appendChild(tdCQ);

                    const tdDXCC = document.createElement('td');
                    tdDXCC.textContent = item.dxcc;
                    tr.appendChild(tdDXCC);

                    results.appendChild(tr);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 6;
            td.textContent = 'Error loading data';
            tr.appendChild(td);
            results.appendChild(tr);
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    // Dočasné odstranění sloupce FLAG
    const table = document.getElementById('resultsTable');
    const cells = table.querySelectorAll('td:nth-child(3), th:nth-child(3)');
    
    cells.forEach(cell => cell.style.display = 'none');

    // Generování PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Table prefix', 14, 16);

    doc.autoTable({
        html: '#resultsTable',
        startY: 25,
        styles: {
            fontSize: 10,
            cellPadding: 4,
            halign: 'center',
            valign: 'middle',
            lineColor: [0, 0, 0],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontSize: 12
        },
        bodyStyles: {
            fillColor: [255, 255, 255]
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        margin: { left: 14, right: 14 },
        theme: 'striped'
    });

    // Obnovení viditelnosti sloupce FLAG
    cells.forEach(cell => cell.style.display = '');

    doc.save('prefix.pdf');
});
