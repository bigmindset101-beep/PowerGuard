
/* =================================
   POWERGUARD EXPENSES JAVASCRIPT
================================= */

// ELEMENTS

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("expenseDate");
const descriptionInput = document.getElementById("description");

const receiptInput = document.getElementById("receiptInput");
const uploadBox = document.getElementById("uploadBox");
const uploadTitle = document.getElementById("uploadTitle");
const fileName = document.getElementById("fileName");
const extractBtn = document.getElementById("extractBtn");

const toast = document.getElementById("toast");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

const modalClose = document.getElementById("modalClose");
const modalDone = document.getElementById("modalDone");

const emptyState = document.getElementById("emptyState");


// INITIAL SAMPLE EXPENSES

let expenses = [
    {
        id: 1,
        date: "2025-10-28",
        description: "Fuel purchase (10L)",
        category: "Generator",
        amount: 15000,
        source: "Measured"
    },

    {
        id: 2,
        date: "2025-10-26",
        description: "Electricity Bill",
        category: "Grid Electricity",
        amount: 8500,
        source: "Confirmed"
    },

    {
        id: 3,
        date: "2025-10-24",
        description: "Fuel purchase",
        category: "Generator",
        amount: 10000,
        source: "Confirmed"
    }
];

let activeFilter = "All";
let editingId = null;
let selectedReceipt = null;


// HELPER FUNCTIONS

function formatCurrency(amount) {

    return "₦" + Number(amount).toLocaleString("en-NG");

}


function formatDate(date) {

    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);

}


function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }

}


// MOBILE SIDEBAR

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


document.addEventListener("click", (event) => {

    if (
        window.innerWidth <= 760 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


// UPDATE SUMMARY CARDS

function updateSummary() {

    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    const grid = expenses
        .filter(e => e.category === "Grid Electricity")
        .reduce((sum, e) => sum + e.amount, 0);

    const generator = expenses
        .filter(e => e.category === "Generator")
        .reduce((sum, e) => sum + e.amount, 0);

    const other = expenses
        .filter(e => e.category === "Other")
        .reduce((sum, e) => sum + e.amount, 0);


    document.getElementById("totalExpenses").textContent =
        formatCurrency(total);

    document.getElementById("gridTotal").textContent =
        formatCurrency(grid);

    document.getElementById("generatorTotal").textContent =
        formatCurrency(generator);

    document.getElementById("otherTotal").textContent =
        formatCurrency(other);


    function percentage(value) {

        return total > 0
            ? Math.round((value / total) * 100)
            : 0;

    }


    document.getElementById("gridPercentage").textContent =
        percentage(grid) + "% of total";

    document.getElementById("generatorPercentage").textContent =
        percentage(generator) + "% of total";

    document.getElementById("otherPercentage").textContent =
        percentage(other) + "% of total";

}


// CATEGORY ICONS

function categoryIcon(category) {

    if (category === "Generator") {
        return "fuel";
    }

    if (category === "Grid Electricity") {
        return "tower-control";
    }

    return "ellipsis";

}


// CATEGORY BADGE CLASS

function categoryClass(category) {

    if (category === "Generator") {
        return "generator-badge";
    }

    if (category === "Grid Electricity") {
        return "grid-badge";
    }

    return "generator-badge";

}


// RENDER EXPENSE TABLE

function renderExpenses() {

    const filteredExpenses = expenses.filter(expense => {

        return activeFilter === "All" ||
            expense.category === activeFilter;

    });


    expenseTable.innerHTML = "";


    if (filteredExpenses.length === 0) {

        emptyState.hidden = false;

    } else {

        emptyState.hidden = true;

    }


    filteredExpenses.forEach(expense => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <span class="date-cell">
                    <i data-lucide="calendar-days"></i>
                    ${formatDate(expense.date)}
                </span>
            </td>

            <td>${escapeHTML(expense.description || "Energy expense")}</td>

            <td>
                <span class="category-badge ${categoryClass(expense.category)}">
                    <i data-lucide="${categoryIcon(expense.category)}"></i>
                    ${expense.category}
                </span>
            </td>

            <td class="amount-cell">
                ${formatCurrency(expense.amount)}
            </td>

            <td>
                <span class="source-badge ${expense.source === "Measured" ? "measured" : "confirmed"}">
                    <i data-lucide="circle"></i>
                    ${expense.source}
                </span>
            </td>

            <td>
                <div class="actions">

                    <button class="view-btn" data-action="view" data-id="${expense.id}" title="View">
                        <i data-lucide="eye"></i>
                    </button>

                    <button class="edit-btn" data-action="edit" data-id="${expense.id}" title="Edit">
                        <i data-lucide="pencil"></i>
                    </button>

                    <button class="delete-btn" data-action="delete" data-id="${expense.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>

                </div>
            </td>

        `;

        expenseTable.appendChild(row);

    });


    updateSummary();
    refreshIcons();

}


// BASIC HTML ESCAPING FOR USER-ENTERED TEXT

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


// ADD AND EDIT EXPENSES

expenseForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {

        showToast("Please enter a valid expense amount.");
        return;

    }


    const expenseData = {

        date: dateInput.value,
        description: descriptionInput.value.trim() || "Energy expense",
        category: categoryInput.value,
        amount: amount,
        source: "Confirmed"

    };


    if (editingId !== null) {

        expenses = expenses.map(expense => {

            if (expense.id === editingId) {

                return {
                    ...expense,
                    ...expenseData
                };

            }

            return expense;

        });

        showToast("Expense updated successfully!");

        editingId = null;

    } else {

        expenses.unshift({

            id: Date.now(),
            ...expenseData

        });

        showToast("Expense added successfully!");

    }


    expenseForm.reset();

    dateInput.value = new Date().toISOString().split("T")[0];

    document.querySelector(".save-btn").innerHTML =
        '<i data-lucide="save"></i> Save Expense';

    activeFilter = "All";

    updateActiveTab();
    renderExpenses();

});


// FILTER TABS

const filterTabs = document.querySelectorAll(".filter-tab");


function updateActiveTab() {

    filterTabs.forEach(tab => {

        tab.classList.toggle(
            "active",
            tab.dataset.filter === activeFilter
        );

    });

}


filterTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        activeFilter = tab.dataset.filter;

        updateActiveTab();
        renderExpenses();

    });

});


// TABLE ACTIONS

expenseTable.addEventListener("click", (event) => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const expense = expenses.find(e => e.id === id);

    if (!expense) return;


    if (action === "view") {

        viewExpense(expense);

    }


    if (action === "edit") {

        editExpense(expense);

    }


    if (action === "delete") {

        deleteExpense(id);

    }

});


// VIEW EXPENSE

function viewExpense(expense) {

    modalTitle.textContent = "Expense Details";

    modalContent.innerHTML = `

        <div class="modal-details">

            <div>
                <small>Description</small>
                <strong>${escapeHTML(expense.description)}</strong>
            </div>

            <div>
                <small>Category</small>
                <strong>${expense.category}</strong>
            </div>

            <div>
                <small>Amount</small>
                <strong>${formatCurrency(expense.amount)}</strong>
            </div>

            <div>
                <small>Date</small>
                <strong>${formatDate(expense.date)}</strong>
            </div>

            <div>
                <small>Source</small>
                <strong>${expense.source}</strong>
            </div>

        </div>

    `;

    modalOverlay.classList.add("show");

}


// EDIT EXPENSE

function editExpense(expense) {

    editingId = expense.id;

    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;
    descriptionInput.value = expense.description;

    document.querySelector(".save-btn").innerHTML =
        '<i data-lucide="save"></i> Update Expense';

    refreshIcons();

    document.querySelector(".manual-panel").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showToast("Edit the details and save your changes.");

}


// DELETE EXPENSE

function deleteExpense(id) {

    const confirmed = window.confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;


    expenses = expenses.filter(expense => expense.id !== id);

    renderExpenses();

    showToast("Expense deleted successfully.");

}


// MODAL CONTROLS

function closeModal() {

    modalOverlay.classList.remove("show");

}


modalClose.addEventListener("click", closeModal);
modalDone.addEventListener("click", closeModal);


modalOverlay.addEventListener("click", (event) => {

    if (event.target === modalOverlay) {
        closeModal();
    }

});


// RECEIPT UPLOAD

receiptInput.addEventListener("change", () => {

    const file = receiptInput.files[0];

    if (!file) return;

    handleReceipt(file);

});


function handleReceipt(file) {

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {

        showToast("Please upload a JPG or PNG image.");
        receiptInput.value = "";
        return;

    }

    if (file.size > 5 * 1024 * 1024) {

        showToast("Receipt image must be smaller than 5MB.");
        receiptInput.value = "";
        return;

    }


    selectedReceipt = file;

    uploadTitle.textContent = "Receipt selected successfully";

    fileName.textContent = file.name;

    extractBtn.hidden = false;

    showToast("Receipt uploaded. Ready for extraction.");

}


// DRAG AND DROP RECEIPT

uploadBox.addEventListener("dragover", (event) => {

    event.preventDefault();

    uploadBox.classList.add("dragover");

});


uploadBox.addEventListener("dragleave", () => {

    uploadBox.classList.remove("dragover");

});


uploadBox.addEventListener("drop", (event) => {

    event.preventDefault();

    uploadBox.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {

        const transfer = new DataTransfer();

        transfer.items.add(file);

        receiptInput.files = transfer.files;

        handleReceipt(file);

    }

});


// GEMINI EXTRACTION PLACEHOLDER

extractBtn.addEventListener("click", () => {

    if (!selectedReceipt) {

        showToast("Please upload a receipt first.");
        return;

    }

    showToast(
        "Receipt selected! Connect your Gemini backend to extract the details."
    );

});


// DATE FILTER

document.getElementById("periodFilter")
    .addEventListener("change", (event) => {

        showToast(
            event.target.value === "all"
                ? "Showing all available records."
                : `Selected last ${event.target.value} days. Connect your date filter to the backend.`
        );

    });


// FULL HISTORY BUTTON

document.getElementById("historyBtn")
    .addEventListener("click", () => {

        activeFilter = "All";

        updateActiveTab();
        renderExpenses();

        showToast("Showing all available expense records.");

    });


// SEARCH

document.querySelector(".search-box input")
    .addEventListener("input", (event) => {

        const query = event.target.value.toLowerCase().trim();

        const rows = expenseTable.querySelectorAll("tr");

        rows.forEach(row => {

            row.style.display =
                row.textContent.toLowerCase().includes(query)
                    ? ""
                    : "none";

        });

    });


// INITIALIZE PAGE

dateInput.value = new Date().toISOString().split("T")[0];

renderExpenses();

refreshIcons();
