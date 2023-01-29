import React from 'react';
import './Footer.scss';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';

class Footer extends React.Component {
    render() {
        const pathName = this.props.location.pathname;
        return (
            <div className="footer-component" style={{display: pathName.indexOf('/admin') > -1 ? 'none' : 'initial' }}>
                <Container maxWidth="lg" className="custom-container v-c h-c v-r">
                    <div className="footer-links v-c">
                        <NavLink to="/terms">Terms and Conditions</NavLink>
                        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
                        <NavLink to="/faqs">FAQ's</NavLink>
                        <NavLink to="/about">AboutUs</NavLink>
                    </div>
                    <p>© {new Date().getFullYear()} EventTree. All rights reserved.</p>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(Footer));