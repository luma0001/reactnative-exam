import React, { useEffect, useState } from "react";
import { firestore } from "../firebaseConfig";
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './components/WelcomePage';
import ItemListPage from './components/ItemListPage';
import ItemDetailPage from './components/ItemDetailPage';

///////////////////////////////////////////////////////////////////////////////////


export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Button 
        title="Go to Item List"
        onPress={() => navigation.navigate('ItemList')}
      />
    </View>
  );
}


/////////////////////////////////////////////////////////////////////////

export default function ItemListPage({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('items')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Button 
        title="View Details"
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

//////////////////////////////////////////////////////////////////////////



export default function ItemDetailPage({ route }) {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const doc = await firestore.collection("items").doc(itemId).get();
      if (doc.exists) {
        setItem(doc.data());
      }
    };

    fetchItem();
  }, [itemId]);

  if (!item) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Details: {item.details}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Category: {item.category}</Text>
    </View>
  );
}


/////////////////////////////////////////////////////////////////////////////

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="ItemList" component={ItemListPage} />
        <Stack.Screen name="ItemDetail" component={ItemDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});
