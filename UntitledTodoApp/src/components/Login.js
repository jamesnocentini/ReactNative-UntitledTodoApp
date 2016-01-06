'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight
  } = React;

var Lists = require('./Lists');
var database = require('./../database');

var Login = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },
  _onLoginButtonPressed: function() {
    // 1 - Request configuration
    var remote = `http://${this.state.username}:${this.state.password}@localhost:4984/todos`;
    var credentials = this.state;
    var settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.username,
        password: credentials.password
      })
    };
    var that = this;
    // 2 - Check that the name/password are valid
    fetch(remote + '/_session', settings)
      .then((res) => {
        switch (res.status) {
          case 200:
            // 3 - Bootstrap application
            database.createDatabase()
              .then((res) => {
                database.replicate('myapp', remote, true);
                database.replicate(remote, 'myapp', true);

                var todoViews = {
                  lists: {
                    "map": function (doc) {
                      emit(doc.created_at, doc);
                    }.toString()
                  }
                };

                database.createDesignDocument("_design/todo", todoViews);
              }).catch((err) => {
                throw err
              });
            
            var data = {username: credentials.username};
            that.props.navigator.push({id: 2, data: data});
            break;
          case 401:
            // 4 - Wrong credentials
            alert('User not found or password incorrect');
            break;
          default:
            break;
        }
      });
  },
  render: function() {
    return (
      <View style={styles.background}>
        <View style={styles.dialog}>
          <Text style={styles.header}>
            Log In
          </Text>
          <Text style={styles.subheader}>
            UntitledTodoApp
          </Text>
          <TextInput style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
            value={this.state.username} />
          <TextInput style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
            value={this.state.password} />
          <TouchableHighlight
            style={styles.button}
            onPress={this._onLoginButtonPressed}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  background: {
    backgroundColor: '#3D414C',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  dialog: {
    width: 280,
    height: 280,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  header: {
    marginTop: 25,
    fontSize: 20,
  },
  subheader: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 44,
    width: 250,
    borderColor: '#96A6B4',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    alignSelf: 'center',
    padding: 10,
  },
  button: {
    marginTop: 15,
    backgroundColor: '#ED2226',
    width: 250,
    height: 44,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

module.exports = Login;