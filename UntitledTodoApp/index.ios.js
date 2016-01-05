/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
} = React;

var Login = require('./src/components/Login');
var Lists = require('./src/components/Lists');

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var BaseConfig = Navigator.SceneConfigs.FloatFromRight;

var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  snapVelocity: 8,
  edgeHitWidth: SCREEN_WIDTH
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
  springTension: 100,
  springFriction: 1,
  gestures: {
    pop: CustomLeftToRightGesture
  }
});

var HelloWorld = React.createClass({
  getInitialState: function() {
    return {
      navigationBarHidden: true
    }
  },
  _renderScene: function(route, navigator) {
    if (route.id === 1) {
      return <Login navigator={navigator} />
    } else if (route.id === 2) {
      return <Lists navigator={navigator} data={route.data} />
    }
  },
  _configureScene: function(route) {
    return CustomSceneConfig
  },
  render: function() {
    return (
      <Navigator
        initialRoute={{id: 1, }}
        renderScene={this._renderScene}
        configureScene={this._configureScene}/>
    );
  }
});

var styles = StyleSheet.create({
  dialog: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  nav: {
    flex: 1,
    backgroundColor: 'red'
  },
  navWrap: {
    flex: 1,
  }
});

AppRegistry.registerComponent('UntitledTodoApp', () => HelloWorld);
