import React from 'react';
import { withLayout } from '../components/withLayout';
import { withMessages } from '../components/withMessages';

class ChannelPage extends React.Component {
    static getMessagesPath({ query }) {
        return `/api/channel/${query.channel}`;
    }

    static getPageTitle(props) {
        return `#${props.channel}`;
    }

    render() {
        return (
            <h1>{this.props.channel}</h1>
        );
    }
}

export default withLayout(withMessages(ChannelPage));
