let newColumnIndex = null; // This will store the index of the new column

        // Open the modal and create input fields for rows except the first one
        function openModal() {
            const tableBody = document.getElementById('table-body');
            const rows = tableBody.getElementsByTagName('tr');
            const rowDataInputs = document.getElementById('row-data-inputs');

            // Clear any existing inputs
            rowDataInputs.innerHTML = '';

            // Skip the first row (index 0) and the last row (index rows.length-1) to exclude header and add row
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

        // Add a new column with data for existing rows (except the last row)
        function addColumn() {
            const columnHeaderName = document.getElementById('column-header-input').value;

            if (!columnHeaderName) {
                alert("Column header name cannot be empty!");
                return;
            }

            const headerRow = document.getElementById("header-row");
            const addColumnHeader = document.getElementById("add-column-header");

            // Create a new header cell
            const newHeaderCell = document.createElement("th");
            newHeaderCell.textContent = columnHeaderName;

            // Insert the new header cell before the "Add Column" header
            headerRow.insertBefore(newHeaderCell, addColumnHeader);

            const tableBody = document.getElementById("table-body");
            const rows = tableBody.getElementsByTagName("tr");

            // Get data input for each row
            const rowDataInputs = Array.from(document.querySelectorAll('[id^="row-data-"]'));

            // Loop through all rows except the last one and add data
            Array.from(rows).slice(0, -1).forEach((row, index) => {
                const newCell = document.createElement("td");

                // Get custom data for this row
                const rowDataInput = rowDataInputs[index];
                newCell.textContent = rowDataInput ? rowDataInput.value || "Default" : "Default";

                // Append the new cell to the current row
                row.appendChild(newCell);
            });

            // Clear the modal and reset inputs
            closeModal();
            document.getElementById('column-header-input').value = '';
            document.getElementById('row-data-inputs').innerHTML = '';
        }

        // Function to add a new row (for testing purposes)
        function addRow() {
            const tableBody = document.getElementById('table-body');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>New Row, Col 1</td>
                <td>New Row, Col 2</td>
            `;
            tableBody.appendChild(newRow);
        }