const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
    for (let currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value = currcode;

        // Set default values (USD to INR)
        if (select.name === "from" && currcode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currcode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    // Add change event listener to update flags when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Fetch and update the exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input").value;
    if (amount === "" || amount < 1) {
        amount = 1;
        document.querySelector(".amount input").value = 1;
    }

    // API URL now fetches only fromCurrency data, and we extract toCurrency from the response
    const URL = `${BASE_URL}/${fromcurr.value.toLowerCase()}.json`;
    try {
        let response = await fetch(URL);
        let data = await response.json();
        
        // Extract the exchange rate using the new data structure
        let rate = data[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];
        
        if (!rate) {
            msg.innerText = `Exchange rate not available for ${fromcurr.value} to ${tocurr.value}`;
            return;
        }

        let finalAmount = amount * rate;
        msg.innerText = `${amount} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate.";
        console.error("Error fetching the data:", error);
    }
};

// Update flag based on selected currency
const updateFlag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode];
    let imgSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = imgSrc;
};

// Event listeners for fetching and displaying rates
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
