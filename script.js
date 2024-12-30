// Add new column
 // Open the modal to add a column
 function openModal() {
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');
    const rowDataInputs = document.getElementById('row-data-inputs');

    // Clear any existing inputs
    rowDataInputs.innerHTML = '';

    // Skip the first row (index 0) and the last row (index rows.length-1) to exclude header and "Add Row"
    Array.from(rows).slice(0, -1).forEach((row, index) => {
        const rowInput = document.createElement('div');
        rowInput.innerHTML = `
            <label>Row ${index + 1}:</label>
            <input type="text" id="row-data-${index}" placeholder="Enter data for Row ${index + 1}">
        `;
        rowDataInputs.appendChild(rowInput);
    });

    // Display the modal
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('add-column-modal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('add-column-modal').style.display = 'none';
}

// Add the new column and populate the data for each row
function addColumn() {
    const columnHeaderName = document.getElementById('column-header-input').value;

    if (!columnHeaderName) {
        alert("Column header name cannot be empty!");
        return;
    }

    const headerRow = document.getElementById("header-row");
    const addColumnHeader = document.getElementById("add-column-header");

    // Create a new header cell and insert it before the "Add Column" header
    const newHeaderCell = document.createElement("th");
    newHeaderCell.textContent = columnHeaderName;

    // Insert the new header cell before the "Add Column" button
    headerRow.insertBefore(newHeaderCell, addColumnHeader);

    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");

    // Get data input for each row (except the last row, which contains the "Add Row" button)
    const rowDataInputs = Array.from(document.querySelectorAll('[id^="row-data-"]'));

    // Loop through all rows except the last one and add data
    Array.from(rows).slice(0, -1).forEach((row, index) => {
        const newCell = document.createElement("td");

        // Get custom data for this row
        const rowDataInput = rowDataInputs[index];
        newCell.textContent = rowDataInput ? rowDataInput.value || "Default" : "Default";

        // Insert the new cell at the correct position (before the last cell)
        row.insertBefore(newCell, row.lastElementChild);
    });

    // Close the modal and reset the inputs
    closeModal();
    document.getElementById('column-header-input').value = '';
    document.getElementById('row-data-inputs').innerHTML = '';
}

// Function to add a new row (for testing purposes)
function addRow() {
    const tableBody = document.getElementById('table-body');
    const newRow = document.createElement('tr');
    const columnCount = document.getElementById("header-row").children.length - 1; // Exclude "Add Column" button

    // Create cells for the new row
    for (let i = 0; i < columnCount; i++) {
        const newCell = document.createElement('td');
        newCell.textContent = `New Row, Col ${i + 1}`;
        newRow.appendChild(newCell);
    }

    // Add the row to the table before the "Add Row" button
    const addRowButtonRow = document.getElementById('add-row');
    tableBody.insertBefore(newRow, addRowButtonRow);
}

// Add New Row
let serialNumber = 1; // Starting serial number

// Function to get the highest serial number in the table
function getMaxSerialNumber() {
    const rows = document.querySelectorAll("#table-body tr");
    let maxSerial = 0;

    rows.forEach(row => {
        const serialCell = row.querySelector("td.fixed-column");
        if (serialCell) {
            const serial = parseInt(serialCell.textContent);
            if (!isNaN(serial)) {
                maxSerial = Math.max(maxSerial, serial);
            }
        }
    });

    return maxSerial;
}

function openDialog() {
    const columnHeaders = document.querySelectorAll("#header-row th:not(.fixed-column):not(.add-row-column)");
    const dialogContent = document.getElementById("dialog-content");

    dialogContent.innerHTML = ""; // Clear previous inputs
    columnHeaders.forEach((header, index) => {
        const label = document.createElement("label");
        label.textContent = `Enter data for ${header.textContent}:`;
        const input = document.createElement("input");
        input.type = "text";
        input.name = `col${index}`;
        dialogContent.appendChild(label);
        dialogContent.appendChild(input);
    });

    document.getElementById("dialog-overlay").style.display = "block";
    document.getElementById("dialog-box").style.display = "block";
}

function closeDialog() {
    document.getElementById("dialog-overlay").style.display = "none";
    document.getElementById("dialog-box").style.display = "none";
}

function submitRowData() {
    const tableBody = document.getElementById("table-body");
    const addRowButtonRow = document.getElementById("add-row-button");

    // Get the highest serial number and increment it for the new row
    serialNumber = getMaxSerialNumber() + 1;

    // Create a new row
    const newRow = document.createElement("tr");

    // Serial Number
    const serialCell = document.createElement("td");
    serialCell.className = "fixed-column";
    serialCell.textContent = serialNumber;
    newRow.appendChild(serialCell);

    // Image Column
    const imageCell = document.createElement("td");
    imageCell.className = "fixed-column";
    const img = document.createElement("img");
    img.src = "./images/stop.png"; // Path to your image
    img.alt = "Stop";
    imageCell.appendChild(img);
    newRow.appendChild(imageCell);

    // Other columns
    const formData = new FormData(document.getElementById("rowDataForm"));
    const columnHeaders = document.querySelectorAll("#header-row th:not(.fixed-column):not(.add-row-column)");

    columnHeaders.forEach((_, index) => {
        const newCell = document.createElement("td");
        const cellValue = formData.get(`col${index}`) || "Default";
        newCell.textContent = cellValue;
        newRow.appendChild(newCell);
    });

    // Add an empty cell for the "Add Row" column
    const emptyCell = document.createElement("td");
    newRow.appendChild(emptyCell);

    // Insert the new row before the Add Row button row
    tableBody.insertBefore(newRow, addRowButtonRow);

    // Reset and close the modal
    closeDialog();
    document.getElementById("rowDataForm").reset();
}