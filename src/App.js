import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import React from 'react';
import Login from './pages/Login';
import NewContatto from './pages/NewContatto'
import { Provider } from 'react-redux'; 
import store from './redux/store'; 

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="Home" element={<Home />} />
            <Route path="AddContatto" element={<NewContatto />} />
          </Routes>
        </div>
      </Router>
    </Provider> 
  );
};

export default App;
