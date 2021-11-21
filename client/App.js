import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import styled from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Home, ChatList, Chat, WelCome } from "./components";
import { Con, HeaderLogo } from "./assets/common/common";
import { photoShopDetail } from "./components/Home/photoShopDetail";
import { photoShopList } from "./components/Home/photoShopList";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Provier } from "react-redux";
import { createStore, combineReducers } from "redux";
import * as Location from "expo-location";
import AppIndex from "./AppIndex";
import { Provider } from "react-redux";
import { AsyncStorage } from "react-native";
import Port from "./components/Port";

export default function App() {
  const [loginUser, setLoginUser] = useState(null);
  const [wishList, setWishList] = useState(null);
  const [reservationList, setReservationList] = useState(null);

  useEffect(() => {
    getProfileUserData();
  }, []);

  const getProfileUserData = async () => {
    await getLoginUser();
    await getWishList();
    await getReservationList();
  };

  const getLoginUser = async () => {
    await AsyncStorage.getItem("loginUser", (err, res) => {
      console.log(res);
      if (res !== null) {
        const asyncUser = JSON.parse(res);
        if (Object.keys(asyncUser).length > 0) {
          setLoginUser(asyncUser);
        }
      }
    });
  };

  const getWishList = async () => {
    console.log(`${Port}/getWishList`);
    await axios({
      method: "get",
      url: `${Port}/getWishList`,
      params: {
        userNo: loginUser.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) setWishList(data);
      })
      .catch((e) => {
        console.log("getWishList Error");
        // alert(e);
      });

    console.log("zz2");
  };

  const getReservationList = async () => {
    await axios({
      method: "get",
      url: `${Port}/getReservationList`,
      params: {
        userNo: loginUser.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) setReservationList(data);
      })
      .catch((e) => {
        // alert(e);
      });

    console.log("zz3");
  };

  const loginUserRd = (state = loginUser, action) => {
    switch (action.type) {
      case "하이": {
        console.log("Hi2");
        break;
      }

      default: {
        return state;
      }
    }

    return state;
  };

  const wishListRd = (state = wishList, action) => {
    const cloneList = [...state];
    switch (action.type) {
      case "saveWishPhotoShop": {
        const photoShop = action.payload;
        cloneList.push(photoShop);

        return cloneList;
      }

      case "deleteWishPhotoShop": {
        const photoShop = action.payload;
        const filterPhotoShop = cloneList.filter(
          (row) => photoShop.seq != row.seq
        );
        return filterPhotoShop;
      }

      default: {
        return state;
      }
    }
  };

  const reservationListRd = (state = reservationList, action) => {
    switch (action.type) {
      default: {
        return state;
      }
    }

    return state;
  };

  const Store = createStore(
    combineReducers({ loginUserRd, wishListRd, reservationListRd })
  );

  return (
    <Provider store={Store}>
      <AppIndex />
    </Provider>
  );
}
