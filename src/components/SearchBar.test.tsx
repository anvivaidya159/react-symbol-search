
import { render } from "@testing-library/react";
import React from "react";
import { SearchBar, SearchBarProps } from "./SearchBar";

describe('SearchBar', () => {
    it('search input should be available', () => {

       let searchComponent = render(
            <SearchBar
            onChangeInput= {jest.fn()}
            searchResult= {[]}
            showStockDetails= {jest.fn()}
            showMenu= {false}
            searchValue= {'BA'}
            onSubmit= {jest.fn()}
            isDelay= {false}
            errors= {{
                invalidCharacters: '',
                maxLength: '',
                required: ''
            }}
            ></SearchBar>) 
        
        expect(searchComponent.container.querySelector(`[data-name="search"]`)).not.toBeNull();
        expect(searchComponent.container.querySelector(`[data-name="search-btn"]`)).not.toBeNull();
    });

    it('should show errors if there is any error available', () => {
        let showStockDetailsSpy = jest.fn()

       let searchComponent = render(
            <SearchBar
            onChangeInput= {jest.fn()}
            searchResult= {[]}
            showStockDetails= {showStockDetailsSpy}
            showMenu= {false}
            searchValue= {'&'}
            onSubmit= {jest.fn()}
            isDelay= {false}
            errors= {{
                invalidCharacters: 'Invalid value, Please enter valid value.',
                maxLength:'',
                required: ''
            }}
            ></SearchBar>) 

        expect(searchComponent.container.querySelector(`[data-name="invalidCharacters"]`)).not.toBeNull()
        expect(searchComponent.container.querySelector(`[data-name="maxLength"]`)).toBeNull()
    });

    it('on click of search button onSubmit should have been called', () => {
        let submitSpy = jest.fn()

       let searchComponent = render(
            <SearchBar
            onChangeInput= {jest.fn()}
            searchResult= {[]}
            showStockDetails= {jest.fn()}
            showMenu= {false}
            searchValue= {'BA'}
            onSubmit= {submitSpy}
            isDelay= {false}
            errors= {{
                invalidCharacters: '',
                maxLength:'',
                required: ''
            }}
            ></SearchBar>) 
        const searchButton = searchComponent.container.querySelector(`[data-name="search-btn"]`) as HTMLButtonElement
        searchButton.click();
        expect(submitSpy).toHaveBeenCalled();
    });
})


