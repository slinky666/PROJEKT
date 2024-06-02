// Funktion för att omdirigera till inloggning
function redirectToLogin() {
    window.location.href = "login.html";
}

// Funktion för att omdirigera till signupsidan
function redirectToSignup() {
    window.location.href = "signup.html";
}

// Funktion för att registrera en ny användare
function signup() {
    var newUsername = document.getElementById('newUsername').value;
    var newPassword = document.getElementById('newPassword').value;

    localStorage.setItem('username', newUsername);
    localStorage.setItem('password', newPassword);

    alert("Konto skapat!");

    window.location.href = "login.html";

    return false;
}

// Funktion för att logga in en användare
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var savedUsername = localStorage.getItem('username');
    var savedPassword = localStorage.getItem('password');

    if (username === savedUsername && password === savedPassword) {
        alert("Inloggning lyckades");
        window.location.href = "news.html";
        return false;
    } else {
        alert("Fel användarnamn eller lösenord!");
        return false;
    }
}

// Funktion för att växla mörkt läge
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function showTerms() {
    var modal = document.getElementById('termsModal');
    modal.style.display = 'block';
}

function hideTerms() {
    var modal = document.getElementById('termsModal');
    modal.style.display = 'none';
}

// Funktion för att rensa tabellen
function clearTable() {
    const tbody = document.querySelector('#crypto-table');
    tbody.innerHTML = '';
}

// Funktion för att hämta kryptopriser från API
async function fetchCryptoPrices() {
    try {
        const cryptoIds = Array.from(document.querySelectorAll('#crypto-table tr')).map(row => row.firstChild.textContent.toLowerCase().replace(/\s/g, '-'));

        if (cryptoIds.length === 0) return; // Om det inte finns några kryptovalutor, avbryt funktionen

        // Begränsa antalet samtidiga förfrågningar
        const chunkSize = 5;
        for (let i = 0; i < cryptoIds.length; i += chunkSize) {
            const chunk = cryptoIds.slice(i, i + chunkSize);
            const params = new URLSearchParams({
                vs_currency: 'usd',
                ids: chunk.join(',')
            });

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${params}`);
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new TypeError('Expected an array of data');
            }

            data.forEach(coin => updatePrice(coin.id, coin));
        }
    } catch (error) {
        document.querySelectorAll('[id$="-price"]').forEach(el => el.textContent = 'Error');
        document.querySelectorAll('[id$="-change"]').forEach(el => el.textContent = 'Error');
    }
}

// Funktion för att uppdatera priserna för en kryptovaluta
function updatePrice(crypto, data) {
    if (!data) {
        document.getElementById(`${crypto}-price`).textContent = 'Error';
        document.getElementById(`${crypto}-change`).textContent = 'Error';
        return;
    }

    const priceElement = document.getElementById(`${crypto}-price`);
    const changeElement = document.getElementById(`${crypto}-change`);

    priceElement.textContent = `$${data.current_price}`;
    const change = data.price_change_percentage_24h;
    changeElement.textContent = `${change.toFixed(2)}%`;

    if (change > 0) {
        changeElement.style.color = 'green';
    } else {
        changeElement.style.color = 'red';
    }
}

// Funktion för att lägga till en kryptovaluta i tabellen
function addCryptoToTable(cryptoId) {
    if (document.querySelectorAll('#crypto-table tr').length >= 5) {
        alert("Max 5 kryptovalutor åt gången");
        return;
    }

    if (document.getElementById(`${cryptoId}-price`)) return; // Om kryptovalutan redan finns i tabellen

    const tbody = document.querySelector('#crypto-table');
    const newRow = document.createElement('tr');

    const cryptoName = document.createElement('td');
    cryptoName.textContent = cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1).replace(/-/g, ' '); // Stor bokstav i början och ersätt '-' med ' '
    newRow.appendChild(cryptoName);

    const priceCell = document.createElement('td');
    priceCell.id = `${cryptoId}-price`;
    priceCell.textContent = 'Loading...';
    newRow.appendChild(priceCell);

    const changeCell = document.createElement('td');
    changeCell.id = `${cryptoId}-change`;
    changeCell.textContent = 'Loading...';
    newRow.appendChild(changeCell);

    tbody.appendChild(newRow);
}

// Funktion för att hämta kryptopriser och lägga till en vald kryptovaluta i tabellen
async function addCrypto() {
    const selectedCrypto = document.getElementById('crypto-options').value;
    addCryptoToTable(selectedCrypto);
    await fetchCryptoPrices(); // Hämta uppdaterade priser
}


// Starta hämtning av kryptopriser när sidan laddas
window.onload = function() {
    clearTable(); // Rensa tabellen vid sidans laddning
    fetchCryptoPrices();
}
