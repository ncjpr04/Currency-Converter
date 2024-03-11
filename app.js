const BASE_URL =
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }
        const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
        let selectedCurr = fromCurr.value.toLowerCase();

        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Error fetching data. HTTP status: ${response.status}`);
        }

        let data = await response.json();
        let rate;
        for (const key in data[selectedCurr]) {
            if (key === toCurr.value.toLowerCase()) {
                rate = data[selectedCurr][key];
                break;
            }
        }

        if (rate === undefined) {
            throw new Error(`Exchange rate not available for ${toCurr.value}`);
        }

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error('Error updating exchange rate:', error);
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
document.addEventListener('keypress', function(event) {
    // Check if the user pressed the Enter key
    if (event.key === 'Enter') {
      // Trigger the button click
      btn.click();
    }
  });
