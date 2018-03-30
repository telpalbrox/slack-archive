import Link from 'next/link';

export const MessageLink = ({ message }) =>
    <Link
        href={`/channel?channel=${message.channel}#${message.ts}`}
        as={`/channel/${message.channel}#${message.ts}`}>
        <a>#{message.channel}</a>
    </Link>;
