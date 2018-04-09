import Link from 'next/link';

export const MessageLink = ({ message }) => (
    <Link
        href={`/channel?channel=${message.channel}&ts=${message.ts}`}
        as={`/channel/${message.channel}?ts=${message.ts}`}
    >
        <a>#{message.channel}</a>
    </Link>
);
