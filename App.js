// ---- Import React og Expo Libraties -----
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
// ---- Import Firebase -----
import { app, database, storage } from "./firebaseConfig.js";
import { getDocs, addDoc, collection } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   initializeAuth,
//   getReactNativePersistence,
//   setPersistence,
//   browserLocalPersistence,
// } from "firebase/auth";
// ---- Import MapView -----
import MapView, { Marker } from "react-native-maps";
// ---- Import config -----
import { firebaseConfig } from "./firebaseConfig.js";
import { userLogIn } from "./firebaseConfig.js";
// ---- Import navigation -----
import { NavigationContaier } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/*
  ==================================================================================
                                  Set Auth
  ==================================================================================
  */
//#region Auth

let auth = getAuth(app);

/*

This is giving some errors - if I can make it work, good.

if (Platform.OS !== "web") {
  // Gemmer auth i devicen - virker dog ikke
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
*/
//#endregion

//#region Default Screen
/*
  ==================================================================================
                                Default Screen
  ==================================================================================
*/

function DefaultScreen({ navigation }) {
  const [date, setDate] = useState("");

  return (
    <>
      <View>
        <Text>Task</Text>
        <TextInput placeholder="Task" onChange={setDate} value={date} />
        <Button title="Go to Date" onPress={navigation.navigate("Date")} />
        <Button title="Go to List" onPress={navigation.navigate("List")} />
        <Button title="Go to Map" onPress={navigation.navigate("Map")} />
        <Button title="Go to Event" onPress={navigation.navigate("Event")} />
      </View>
    </>
  );
}
//#endregion

//#region MOCKMAP
/*
  ==================================================================================
                                  Mock Map
  ==================================================================================
*/

function MapScreen({ navigation }) {
  const [date, setDate] = useState("");

  return (
    <>
      <View>
        <Text>HERE IS A MAP</Text>
        <Button
          title="Go to Default"
          onPress={() => navigation.navigate("Default")}
        />
      </View>
    </>
  );
}
//#endregion

//#region Tasks
/*
  ==================================================================================
                                  Task View
  ==================================================================================
*/

function EventScreen(navigation) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  return (
    <>
      <View>
        <Text>Task</Text>
        <TextInput placeholder="Task" onChange={setTitle} value={title} />
        <Text>Details</Text>
        <TextInput
          placeholder="Details"
          onChange={setDetails}
          value={details}
        />
        <Button
          title="Go to Default"
          onPress={() => navigation.navigate("Default")}
        />
      </View>
    </>
  );
}
//endregion

//#region List
/*
  ==================================================================================
                                  List
  ==================================================================================
*/

function ListScreen({ navigation }) {
  const [date, setDate] = useState("");

  return (
    <>
      <View>
        <Text>HERE IS A LIST OF TASKS</Text>
        <Button
          title="Go to Default"
          onPress={() => navigation.navigate("Default")}
        />
      </View>
    </>
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
  const [date, setDate] = useState("");

  return (
    <>
      <View>
        <Text>Task</Text>
        <TextInput placeholder="Task" onChange={setDate} value={date} />
        <Button
          title="Go to Default"
          onPress={navigation.navigate("Default")}
        />
      </View>
    </>
  );
}
//#endregion

//#region # App #
/*
  ==================================================================================
                                  APP()
  ==================================================================================
*/

export default function App() {
  // Very silly to hve stuff like this hardcoded here...
  const [enteredEmail, setEnteredEmail] = useState(userLogIn.email);
  const [enteredPassword, setEnteredPassword] = useState(userLogIn.password);
  const [userId, setUserId] = useState(null);
  const [enteredText, setenteredText] = useState("type here");

  // "seemed to work"
  //alert(JSON.stringify(app, null, 4));

  // Kører når programmet starter
  useEffect(() => {
    const auth_ = getAuth();
    // Unsubscribe - mounter componenten...
    // Listener som håndtere om brugeren er logget ind eller ud
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  async function addDocument() {
    try {
      await addDoc(collection(database, userId), {
        text: enteredText,
      });
    } catch (error) {
      console.log("error addDocument " + error);
    }
  }
  //#endregion

  //#region Map
  /*
  ==================================================================================
                                  Map View
  ==================================================================================
  */
  // --------------------- MAP HOOKS -----------------------------------------------
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0, // Default latitude
    longitude: 12, // Default longitude
    latitudeDelta: 10, // Default zoom level
    longitudeDelta: 10, // Default zoom level
  });
  const mapView = useRef(null); // Ref for MapView instance
  const locationSubscription = useRef(null); // To track the location subscription

  // --------------------- FETCH MARKER ----------------------------------------------

  // Her bruge vi en useEffect til kun at kaled fetchRegions når siden loades første gang
  useEffect(() => {
    fetchRegions();
  }, []);

  // Fetch all markers from Firestore
  async function fetchRegions() {
    alert(JSON.stringify, markers, 4, null);
    try {
      const regionData = await getDocs(collection(database, userId));
      const allMarkers = regionData.docs.map((doc) => ({
        id: doc.id, // Firebase-generated ID
        ...doc.data().marker, // Marker data
      }));

      // Set the markers state to the fetched data
      setMarkers(allMarkers); // Set regions to markers
    } catch (error) {
      console.log("Error fetching regions:", error);
    }
  }

  // --------------------- ADD MARKER ----------------------------------------------

  // Function to add a marker on long press
  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate; // Correct destructuring
    const newMarker = {
      coordinate: { latitude, longitude },
      title: "New App",
    };
    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]); // Use previous state to add the marker

    // Upload the current region to firebase
    uploadRegion(newMarker); // Use the current region state directly
  }

  // --------------------- UPLOAD MARKER ----------------------------------------------

  // Modify uploadRegion to accept the region as a parameter
  async function uploadRegion(currentMarker) {
    console.log(currentMarker);
    try {
      if (
        !currentMarker ||
        !currentMarker.coordinate.latitude ||
        !currentMarker.coordinate.longitude
      ) {
        alert("Region data is invalid.");
        return;
      }

      alert("New region added ", JSON.stringify(currentMarker));

      // Upload region to Firestore
      await addDoc(collection(database, userId), { marker: currentMarker });

      // Fetches alle th markers from firestore
      fetchRegions();
      alert("Region uploaded successfully!");
    } catch (err) {
      console.error("Error uploading region:", err.message || err);
      alert("Error uploading region: " + (err.message || err));
    }
  }

  // --------------------- UPDATE REGION/ LOCATION  ----------------------------------------------

  // UseEffect for location updates
  useEffect(() => {
    async function startListening() {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location is not available");
        return;
      }

      // Start watching the position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          distanceInterval: 100, // Update every 100 meters
          accuracy: Location.Accuracy.High, // Use high accuracy for location
        },
        (location) => {
          if (!location || !location.coords) {
            console.log("Location is not available");
            return; // Handle location not available case
          }

          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: region.latitudeDelta, // Keep zoom level constant
            longitudeDelta: region.longitudeDelta, // Keep zoom level constant
          };

          // Update region state with new location
          setRegion(newRegion);
          // Animate map to new region
          if (mapView.current) {
            mapView.current.animateToRegion(newRegion); // Animate to new location
          }
        }
      );
    }

    // Start location tracking
    startListening();

    // Cleanup function to remove the location listener when the component unmounts
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []); // Re-run effect if zoom level changes

  //#endregion

  /*
  ==================================================================================
                                  LOG IN
  ==================================================================================
  */
  //#region Login

  // VI SKAL benytte CLIENT måden hvor man automatisk for log-in statet med...
  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("logged in " + userCredential.user.uid);
    } catch (error) {}
  }

  async function sign_out() {
    await signOut(auth);
  }

  async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("User created: " + userCredential.user.uid);
    } catch (error) {}
  }

  //#endregion

  //#region Stack Navigation
  /*
  ==================================================================================
                                  Stack Navigation
  ==================================================================================
*/
  const Stack = createNativeStackNavigator();
  //endregion

  return (
    <View style={styles.container}>
      {!userId && (
        <>
          <Text>Login</Text>
          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button title="Log in" onPress={login} />

          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button title="Signup" onPress={signup} />
        </>
      )}
      {userId && (
        <>
          {/* <TextInput
            onChangeText={(newText) => setenteredText(newText)}
            value={enteredText}
          />
          <Button title="Add new Document" onPress={addDocument} /> */}
          {/* <Text>UPDATED</Text>
          <MapView style={styles.map} reion={region} onLongPress={addMarker}>
            {markers.map((marker) => (
              <Marker
                coordinate={marker.coordinate}
                key={marker.id} // Ensure unique key
                title={marker.title}
                onPress={() => alert("Pressed " + marker.title)} // Show alert on marker press
              />
            ))}
          </MapView> */}
          <NavigationContaier>
            <Stack.Navigatior initalRouteName="Default" />
            <Stack.Screen name="Default" component={DefaultScreen} />
            <Stack.Screen name="Date" component={DatePickerScreen} />
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack Screen name="Event" component={EventScreen} />
          </NavigationContaier>
          <Button title="Sign Out" onPress={sign_out} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "90%",
  },
});
