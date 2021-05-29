import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import { baseTheme, darkTheme } from './themes';
import { store } from './store';
import { init as initI18n } from './i18n';
import './index.css';

initI18n();

const themePref = new URLSearchParams(window.location.search).get('theme');
const theme = themePref === 'dark' ? darkTheme : baseTheme;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
