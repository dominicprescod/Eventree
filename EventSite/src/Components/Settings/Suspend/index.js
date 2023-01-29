import React from 'react';
import './Suspend.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

class SuspendComponent extends React.Component {
	save = () => {
	}

    render() {
        return (
            <div className="suspend-component v-r">
				<form autoComplete="off" noValidate className="v-r">
					<p className="form-title">Certain user content will not exist anymore.</p>
					<Button className="btn-primary save-btn btn-round" variant="contained" onClick={this.save}>Close Account</Button>
				</form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(SuspendComponent));