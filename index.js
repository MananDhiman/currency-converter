// const URL_ALL_CURRENCIES_AND_SHORTFORM = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json";
// const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";

const URL_ALL_CURRENCIES_AND_SHORTFORM = "currencies.min.json";
const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "eur.json";

main();

function main() {

    // show a loading screen here

    getParsedDataCollection().then( list => {

        const allCurrencies = list[0];
        const eurRate = list[1]["eur"];

        let map = new Map();
        
        createMapFromCurrencyData(map, allCurrencies, eurRate);

        createHtmlTableFromMap(map, allCurrencies);
        
        setCurrenciesInSelect(map);

        const convertButton = document.getElementById("convert_currency_1_currency_2");
        convertButton.onclick = function() {
            convertCurrency(map);
        };

    });

    // end the loading screen here

}

async function getParsedDataCollection() {

    const allCurrencies = await getJsonFromApi(URL_ALL_CURRENCIES_AND_SHORTFORM);
    const currencyRateEurAsBase = await getJsonFromApi(URL_EUR_AS_BASE_TO_OTHER_CURRENCIES);

    return [allCurrencies, currencyRateEurAsBase];
}

async function getJsonFromApi(url) {

    const response = await fetch(url);

    var data = await response.json();

    // console.log(data);
    return data;
}

function createMapFromCurrencyData(map, all, eurRate) {

    Object.keys(all).forEach(function(key){
        map.set(key, eurRate[key]);
    });

}

function createHtmlTableFromMap(map, allCurrencies) {

    let table = document.getElementById("currency_table");
    
    const tableHeader = "<tr><th>ISO Currency Code</th><th>Currency</th><th>Value</th></tr>";

    let tableBody = "";

    Object.keys(allCurrencies).forEach(function(key){
        tableBody += `<tr><td>${key}</td><td>${allCurrencies[key]}</td><td>${map.get(key)}</td></tr>`;
    });

    const completeTable = tableHeader + tableBody;

    table.innerHTML = completeTable;
}

function setCurrenciesInSelect(map) {
    const select_1 = document.getElementById("currency_1");
    const select_2 = document.getElementById("currency_2");

    let data = "<option value='--'>--</option>";    

    map.forEach(function (value, key) {
        data += `<option value="${key}">${key}</option>`;
    });

    select_1.innerHTML = data;
    select_2.innerHTML = data;

}

function convertCurrency(map) {
    const select_1 = document.getElementById("currency_1");
    const select_2 = document.getElementById("currency_2");
    const amount_1 = document.getElementById("amount_1");

    const value_1 = select_1.value;
    const value_2 = select_2.value;

    let amount_2 = document.getElementById("amount_2");

    if (areOptionsSelected(value_1, value_2)) {
        
        let ratio = map.get(value_2) / map.get(value_1);
        let convertedAmount = (ratio * amount_1.value).toFixed(2);
        amount_2.textContent = convertedAmount;

    } else {
        alert("Please select both currencies")
    }

}

function areOptionsSelected(value_1, value_2) {

    if (value_1 === "--" || value_2 === "--") return false;

    return true;

}