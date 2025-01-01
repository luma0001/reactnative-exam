// ---- Import React og Expo Libraties -----
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
// ---- Import Firebase -----
import { app, database, storage } from "./firebaseConfig.js";
import { addDoc, collection } from "firebase/firestore";
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

  //#region Map
  /*
  ==================================================================================
                                  Map View
  ==================================================================================
  */
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0, // Default latitude
    longitude: 12, // Default longitude
    latitudeDelta: 10, // Default zoom level
    longitudeDelta: 10, // Default zoom level
  });

  // --------------------- FETCH MARKER ----------------------------------------------

  // Her bruge vi en useEffect til kun at kaled fetchRegions når siden loades første gang
  useEffect(() => {
    fetchRegions();
  }, []);

  // Fetch all markers from Firestore
  async function fetchRegions() {
    alert(JSON.stringify, markers, 4, null);
    try {
      const regionData = await getDocs(collection(database, "marker"));
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

  function addMarker() {
    alert("Marker!");
  }

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
          <Text>UPDATED</Text>
          <MapView style={styles.map} reion={region} onLongPress={addMarker}>
            {markers.map((marker) => (
              <Marker
                coordinate={marker.coordinate}
                key={marker.id} // Ensure unique key
                title={marker.title}
                onPress={() => alert("Pressed " + marker.title)} // Show alert on marker press
              />
            ))}
          </MapView>
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
