// In App.js in a new project

import * as React from 'react';
import Main from './Main';
import '@azure/core-asynciterator-polyfill'
import { Provider } from 'react-redux';
import store from './src/store';

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>

  );
}

export default App;