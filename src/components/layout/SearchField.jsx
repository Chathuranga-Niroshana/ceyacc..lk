import { Input } from 'antd';
import React from 'react'

const searchStyle = {
    width: '100%',
};

// Dynamic button style based on dark mode
const searchButtonStyle = {
    backgroundColor: '#90093A',
    borderColor: '#90093A',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px'
};
const SearchField = ({ onSearch = () => null }) => {
    const { Search } = Input;

    return (
        <Search
            placeholder="Search..."
            onSearch={onSearch}
            enterButton
            size="large"
            style={searchStyle}
            className="custom-search-input"
            buttonStyle={searchButtonStyle}
        />
    )
}

export default SearchField