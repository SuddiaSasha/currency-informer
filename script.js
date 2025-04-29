fetch(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
)
.then((response) => response.json())
.then(res => render(res))
.catch((err) => console.error(err));

function render (arr) {
    const list = arr.map(rate => `<li>${rate.txt} - ${rate.rate}</li>`).join("");
    console.log(list)
    const body = document.body;
body.innerHTML = `<ul>${list}</ul>`
}