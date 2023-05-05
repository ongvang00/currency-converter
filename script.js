var myHeaders = new Headers();
myHeaders.append("apikey", "XLVdCfh0Is6qZXpOFd7QAs4KXVZlxZoR");

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};


const baseCurrency = document.getElementById('base-currency');
const targetCurrency = document.getElementById('target-currency');
const amount = document.getElementById('amount');
const convertedAmount = document.getElementById('converted-amount');

async function getCurrencies() {
  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
    const json = await response.json()
    const currencies = Object.keys(json.symbols)
    console.log(json)
    for (const index in currencies) {
        const option = document.createElement('option');
        option.value = currencies[index];
        option.text = `${currencies[index]}`;
        baseCurrency.add(option.cloneNode(true));
        targetCurrency.add(option);
    }
  } catch (error) {
    console.error('Error fetching currencies:', error);
  }
}

console.log(getCurrencies());



async function performConversion() {
  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${baseCurrency.value}&to=${targetCurrency.value}&amount=${amount.value}&apikey=3mgP2F598I0n9pUpJqzrsMtJ3Tsh3Sty`);
    const data = await response.json();
    const result = data.result;
    convertedAmount.textContent = result.toFixed(2);
  } catch (error) {
    console.error('Error performing conversion:', error);
    convertedAmount.textContent = 'Error performing conversion';
  }
}

baseCurrency.addEventListener('change', performConversion);
targetCurrency.addEventListener('change', performConversion);
amount.addEventListener('input', performConversion);


const historicalRates = document.getElementById('historical-rates');
const historicalRatesContainer = document.getElementById('historical-rates-container');
const saveFavorite = document.getElementById('save-favorite');
const favoriteCurrencyPairs = document.getElementById('favorite-currency-pairs');


async function fetchHistoricalRates() {
  const from = baseCurrency.value;
  const to = targetCurrency.value;
  const date = '2023-03-11';

  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/${date}?base=${from}&symbols=${to}&apikey=3mgP2F598I0n9pUpJqzrsMtJ3Tsh3Sty`);
    const data = await response.json();
    const rate = data.rates[to]
    historicalRatesContainer.innerHTML = `Historical exchange rate on ${date}: 1 ${from} = ${rate.toFixed(2)} ${to}`;
    

  } catch (error) {
    console.error('Error with historical rates:', error);
  }
}

function displayFavorites() {
    if (localStorage.getItem('favoritePairs')) {
        const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs'));
        favoriteCurrencyPairs.innerHTML = '';
        favoritePairs.forEach(pair => {
            const pairElement = document.createElement('button');
            pairElement.style.display = 'inline-block'
            pairElement.className = 'favorite-pair';
            pairElement.textContent = pair;
            pairElement.addEventListener('click', () => {
                const [from, to] = pair.split('-');
                baseCurrency.value = from;
                targetCurrency.value = to;
                performConversion();
            });
            favoriteCurrencyPairs.appendChild(pairElement);
        });
    }
}

historicalRates.addEventListener('click', fetchHistoricalRates);
function saveFavorites() {
    const pair = `${baseCurrency.value}-${targetCurrency.value}`;

    if (!localStorage.getItem('favoritePairs')) {
        localStorage.setItem('favoritePairs', JSON.stringify([]));
    }

    const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs'));

    if (baseCurrency.value !== "" && targetCurrency.value !== "" && !favoritePairs.includes(pair)) {
        favoritePairs.push(pair);
        localStorage.setItem('favoritePairs', JSON.stringify(favoritePairs));
        displayFavorites();
    }
}
    
console.log(displayFavorites());

saveFavorite.addEventListener('click', saveFavorites);
