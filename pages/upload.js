import React from 'react';
import axios from 'axios';

export default class Upload extends React.Component {
    state = {
        isLoading: false,
        error: false,
        isFinished: false
    };

    onSubmit = async event => {
        event.preventDefault();
        if (!this.fileInput.files || !this.fileInput.files[0]) {
            return;
        }
        const formData = new FormData();
        formData.append('archive', this.fileInput.files[0]);
        this.setState({ isLoading: true, error: false, isFinished: false });
        try {
            await axios.post('/api/upload', formData);
            this.setState({ error: false, isFinished: true, isLoading: false });
        } catch (err) {
            console.error(err);
            this.setState({ error: true, isFinished: false, isLoading: false });
        }
    };

    render() {
        return (
            <div>
                <h1>Upload</h1>
                <p>Upload your slack archive zip file</p>
                <form onSubmit={this.onSubmit}>
                    <input ref={input => (this.fileInput = input)} type="file" accept=".zip" />
                    <button type="submit">Upload</button>
                </form>
                {this.state.isLoading ? <p>Loading...</p> : null}
                {this.state.error ? <p>Error uploading the file</p> : null}
                {this.state.isFinished ? <p>Upload completed!</p> : null}
            </div>
        );
    }
}
