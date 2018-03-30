import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import axios from 'axios';
import utils from '../utils';
import { MessageList } from './MessageList';

export const withMessages = (WrappedComponent) => {
    class WithMesssages extends React.Component {
        static getDerivedStateFromProps(props, prevState) {
            if (prevState && props.channel !== prevState.channel) {
                return {
                    messages: props.messages,
                    channel: props.channel,
                    finished: false,
                    loading: false
                };
            }
            return null;
        }

        static async getInitialProps(context) {
            const messagesPath = WrappedComponent.getMessagesPath(context);
            const [messagesResponse, wrappedComponentProps] = await Promise.all([
                axios.get(`${utils.getServerUrl()}${messagesPath}`),
                WrappedComponent.getInitialProps && WrappedComponent.getInitialProps(context)
            ]);
            return Object.assign({}, {
                messages: messagesResponse.data,
                messagesPath
            }, wrappedComponentProps);
        }

        constructor(props) {
            super(props);
            this.state = {
                loading: false,
                finished: false,
                messages: props.messages,
                channel: props.channel
            };
        }

        onLoadMoreMessages = async () => {
            if (this.state.finished || this.state.loading) {
                return;
            }
            this.setState({
                loading: true
            });
            const response = await axios.get(`${utils.getServerUrl()}${this.props.messagesPath}`, {
                params: {
                    ts: this.state.messages[this.state.messages.length - 1].ts
                }
            });
            if (response.data.length === 0) {
                this.setState({
                    finished: true,
                    loading: false
                });
                return;
            }
            const messages = this.state.messages.concat(response.data);
            this.setState({
                messages,
                loading: false
            });
        }

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props} />
                    <MessageList showChannelLink={WrappedComponent.showChannelLink} loadMoreMessages={this.onLoadMoreMessages} messages={this.state.messages} />
                    {this.state.loading ? <span>Loading...</span> : null}
                </React.Fragment>
            );
        }
    }
    hoistNonReactStatic(WithMesssages, WrappedComponent, { getInitialProps: true });
    return WithMesssages;
};
