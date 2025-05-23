import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';


const HomeScreen = () => {
  const [city, setCity] = useState('Loading Your Location Please Wait...');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable location access in settings.');
        setCity('Location permission was denied.');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation) {
          let reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
          if (reverseGeocode && reverseGeocode.length > 0) {
            setCity(reverseGeocode[0].city || 'City not found');
          } else {
            setCity('Could not determine');
          }
        }
      } catch (error) {
        console.error("Error fetching location or city:", error);
        setErrorMsg('Failed to fetch location. Please try again later.');
        setCity('Failed to load city.');
        Alert.alert("Location Error", "Could not fetch your current location. Make sure your location services are enabled.");
      }
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (city) {
    text = `Your city is: ${city}`;
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>{text}</Text>
      {city === 'Loading your city please wait...' && !errorMsg && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};


const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [editingName, setEditingName] = useState('User');

  const handleNameChange = () => {
    if (editingName.trim() === '') {
        Alert.alert("Invalid Name", "Username cannot be empty.");
        return;
    }
    setUserName(editingName);
    Alert.alert("Profile Updated", `Username changed to: ${editingName}`);
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileLabel}>Edit User Name:</Text>
      <TextInput
        style={styles.profileInput}
        onChangeText={setEditingName}
        value={editingName}
        placeholder="Enter your name in the textbox below"
      />
      <Button title="Save" onPress={handleNameChange} />
      <Text style={styles.profileDisplayText}>Welcome, {userName}!</Text>
    </View>
  );
};


const SettingsScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.settingsText}>Settings Screen</Text>
      <Text>This is our settings screen!</Text>
    </View>
  );
};

// --- Main App Component with Navigation ---
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00bcd4',
          tabBarInactiveTintColor: '#b2ebf2',
          headerStyle: {
            backgroundColor: '#00acc1',
          },
          headerTintColor: '#e0f7fa',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', 
  },
  screenText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#006064',
  },
  
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#e0f7fa',
  },
  profileLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  profileInput: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 5,
    width: '100%',
  },
  profileDisplayText: {
    fontSize: 18,
    marginTop: 30,
    fontStyle: 'italic',
  },
 
  settingsText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
