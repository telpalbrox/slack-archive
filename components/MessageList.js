import { List, WindowScroller } from 'react-virtualized';

export const MessageList = (props) => {
    const rowRenderer = ({
        key,
        index,
        style
    }) => {
        const message = props.messages[index];
        return (
            <div key={key}
                style={style}
                className="sa-message"
                id={message.ts}
            >
                {message.user}: {message.text}
            </div>
        );
    };
    return <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
                autoHeight={true}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={props.messages.length}
                rowHeight={40}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
                width={500}
            />
        )}
    </WindowScroller>;
};
