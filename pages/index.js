import React from 'react';
import axios from 'axios';
import utils from '../utils';

export default class extends React.Component {
    static async getInitialProps() {
        const response = await axios.get(`${utils.getServerUrl()}/channels`);
        return {
            channels: response.data
        };
    }

    render() {
        return (
            <div>
                <h1>Hello world!</h1>
                {this.props.channels.map((channel) => <div key={channel.id}>{channel.name}</div>)}
            </div>
        );
    }
}
