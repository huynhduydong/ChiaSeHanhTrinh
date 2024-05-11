/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './navigation/App';
import {name as appName} from './app.json';
import Home from './components/Home/Home';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => Home);