// const URL_ALL_CURRENCIES_AND_SHORTFORM = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json";
// const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";

const URL_ALL_CURRENCIES_AND_SHORTFORM = "currencies.min.json";
const URL_EUR_AS_BASE_TO_OTHER_CURRENCIES = "eur.json";

let map;
let tableStatus = 0;
main();

function main() {

    // show a loading screen here

    getParsedDataCollection().then( list => {

        map = new Map();

        fillMapData(list);
        createPopularCurrenciesTable();

        // createHtmlTableFromMap();
        
        setCurrenciesInSelect();

        const convertButton = document.getElementById("convert_currency_1_currency_2");
        convertButton.onclick = function() {
            convertCurrency();
        };

    });

    // end the loading screen here

}

var searchBox = document.getElementById("search");
searchBox.onkeyup = function(){
    tableStatus = 1;
    toggleTable();
    search();
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

function fillMapData(list) {
    const all = list[0];
    const eur = list[1]["eur"];

    Object.keys(all).forEach(function(key) {
        const obj = {name: all[key], value: eur[key]}
        map.set(key, obj);
    });

}

function createPopularCurrenciesTable() {
    const popularCurrencies = ["usd", "eur", "jpy", "gbp", "cad", "cny", "chf", "inr"];

    let table = document.getElementById("popular_currency_table");
    
    const tableHeader = "<tr><th>ISO Currency Code</th><th>Currency</th><th>Value</th></tr>";

    let tableBody = "";

    console.log(map.get("usd"));
    for(let curr of popularCurrencies) {
        // console.log(curr);
        tableBody += `<tr><td>${curr}</td><td>${map.get(curr).name}</td><td>${map.get(curr) .value}</td></tr>`;
    }

    const completeTable = tableHeader + tableBody;

    table.innerHTML = completeTable;
    
}

function toggleTable() {
    if(tableStatus == 1) {
        document.getElementById("currency_table").innerHTML = "";
        tableStatus = 0;
    } else {
        createHtmlTableFromMap();
        tableStatus = 1;
    }
}

function createHtmlTableFromMap(query = undefined) {
    
    let table = document.getElementById("currency_table");
    
    const tableHeader = "<tr><th>ISO Currency Code</th><th>Currency</th><th>Value</th></tr>";

    let tableBody = "";

    if(query == undefined) {
        map.forEach(function (value, key) {
            tableBody += `<tr><td>${key}</td><td>${value.name}</td><td>${value.value}</td></tr>`;
        })
    } else {
        map.forEach(function (value, key) {
            if(key.toLowerCase().includes(query.toLowerCase()) || value.name.toLowerCase().includes(query.toLowerCase())) {
                tableBody += `<tr><td>${key}</td><td>${value.name}</td><td>${value.value}</td></tr>`;
            }
        })
    }
    

    const completeTable = tableHeader + tableBody;

    table.innerHTML = completeTable;
}

function setCurrenciesInSelect() {
    const select_1 = document.getElementById("currency_1");
    const select_2 = document.getElementById("currency_2");

    let data = "<option value='--'>--</option>";    

    map.forEach(function (value, key) {
        data += `<option value="${key}">${key}</option>`;
    });

    select_1.innerHTML = data;
    select_2.innerHTML = data;

}

function convertCurrency() {
    const select_1 = document.getElementById("currency_1");
    const select_2 = document.getElementById("currency_2");
    const amount_1 = document.getElementById("amount_1");

    const value_1 = select_1.value;
    const value_2 = select_2.value;

    let amount_2 = document.getElementById("amount_2");

    if (areOptionsSelected(value_1, value_2)) {
        
        let ratio = map.get(value_2).value / map.get(value_1).value;
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

function search() {
    const query = document.getElementById("search").value;
    createHtmlTableFromMap(query);
}