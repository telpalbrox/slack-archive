import React from 'react';
import Router from 'next/router';

export class Search extends React.Component {
    onSubmit = event => {
        event.preventDefault();
        const value = this.input.value;
        if (value == null || value === '') {
            return;
        }
        Router.push(`/search?query=${value}`);
    };

    render() {
        return (
            <div className="sa-search">
                <form onSubmit={this.onSubmit}>
                    <input
                        className="sa-search-input"
                        ref={input => (this.input = input)}
                        type="search"
                        placeholder="Search..."
                        defaultValue={this.props.query}
                    />
                    <button className="sa-search-button" type="submit">
                        🔎
                    </button>
                </form>
            </div>
        );
    }
}
