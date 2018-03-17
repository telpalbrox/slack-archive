import React from 'react';
import Head from 'next/head';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, title = 'Slack Archives', channels, selectedChannel }) => (
    <div className="sa-page">
        <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <title>{title}</title>
        </Head>
        <Sidebar selectedChannel={selectedChannel} channels={channels}/>
        <div className="sa-content">
            {children}
        </div>
    </div>
);
