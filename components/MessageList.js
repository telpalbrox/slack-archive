import React from 'react';
import { MessageLink } from './MessageLink';

export class MessageList extends React.Component {
    scrollHandler = async () => {
        window.requestAnimationFrame(() => {
            const d = document.documentElement;
            const offset = d.scrollTop + window.innerHeight;
            const height = d.offsetHeight;
    
            if (offset >= height - 100) {
                this.props.loadMoreMessages && this.props.loadMoreMessages();
            }
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollHandler);
    }

    componentWillUnmount() {
        console.log('unmount');
        window.removeEventListener('scroll', this.scrollHandler);
    }

    render() {
        return (
            <div>
                {this.props.messages.map((message) =>
                    <div
                        key={message.ts}
                        className="sa-message"
                        id={message.ts}
                    >
                        {this.props.showChannelLink ? <MessageLink message={message}/> : null} {message.user}: {message.text}
                    </div>
                )};
            </div>
        );
    }
}

