import React from 'react';

export class MessageList extends React.Component {
    scrollHandler = async () => {
        const d = document.documentElement;
        const offset = d.scrollTop + window.innerHeight;
        const height = d.offsetHeight;

        if (offset >= height - 100) {
            this.props.loadMoreMessages && this.props.loadMoreMessages();
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', () => window.requestAnimationFrame(this.scrollHandler));
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
                        {message.user}: {message.text}
                    </div>
                )};
            </div>
        );
    }
}

