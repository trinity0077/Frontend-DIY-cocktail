import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import HomeScreen from "./screens/CocktailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import Cocktailscard from "./src/components/Cocktailscard";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducers/cocktail";

const store = configureStore({
  reducer: { cocktail: userSlice.reducer },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "cocktail";
          } else if (route.name === "Favorites") {
            iconName = "heart";
          }

          return (
            <FontAwesome5 name={iconName} size={size} color={color} solid />
          );
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Cocktailscard" component={Cocktailscard} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
