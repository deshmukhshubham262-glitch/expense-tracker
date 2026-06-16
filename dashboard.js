const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "login.html";
}

document.getElementById("welcomeUser").innerText =
`Welcome ${loggedInUser.fullName} 👋`;

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});

const storageKey =
"expenses_" + loggedInUser.email;

let expenses =
JSON.parse(localStorage.getItem(storageKey)) || [];

const addBtn = document.getElementById("addBtn");
const expenseBody = document.getElementById("expenseBody");

let pieChart;
let barChart;

function saveExpenses() {
    localStorage.setItem(
        storageKey,
        JSON.stringify(expenses)
    );
}

function updateDashboard() {

    let total = 0;

    expenses.forEach(expense => {
        total += Number(expense.amount);
    });

    document.getElementById("totalExpense").innerText =
        "₹" + total;

    document.getElementById("totalTransactions").innerText =
        expenses.length;

    let currentMonth =
        new Date().getMonth();

    let monthTotal = 0;

    expenses.forEach(expense => {

        let expenseMonth =
            new Date(expense.date).getMonth();

        if (expenseMonth === currentMonth) {
            monthTotal += Number(expense.amount);
        }

    });

    document.getElementById("monthExpense").innerText =
        "₹" + monthTotal;

    let largest = 0;

    expenses.forEach(expense => {
        if (Number(expense.amount) > largest) {
            largest = Number(expense.amount);
        }
    });

    document.getElementById("largestExpense").innerText =
        "₹" + largest;

    let average =
        expenses.length > 0
            ? Math.round(total / expenses.length)
            : 0;

    document.getElementById("averageExpense").innerText =
        "₹" + average;

    let categoryTotals = {};

    expenses.forEach(expense => {

        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] +=
            Number(expense.amount);

    });

    let highestCategory = "-";
    let highestValue = 0;

    for (let category in categoryTotals) {

        if (categoryTotals[category] > highestValue) {

            highestValue =
                categoryTotals[category];

            highestCategory =
                category;

        }

    }

    document.getElementById("highestCategory").innerText =
        highestCategory;

    updateCharts(categoryTotals);
}

function renderTable(data = expenses) {

    expenseBody.innerHTML = "";

    data.forEach((expense, index) => {

        let row = `
        <tr>
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

        expenseBody.innerHTML += row;

    });

}

window.deleteExpense = function(index){

    expenses.splice(index,1);

    saveExpenses();

    renderTable();

    updateDashboard();

};

addBtn.addEventListener("click", () => {

    const date =
        document.getElementById("date").value;

    const name =
        document.getElementById("name").value;

    const category =
        document.getElementById("category").value;

    const amount =
        document.getElementById("amount").value;

    if (
        !date ||
        !name ||
        !category ||
        !amount
    ) {
        alert("Please fill all fields");
        return;
    }

    expenses.push({
        date,
        name,
        category,
        amount
    });

    saveExpenses();

    renderTable();

    updateDashboard();

    document.getElementById("date").value = "";
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";

});

document.getElementById("searchInput")
.addEventListener("input", function(){

    let keyword =
    this.value.toLowerCase();

    let filtered =
    expenses.filter(expense =>
        expense.name.toLowerCase()
        .includes(keyword)
    );

    renderTable(filtered);

});

document.getElementById("filterCategory")
.addEventListener("change", function(){

    let category = this.value;

    if(category === "All"){

        renderTable();

        return;
    }

    let filtered =
    expenses.filter(expense =>
        expense.category === category
    );

    renderTable(filtered);

});

document.getElementById("exportBtn")
.addEventListener("click", () => {

    let csv =
    "Date,Name,Category,Amount\n";

    expenses.forEach(expense => {

        csv +=
        `${expense.date},${expense.name},${expense.category},${expense.amount}\n`;

    });

    let blob =
    new Blob([csv], {
        type: "text/csv"
    });

    let url =
    URL.createObjectURL(blob);

    let a =
    document.createElement("a");

    a.href = url;

    a.download =
    "expenses.csv";

    a.click();

});

document.getElementById("clearBtn")
.addEventListener("click", () => {

    let confirmDelete =
    confirm(
        "Delete all expenses?"
    );

    if(!confirmDelete) return;

    expenses = [];

    saveExpenses();

    renderTable();

    updateDashboard();

});

function updateCharts(categoryTotals){

    const labels =
    Object.keys(categoryTotals);

    const values =
    Object.values(categoryTotals);

    const pieCtx =
    document.getElementById("expenseChart");

    if(pieChart){
        pieChart.destroy();
    }

    pieChart =
    new Chart(pieCtx,{

        type:"pie",

        data:{
            labels:labels,
            datasets:[{
                data:values
            }]
        }

    });

    const barCtx =
    document.getElementById("barChart");

    if(barChart){
        barChart.destroy();
    }

    barChart =
    new Chart(barCtx,{

        type:"bar",

        data:{
            labels:labels,
            datasets:[{
                label:"Expenses",
                data:values
            }]
        }

    });

}

renderTable();
updateDashboard();