import Link from 'next/link';
import classnames from 'classnames';

export const Sidebar = ({ channels, selectedChannel }) => {
    return (
        <aside className="sa-sidebar">
            <div className="sa-sidebar-container">
                <h2 className="sa-sidebar-heading"><Link href={`/`}><a>Channels</a></Link></h2>
                <ul>
                    {channels.map((channel) =>
                        <li className={classnames('sa-sidebar-channel', { 'sa-sidebar-channel-selected': channel.name === selectedChannel })}
                            key={channel.id}>
                            <Link href={`/channel?channel=${channel.name}`} as={`/channel/${channel.name}`}>
                                <a>#{channel.name}</a>
                            </Link>
                        </li>)
                    }
                </ul>
            </div>
        </aside>
    );
};
