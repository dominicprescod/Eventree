import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './Reducers';
import sagas from './Sagas';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['Sidemenu']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware({});

    const store = createStore(
        persistedReducer,
        applyMiddleware(sagaMiddleware),
    );

    // Extensions
    store.runSaga = sagaMiddleware.run(sagas);
    store.injectedReducers = {}; // Reducer registry
    store.injectedSagas = {}; // Saga registry

    let persistor = persistStore(store);

    return { store, persistor }
}
