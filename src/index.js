import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter } from 'react-router-dom';
import './assets/fonts/font.css';
import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/css/animation.css';
import './assets/css/result_style.css';
// import './assets/js/jQuery/jquery-3.6.3.min.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);

