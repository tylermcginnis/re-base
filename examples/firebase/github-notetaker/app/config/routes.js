import React from 'react';
import Main from '../components/Main';
import Home from '../components/Home';
import Profile from '../components/Profile';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default (
  <Router>
    <Main>
      <Route exact path="/" component={Home} />
      <Route exact path="/profile/:username" component={Profile} />
    </Main>
  </Router>
);
