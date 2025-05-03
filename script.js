fetch(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
)
    .then((response) => response.json())
    .then(res => render(res))
    .catch((err) => console.error(err));

function render(arr) {
    const list = arr.map(rate => `<li class="currency-item">${rate.cc} - ${rate.txt} - ${rate.rate.toFixed(2)} грн</li>`).join("");
    const currencyList = document.getElementById("currency-list");
    currencyList.innerHTML = "";
    currencyList.innerHTML = list;

    const currentDate = document.getElementById("current-date");
    const today = arr[0].exchangedate;
    currentDate.textContent = `Курс валют на ${today}`;

    renderCurrencyDropdownList(arr);
}
//function to render foreign currency for DROPDOWN LIST
function renderCurrencyDropdownList(arr) {
    const foreignCurrencySelect = document.getElementById("foreign-currency-select");

    const options = arr.map(rate => `<option value="${rate.rate}">${rate.txt} (${rate.rate.toFixed(2)})</option>`
    ).join("");

    foreignCurrencySelect.innerHTML += options; 
}

//funcion to update value of element of CALCULATION
function updateCalculatedHrn() {
    const calculatedHrnInput = document.getElementById("calculated-hrn-input");

    if (foreignInputValue && !isNaN(foreignCurrencySelectValue) && foreignCurrencySelectValue !== 'default') {
        const calculatedValueHrn = parseFloat(foreignInputValue) * foreignCurrencySelectValue;
        calculatedHrnInput.value = calculatedValueHrn.toFixed(4);
    } else {
        calculatedHrnInput.value = ''; // clean feild if vavlues arent valid
    }
}

//FIRST FOREIGN INPUT (user to input amount of foreign currency)
let foreignInputValue = ''; //NEED TO USE THIS FOR CALCULATION (this is AMOUNT)<------------
const foreignInput = document.getElementById('foreign-input');
foreignInput.addEventListener('input', () => {
    foreignInputValue = foreignInput.value;
    updateCalculatedHrn();  
});

//FIRST DROPDOWNLIST select (foreign currency)
let foreignCurrencySelectValue = '';  //NEED TO USE THIS FOR CALCULATION (this is OPTION whith foreign currency) 
let foreignCurrencySelect = document.getElementById("foreign-currency-select");
foreignCurrencySelect.addEventListener("change", (event) => {
    foreignCurrencySelectValue = parseFloat(foreignCurrencySelect.value);
    updateCalculatedHrn();
})

