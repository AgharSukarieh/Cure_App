import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/contexts/AuthContext';
import {Provider} from 'react-redux';
import {store} from './src/store';

const AppWithAuthProvider = () => (
  <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
  </AuthProvider>
);

AppRegistry.registerComponent(appName, () => AppWithAuthProvider);

// AppRegistry.registerComponent(appName, () => App);
