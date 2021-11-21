import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  CardItem,
  RegularText,
  SmallText,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Con } from "../assets/common/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import Port from "./Port";
import { timeForToday } from "../assets/helper/timeHelper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Profile = ({
  loginUser,
  wishList,
  reservationList,
  navigation,
  dispatch,
}) => {
  const userHeight = Dimensions.get("window").height;
  const userWidth = Dimensions.get("window").width;

  return (
    <ScrollView
      style={{
        padding: 15,
        height: userHeight,
        backgroundColor: "#161616",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 150, height: 150, borderRadius: 35 }}
          source={{
            uri: "https://cdnweb01.wikitree.co.kr/webdata/editor/202009/16/img_20200916152758_395c9c8b.webp",
          }}
        />
        <View>
          <Text style={{ fontSize: 25, color: "white" }}>{loginUser.name}</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            marginBottom: 10,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: 5, marginTop: 2 }}>
            <Icon name="check-circle" size={20} color="white" />
          </View>
          <View>
            <Text style={{ fontSize: 20, color: "white" }}>예약 목록</Text>
          </View>
        </View>
        <View>
          {reservationList &&
            reservationList.map((data, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Home", {
                      screen: "Detail",
                      params: { row: data },
                    })
                  }
                  key={data.seq}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    padding: 12,
                    backgroundColor: "white",
                    borderRadius: 8,
                    width: userWidth - 40,
                    marginVertical: 10,
                    borderRadius: 12,
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                    source={{ uri: data.present_img }}
                  />
                  <View style={{ marginLeft: 6 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                      {data.title}
                    </Text>
                    <Text>{data.local}</Text>
                    <Text>{timeForToday(data.date)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
      <View>
        <View
          style={{
            marginBottom: 10,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: 5, marginTop: 2 }}>
            <Icon name="cards-heart" size={20} color="red" />
          </View>
          <View>
            <Text style={{ fontSize: 20, color: "white" }}>찜 목록</Text>
          </View>
        </View>
        <View style={{ marginBottom: 30 }}>
          {wishList &&
            wishList.map((data, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Home", {
                      screen: "Detail",
                      params: {
                        row: data,
                      },
                    })
                  }
                  key={data.seq}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    padding: 12,
                    backgroundColor: "white",
                    borderRadius: 8,
                    width: userWidth - 40,
                    marginVertical: 10,
                    borderRadius: 12,
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                    source={{ uri: data.present_img }}
                  />
                  <View style={{ marginLeft: 6 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                      {data.title}
                    </Text>
                    <Text>{data.local}</Text>
                    <Text>{timeForToday(data.reg_date)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

function StateChange(props) {
  return {
    loginUser: props.loginUserRd,
    wishList: props.wishListRd,
    reservationList: props.reservationListRd,
  };
}

export default connect(StateChange)(Profile);
