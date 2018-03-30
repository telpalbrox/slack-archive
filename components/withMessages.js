import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import axios from 'axios';
import utils from '../utils';
import { MessageList } from './MessageList';

export const withMessages = (WrappedComponent) => {
    class WithMesssages extends React.Component {
        static getDerivedStateFromProps(props, prevState) {
            if (prevState && props.messages !== prevState.messages) {
                return {
                    messages: props.messages,
                    channel: props.channel,
                    finishedBottom: false,
                    loadingBottom: false,
                    finishedTop: false,
                    loadingTop: false
                };
            }
            return null;
        }

        static async getInitialProps(context) {
            const messagesPath = WrappedComponent.getMessagesPath(context);
            const [messagesResponse, wrappedComponentProps] = await Promise.all([
                axios.get(`${utils.getServerUrl()}${messagesPath}`, {
                    params: {
                        ts: context.query.ts,
                        includeMessage: !!context.query.ts
                    }
                }),
                WrappedComponent.getInitialProps && WrappedComponent.getInitialProps(context)
            ]);
            return Object.assign({}, {
                messages: messagesResponse.data,
                messagesPath,
                ts: context.query.ts
            }, wrappedComponentProps);
        }

        constructor(props) {
            super(props);
            this.state = {
                loadingBottom: false,
                finishedBottom: false,
                loadingTop: false,
                finishedTop: false,
                messages: props.messages,
                channel: props.channel
            };
        }

        onLoadMoreMessages = async (position) => {
            if (this.state[`finished${position}`] || this.state[`loading${position}`]) {
                return;
            }
            this.setState({
                [`loading${position}`]: true
            });
            const response = await axios.get(`${utils.getServerUrl()}${this.props.messagesPath}`, {
                params: {
                    ts: position === 'Top' ? this.state.messages[0].ts : this.state.messages[this.state.messages.length - 1].ts,
                    reverse: position === 'Top'
                }
            });
            this.setState({
                messages: position === 'Top' ? [...response.data, ...this.state.messages] : [...this.state.messages, ...response.data],
                [`loading${position}`]: false,
                [`finished${position}`]: response.data.length < 100,
            });
        }

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props} />
                    {this.props.ts && !this.state.loadingTop && !this.state.finishedTop ? <button onClick={() => this.onLoadMoreMessages('Top')}>Load more messages</button> : null}
                    {this.state.loadingTop ? <span>loading...</span> : null}
                    <MessageList
                        showChannelLink={WrappedComponent.showChannelLink}
                        loadMoreMessagesBottom={() => this.onLoadMoreMessages('Bottom')} messages={this.state.messages}
                        selectedMessage={this.props.ts}
                    />
                    {this.state.loadingBottom ? <span>loading...</span> : null}
                </React.Fragment>
            );
        }
    }
    hoistNonReactStatic(WithMesssages, WrappedComponent, { getInitialProps: true });
    return WithMesssages;
};
