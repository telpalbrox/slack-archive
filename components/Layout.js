import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Sidebar } from './Sidebar';
import { Search } from './Search';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export const Layout = ({ children, title, channels, selectedChannel, query }) => (
    <div className="sa-page">
        <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <title>{title ? `${title} | Slack Archives` : 'Slack Archives'}</title>
            <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
        </Head>
        <Sidebar query={query} selectedChannel={selectedChannel} channels={channels}/>
        <div className="sa-content">
            <Search query={query} />
            {children}
        </div>
    </div>
);
