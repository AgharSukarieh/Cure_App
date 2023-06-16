import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/contexts/AuthContext';

const AppWithAuthProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

AppRegistry.registerComponent(appName, () => AppWithAuthProvider);

// AppRegistry.registerComponent(appName, () => App);
