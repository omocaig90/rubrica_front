import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import React from 'react';
import Login from './pages/Login';
import NewContatto from './pages/NewContatto'
import { Provider } from 'react-redux'; // Aggiunto
import store from './redux/store'; // Aggiunto

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="Home" element={<Home />} />
            <Route path="AddContatto" element={<NewContatto />} />
            {/* <Route path="Imbarca" element={<FormImbarca />} />
            <Route path="Sbarca" element={<FormSbarca />} /> */}
          </Routes>
        </div>
      </Router>
    </Provider> // Aggiunto
  );
};

export default App;
