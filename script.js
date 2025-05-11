const BASE_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

function generateDates(daysCount) {
    const today = new Date();
    return [...Array(daysCount)].map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0].replace(/-/g, '');
    });
}

async function fetchRates(valcode, date) {
    const url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valcode}&date=${date}&json`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data[0];
    } catch (err) {
        console.error(`Помилка отримання курсу на ${date}:`, err);
        throw err;
    }
}

async function loadCurrencyHistory(code, name) {
    const dates = generateDates(7);

    try {
        const promises = dates.map(date => fetchRates(code, date));
        let rates = await Promise.all(promises);

        // Фільтруємо успішні відповіді та сортуємо за датою ↓
        rates = rates.filter(Boolean).sort((a, b) => {
            const da = new Date(a.exchangedate.split('.').reverse().join('-'));
            const db = new Date(b.exchangedate.split('.').reverse().join('-'));
            return db - da;
        });

        displayHistory(rates, name);
    } catch (err) {
        console.error('Помилка завантаження історії:', err);
    }
}

function displayHistory(rates, currencyName) {
    const output = document.getElementById("history-output");

    const historyHtml = `
        <table class="currency-history-table">
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Курс (грн)</th>
                </tr>
            </thead>
            <tbody>
                ${rates.map(rate =>
                    `<tr><td>${rate.exchangedate}</td><td>${rate.rate.toFixed(2)}</td></tr>`
                ).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("history-title").textContent = `Курс валюти за тиждень: ${currencyName}`;
    output.innerHTML = historyHtml;
}

function render(arr) {
    const list = arr.map(rate =>
        `<li class="currency-item" data-code="${rate.cc}" data-name="${rate.txt}">${rate.cc} - ${rate.txt} - ${rate.rate.toFixed(2)} грн</li>`
    ).join("");

    const currencyList = document.getElementById("currency-list");
    currencyList.innerHTML = list;

    const currentDate = document.getElementById("current-date");
    const today = arr[0].exchangedate;
    currentDate.textContent = `Курс валют на ${today}`;

    renderCurrencyDropdownList(arr);
    renderCurrencyDropdownList2(arr);

    document.querySelectorAll('.currency-item').forEach(item => {
        item.addEventListener('click', () => {
            const currencyCode = item.dataset.code;
            const currencyName = item.dataset.name;
            loadCurrencyHistory(currencyCode, currencyName);
        });
    });
}

fetch(BASE_URL)
    .then(response => response.json())
    .then(render)
    .catch(err => console.error(err));

function renderCurrencyDropdownList(arr) {
    const foreignCurrencySelect = document.getElementById("foreign-currency-select");
    const options = arr.map(rate => `<option value="${rate.rate}">${rate.txt} (${rate.rate.toFixed(2)})</option>`).join("");
    foreignCurrencySelect.innerHTML += options;
}

function renderCurrencyDropdownList2(arr) {
    const foreignCurrencySelect2 = document.getElementById("foreign-currency-select2");
    const options = arr.map(rate => `<option value="${rate.rate}">${rate.txt} (${rate.rate.toFixed(2)})</option>`).join("");
    foreignCurrencySelect2.innerHTML += options;
}

// Конвертер валюти
let foreignInputValue = '';
let foreignCurrencySelectValue = '';
let hrnInputValue = '';
let foreignCurrencySelectValue2 = '';

const foreignInput = document.getElementById('foreign-input');
foreignInput.addEventListener('input', () => {
    foreignInputValue = foreignInput.value;
    updateCalculatedHrn();
});

const foreignCurrencySelect = document.getElementById("foreign-currency-select");
foreignCurrencySelect.addEventListener("change", () => {
    foreignCurrencySelectValue = parseFloat(foreignCurrencySelect.value);
    updateCalculatedHrn();
});

function updateCalculatedHrn() {
    const calculatedHrnInput = document.getElementById("calculated-hrn-input");
    if (foreignInputValue && !isNaN(foreignCurrencySelectValue) && foreignCurrencySelectValue !== 'default') {
        const calculatedValueHrn = parseFloat(foreignInputValue) * foreignCurrencySelectValue;
        calculatedHrnInput.value = calculatedValueHrn.toFixed(4);
    } else {
        calculatedHrnInput.value = '';
    }
}

const hrnInput = document.getElementById('hrn-input');
hrnInput.addEventListener('input', () => {
    hrnInputValue = hrnInput.value;
    updateCalculatedForeign();
});

const foreignCurrencySelect2 = document.getElementById("foreign-currency-select2");
foreignCurrencySelect2.addEventListener("change", () => {
    foreignCurrencySelectValue2 = parseFloat(foreignCurrencySelect2.value);
    updateCalculatedForeign();
});

function updateCalculatedForeign() {
    const calculatedForeign = document.getElementById("calculated-foreign");
    if (hrnInputValue && !isNaN(foreignCurrencySelectValue2) && foreignCurrencySelectValue2 !== 'default') {
        const calculatedValueForeign = parseFloat(hrnInputValue) / foreignCurrencySelectValue2;
        calculatedForeign.value = calculatedValueForeign.toFixed(4);
    } else {
        calculatedForeign.value = '';
    }
}
