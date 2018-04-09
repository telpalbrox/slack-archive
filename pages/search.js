import React from 'react';
import { withLayout } from '../components/withLayout';
import { MessageLink } from '../components/MessageLink';
import { withMessages } from '../components/withMessages';

class SearchPage extends React.Component {
    static getMessagesPath({ query }) {
        return `/api/search?query=${query.query}`;
    }

    static async getInitialProps({ query }) {
        return {
            query: query.query
        };
    }

    static showChannelLink = true;

    static getPageTitle(props) {
        return `Search "${props.query}"`;
    }

    render() {
        return <h1>Search "{this.props.query}"</h1>;
    }
}

export default withLayout(withMessages(SearchPage));
