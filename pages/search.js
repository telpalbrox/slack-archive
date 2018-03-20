import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import utils from '../utils';
import { Layout } from '../components/Layout';
import '../styles/styles.scss';

export default class extends React.Component {
    static async getInitialProps({ query }) {
        const searchQuery = query.query;
        const [channelsResponse, searchResponse] = await Promise.all([
            axios.get(`${utils.getServerUrl()}/api/channels`),
            axios.get(`${utils.getServerUrl()}/api/search?query=${searchQuery}`)
        ]);
        return {
            channels: channelsResponse.data,
            messages: searchResponse.data,
            query: searchQuery
        };
    }

    render() {
        return (
            <Layout title={`Search "${this.props.query}"`} query={this.props.query} channels={this.props.channels}>
                <h1>Search "{this.props.query}"</h1>
                <ul>
                    {this.props.messages.map((message) =>
                        <li className="sa-message" key={message.ts}>
                            <Link href={`/channel?channel=${message.channel}#${message.ts}`} as={`/channel/${message.channel}#${message.ts}`}><a>#{message.channel}</a></Link> {message.user}: {message.text}
                        </li>
                    )}
                </ul>
            </Layout>
        );
    }
}
