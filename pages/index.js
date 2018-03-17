import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import utils from '../utils';
import { Layout } from '../components/Layout';
import '../styles/styles.scss';

export default class extends React.Component {
    static async getInitialProps() {
        const response = await axios.get(`${utils.getServerUrl()}/api/channels`);
        return {
            channels: response.data
        };
    }

    render() {
        return (
            <Layout channels={this.props.channels}>
                <h1>Select a channel</h1>
            </Layout>
        );
    }
}
