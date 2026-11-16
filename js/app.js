/*
====================================================
 CAMPUS MAINTENANCE REQUESTS MANAGEMENT SYSTEM
 ICT251 - ACTIVITY 6
 APPLICATION FUNCTIONALITY
 Mulungushi University
====================================================
*/


// ================================================
// 1. IMPORT DATA SERVICE
// ================================================

import { recordService } from "./data.js";


// ================================================
// 2. SELECT HTML ELEMENTS
// ================================================

const requestForm = document.getElementById("requestForm");

const recordIdInput = document.getElementById("recordId");

const titleInput = document.getElementById("title");

const categoryInput = document.getElementById("category");

const descriptionInput = document.getElementById("description");

const statusInput = document.getElementById("status");

const submitButton = document.getElementById("submitButton");

const cancelEditButton = document.getElementById("cancelEdit");

const formHeading = document.getElementById("formHeading");

const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");

const recordsTableBody = document.getElementById("recordsTableBody");

const recordCount = document.getElementById("recordCount");

const emptyMessage = document.getElementById("emptyMessage");


// Dashboard elements

const totalRequests = document.getElementById("totalRequests");

const pendingRequests = document.getElementById("pendingRequests");

const progressRequests = document.getElementById("progressRequests");

const completedRequests = document.getElementById("completedRequests");


// ================================================
// 3. DARK MODE AND LIGHT MODE
// ================================================

const themeToggle = document.getElementById("themeToggle");

const THEME_STORAGE_KEY = "maintenance-theme";


// Load the previously saved theme

function loadSavedTheme() {

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");

    }

}


// Update the theme button

function updateThemeButton() {

    if (!themeToggle) {

        return;

    }

    const isDarkMode = document.body.classList.contains("dark-mode");

    if (isDarkMode) {

        themeToggle.textContent = "☀️ Light Mode";

        themeToggle.setAttribute("aria-pressed", "true");

    } else {

        themeToggle.textContent = "🌙 Dark Mode";

        themeToggle.setAttribute("aria-pressed", "false");

    }

}


// Switch between dark mode and light mode

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDarkMode = document.body.classList.contains("dark-mode");

    // Save selected theme

    localStorage.setItem(
        THEME_STORAGE_KEY,
        isDarkMode ? "dark" : "light"
    );

    // Update button

    updateThemeButton();

}


// Load theme immediately

loadSavedTheme();

updateThemeButton();


// Attach theme button event

if (themeToggle) {

    themeToggle.addEventListener("click", toggleTheme);

}


// ================================================
// 4. DISPLAY MESSAGES
// ================================================

function showMessage(text, type = "success") {

    message.textContent = text;

    message.className = type;

}


function clearMessage() {

    message.textContent = "";

    message.className = "";

}


// ================================================
// 5. VALIDATE FORM INPUT
// ================================================

function validateRecord(record) {

    const allowedCategories = [
        "Electrical",
        "Plumbing",
        "Furniture"
    ];

    const allowedStatuses = [
        "Pending",
        "In progress",
        "Completed"
    ];


    // Check title

    if (record.title.length < 3 || record.title.length > 80) {

        return "Title must contain between 3 and 80 characters.";

    }


    // Check category

    if (
        record.category.length < 2 ||
        record.category.length > 40 ||
        !allowedCategories.includes(record.category)
    ) {

        return "Please select a valid maintenance category.";

    }


    // Check description

    if (
        record.description.length < 5 ||
        record.description.length > 300
    ) {

        return "Description must contain between 5 and 300 characters.";

    }


    // Check status

    if (!allowedStatuses.includes(record.status)) {

        return "Please select a valid status.";

    }


    return null;

}


// ================================================
// 6. RESET FORM
// ================================================

function resetForm() {

    requestForm.reset();

    recordIdInput.value = "";

    formHeading.textContent = "Add New Maintenance Request";

    submitButton.textContent = "Add Request";

    cancelEditButton.hidden = true;

    statusInput.value = "Pending";

}


// ================================================
// 7. UPDATE DASHBOARD STATISTICS
// ================================================

function updateDashboard(records) {

    totalRequests.textContent = records.length;


    const pending = records.filter(
        record => record.status === "Pending"
    ).length;


    const inProgress = records.filter(
        record => record.status === "In progress"
    ).length;


    const completed = records.filter(
        record => record.status === "Completed"
    ).length;


    pendingRequests.textContent = pending;

    progressRequests.textContent = inProgress;

    completedRequests.textContent = completed;

}


// ================================================
// 8. CREATE TABLE BUTTON
// ================================================

function createActionButton(label, className, id) {

    const button = document.createElement("button");

    button.type = "button";

    button.textContent = label;

    button.className = className;

    button.dataset.id = id;

    return button;

}


// ================================================
// 9. DISPLAY RECORDS
// ================================================

function displayRecords(records) {

    recordsTableBody.replaceChildren();


    records.forEach(record => {

        const row = document.createElement("tr");


        // ID column

        const idCell = document.createElement("td");

        idCell.textContent = record.id;


        // Title column

        const titleCell = document.createElement("td");

        titleCell.textContent = record.title;


        // Category column

        const categoryCell = document.createElement("td");

        categoryCell.textContent = record.category;


        // Status column

        const statusCell = document.createElement("td");

        statusCell.textContent = record.status;


        // Actions column

        const actionsCell = document.createElement("td");


        // View button

        const viewButton = createActionButton(
            "View",
            "view-btn",
            record.id
        );


        // Edit button

        const editButton = createActionButton(
            "Edit",
            "edit-btn",
            record.id
        );


        // Delete button

        const deleteButton = createActionButton(
            "Delete",
            "delete-btn",
            record.id
        );


        actionsCell.append(
            viewButton,
            editButton,
            deleteButton
        );


        // Add cells to row

        row.append(
            idCell,
            titleCell,
            categoryCell,
            statusCell,
            actionsCell
        );


        // Add row to table

        recordsTableBody.appendChild(row);

    });

}


// ================================================
// 10. SEARCH AND FILTER RECORDS
// ================================================

function filterRecords(records) {

    const searchTerm = searchInput.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;


    return records.filter(record => {

        const matchesTitle = record.title
            .toLowerCase()
            .includes(searchTerm);


        const matchesStatus =
            selectedStatus === "" ||
            record.status === selectedStatus;


        return matchesTitle && matchesStatus;

    });

}


// ================================================
// 11. RENDER APPLICATION
// ================================================

async function renderApplication() {

    try {

        const records = await recordService.list();


        // Update dashboard

        updateDashboard(records);


        // Apply search and filtering

        const filteredRecords = filterRecords(records);


        // Display filtered records

        displayRecords(filteredRecords);


        // Update record count

        recordCount.textContent =
            `Showing ${filteredRecords.length} of ${records.length} records`;


        // Display empty list message

        if (filteredRecords.length === 0) {

            emptyMessage.hidden = false;

            if (records.length === 0) {

                emptyMessage.textContent =
                    "No maintenance requests have been added yet.";

            } else {

                emptyMessage.textContent =
                    "No records match your search or selected filter.";

            }

        } else {

            emptyMessage.hidden = true;

        }

    } catch (error) {

        showMessage(error.message, "error");

    }

}


// ================================================
// 12. ADD AND UPDATE RECORDS
// ================================================

requestForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    clearMessage();


    // Collect and trim input

    const record = {

        title: titleInput.value.trim(),

        category: categoryInput.value.trim(),

        description: descriptionInput.value.trim(),

        status: statusInput.value

    };


    // Validate input

    const validationError = validateRecord(record);


    if (validationError) {

        showMessage(validationError, "error");

        return;

    }


    try {

        const editingId = recordIdInput.value;


        if (editingId) {

            // Update existing record

            await recordService.update(editingId, record);

            showMessage(
                "Maintenance request updated successfully!",
                "success"
            );

        } else {

            // Create new record

            await recordService.create(record);

            showMessage(
                "Maintenance request added successfully!",
                "success"
            );

        }


        // Reset form

        resetForm();


        // Refresh application

        await renderApplication();

    } catch (error) {

        showMessage(error.message, "error");

    }

});


// ================================================
// 13. HANDLE VIEW, EDIT AND DELETE
// ================================================

recordsTableBody.addEventListener("click", async function(event) {

    const button = event.target.closest("button");


    if (!button) {

        return;

    }


    const id = Number(button.dataset.id);


    try {

        // VIEW RECORD

        if (button.classList.contains("view-btn")) {

            const record = await recordService.get(id);


            alert(
                "MAINTENANCE REQUEST DETAILS\n\n" +

                "ID: " + record.id + "\n" +

                "Title: " + record.title + "\n" +

                "Category: " + record.category + "\n" +

                "Description: " + record.description + "\n" +

                "Status: " + record.status
            );

        }


        // EDIT RECORD

        else if (button.classList.contains("edit-btn")) {

            const record = await recordService.get(id);


            recordIdInput.value = record.id;

            titleInput.value = record.title;

            categoryInput.value = record.category;

            descriptionInput.value = record.description;

            statusInput.value = record.status;


            formHeading.textContent = "Edit Maintenance Request";

            submitButton.textContent = "Update Request";

            cancelEditButton.hidden = false;


            clearMessage();


            // Move user to the form

            requestForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        // DELETE RECORD

        else if (button.classList.contains("delete-btn")) {

            const confirmation = confirm(
                "Are you sure you want to delete this maintenance request?"
            );


            if (confirmation) {

                await recordService.remove(id);


                showMessage(
                    "Maintenance request deleted successfully!",
                    "success"
                );


                // Cancel edit if the deleted record was being edited

                if (Number(recordIdInput.value) === id) {

                    resetForm();

                }


                await renderApplication();

            }

        }

    } catch (error) {

        showMessage(error.message, "error");

    }

});


// ================================================
// 14. CANCEL EDITING
// ================================================

cancelEditButton.addEventListener("click", function() {

    resetForm();

    clearMessage();

    showMessage(
        "Editing cancelled.",
        "success"
    );

});


// ================================================
// 15. SEARCH EVENT
// ================================================

searchInput.addEventListener("input", function() {

    renderApplication();

});


// ================================================
// 16. STATUS FILTER EVENT
// ================================================

statusFilter.addEventListener("change", function() {

    renderApplication();

});


// ================================================
// 17. START APPLICATION
// ================================================

resetForm();

renderApplication();