import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import MainPage from './MainPage';
import List from './List';
import Record from './Record';

const Root = () => {
    return (
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/main" component={MainPage} />
            <Route path="/list" component={List} />
            <Route path="/record" component={Record} />
        </Switch>
        </BrowserRouter>
    );
};

export default Root;