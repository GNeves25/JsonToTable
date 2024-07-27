let sortDirection = true;
let tableData = [];
let columns = [];
let originalTableData = [];

function createTable() {
    var jsonInput = document.getElementById("jsonInput").value.trim();
    if (!jsonInput) {
        alert("You must provide some data to generate the table.");
        return;
    }

    try {
        var data = JSON.parse(jsonInput);
        columns = data["Colunas"];
        tableData = data["Valores"];
        originalTableData = [...tableData];

        renderTable();
        enableExportButtons();
    } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error parsing JSON. Check the format and try again.");
    }
}

function sortTable(colIndex) {
    const isNumericColumn = tableData.every(row => !isNaN(parseFloat(row[colIndex])) && isFinite(row[colIndex]));

    tableData.sort(function (a, b) {
        if (isNumericColumn) {
            return sortDirection
                ? parseFloat(a[colIndex]) - parseFloat(b[colIndex])
                : parseFloat(b[colIndex]) - parseFloat(a[colIndex]);
        } else {
            if (a[colIndex] < b[colIndex]) {
                return sortDirection ? -1 : 1;
            }
            if (a[colIndex] > b[colIndex]) {
                return sortDirection ? 1 : -1;
            }
            return 0;
        }
    });

    sortDirection = !sortDirection;

    renderTable();
}

function renderTable() {
    var tableHTML = "<table class='table table-striped'><thead><tr>";
    for (var i = 0; i < columns.length; i++) {
        tableHTML += `<th onclick="sortTable(${i})">${columns[i]}</th>`;
    }
    tableHTML += "</tr></thead><tbody>";

    for (var j = 0; j < tableData.length; j++) {
        tableHTML += "<tr>";
        for (var k = 0; k < tableData[j].length; k++) {
            tableHTML += "<td>" + tableData[j][k] + "</td>";
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table>";

    document.getElementById("table").innerHTML = tableHTML;
}

function enableExportButtons() {
    document.getElementById("btnDownloadExcel").classList.remove("disabled");
    document.getElementById("btnDownloadPDF").classList.remove("disabled");
}

function downloadExcel() {
    if (document.getElementById("btnDownloadExcel").classList.contains("disabled")) {
        alert("The table must be generated before exporting it.");
        return;
    }

    const table = document.querySelector('#table table');
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    XLSX.writeFile(workbook, "JsonToTable.xlsx");
}

function downloadPDF() {
    if (document.getElementById("btnDownloadPDF").classList.contains("disabled")) {
        alert("The table must be generated before exporting it.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.querySelector('#table table');
    const headers = [...table.querySelectorAll('thead th')].map(th => th.innerText);
    const rows = [...table.querySelectorAll('tbody tr')].map(tr => {
        return [...tr.querySelectorAll('td')].map(td => td.innerText);
    });

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 10,
        theme: 'grid',
        styles: {
            cellPadding: 2,
            fontSize: 8,
            overflow: 'linebreak',
            halign: 'left',
            valign: 'middle'
        },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        }
    });

    doc.save("JsonToTable.pdf");
}

function searchTable() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();

    if (searchInput === "") {
        tableData = [...originalTableData];
    } else {
        tableData = originalTableData.filter(row => {
            return row.some(cell => cell.toString().toLowerCase().includes(searchInput));
        });
    }

    renderTable();
}

document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchTable();
    }
});
