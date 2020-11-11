import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { SearchBar } from './components/SearchBar';

export interface StockData {
  symbol: string,
  name: string,
  type: string,
  region: string,
  marketClose: string,
  marketOpen: string,
  matchScore: string,
  timezone: string,
  currency: string,
  [key: string]: string
}

export interface Errors {
  invalidCharacters: string,
  maxLength: string,
  required: string
  [key: string]: string
}

function App() {

  const [searchValue, setSearchValue] = useState('');
  const [stock, setStock] = useState({} as StockData);
  const [searchResult, setSearchResult] = useState([] as StockData[]);
  const [displayStock, setDisplayStock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDelay, setIsDelay] = useState(false);
  const [errors, setErrors] = useState({} as Errors);

  const url = (value: string) => {
    console.log('val', value)
    return `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=MXEY6PLHRSVHUH74`;
  }

  const getStockData = useCallback((searchValue) => {
    fetch(url(searchValue))
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        if (data.Note) {
          setIsDelay(true)
          setShowMenu(false)
        }
        if (data && data.bestMatches && data.bestMatches.length) {
          setIsDelay(false)
          let result = data.bestMatches.map((item: StockData) => {
            let newItem: StockData = {
              symbol: '',
              name: '',
              type: '',
              region: '',
              marketClose: '',
              marketOpen: '',
              matchScore: '',
              timezone: '',
              currency: ''
            }
            let key, newKey: string
            for (key in item) {
              newKey = key.substring(3, key.length)
              newItem[newKey] = item[key];
            }
            return newItem;
          })
          console.log('result', result)
          setSearchResult(result);
        }
      }).catch((error) => {
        console.log(error)
      }
      )
  }, []);

  useEffect(() => {
    if (searchValue) {
      setShowMenu(true)
      setDisplayStock(false)
      setIsDelay(false)
      getStockData(searchValue)
    } else {
      setShowMenu(false)
    }
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const isValid = (value: string, onSubmit: boolean = false): boolean => {
    console.log(value)
    let pattern: RegExp = /[^a-zA-Z0-9]/g
    let errors: Errors = { invalidCharacters: '', maxLength: '', required: ''}
    errors.required = !value && onSubmit? 'please enter the stock symbol'  : ''
    errors.invalidCharacters = pattern.test(value) ? 'Invalid value, Please enter valid value.' : ''
    errors.maxLength = value.length > 10 ? 'Enter maximum 10 characters.' : ''
    setErrors(errors)
    return !errors.invalidCharacters && !errors.maxLength && !errors.required? true : false
  }

  const onChangeInput = (value: string) => {
    if (isValid(value)) {
      setSearchValue(value)
      setErrors({} as Errors)
    } else {
      setShowMenu(false)
      setDisplayStock(false)
    }
  }

  const showStockDetails = (stock: StockData) => {
    setStock(stock)
    setDisplayStock(true)
    setShowMenu(false)
    setIsDelay(false)
  }

  const onSearchStock = () => {
    if (isValid(searchValue, true)) {
      setErrors({} as Errors)
      getStockData(searchValue)
      setStock(searchResult[0])
      setDisplayStock(true)
      setShowMenu(false)
      setIsDelay(false)
    } else {
      setShowMenu(false)
      setDisplayStock(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Information</h1>
        <SearchBar
          onChangeInput={(value: string) => onChangeInput(value)}
          searchResult={searchResult}
          showStockDetails={(stock: StockData) => showStockDetails(stock)}
          searchValue={searchValue}
          onSubmit={(value: string) => onSearchStock()}
          showMenu={showMenu}
          isDelay={isDelay}
          errors={errors}
        />
      </header>
      <div className='data-box'>
        {displayStock ?
          <>
            <h2> {stock.symbol} - {stock.name}</h2>

            {Object.keys(stock)
              .filter((key) => (key !== 'symbol' && key !== 'name'))
              .map((keyName: string, index: number) => {
                return (
                  <div className='box' key={index}>
                    <label> {keyName} : </label> {stock[keyName]}
                  </div>
                )
              })
            }
          </> : null}
      </div>
      <footer className='footer'>
        <div>Note: </div>
        <div>Special characters are not allow.</div>
        <div>More then 10 characters are not allow.</div>
      </footer>
    </div>
  );
}

export default App;
