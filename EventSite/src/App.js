import React, { useEffect } from 'react';
import './App.scss';
import { 
  HomePage, SigninPage, SignupPage, ForgotPasswordPage, SearchPage, EventDetailPage, FAQsPage, CommunityPage, CommunityDetailPage, CreateCommunityPage, AdminPage, ActivatePage, ResetPasswordPage, EventCreatePage, AboutUsPage, PrivacyPolicyPage, TermsPage
} from './Pages';
import { BrowserRouter, Switch, Route, useLocation, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { Header, Footer, SideMenu } from './Components';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { updateToken } from './Redux/Actions';

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#262C34'
		},
		secondary: {
			main: '#FFFFFF'
		}
  }
});

function ScrollToTop() {
	const { pathname } = useLocation();
  
	useEffect(() => {
	  	window.scrollTo(0, 0);
	}, [pathname]);
  
	return null;
}

class App extends React.Component {
  state = {
		isBlur: false,
		isLoggedin: false,
    me: null,
  }

  static getDerivedStateFromProps(props, state) {
    return {
			isBlur: props.isSidemenuOpen,
			isLoggedin: props.isLoggedin,
      me: props.me,
    }
	}
	
	componentDidMount() {
    const { isLoggedin, me } = this.state;
    if (isLoggedin && me) {
      this.props.updateToken();
    }
  }

  render() {
		const { isLoggedin, me } = this.props;
    const { isBlur } = this.state;

    if (isBlur) {
      if (document.body) {
        const body = document.body
        body.classList.add('modal-open');
      }
    } else {
      if (document.body) {
        const body = document.body
        body.classList.remove('modal-open');
      }
		}

    return (
      <BrowserRouter>
	  	<ScrollToTop />
        <ThemeProvider theme={MuiTheme}>
          <div className="App">
            <SideMenu />
            <div id="main" className={`${isBlur? 'blur': ''}`}>
              <Header />
              <div className="content">
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route exact path="/sign-in" component={SigninPage} />
                  <Route exact path="/sign-up" component={SignupPage} />
                  <Route exact path="/forgot-password" render={() => (!isLoggedin || !me) ? <ForgotPasswordPage /> : <Redirect to="/" />} />
									<Route exact path="/resetpassword" render={() => (!isLoggedin || !me) ? <ResetPasswordPage /> : <Redirect to="/" />} />
                  <Route exact path="/search" component={SearchPage} />
                  <Route exact path="/event/:id" component={EventDetailPage} />
                  <Route exact path="/faqs" component={FAQsPage} />
                  <Route exact path="/terms" component={TermsPage} />
                  <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
                  <Route exact path="/about" component={AboutUsPage} />
                  <Route exact path="/community" component={CommunityPage} />
                  <Route exact path="/community/:id" component={CommunityDetailPage} />
                  <Route exact path="/create-community" component={CreateCommunityPage} />
									<Route exact path="/activate" component={ActivatePage} />
									<Route exact path="/create-event" component={EventCreatePage} />
                  <Route path="/admin" component={AdminPage} />
                </Switch>
              </div>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
		isSidemenuOpen: state.Sidemenu.isOpen,
		isLoggedin: state.Auth.loggedin,
    me: state.Auth.me,
  }
}

export default connect(mapStateToProps, { updateToken })(App);
