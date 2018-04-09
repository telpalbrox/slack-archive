import React from 'react';
import { withLayout } from '../components/withLayout';
import '../styles/styles.scss';

class HomePage extends React.Component {
    render() {
        return <h1>Select a channel</h1>;
    }
}

export default withLayout(HomePage);
