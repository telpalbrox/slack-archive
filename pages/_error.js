import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default class Error extends React.Component {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        return { statusCode };
    }

    render() {
        return (
            <div className="sa-page">
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <title>Error | Slack Archives</title>
                </Head>
                <div className="sa-content">
                    <div>
                        {this.props.statusCode
                            ? `An error ${this.props.statusCode} occurred on server`
                            : 'An error occurred on client, are you connected to the Internet?'}
                    </div>
                    <Link href={`/`}><a>Go home or </a></Link>
                    <button onClick={() => window.location.reload()}>Try again</button>
                </div>
            </div>
        );
    }
}
