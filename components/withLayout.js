import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import axios from 'axios';
import utils from '../utils';
import { Layout } from './Layout';

export const withLayout = WrappedComponent => {
    class WithLayout extends React.Component {
        static async getInitialProps(context) {
            const [channelsResponse, wrappedComponentProps] = await Promise.all([
                axios.get(`${utils.getServerUrl()}/api/channels`),
                WrappedComponent.getInitialProps && WrappedComponent.getInitialProps(context)
            ]);
            return Object.assign(
                {},
                {
                    channels: channelsResponse.data,
                    channel: context.query.channel
                },
                wrappedComponentProps
            );
        }

        render() {
            return (
                <Layout
                    title={WrappedComponent.getPageTitle && WrappedComponent.getPageTitle(this.props)}
                    selectedChannel={this.props.channel}
                    channels={this.props.channels}
                >
                    <WrappedComponent {...this.props} />
                </Layout>
            );
        }
    }
    hoistNonReactStatic(WithLayout, WrappedComponent, { getInitialProps: true });
    return WithLayout;
};
