import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import utils from '../utils';
import { Layout } from '../components/Layout';
import { MessageList } from '../components/MessageList';
import '../styles/styles.scss';

export default class extends React.Component {
    static async getInitialProps({ query }) {
        const channel = query.channel;
        const [channelsResponse, messagesResponse] = await Promise.all([
            axios.get(`${utils.getServerUrl()}/api/channels`),
            axios.get(`${utils.getServerUrl()}/api/channel/${channel}`)
        ]);
        return {
            channels: channelsResponse.data,
            messages: messagesResponse.data,
            channel
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages,
            loading: false
        };
    }

    onLoadMoreMessages = async () => {
        this.setState({
            loading: true
        });
        const response = await axios.get(`${utils.getServerUrl()}/api/channel/${this.props.channel}`, {
            params: {
                ts: this.state.messages[this.state.messages.length - 1].ts
            }
        });
        this.setState({
            messages: this.state.messages.concat(response.data),
            loading: false
        });
    }

    render() {
        return (
            <Layout title={`#${this.props.channel}`} selectedChannel={this.props.channel} channels={this.props.channels}>
                <h1>{this.props.channel}</h1>
                <MessageList loadMoreMessages={this.onLoadMoreMessages} messages={this.state.messages} />
                { this.state.loading ? <span>Loading...</span> : null }
            </Layout>
        );
    }
}
