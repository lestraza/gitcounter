import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App.jsx'

import { Provider } from 'mobx-react'
import MainStore from './store/MainStore'

const store = new MainStore()

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>
, document.getElementById('root'));

