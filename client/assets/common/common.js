import React from "react";
import { View, ScrollView, Text, Button, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const SafeCon = styled.SafeAreaView`
  flex: 1;
  background-color: #161616;
`;

const Con = styled.SafeAreaView`
  height: 100%;
  width: 100%;
  background-color: #161616;
`;

const ListCard = styled.ScrollView`
  height: 100%;
  width: 100%;
  padding: 15px;
  background-color: #161616;
`;

const Card = styled.TouchableOpacity`
  width: 100%;
  height: 150px;
  margin-bottom: 50px;
`;

const ReservBtn = styled.TouchableOpacity`
  width: 300px;
  height: 30px;
  background-color: #a5d6a7;
  color: #ffffff;
`;

const ShopDetailTitle = styled.Text`
  font-size: 23px;
  margin-top: 15px;
  color: white;
`;

const ShopTitle = styled.Text`
  font-size: 18px;
  flex-wrap: wrap;
  color: white;
  font-weight: bold;
`;

const ShopDes = styled.Text`
  margin-top: 3px;
  color: #bdbdbd;
`;

const HeaderLogo = styled.Text`
  font-size: 16px;
  color: black;
  padding-left: 15px;
  font-weight: bold;
`;

const FixedBtn = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  border-left-width: 1px;
  height: 100%;
  justify-content: center;
  border-left-color: white;
`;

const FixedBottomBtn = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  background-color: #81c784;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
`;

export {
  Con,
  HeaderLogo,
  SafeCon,
  ListCard,
  Card,
  ShopDes,
  ShopTitle,
  ReservBtn,
  ShopDetailTitle,
  FixedBottomBtn,
  FixedBtn,
};
