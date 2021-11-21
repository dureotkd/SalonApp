import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import styled from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Home, Profile, Chat, WelCome } from "./components";
import { Con, HeaderLogo } from "./assets/common/common";
import { photoShopDetail } from "./components/Home/photoShopDetail";
import { photoShopList } from "./components/Home/photoShopList";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Provier } from "react-redux";
import { createStore } from "redux";
import * as Location from "expo-location";
import { connect } from "react-redux";

const Tab = createBottomTabNavigator();

function App() {
  const [isReady, setIsReady] = useState(true);
  const [userAddress, setUserAddress] = useState();
  const [addEnabled, setAddEnabled] = useState();
  const [addressDetail, setAddressDetail] = useState();

  useEffect(() => {
    CheckLocationEnabled();
  }, []);

  const CheckLocationEnabled = async () => {
    const enabled = await Location.hasServicesEnabledAsync();

    if (enabled) {
      setAddEnabled(true);
      GetCurrentLocation();
    }
  };

  const GetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const { coords } = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = coords;
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setAddressDetail(coords);
    setUserAddress(address);
  };

  const getData = () => {
    return [];
  };

  return (
    <NavigationContainer>
      {isReady ? (
        <AppLoading
          startAsync={getData}
          onFinish={() => setIsReady(false)}
          onError={(e) => console.log(e)}
        />
      ) : (
        <Tab.Navigator
          initialRouteName="WelCome"
          screenOptions={{
            headerStyle: { backgroundColor: "#161616" },
            headerTitle: "",
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#66bb6a",
            tabBarItemStyle: {
              backgroundColor: "#161616",
              borderBottomColor: "black",
            },
            headerLeft: () => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <HeaderLogo onPress={() => console.log()}></HeaderLogo>
                  {addEnabled ? (
                    <Text style={{ color: "white" }}>
                      {userAddress?.region} {userAddress?.district}{" "}
                      {userAddress?.street} {userAddress?.postalCode}
                    </Text>
                  ) : (
                    <Text>위치몰라</Text>
                  )}
                </View>
              );
            },
            headerRight: () => {
              return (
                <Icon
                  name="bell"
                  size={25}
                  style={{ padding: 15, color: "#9e9e9e" }}
                />
              );
            },
          }}
        >
          <Tab.Screen
            name="WelCome"
            component={WelCome}
            options={{
              tabBarIcon: (props) => {
                return (
                  <Icon name="emoticon-excited" size={28} color={props.color} />
                );
              },
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: (props) => {
                return (
                  <Icon name="filter-variant" size={28} color={props.color} />
                );
              },
            }}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
              tabBarIcon: (props) => {
                return <Icon name="chat" size={28} color={props.color} />;
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: (props) => {
                return <Icon name="account" size={28} color={props.color} />;
              },
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

function ChangeState(props) {
  return {
    loginUser: props.loginUserRd,
  };
}

export default connect(ChangeState)(App);
