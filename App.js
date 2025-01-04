import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
// --- Import Navigation -----
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// --- Import Maps -----
import MapView, { Marker } from "react-native-maps";
// --- Import Firebase Config -----
import { database } from "./firebaseConfig.js";
// --- Import Firebase Functions ----
import { addDoc, getDocs, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

// --- FIRE STORE DATABASE VAR:
// const [chosenCollection, setChosenCollection] = useState("User");

//#region Default Screen
/*
  ==================================================================================
                                Default Screen
  ==================================================================================
*/

function DefaultScreen({ navigation }) {
  const [date, setDate] = useState("");

  // useEffect(() => {
  //   console.log("DefaultScreen rendered");
  //   alert("Default Screen here");
  // }, []); // Alert only when the component is mounted

  return (
    <View style={styles.screenContainer}>
      <Button
        title="Go to Date"
        onPress={() => {
          console.log("Navigating to Date");
          navigation.navigate("Date");
        }}
      />
      <Button
        title="Go to List"
        onPress={() => {
          console.log("Navigating to List");
          navigation.navigate("List");
        }}
      />
      <Button
        title="Go to Map"
        onPress={() => {
          console.log("Navigating to Map");
          navigation.navigate("Map");
        }}
      />
      <Button
        title="Go to Event"
        onPress={() => {
          console.log("Navigating to Event");
          navigation.navigate("Event");
        }}
      />
    </View>
  );
}
//#endregion

//#region Date Picker
/*
  ==================================================================================
                                Date Picker
  ==================================================================================
*/

function DatePickerScreen({ navigation }) {
  return (
    <View style={styles.screenContainer}>
      <Text>Task</Text>
      <TextInput placeholder="Task" onChangeText={() => {}} />
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

//#region List
/*
  ==================================================================================
                                  List
  ==================================================================================
*/

function ListScreen({ navigation }) {
  // const [date, setDate] = useState("");
  const [taskList, setTaskList] = useState([]);
  // --- fra useCollecion, fra firestore
  // ------------------------------------------------------------- note: db-collection
  const [values, loading, error] = useCollection(collection(database, "User"));

  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const renderEvent = ({ item }) => (
    <View style={styles.listEvent}>
      <Text>{item.title}</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate("Event", { itemObject: item })}
      />
    </View>
  );

  function handleNewEventPressed() {
    alert("You wanna make a new event!");

    // open the EventScreen with a <CREATE BUTTON>
    // Instead of a <DELETE/UPDATE...>
    // EventScreen should be TEXT until you CREATE or DELTE - Then it's text input!
    // ... then we ddo CRUD
    // Update LOCATION - the last thing OK!
    // Then we can contemplate having a calender...
  }

  return (
    <View style={styles.screenContainer}>
      <Text>Your Day:</Text>
      {/* <Button title="New Event" onPress={handleNewEventPressed()}></Button> */}
      <FlatList
        data={data}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

//#region Tasks
/*
  ==================================================================================
                                  Event Detail View
  ==================================================================================
*/

function EventScreen({ navigation, route }) {
  const [viewOnly, setViewOnly] = useState(true); // Default to view mode
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const event = route.params.itemObject;

  // Update form fields with event details when in view mode
  useEffect(() => {
    if (!viewOnly) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setDescription(event.description);
      setLatitude(event.latitude);
      setLongitude(event.longitude);
    }
  }, [viewOnly, event]);

  function handleSetLocation() {
    alert("Set location pressed");
  }

  // Toggle between view and edit modes
  function toggleEditMode() {
    setViewOnly(!viewOnly);
  }

  return (
    <View style={styles.screenContainer}>
      {viewOnly ? (
        // View mode
        <View>
          <Text style={styles.title}>{event.title}</Text>
          <Text>{event.date}</Text>
          <Text>{event.time}</Text>
          <Text>{event.description}</Text>
          <Text>{event.latitude}</Text>
          <Text>{event.longitude}</Text>
          <Button title="Edit" onPress={toggleEditMode} />
        </View>
      ) : (
        // Edit mode
        <View>
          <Text style={styles.title}>Edit Event</Text>
          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Text>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
          />
          <Text>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={time}
            onChangeText={setTime}
          />
          <Text>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Text>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
          />
          <Button title="Set Location" onPress={handleSetLocation} />
          <Button title="Save Changes" onPress={toggleEditMode} />
        </View>
      )}
    </View>
  );
}

//endregion

//#region Map
/*
  ==================================================================================
                                  Map
  ==================================================================================
*/

function MapScreen({ navigation }) {
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0, // Default latitude
    longitude: 12, // Default longitude
    latitudeDelta: 10, // Default zoom level
    longitudeDelta: 10, // Default zoom level
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  // const [values, loading, error] = useCollection(collection(database, "User"));
  // const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  // WHY FETCH? - Det er der jo ikke behov for i listen, ER DER?
  // Fetch all markers from Firestore
  async function fetchRegions() {
    try {
      const eventDocs = await getDocs(collection(database, "User"));
      const allEvents = eventDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setEvents(allEvents);
    } catch (error) {
      console.log("Error fetching regions:", error);
    }
  }

  function addMarker() {
    alert("Marker Added");
  }

  function handlePressMarker(event) {
    alert("MARKER PRESSED!");
    navigation.navigate("Event", { itemObject: event });
  }

  return (
    <View style={styles.screenContainer}>
      <Text>HERE IS A MAP</Text>
      <MapView style={styles.map} reion={region}>
        {events.map((event) => (
          <Marker
            coordinate={event.coordinate}
            key={event.id} // Ensure unique key
            title={event.title}
            onPress={() => handlePressMarker(event)}
          />
        ))}
      </MapView>
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

// Stack Navigation Setup
const Stack = createNativeStackNavigator();

// App component
export default function App() {
  const [enteredText, setEnteredText] = useState("type here");

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Default">
        <Stack.Screen name="Default" component={DefaultScreen} />
        <Stack.Screen name="Date" component={DatePickerScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Event" component={EventScreen} />

        {/* You can add more screens like List, Map, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  map: {
    height: "80%",
    width: "100%",
  },
  listEvent: {
    flex: 1 / 2,
    flexDirection: "row",
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40, // Adjust the height as needed
    borderColor: "#ccc", // Light grey border color
    borderWidth: 1, // Solid border width
    borderRadius: 5, // Optional rounded corners
    paddingHorizontal: 10, // Padding inside the input
    fontSize: 16, // Adjust text size
    backgroundColor: "#fff", // White background
  },
});
