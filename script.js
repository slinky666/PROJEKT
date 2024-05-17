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
    // Hämta användarnamn och lösenord från formuläret
    var newUsername = document.getElementById('newUsername').value;
    var newPassword = document.getElementById('newPassword').value;

    // Spara användarnamn och lösenord i local storage
    localStorage.setItem('username', newUsername);
    localStorage.setItem('password', newPassword);

    // Visa ett meddelande om att kontot har skapats
    alert("Konto skapat!");

    // Omdirigera användaren till inloggningssidan
    window.location.href = "login.html";

    return false;
}


// Funktion för att logga in en användare
function login() {
    // Hämta användarnamn och lösenord från formuläret
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Hämta sparade användarnamn och lösenord från local storage
    var savedUsername = localStorage.getItem('username');
    var savedPassword = localStorage.getItem('password');

    // Jämför användarnamn och lösenord med sparade värden
    if (username === savedUsername && password === savedPassword) {
        // Om användarnamn och lösenord matchar, visa meddelande om lyckad inloggning och omdirigera till news sidan
        alert("Inloggning lyckades");
        window.location.href = "news.html";
        return false;
    } else {
        // Annars, visa felmeddelande
        alert("Fel användarnamn eller lösenord!");
        return false;
    }
}

// Funktion för att växla mörkt läge
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  function showTerms() {
    // Visa modalrutan för användarvillkoren
    var modal = document.getElementById('termsModal');
    modal.style.display = 'block';
  }

  function hideTerms() {
    // Dölj modalrutan för användarvillkoren
    var modal = document.getElementById('termsModal');
    modal.style.display = 'none';
  }



// Funktion för att hämta kryptopriser från API
async function fetchCryptoPrices() {
    try {
        // Parametrar för API
        const params = new URLSearchParams({
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,litecoin,dogecoin'
        });
        // Gör ett HTTP-anrop till API
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${params}`);
        // Konvertera svaret till JSON-format
        const data = await response.json();

        // Kontrollera att svaret är en array
        if (!Array.isArray(data)) {
            throw new TypeError('Expected an array of data');
        }

        // Uppdatera priserna för varje kryptovaluta
        updatePrice('bitcoin', data.find(coin => coin.id === 'bitcoin'));
        updatePrice('ethereum', data.find(coin => coin.id === 'ethereum'));
        updatePrice('litecoin', data.find(coin => coin.id === 'litecoin'));
        updatePrice('dogecoin', data.find(coin => coin.id === 'dogecoin'));
    } catch (error) {
        // Vid fel, sätt priser till 'Error'
        document.getElementById('bitcoin-price').textContent = 'Error';
        document.getElementById('ethereum-price').textContent = 'Error';
        document.getElementById('litecoin-price').textContent = 'Error';
        document.getElementById('dogecoin-price').textContent = 'Error';
        document.getElementById('bitcoin-change').textContent = 'Error';
        document.getElementById('ethereum-change').textContent = 'Error';
        document.getElementById('litecoin-change').textContent = 'Error';
        document.getElementById('dogecoin-change').textContent = 'Error';
    }
}

// Funktion för att uppdatera priserna för en kryptovaluta
function updatePrice(crypto, data) {
    // Kontrollera om data finns
    if (!data) {
        // Om ingen data finns, sätt pris och förändring till 'Error'
        document.getElementById(`${crypto}-price`).textContent = 'Error';
        document.getElementById(`${crypto}-change`).textContent = 'Error';
        return;
    }

    // Hämta referenser till pris- och förändringen för krypton
    const priceElement = document.getElementById(`${crypto}-price`);
    const changeElement = document.getElementById(`${crypto}-change`);

    // Uppdatera pris och förändring för krypton
    priceElement.textContent = `$${data.current_price}`;
    const change = data.price_change_percentage_24h;
    changeElement.textContent = `${change.toFixed(2)}%`;
    
    // Färgändringen beroende på om förändringen i priset är potsivit eller negativt
    if (change > 0) {
        changeElement.style.color = 'green';
    } else {
        changeElement.style.color = 'red';
    }
}

// Starta hämtning av kryptopriser när sidan laddas (kallar på funktionen)
fetchCryptoPrices();
