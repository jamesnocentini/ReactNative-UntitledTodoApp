'use strict';

var React = require('react-native');
var {
  View,
  Text,
  AlertIOS,
  ListView,
  StyleSheet,
  } = React;

var NavigationBar = require('react-native-navbar');
var database = require('./../database');

var Lists = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },
  _redrawListView: function() {
    // 1
    database.queryView('_design/todo', 'lists')
      .then((res) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.rows)
        });
      });
  },
  componentWillMount: function() {
    // 2
    var that = this;
    that._redrawListView();
    this.interval = setInterval(function () {
      that._redrawListView();
    }, 100);
  },
  // 3
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  _capitalizeFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  render: function () {

    var leftButtonConfig = {
      title: 'Log Out',
      tintColor: 'white',
      handler: () => {
        database.deleteDatabase()
          .then((res) => {
            if (res.ok) {
              this.props.navigator.pop();
            }
          });
      }
    };
    
    var that = this;
    var rightButtonConfig = {
      title: 'New',
      tintColor: 'white',
      handler: () => {
        AlertIOS.alert(
          'New List Title',
          null,
          [
            {
              text: 'Save',
              onPress: (text) => {
                database.createDocument({
                  type: 'list',
                  title: text,
                  owner: that.props.data.username,
                  created_at: new Date().getTime()
                });
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ],
          'plain-text'
        );
      }
    };
    
    var titleConfig = {
      title: this._capitalizeFirstLetter(that.props.data.username),
      tintColor: 'white',
    };
    
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
          tintColor="#ED2226"></NavigationBar>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderList} />
      </View>
    );
  },
  renderList: function(list) {
    var list = list.value;
    return (
      <View style={styles.listCell}>
        <Text style={styles.title}>{list.title}</Text>
        <Text style={styles.owner}>{list.owner}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    marginTop: 0
  },
  listCell: {
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
  owner: {
    
  }
});

module.exports = Lists;