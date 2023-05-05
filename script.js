let myHeaders = new Headers();
myHeaders.append("apikey", 'ruc3xqyjiPLoQPTtbPQgTQ38yfJ5ICP6');

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
const baseCurrency = document.querySelector("#base-currency");
const amountValue = document.querySelector("#amount");
const targetCurrency = document.querySelector("#target-currency");
const convertedAmount = document.querySelector("#converted-amount");

//countries
fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then(response => response.json())
  .then((data) => {
    let baseCurrencyList = document.querySelector("#base-currency");
    let targetCurrencyList = document.querySelector("#target-currency");
    for (let symbol in data.symbols) {
      let option = document.createElement("option");
      option.value = symbol;
      option.text = symbol;
      baseCurrencyList.appendChild(option);
   
      const targetOption = option.cloneNode(true);
      targetCurrencyList.appendChild(targetOption);
    }
  })
  .catch(error => console.log('error', error));

//conversion 
  [baseCurrency, amountValue, targetCurrency].forEach(input=> {
    input.addEventListener('change', () => {
      const from = baseCurrency.value;
      const to = targetCurrency.value;
      const amount = amountValue.value;
  
      fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        let result = data.result;
        convertedAmount.textContent = result.toFixed(2) + " " + targetCurrency.value;
        console.log(result);
      })
      .catch(error => console.log('error', error));
    })
  });

//historical rate exchange
const historicalButton = document.querySelector("#historical-rates");
const historicalResults = document.querySelector("#historical-rates-container");

historicalButton.addEventListener("click", () => {
  const baseCurrency = document.querySelector("#base-currency").value;
  const targetCurrency = document.querySelector("#target-currency").value;
  const date = "2023-01-01";


  fetch(`https://api.apilayer.com/exchangerates_data/${date}?symbols=${targetCurrency}&base=${baseCurrency}`, requestOptions)
  .then(response => response.json())
  .then(data => {
    const rates = data.rates;
    let rate = 0;
    for (let currency in rates) {
      if(currency === targetCurrency) {
        rate = rates[currency];
        break;
      }
    }
    historicalResults.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
  })
  .catch(error => console.log('error', error));
});
