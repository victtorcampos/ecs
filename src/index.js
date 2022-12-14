import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import MergeSpedXml from './components/MergeSpedXml';
import paymentDetail from './components/dados/paymentDetail';
import cities from './components/dados/cities';

const container = document.getElementById('root');
const root = createRoot(container);
const counterSlice = createSlice({
  name: 'dados', initialState: { acumulador: null, empresa: null, payment: paymentDetail(), cidades: cities() }, reducers: {
    addCidade: (state, action) => { state.cidades = [...state.cidades, action.payload] }
    , addAcumulador: (state, action) => {
      state.acumulador = null;
      state.acumulador = action.payload
    }
  }
});
export const { addCidade, addAcumulador } = counterSlice.actions;
export const store = configureStore({ reducer: { dados: counterSlice.reducer }, middleware: [logger] });

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/ecs/" element={<App />}>
            <Route path='/ecs/mergespedxml' element={<MergeSpedXml />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

function logger({ getState }) {
  return next => action => {
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', getState())
    return returnValue
  }
}