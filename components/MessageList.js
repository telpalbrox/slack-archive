import React from 'react';
import classnames from 'classnames';
import { MessageLink } from './MessageLink';

export class MessageList extends React.Component {
    scrollHandler = async () => {
        window.requestAnimationFrame(() => {
            const d = document.scrollingElement;
            const offset = d.scrollTop + window.innerHeight;
            const height = d.offsetHeight;

            if (offset >= height - 100) {
                this.props.loadMoreMessagesBottom && this.props.loadMoreMessagesBottom();
            }
        });
    };

    componentDidMount() {
        window.addEventListener('scroll', this.scrollHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
    }

    render() {
        return (
            <div>
                {this.props.messages.map(message => (
                    <div
                        key={message.ts}
                        className={classnames('sa-message', {
                            'sa-message-selected': message.ts === this.props.selectedMessage
                        })}
                        id={message.ts}
                    >
                        {this.props.showChannelLink ? <MessageLink message={message} /> : null} {message.user}:{' '}
                        {message.text}
                    </div>
                ))}
            </div>
        );
    }
}
