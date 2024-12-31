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


//Search functionality
document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("table-body");
    const headerRow = document.getElementById("header-row");
    const searchInput = document.getElementById("search-input");
    const rowCountElement = document.getElementById("row-count");
    const columnCountElement = document.getElementById("column-count");
    const sortHeaders = headerRow.querySelectorAll("th"); // Assuming headers are clickable for sorting

    // Function to update row count
    function updateRowCount() {
        const allRows = tableBody.querySelectorAll("tr");
        const visibleRows = Array.from(allRows).filter(row => row.style.display !== "none");
        rowCountElement.textContent = `${visibleRows.length} / ${allRows.length} Rows`;
    }

    // Function to update column count
    function updateColumnCount() {
        const allColumns = headerRow.querySelectorAll("th");
        
        // Exclude the first two columns and the last column
        const includedColumns = Array.from(allColumns).slice(2, allColumns.length - 1);
        
        // Update the column count element
        columnCountElement.textContent = `${includedColumns.length} Columns`;
    }

    // Function to handle search/filtering
    function handleSearch() {
        const searchValue = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll("td"));
            const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(" ");
            if (rowText.includes(searchValue)) {
                row.style.display = ""; // Show matching row
            } else {
                row.style.display = "none"; // Hide non-matching row
            }
        });

        // Update row count after filtering
        updateRowCount();
    }

    // function for sorting
    document.querySelector(".op-content").addEventListener("click", handleSort);

    function handleSort(event) {
        const button = event.currentTarget; // The clicked button (div)
        const columnIndex = parseInt(button.getAttribute("data-column-index")); // Get the column index to sort
        const rows = Array.from(tableBody.querySelectorAll("tr"));
    
        // Toggle sorting order
        const isAscending = button.classList.toggle("sort-asc");
        if (!isAscending) button.classList.toggle("sort-desc");
    
        // Sort rows based on the selected column
        rows.sort((a, b) => {
            const cellA = a.querySelectorAll("td")[columnIndex].textContent.trim();
            const cellB = b.querySelectorAll("td")[columnIndex].textContent.trim();
            return isAscending
                ? cellA.localeCompare(cellB, undefined, { numeric: true })
                : cellB.localeCompare(cellA, undefined, { numeric: true });
        });
    
        // Append sorted rows back to the table body
        rows.forEach(row => tableBody.appendChild(row));
    
        // Update the row count (since sorting doesn't change visibility)
        updateRowCount();
    }
    

    // Attach event listener to each header for sorting
    sortHeaders.forEach(header => header.addEventListener("click", handleSort));

    // Event listener for search input
    searchInput.addEventListener("input", handleSearch);

    // Initial updates for row and column count
    updateRowCount();
    updateColumnCount();
});

// Enrich Button
document.querySelector(".operations-right button").addEventListener("click", function () {
    const rows = document.querySelectorAll("#table-body tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        cells.forEach(cell => {
            if (cell.textContent.trim() === "") {
                cell.textContent = "N/A"; // Default value for empty cells
                cell.style.backgroundColor = "#ffffcc"; // Highlight enriched cells
            }
        });
    });

    alert("Table data enriched successfully!");
});

// Share Icon
document.querySelector(".operations-right .icon-hover[src='./images/share.png']").addEventListener("click", function () {
    const shareData = {
        title: "Shared Table Data",
        text: "Check out this table data!",
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).then(() => {
            alert("Table data shared successfully!");
        }).catch(console.error);
    } else {
        alert("Sharing not supported in your browser.");
    }
});

// Download Icon
document.querySelector(".operations-right .icon-hover[src='./images/download.png']").addEventListener("click", function () {
    // Get the current file name
    const fileNameElement = document.querySelector(".file-header .file-name");
    let fileName = fileNameElement.textContent.trim() || "Untitled File"; // Default if empty
    fileName = fileName.replace(/[^a-zA-Z0-9]/g, "_") + ".csv"; // Sanitize file name and add .csv extension

    // Generate CSV content
    const rows = document.querySelectorAll("table tr");
    let csvContent = "";

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        const rowData = cells.map(cell => `"${cell.textContent.trim()}"`).join(",");
        csvContent += rowData + "\n";
    });

    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // Use dynamic file name
    link.click();
});

// Delete Icon
document.querySelector(".operations-right .icon-hover[src='./images/delete.png']").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all rows?")) {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // Clear all rows
        updateRowCount(); // Update row count after deletion
        alert("All rows deleted!");
    }
});

// 1. Back Arrow Functionality
document.querySelector(".file-header .fa-arrow-left").addEventListener("click", function () {
    if (confirm("Are you sure you want to leave this page? Unsaved changes may be lost.")) {
        window.history.back();
    }
});

// 2. Update File Name Dynamically
document.addEventListener("DOMContentLoaded", function () {
    const fileNameElement = document.querySelector(".file-header .file-name");

    // Function to enable editing on double-click
    fileNameElement.addEventListener("dblclick", function () {
        fileNameElement.setAttribute("contenteditable", "true");
        fileNameElement.focus(); // Focus the element for editing
    });

    // Function to save the updated file name on Enter key or blur
    function saveFileName() {
        const newName = fileNameElement.textContent.trim();
        if (newName === "") {
            fileNameElement.textContent = "Untitled File"; // Default name if empty
        }
        fileNameElement.setAttribute("contenteditable", "false");
    }

    // Save file name on pressing Enter
    fileNameElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent new line
            saveFileName();
        }
    });

    // Save file name on losing focus (blur event)
    fileNameElement.addEventListener("blur", saveFileName);
});

// 3. Auto-Save Toggle Functionality
let autoSaveInterval;

document.getElementById("checkbox").addEventListener("change", function (event) {
    if (event.target.checked) {
        autoSaveInterval = setInterval(() => {
            autoSaveContent();
        }, 5000); // Auto-save every 5 seconds
        alert("Auto-save enabled!");
    } else {
        clearInterval(autoSaveInterval);
        alert("Auto-save disabled!");
    }
});

function autoSaveContent() {
    const fileContent = getFileContent();
    console.log("Auto-saving file content:", fileContent);
    // Add your save logic here
}

function getFileContent() {
    // Mock function to get file content
    return "Current file content...";
}