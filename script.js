fetch(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
)
    .then((response) => response.json())
    .then(res => render(res))
    .catch((err) => console.error(err));

function render(arr) {
    const list = arr.map(rate => `<li class="currency-item">${rate.txt} - ${rate.rate.toFixed(2)} грн</li>`).join("");
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

    const options = arr.map(rate => `<option value="${rate.txt}">${rate.txt}</option>`
    ).join("");

    foreignCurrencySelect.innerHTML += options; 
}

//FIRST FOREIGN INPUT (user to input amount of foreign currency)
let foreignInputValue = '';
const foreignInput = document.getElementById('foreign-input');
foreignInput.addEventListener('input', () => {
    foreignInputValue = foreignInput.value;

});


