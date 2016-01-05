# Introducing the React Native Couchbase Lite Module

Last year, I published a series of articles on the topic of using Couchbase Lite in a React Native application. In this tutorial, we’ll take it one step further and use the recommended Couchbase Lite Module for React Native (the source code can be found in this [GitHub repo](https://github.com/fraserxu/react-native-couchbase-lite) and the latest release is available as an [npm module](https://www.npmjs.com/package/react-native-couchbase-lite)). You will learn the following core concepts:

- Adding the 
- Persisting user credentials in Local Documents

## Getting Started

To save some time, I’ve already put together a starter project which contains all the UI code and can be found here. Go ahead and download it to your preferred directory and unzip the content. First you will install the dependencies:

	code

If it’s already the case, also make sure to have the React Native CLI globally installed:

	code

Next, start the React Native daemon:

	code

Open the Xcode project at `ios/ToDoApp.xcodeproj` and run it in the simulator or device from Xcode. You should see the following:

	gif

Don’t forget to enable LiveReload using the `Cmd+D` shortcut:

	gif

## Local Persistence with Couchbase Lite

The starter project already contains the React Native Couchbase Lite Module (you can follow the [repo instructions](https://github.com/fraserxu/react-native-couchbase-lite) to use it in another React Native project). In this section, you will learn how to instantiate a new manager, database and persist documents locally.

Create a new file in `src/database.js` and paste the following:

	code

With the code above, you are:

1. Importing the `manager` and `ReactCBLite` objects from the module using the [de-structuring assignment syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) in ES6.
2. Starting the Couchbase Lite Listener which serves an HTTP REST API that you will work with later.
3. Instantiate a manager instance passing the URL of the embedded server and the desired database name. 
4. Exporting the object so it can be used throughout the application life-cycle.

Now you can turn your focus to `components/Login.js`. Add a require statement to use the database object from the previous step:

	code

This component has two input fields and a button, you’re going to add some code to check that the user is indeed registered before opening the List View. Replace the body of `_onLoginButtonPressed` with the following:

	code

You’re creating the database and then registering the a design document with a view to query documents by their `created_at` property.

Next, open `Lists.js` and require the database object once more:

	code

In the `render` method, notice the 2 variables leftButtonConfig and rightButtonConfig that are used in the `NavigationBar` component in the return statement. They correspond to the `Log Out` and `New` buttons. The click handlers don’t do anything though so you will change that right away. In the `handler` function literal of `leftButtonConfig` insert:

	

You’re simply deleting the database (and all the documents and potential replication in progress with it) and then returning to the LogIn View.

Next, in the `handler` for the `rightButtonConfig` add:

	code

In this case, you’re displaying an alert dialog to enter the new list title and then persisting it to the database (with the `owner` field set to the logged in user and `created_at` field as the current timestamp).

Next, below the `getInitialState` method add the following to query the persisted documents:

	code

1. `_redrawListView` is private method that queries the `lists` view and update the data source to display new rows on the screen.
2. In `componentWillMount` you’re using the `pollChanges` method to update the UI.
3. Stop the interval method when the component unmount.

Log the View Query result when the promise `queryView` is fulfilled, you will see a lot of output in the Chrome Console. The result of this View Query is like so:

	json

To display them on the screen you will use the `ListView` component. It has two mandatory attributes:

- `dataSource` to provide the data: you can provide `this.state.dataSource` since you are already updating it.
- `renderRow` takes a function that returns `View` given a list item.

You’re missing the method to draw the row, below `render`, add a `renderRow` method:

	code

The desired data is held in the `value` field and you’re display the title and owner fields in `Text` elements. Back in the return statement of the `render` method, add the `ListView` element:

	code

Persist documents and notice the screen updating itself:

	gif

## Sync Gateway Configuration

In this section, you’ll use Sync Gateway to introduce bi-directional synchronising and server-side user authentication so multiple users can log in. First, download Sync Gateway from and here in the root directory of the project, create a new file named `sync-gateway-config.json` with the JSON:

	json

A few important things to note here are:

- The `GUEST` mode is disabled (it’s the case by default in fact) so any unauthenticated requests will be treated as unauthorised and return a 401 status code. For that matter, 4 different users have been created (with names moderator, laura, james, adam). The user named moderator has access to all channels.
- The Sync Function routes a document to a channel named after the `owner` field and grants the `owner` access to that channel.

So, in theory, the moderator should see all List documents where as the other users will see their own List documents only.

Start Sync Gateway from the command line:

	command

In `Login.js`, update the `_onLoginButtonPressed` as follow:

	code

Here’s what is happening:

1. Construct the URL of the remote database (in this case it’s a Sync Gateway database) and set the name/password JSON fields in the request body.
2. Use the POST \_session endpoint to check the name/password.
3. If the credentials are valid, create the database and once that’s done kick off continuous push/pull replications and register a design document with a view to query document by their `created_at` property.
4. If the credentials are invalid, display an alert window.
5. If the server is unreachable, display an alert window.

Run the application and login as different user. If possible, run the app on two devices to observe the continuous replication and different read permissions for the moderator:

## Conclusion

In this tutorial, you learnt how to use the React Native Couchbase Lite module to build a simple Todo application where multiple users can log in. As an exercise, you can try the following:

- Instead of creating a database with a hardcoded name when the user logs in, create a different one for each user. By doing so, you can simply switch database between users.
- Use a [local document](http://developer.couchbase.com/documentation/mobile/1.1.0/develop/references/couchbase-lite/rest-api/local-document/index.html) to persist the user credentials across app launches.

Feel free to share your feedback, findings or ask any questions in the comments below or in the forums. Talk to you soon!