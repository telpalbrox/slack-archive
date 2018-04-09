import Document, { Head, Main, NextScript } from 'next/document';
import { LinkCSS } from '../components/LinkCSS';
import { PreloadPolyfill } from '../components/PreloadPolyfill';

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="manifest" href="/static/manifest.json" />
                    <meta name="theme-color" content="#4D394B" />
                    <link rel="icon" sizes="192x192" href="/static/logo/sa192.png" />
                    <link rel="apple-touch-icon" href="/static/logo/sa192.png" />
                    <link
                        rel="preload"
                        as="font"
                        href="/static/fonts/lato-v14-latin-100.woff2"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        href="/static/fonts/lato-v14-latin-regular.woff2"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        href="/static/fonts/lato-v14-latin-900.woff2"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <LinkCSS href="/_next/static/style.css" />
                    <LinkCSS href="/static/nprogress.css" />
                    <PreloadPolyfill />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
