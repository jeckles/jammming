import cssDeclarationSorter from 'css-declaration-sorter'
import React from 'react'
import './SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = { term: undefined }

        this.search = this.search.bind(this)
        this.handleTermChange = this.handleTermChange.bind(this)
    }

    handleTermChange(e) {
        var searchTerm = e.target.value

        this.setState({ term: searchTerm })
    }

    search() {
        this.props.onSearch(this.state.term)
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter a Song, Album, or Artist" onChange={this.handleTermChange}/>
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}