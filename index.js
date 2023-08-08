// const URL_ALL_CURRENCIES_AND_SHORTFORM = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json";
// const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";

const URL_ALL_CURRENCIES_AND_SHORTFORM = "currencies.min.json";
const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "eur.json";

main();

function main() {

    getParsedDataCollection().then( list => {

        const allCurrencies = list[0];
        const eurRate = list[1]["eur"];

        let map = new Map();
        
        createMapFromCurrencyData(map, allCurrencies, eurRate);

        createHtmlTableFromMap(map, allCurrencies);
    });

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
        map.set(key, null);
    });

    Object.keys(eurRate).forEach(function(key){
        if(map.has(key)) {
            map.set(key, eurRate[key]);
        }
    });

}

function createHtmlTableFromMap(map, allCurrencies) {

    let table = document.getElementById("currency_table");
    
    const tableHeader = "<tr><th>Short Form</th><th>Currency</th><th>Value</th></tr>";

    let tableBody = "";

    Object.keys(allCurrencies).forEach(function(key){
        tableBody += `<tr><td>${key}</td><td>${allCurrencies[key]}</td><td>${map.get(key)}</td></tr>` 
    });

    const completeTable = tableHeader + tableBody;

    table.innerHTML = completeTable;
}