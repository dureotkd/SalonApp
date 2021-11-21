import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import {
  Card,
  ListCard,
  ShopDes,
  ShopTitle,
  ShopDetailTitle,
} from "../assets/common/common";

import photoShopDetail from "./Home/photoShopDetail";
import { photoShopList } from "./Home/photoShopList";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled, { withTheme } from "styled-components/native";
import { Rating, AirbnbRating } from "react-native-ratings";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { connect } from "react-redux";

const Home = ({ navigation, routes }) => {
  const Stack = createStackNavigator();
  const navigationState = navigation.getState();

  useLayoutEffect(() => {
    const isDetail =
      navigationState?.routes?.[1]?.state?.index === 1 ? "none" : null;

    navigation.setOptions({
      tabBarStyle: { display: isDetail },
    });
  }, [navigationState]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen name="List" component={photoShopList} />
      <Stack.Screen name="Detail" component={photoShopDetail} />
    </Stack.Navigator>
  );
};

export default Home;
