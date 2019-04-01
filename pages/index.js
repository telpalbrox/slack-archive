import React from 'react';
import { withLayout } from '../components/withLayout';

class HomePage extends React.Component {
    render() {
        return <h1>Select a channel</h1>;
    }
}

export default withLayout(HomePage);
