import React from "react";
import { Errors, StockData } from "../App";

export type SearchBarProps = {
    onChangeInput: Function
    searchResult: StockData[]
    showStockDetails: Function
    showMenu: boolean
    searchValue: string
    onSubmit: Function
    isDelay: boolean
    errors: Errors
}

export const SearchBar = ({onChangeInput, searchResult, showStockDetails, showMenu,
    searchValue, onSubmit, isDelay, errors}: SearchBarProps) => {
        
    const delayMsg = 'please try again after 1 minute.'

    return (
        <div className='body'>
            <div className='navbar'>
                <label className='label'> Stock Symbol : </label>
                <input type='search'
                    data-name='search'
                    value={searchValue}
                    placeholder='search'
                    className='input-search'
                    onChange={(e) => onChangeInput(e.target.value)}
                /> 
                <button 
                    type='submit' 
                    data-name='search-btn'
                    className='btn' 
                    onClick={() => onSubmit()}
                > Search </button>
            </div>
            <div className='main'>
                <div className='error-box'>
                    {isDelay ? <p> {delayMsg} </p> : null}
                    {Object.keys(errors).map((keyName: string, index: number) => {
                        return (
                            errors[keyName] ? <p key={index} data-name={keyName}> {errors[keyName]} </p> : null
                        )
                    })}
                </div>
                <div className='combo-box'>
                    <ul>
                        {showMenu && searchResult.length ? searchResult.map((stock, index) => {
                            return (
                                <li key={index} onClick={() => showStockDetails(stock)}>
                                     {stock.symbol} - {stock.name} 
                                </li>
                            )
                        }) : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}