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
    renderCurrencyDropdownList2(arr);
}
//function to render foreign currency for DROPDOWN LIST
function renderCurrencyDropdownList(arr) {
    const foreignCurrencySelect = document.getElementById("foreign-currency-select");

    const options = arr.map(rate => `<option value="${rate.rate}">${rate.txt} (${rate.rate.toFixed(2)})</option>`
    ).join("");

    foreignCurrencySelect.innerHTML += options;
}
function renderCurrencyDropdownList2(arr) {
    const foreignCurrencySelect2 = document.getElementById("foreign-currency-select2");

    const options = arr.map(rate => `<option value="${rate.rate}">${rate.txt} (${rate.rate.toFixed(2)})</option>`
    ).join("");

    foreignCurrencySelect2.innerHTML += options;
};


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

function updateCalculatedForeign() {
    const calculatedForeign = document.getElementById("calculated-foreign");

    if (hrnInputValue && !isNaN(foreignCurrencySelectValue2) && foreignCurrencySelectValue2 !== 'default') {
        const calculatedValueForeign = parseFloat(hrnInputValue) / foreignCurrencySelectValue2;
        calculatedForeign.value = calculatedValueForeign.toFixed(4); 
    } else {
        calculatedForeign.value = '';
    }

};

//FIRST FOREIGN INPUT (user to input amount of foreign currency)
let foreignInputValue = ''; //NEED TO USE THIS FOR CALCULATION (this is AMOUNT)<------------
const foreignInput = document.getElementById('foreign-input');
foreignInput.addEventListener('input', () => {
    foreignInputValue = foreignInput.value;
    updateCalculatedHrn();  // < -- changes here 
});

//FIRST DROPDOWNLIST select (foreign currency)
let foreignCurrencySelectValue = '';  //NEED TO USE THIS FOR CALCULATION (this is OPTION whith foreign currency) 
let foreignCurrencySelect = document.getElementById("foreign-currency-select");
foreignCurrencySelect.addEventListener("change", (event) => {
    foreignCurrencySelectValue = parseFloat(foreignCurrencySelect.value);
    updateCalculatedHrn();
})

//SECOND HRN INPUT
let hrnInputValue = ''; // <--- use this for calculation
const hrnInput = document.getElementById('hrn-input');
hrnInput.addEventListener('input', () => {
    hrnInputValue = hrnInput.value;
    updateCalculatedForeign();
});

//second dropdown list
let foreignCurrencySelectValue2 = '';  //NEED TO USE THIS FOR CALCULATION (this is OPTION whith foreign currency) 
let foreignCurrencySelect2 = document.getElementById("foreign-currency-select2");
foreignCurrencySelect2.addEventListener("change", (event) => {
    foreignCurrencySelectValue2 = parseFloat(foreignCurrencySelect2.value);
    updateCalculatedForeign();
})
