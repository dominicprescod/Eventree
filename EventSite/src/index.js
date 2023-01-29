import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './Redux/Store';
import { setStore } from './Api/base';
import { SnackbarProvider } from 'notistack';
import { Button } from '@material-ui/core';

const initialState = {};
const { store, persistor } = configureStore(initialState);

setStore(store);

const notistackRef = React.createRef();
const onClickDismiss = key => () => { 
	notistackRef.current.closeSnackbar(key);
}

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} ref={notistackRef} action={(key) => (<Button onClick={onClickDismiss(key)}>Dismiss</Button>)}>
				<App />
			</SnackbarProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
