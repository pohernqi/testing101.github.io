// Automatically run when the page loads
window.onload = function () {
    toggleGroup(); // Set correct visibility based on current selection
};

function removeDeclaration(button) {
    const declaration = button.closest('.declaration');
    if (declaration) {
        declaration.remove();
    }
}

function populatePersonalNationality() {
    const select = document.getElementById('personalNationality');
    nationalityOptions.forEach(nation => {
        const option = document.createElement('option');
        option.value = nation;
        option.textContent = nation;

        if (nation === "Malaysian") {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function blockNumbers(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Allow only letters (A-Z, a-z) and spaces
    const allowedPattern = /^[A-Za-z\s]+$/;

    // Block typing
    input.addEventListener("keypress", function (e) {
        if (!/^[A-Za-z\s]$/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Block pasting invalid characters
    input.addEventListener("paste", function (e) {
        let pasted = (e.clipboardData || window.clipboardData).getData("text");
        if (!allowedPattern.test(pasted)) {
            e.preventDefault();
        }
    });
}

// Apply only to hostName & personalName
["hostName", "personalName"].forEach(blockNumbers);

function blockLetters(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Allow only digits (0-9)
    input.addEventListener("keypress", function (e) {
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    });
}

// Apply only to phoneNo
blockLetters("personalPhone");

// Call it once the page loads
window.addEventListener('DOMContentLoaded', function () {
    populatePersonalNationality();
});

function toggleGroup() {
    const groupType = document.getElementById("groupType").value;
    const personalInfo = document.getElementById("personalInfo");
    const groupSize = document.getElementById("groupSize");
    const generateBtn = document.getElementById("generateFields");
    const individualFields = document.getElementById("individualFields");

    if (groupType === "group") {
        personalInfo.classList.add("hidden");
        groupSize.classList.remove("hidden");
        generateBtn.classList.remove("hidden");
        individualFields.innerHTML = ""; // Reset in case of re-selection

        //Remove required attributes from personal inputs
        document.getElementById("personalName").removeAttribute("required");
        document.getElementById("personalNationality").removeAttribute("required");
        document.getElementById("personalIC").removeAttribute("required");
        document.getElementById("personalPhone").removeAttribute("required");

    } else {
        personalInfo.classList.remove("hidden");
        groupSize.classList.add("hidden");
        generateBtn.classList.add("hidden");
        individualFields.innerHTML = "";

        // Add required attributes back
        document.getElementById("personalName").setAttribute("required", "required");
        document.getElementById("personalNationality").setAttribute("required", "required");
        document.getElementById("personalIC").setAttribute("required", "required");
        document.getElementById("personalPhone").setAttribute("required", "required");

    }

    // Shared fields are always visible
    document.getElementById("sharedFields").classList.remove("hidden");
}

function enableGenerateButton() {
    var generateBtn = document.getElementById('generateFields');
    generateBtn.classList.remove('hidden');
}

const nationalityOptions = [
    "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine",
    "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi",
    "Barbadian", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian",
    "Bosnian", "Botswanan", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe",
    "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean",
    "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese",
    "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican",
    "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirati", "Equatorial Guinean",
    "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese",
    "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan",
    "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran",
    "Hungarian", "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli",
    "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan",
    "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian",
    "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy",
    "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian",
    "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan",
    "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauru", "Nepalese", "New Zealander",
    "Ni-Vanuatu", "Nicaraguan", "Nigerien", "North Korean", "Northern Irish", "Norwegian",
    "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan",
    "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan",
    "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish",
    "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian",
    "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish",
    "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese",
    "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian",
    "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan",
    "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

function generateIndividualFields(num = null) {
    var numPeople = num || parseInt(document.getElementById('numPeople').value);
    if (isNaN(numPeople) || numPeople < 1) return;

    var individualFields = document.getElementById('individualFields');
    individualFields.innerHTML = '';

    for (let i = 0; i < numPeople; i++) {
        var personDiv = document.createElement('div');
        personDiv.className = 'person-section';

        // Create nationality select dropdown with unique ID
        let nationalitySelect = document.createElement('select');
        nationalitySelect.id = `nationality-${i}`;
        nationalitySelect.name = `nationality-${i}`;
        nationalityOptions.forEach(nation => {
            let option = document.createElement('option');
            option.value = nation;
            option.textContent = nation;
            // Default to Malaysian
            if (nation === "Malaysian") {
                option.selected = true;
            }
            nationalitySelect.appendChild(option);
        });

        personDiv.innerHTML = `
            <h3>Person ${i + 1} Details</h3>
            <div class="field-row">
                <div>
                    <label>Name:</label>
                    <input type="text" id="name-${i}" name="name-${i}" required>
                </div>
                <div>
                    <label>IC/Passport No.:</label>
                    <input type="text" id="ic-${i}" name="ic-${i}" required>
                </div>
            </div>
            <div class="field-row">
                <div class="nationality-container">
                    <label>Nationality:</label>
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input type="tel" id="phone-${i}" name="phone-${i}" required placeholder="e.g., 60123456789">
                </div>
            </div>
            <div class="field-row">
                <div>
                    <label>Vehicle No. (optional):</label>
                    <input type="text" id="vehicle-${i}" name="vehicle-${i}" placeholder="e.g., PND1234">
                </div>
                <div>
                </div>
            </div>
        `;

        personDiv.querySelector('.nationality-container').appendChild(nationalitySelect);
        individualFields.appendChild(personDiv);

        // ✅ Block numbers for the dynamically created name input
        blockNumbers(`name-${i}`);
        blockLetters(`phone-${i}`);
    }
}


function addDeclaration() {
    const declarations = document.getElementById("declarations");
    const declaration = document.createElement("div");
    declaration.className = "declaration";

    declaration.innerHTML = `
        <div class="field-row">
            <div>
                <label>Type:</label>
                <select class="type" onchange="toggleOthers(this)">
                    <option value="USB">USB</option>
                    <option value="laptop">Laptop</option>
                    <option value="others">Others</option>
                </select>
                <input type="text" class="others-type hidden" placeholder="Specify others">
            </div>
            <div>
                <label>Quantity:</label>
                <input type="number" class="quantity" min="1" value="1">
            </div>
            <div>
                <label>Description:</label>
                <input type="text" class="desc">
            </div>
            <div style="flex-basis:100%; width:100%;">
                <button type="button" onclick="removeDeclaration(this)">Remove</button>
            </div>
        </div>
    `;
    declarations.appendChild(declaration);
}
function generateGroupID(isGroup) {
    const prefix = isGroup ? 'G' : 'P';
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900); // Random 3-digit
    return `${prefix}-${dateStr}-${randomNum}`;
}

function toggleOthers(select) {
    var othersInput = select.parentElement.querySelector('.others-type');
    othersInput.classList.toggle('hidden', select.value !== 'others');
}

function toggleDeclaration() {
    var yes = document.getElementById('declareYes').checked;
    document.getElementById('declarationSection').classList.toggle('hidden', !yes);
}

function toggleVisitDate() {
    const scheduleVisit = document.getElementById("scheduleVisit").value;
    const visitDateSection = document.getElementById("visitDateSection");
    if (scheduleVisit === "yes") {
        visitDateSection.classList.remove("hidden");
    } else {
        visitDateSection.classList.add("hidden");
    }
}

function getDeclarationItems() {
    const items = [];
    document.querySelectorAll('#declarations .declaration').forEach(declaration => {
        const description = declaration.querySelector('.desc')?.value || 'N/A';
        const type = declaration.querySelector('.type')?.value || 'N/A';
        const specifyOthers = declaration.querySelector('.others-type')?.value || 'N/A';
        const declarationQuantity = declaration.querySelector('.quantity')?.value || 'N/A';

        items.push({
            description,
            type,
            specifyOthers,
            declarationQuantity
        });
    });
    return items;
}


document.getElementById('visitorForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // disableHiddenInputs(); // Disable hidden inputs before submission
    const groupType = document.getElementById('groupType').value;
    const isGroup = groupType === 'group';
    const groupID = generateGroupID(isGroup);

    let submissionRows = [];
    const declarationValue = document.querySelector('input[name="declare"]:checked').value;
    let declarationItems = getDeclarationItems(); // [{description, type}, ...]

    if (declarationValue === 'no') {
        declarationItems = [{
            type: 'N/A',
            description: 'N/A',
            specifyOthers: 'N/A',
            declarationQuantity: 'N/A'
        }];
    }

    // Get scheduled visit date (if provided)
    const scheduledVisitInput = document.getElementById('visitDate')?.value || '';
    const timeStamp = scheduledVisitInput
        ? new Date(scheduledVisitInput).toLocaleString('en-GB', { hour12: false })
        : new Date().toLocaleString('en-GB', { hour12: false });

    console.log('Scheduled Visit Date:', timeStamp);


    if (isGroup) {
        const numPeople = parseInt(document.getElementById('numPeople').value);
        const purpose = document.getElementById('sharedPurpose').value;
        const company = document.getElementById('sharedCompany').value;
        const hostName = document.getElementById('hostName').value;
        //const declarations = getDeclarationString();


        // Collect multiple entries into arrays
        let names = [], nationalities = [], icNumbers = [], phoneNos = [], vehicleNos = [];


        for (let i = 0; i < numPeople; i++) {
            names.push(document.getElementById(`name-${i}`).value);
            nationalities.push(document.getElementById(`nationality-${i}`).value);
            icNumbers.push(document.getElementById(`ic-${i}`).value);
            phoneNos.push(document.getElementById(`phone-${i}`).value); // New phone number field

            let vehicleValue = document.getElementById(`vehicle-${i}`).value.trim();
            vehicleNos.push(vehicleValue ? vehicleValue : "N/A");
        }

        submissionRows.push({
            timeStamp,
            groupType: 'Group',
            groupId: groupID,
            name: names.join(', '),
            nationality: nationalities.join(', '),
            icNumber: icNumbers.join(', '),
            phoneNo: phoneNos.join(', '), // Store group phone numbers
            vehicleNo: vehicleNos.join(', '),
            purpose: purpose,
            company: company,
            hostName: hostName,
            declaration: declarationValue,
            declarationDescriptions: declarationItems.map(item => item.description).join(', '),
            declarationTypes: declarationItems.map(item => item.type).join(', '),
            specifyOthers: declarationItems.map(item => item.specifyOthers).filter(Boolean).join(', '),
            declarationQuantity: declarationItems.map(item => item.declarationQuantity).join(', ')
        });


    } else {
        const name = document.getElementById('personalName')?.value || 'N/A';
        const nationality = document.getElementById('personalNationality')?.value || 'N/A';
        const icNumber = document.getElementById('personalIC')?.value || 'N/A';
        const phoneNo = document.getElementById('personalPhone')?.value || 'N/A'; // New phone number field
        const vehicleNo = document.getElementById('personalVehicle')?.value || 'N/A';
        const purpose = document.getElementById('sharedPurpose')?.value || 'N/A';
        const hostName = document.getElementById('hostName')?.value || 'N/A';
        const company = document.getElementById('sharedCompany')?.value || 'N/A';


        //console.log('Personal Info:', { name, nationality, icNumber, vehicleNo, purpose, hostName});

        submissionRows.push({
            timeStamp,
            groupType: 'Personal',
            groupId: groupID,
            name,
            nationality,
            icNumber,
            phoneNo, // Store personal phone number
            vehicleNo,
            purpose,
            company: company,
            hostName,
            declaration: declarationValue,
            declarationDescriptions: declarationItems.map(item => item.description).join(', '),
            declarationTypes: declarationItems.map(item => item.type).join(', '),
            specifyOthers: declarationItems.map(item => item.specifyOthers).filter(Boolean).join(', '),
            declarationQuantity: declarationItems.map(item => item.declarationQuantity).join(', ')

        });
    }

    console.log('Sending data:', JSON.stringify({ visitors: submissionRows }));
    // Send data as plain text
    fetch('https://prod-40.japaneast.logic.azure.com:443/workflows/8dd23ebb92b5470bb05c20f25b6deb09/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ifJn6a33nVpnBPtIrFAtkJRiucZpsUBS-DfHVUtRoBg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ visitors: submissionRows }) // still send JSON format, just change content-type
    })
        .then(response => {
            if (!response.ok) {
                alert('There were issues in submitting the form. Please submit again.');
                throw new Error('Submission failed');
            }
            alert("Submission successful!");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
