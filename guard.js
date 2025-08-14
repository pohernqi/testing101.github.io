
window.addEventListener('load', () => {
    refreshTable();
});

function changeName() {
    const input = document.getElementById("nameInput");
    const display = document.getElementById("nameDisplay");
    const name = input.value.trim();
    display.textContent = `Guard On duty name: '${name}'`;
}

const savedRows = {};
//Add this variable to store the original data
let allRows = [];

async function refreshTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "<tr><td colspan='11' style='text-align:center;'>Loading...</td></tr>";
    const url = 'https://prod-63.japaneast.logic.azure.com:443/workflows/01c19ae7b0c44721a2f8171935cca55a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5z7T5hQf73owxl20-_h4u_l00wc9oJmw3QY99cmxHS8';

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const dt = await res.json();
        if (dt.status !== 'success') throw new Error("Flow returned error");

        //let pendingRows = dt.data.filter(row => row.decision?.toLowerCase() === 'pending');
        allRows = dt.data;

        allRows.sort((a, b) => {
            const dateA = new Date(a.timeStamp || 0);
            const dateB = new Date(b.timeStamp || 0);
            return dateB - dateA;
        });
        updateTable(allRows);

        //console.log("Received data:", dt.data);
        console.log("All rows:", allRows);

        // Apply filter after table is loaded
        applyDayFilter();

    } catch (err) {
        console.error("Error fetching data:", err);
        document.getElementById("tableBody").innerHTML = "<tr><td colspan='5'>Failed to load data</td></tr>";
    }
}

function updateTable(rows) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

     if (!rows || rows.length === 0) {
        tbody.innerHTML = "<tr><td colspan='11' style='text-align:center;'>No data found</td></tr>";
        return;
    }

    rows.forEach((row, index) => {
        const tr = document.createElement("tr");

        // Determine what to show in the decision cells
        const decisionInCellContent =
            row.decisionIn?.toLowerCase() === 'pending'
                ? `
                    <div class="vertical-radios">
                    <label><input type="radio" name="decisionIn${index}" value="Approved">✔️</label>
                    <label><input type="radio" name="decisionIn${index}" value="Rejected">❌</label>
                     </div>
                `
                : row.decisionIn || '';

        const decisionOutCellContent =
            row.decisionIn?.toLowerCase() === 'approved' &&
    row.decisionOut?.toLowerCase() !== 'approved'
                ? `
                    <div class="vertical-radios">
                    <label><input type="radio" name="decisionOut${index}" value="Approved">✔️</label>
                    <label><input type="radio" name="decisionOut${index}" value="Rejected">❌</label>
                    </div>
                `
                : row.decisionOut || '';

        tr.innerHTML = `
            <td>${row.timeStamp || ''}</td>  
            <td><a class="group-link" href="details.html?groupId=${row.groupId}" target="_blank">${row.groupId}</a></td>
            <td>${row.name || ''}</td> 
            <td>${decisionInCellContent}</td>
            <td>
                ${row.decisionIn?.toLowerCase() === 'pending'
                ? `<button id="saveInBtn${index}" onclick="saveInRow(${index}, '${row.groupId}')" >Save In</button>`
                : ''}
            </td>
            <td id="timestamp_approveIn${index}">${row.timestamp_approveIn || ''}</td>
            <td id="approvedIn${index}">${row.approvedIn || ''}</td>
            <td>${decisionOutCellContent}</td>
            <td>
                ${row.decisionOut?.toLowerCase() === 'pending' &&
                row.decisionIn?.toLowerCase() === 'approved'
                ? `<button id="saveOutBtn${index}" onclick="saveOutRow(${index}, '${row.groupId}')">Save Out</button>`
                : ''}
            </td>
            <td id="approvedOut${index}">${row.approvedOut || ''}</td>
            <td id="timestamp_approveOut${index}">${row.timestamp_approveOut || ''}</td>
        `;

        tbody.appendChild(tr);
    });
}

function searchTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    if (!searchInput) {
        // If search is empty, show all rows
        //updateTable(allRows);
        return;
    }
    // Filter rows based on search criteria
    const filteredRows = allRows.filter(row => {
        return (
            (row.groupId && row.groupId.toLowerCase().includes(searchInput)) ||
            (row.name && row.name.toLowerCase().includes(searchInput)) ||
            (row.timeStamp && row.timeStamp.toLowerCase().includes(searchInput)) ||
            (row.decisionIn && row.decisionIn.toLowerCase().includes(searchInput)) ||
            (row.timestamp_approveIn && row.timestamp_approveIn.toLowerCase().includes(searchInput)) ||
            (row.approvedIn && row.approvedIn.toLowerCase().includes(searchInput)) ||
            (row.decisionOut && row.decisionOut.toLowerCase().includes(searchInput)) ||
            (row.approvedOut && row.approvedOut.toLowerCase().includes(searchInput)) ||
            (row.timestamp_approveOut && row.timestamp_approveOut.toLowerCase().includes(searchInput))
        );
    });

    updateTable(filteredRows);
}


// Function to toggle visibility of custom date input
function toggleDateInput() {
    const filterValue = document.getElementById("dayFilter").value;
    const customDateInput = document.getElementById("customDateInput");

    if (filterValue === "custom") {
        customDateInput.style.display = "block";
    } else {
        customDateInput.style.display = "none";
        applyDayFilter();
    }
}

// Function to format date as DD/MM/YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to check if a timestamp matches the selected date
function isDateMatch(timestamp, targetDateStr) {
    if (!timestamp) return false;

    // Extract date part from timestamp (assuming format DD/MM/YYYY, HH:mm:ss)
    const datePart = timestamp.split(',')[0].trim();
    return datePart === targetDateStr;
}

// Function to apply date filter
function applyDayFilter() {
    const filterValue = document.getElementById("dayFilter").value;
    let targetDateStr = '';
    const today = new Date();

    switch (filterValue) {
        case 'today':
            targetDateStr = formatDate(today);
            break;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            targetDateStr = formatDate(yesterday);
            break;
        case 'custom':
            const customDate = new Date(document.getElementById("customDateInput").value);
            if (isNaN(customDate.getTime())) return; // Invalid date
            targetDateStr = formatDate(customDate);
            break;
        default:
            return;
    }
  // Filter based on the data's timeStamp property (not displayed)
    const filteredRows = allRows.filter(row => {
        if (!row.timeStamp) return false;
        const datePart = row.timeStamp.split(',')[0].trim();
        return datePart === targetDateStr;
    });

    updateTable(filteredRows);
}
function saveInRow(index, groupId) {
    const decisionRadios = document.getElementsByName(`decisionIn${index}`);
    const selectedRadio = Array.from(decisionRadios).find(r => r.checked);
    const decisionValue = selectedRadio ? selectedRadio.value : '';


    const approverName = document.getElementById("nameInput").value.trim();

    if (!decisionValue) {
        alert("Please select a decision (Approve or Reject).");
        return;
    }

    if (!approverName) {
        alert("Please enter your name before saving.");
        return;
    }

    const timestamp_approveIn = new Date().toLocaleString('en-GB', { hour12: false });
    document.getElementById(`timestamp_approveIn${index}`).textContent = timestamp_approveIn;
    document.getElementById(`approvedIn${index}`).textContent = approverName;

    savedRows[groupId] = {
        decisionIn: decisionValue,
        approvedIn: approverName,
        timestamp_approveIn: timestamp_approveIn
    };

    alert("Saved successfully.");

    const flowUrl = "https://prod-32.japaneast.logic.azure.com:443/workflows/f466c344f8f44a10b6a2feac13495686/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_vQAFs4fpxth0N8HNkGn7WTiZJORKV4sCObReSem5Jc";

    const payload = {
        groupId: groupId,
        decisionIn: decisionValue,
        approvedIn: approverName,
        timestamp_approveIn: timestamp_approveIn
    };

    fetch(flowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => res.ok ? console.log("Data sent to Power Automate") : console.error("Flow error"))
        .catch(err => console.error("Fetch error:", err));
}


function saveOutRow(index, groupId) {
    const decisionRadios = document.getElementsByName(`decisionOut${index}`);
    const selectedRadio = Array.from(decisionRadios).find(r => r.checked);
    const decisionValue = selectedRadio ? selectedRadio.value : '';

    const approverName = document.getElementById("nameInput").value.trim();

    if (!decisionValue) {
        alert("Please select a decision (Approve or Reject).");
        return;
    }

    if (!approverName) {
        alert("Please enter your name before saving.");
        return;
    }

    const timestamp_approveOut = new Date().toLocaleString('en-GB', { hour12: false });
    document.getElementById(`timestamp_approveOut${index}`).textContent = timestamp_approveOut;
    document.getElementById(`approvedOut${index}`).textContent = approverName;

    // Update savedRows object with the out decision
    if (!savedRows[groupId]) {
        savedRows[groupId] = {};
    }
    savedRows[groupId].decisionOut = decisionValue;
    savedRows[groupId].approvedOut = approverName;

    alert("Saved successfully.");

    const flowUrl = "https://prod-32.japaneast.logic.azure.com:443/workflows/f466c344f8f44a10b6a2feac13495686/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_vQAFs4fpxth0N8HNkGn7WTiZJORKV4sCObReSem5Jc";

    const payload = {
        groupId: groupId,
        decisionOut: decisionValue,
        approvedOut: approverName,
        timestamp_approveOut: timestamp_approveOut
    };

    fetch(flowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => res.ok ? console.log("Data sent to Power Automate") : console.error("Flow error"))
        .catch(err => console.error("Fetch error:", err));
}

