// menyimpan lalu display nama dan mempersonalisasi akun tranksaksi berdasarkan nama
document.addEventListener("DOMContentLoaded", function() {
    var formLogin = document.getElementById("formLogin");

    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        var username = document.getElementById("inputName").value;

        sessionStorage.setItem("username", username);

        var userTransactionsKey = "transactions_" + username;
        var userTransactions = localStorage.getItem(userTransactionsKey);

        if (!userTransactions) {
            localStorage.setItem(userTransactionsKey, JSON.stringify([]));
        }

        window.location.href = "index.html";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var username = sessionStorage.getItem("username");
    if (username) {
        document.getElementById("usernameDisplay").textContent = "Welcome, " + username + "!";
        document.getElementById("In").textContent = username + "' Income";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var username = sessionStorage.getItem("username");
    if (username) {
        document.getElementById("usernameDisplay").textContent = "Welcome, " + username + "!";
        document.getElementById("out").textContent = username + "' Outcome";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const transactionName = document.getElementById('transactionName').value.trim();
        const transactionNominal = document.getElementById('transactionNominal').value.trim();
        const transactionType = document.getElementById('transactionType').value.trim();
        const transactionCategory = document.getElementById('transactionType').querySelector('option:checked').getAttribute('data-category');
        const currentUsername = sessionStorage.getItem("username");
        const userTransactionsKey = "transactions_" + currentUsername;
        let transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
        const currentBalance = calculateBalance(transactions);
        if (transactionName !== '' && transactionNominal !== '' && transactionType !== '' && transactionCategory !== 'undefined') {
            const transaction = {
                name: transactionName,
                nominal: parseInt(transactionNominal), 
                type: transactionType,
                category: transactionCategory
            };

            if (transaction.type === 'outcome' && transaction.nominal > currentBalance) {
                console.log('Insufficient balance to cover the transaction:', transactionName);
                window.alert('Insufficient balance to cover the transaction: ' + transactionName);
            } else {
                transactions.push(transaction);
                localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));
                alert('Data transaksi berhasil ditambahkan.'); 
                form.reset();
                window.location.href = "index.html";
            }
        } else {
            alert('Harap isi semua kolom form dan pilih kategori.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const transactionDataDiv = document.getElementById('transactionData');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const balanceDisplay = document.getElementById('balanceDisplay');

    const username = sessionStorage.getItem('username');
    if (username) {
        usernameDisplay.textContent = 'Welcome, ' + username + '!';

        const userTransactionsKey = "transactions_" + username;
        let transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];

        if (transactions.length > 0) {
            let validTransactions = [];
            transactions.forEach(function (transaction) {
                const currentTransactions = validTransactions.concat(transaction);
                const balance = calculateBalance(currentTransactions);

                if (transaction.type === 'income' || transaction.nominal <= balance) {
                    validTransactions.push(transaction);
                }
            });

            if (validTransactions.length > 0) {
                validTransactions.forEach(function (transaction, index) {
                    const backgroundColor = transaction.type === 'income' ? 'lightgreen' : 'lightcoral';

                    const transactionHTML = `
                        <div class="transaction" style="background-color: ${backgroundColor};">
                            <p><strong>Type:</strong> ${transaction.type}</p>
                            <p><strong>Name:</strong> ${transaction.name}</p>
                            <p><strong>Nominal:</strong> ${transaction.nominal}</p>
                            <p><strong>Category:</strong> ${transaction.category}</p>
                        </div>
                    `;

                    transactionDataDiv.innerHTML += transactionHTML;
                });

                const balance = calculateBalance(validTransactions);
                const formattedBalance = formatBalance(balance);
                balanceDisplay.textContent = 'Your balance: Rp ' + formattedBalance;
            } else {
                transactionDataDiv.textContent = 'No transactions to display.';
                balanceDisplay.textContent = 'Your balance: Rp 0';
            }
        } else {
            transactionDataDiv.textContent = 'No transactions yet.';
            balanceDisplay.textContent = 'Your balance: Rp 0';
        }
    }
});

function calculateBalance(transactions) {
    let balance = 0;
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            balance += transaction.nominal;
        } else {
            if (balance >= transaction.nominal) {
                balance -= transaction.nominal;
            } else {
              console.log('Insufficient funds to cover the transaction:', transaction.name);
            }
        }
    });
    return balance;
}

function formatBalance(balance) {
    return Math.abs(balance); 
}


//main.html
var swiper = new Swiper('.swiper-container', {
    loop: true, 
    navigation: {
        nextEl: '#slider .swiper-button-next', 
        prevEl: '#slider .swiper-button-prev', 
    },
    pagination: {
        el: '.swiper-pagination',
    },
});
document.addEventListener('DOMContentLoaded', function () {
    const transactions = JSON.parse(localStorage.getItem("transactions_" + sessionStorage.getItem("username"))) || [];

    const categoryMap = {};
    transactions.forEach(transaction => {
        const category = transaction.type;
        const nominal = transaction.nominal;
        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }
        categoryMap[category] += nominal;
    });

    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);

    const backgroundColors = labels.map(type => {
        return type === 'income' ? 'blue' : 'red';
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });
    var resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', function () {
        localStorage.clear();

        var form = document.querySelector('form');
        form.reset();

        window.location.href = 'login.html'; 
    });
});

//Income.html
function incomeSelectChanged() {
    var selectElement = document.getElementById("transactionType");
    var otherInputDiv = document.getElementById("lainnyaInput");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var otherCategoryInput = document.getElementById("otherCategory");

    if (selectedOption.dataset.category === "Lainnya") {
        otherInputDiv.style.display = "block";
        otherCategoryInput.value = "";
        otherCategoryInput.focus();
    } else {
        otherInputDiv.style.display = "none";
    }
}

document.getElementById("otherCategory").addEventListener("input", function() {
    var selectElement = document.getElementById("transactionType");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    selectedOption.dataset.category = this.value;
});

// Outcome.html
function outcomeSelectChanged() {
    var selectElement = document.getElementById("transactionType");
    var otherInputDiv = document.getElementById("lainnyaInputDiv");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var otherCategoryInput = document.getElementById("otherCategory");

    if (selectedOption.dataset.category === "lainnyaInput") {
        otherInputDiv.style.display = "block";
        otherCategoryInput.value = "";
        otherCategoryInput.focus(); 
    } else {
        otherInputDiv.style.display = "none";
    }
}

document.getElementById("otherCategory").addEventListener("input", function() {
    var selectElement = document.getElementById("transactionType");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    selectedOption.dataset.category = this.value; 
});
