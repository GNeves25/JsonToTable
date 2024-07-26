let sortDirection = true;
let tableData = [];
let columns = [];

function createTable() {
    var jsonInput = document.getElementById("jsonInput").value;
    try {
        var data = JSON.parse(jsonInput);
        columns = data["Colunas"];
        tableData = data["Valores"];

        renderTable();
    } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error parsing JSON. Please check the format and try again.");
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
