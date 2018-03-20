import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import utils from '../utils';
import { Layout } from '../components/Layout';
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

    render() {
        return (
            <Layout title={`#${this.props.channel}`} selectedChannel={this.props.channel} channels={this.props.channels}>
                <h1>{this.props.channel}</h1>
                <ul>
                    {this.props.messages.map((message) => <li className="sa-message" id={message.ts} key={message.ts}>{message.user}: {message.text}</li>)}
                </ul>
            </Layout>
        );
    }
}
