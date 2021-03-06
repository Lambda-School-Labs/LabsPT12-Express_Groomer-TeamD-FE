import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Switch,
} from 'react-router-dom';

import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import 'antd/dist/antd.less';

import { NotFoundPage } from './components/pages/NotFound';
import { ExampleListPage } from './components/pages/ExampleList';
import { LandingPage } from './components/pages/Landing';
import { ProfileListPage } from './components/pages/ProfileList';
import { LoginPage } from './components/pages/Login';
import { Search } from './components/pages/search';
import { Map, SearchableMap } from './components/pages/Maps';

import { GroomerDashBoard } from './components/GroomerDashboard/index';

import { Dashboard } from './components/userDash/index';

import { config } from './utils/oktaConfig';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store/reducers/reducers';
import RedirectToDashboard from './components/pages/Login/RedirectToDashboard';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </Router>,
  document.getElementById('root')
);

function App() {
  // The reason to declare App this way is so that we can use any helper functions we'd need for business logic, in our case auth.
  // React Router has a nifty useHistory hook we can use at this level to ensure we have security around our routes.
  const history = useHistory();

  const authHandler = () => {
    // We pass this to our <Security /> component that wraps our routes.
    // It'll automatically check if userToken is available and push back to login if not :)
    history.push('/login');
  };

  return (
    <Security {...config} onAuthRequired={authHandler}>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <SecureRoute exact path="/userDash" component={Dashboard} />
        <Route path="/login" component={LoginPage} />
        <Route path="/search" component={Search} />
        <Route exact path="/map" component={Map} />
        <Route exact path="/map-search" component={SearchableMap} />
        <SecureRoute exact path="/GroomerDash" component={GroomerDashBoard} />
        <Route path="/implicit/callback" component={LoginCallback} />
        {/* any of the routes you need secured should be registered as SecureRoutes */}
        <Route path="/dashboard" exact component={RedirectToDashboard} />
        <SecureRoute path="/example-list" component={ExampleListPage} />

        <SecureRoute path="/profile-list" component={ProfileListPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Security>
  );
}
