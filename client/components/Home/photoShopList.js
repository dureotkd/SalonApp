import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Card, ListCard, ShopDes, ShopTitle } from "../../assets/common/common";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled, { withTheme } from "styled-components/native";
import { Rating, AirbnbRating } from "react-native-ratings";
import { createStackNavigator } from "@react-navigation/stack";
import Port from "../Port";

const SortBtnList = (props) => {
  const userWidth = Dimensions.get("window").width;
  const [sortState, setSortState] = useState("normal");
  const sortArr = [
    { name: "기본", code: "normal" },
    { name: "평점 높은 곳", code: "rate" },
  ];

  const handleSort = (code) => {
    if (code === sortState) return;
    const cloneList = [...props.photoShops];
    switch (code) {
      default: {
        cloneList.sort((prev, next) => {
          return prev.reg_date < next.reg_date ? 1 : -1;
        });
        break;
      }
      case "rate": {
        cloneList.sort((prev, next) => {
          return prev.satis_avg < next.satis_avg ? 1 : -1;
        });
        break;
      }
    }

    props.setPhotoShops(cloneList);
    setSortState(code);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        width: userWidth - 30,
        height: 40,
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: 8,
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#353535",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        marginBottom: 20,
      }}
    >
      {sortArr.map((item, idx) => {
        return (
          <TouchableOpacity
            key={idx}
            onPress={handleSort.bind(this, item.code)}
          >
            {item.code === sortState ? (
              <View
                style={{
                  backgroundColor: "#66bb6a",
                  padding: 6,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white" }}>{item.name}</Text>
              </View>
            ) : (
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {item.name}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const photoShopList = ({ navigation }) => {
  const [photoShops, setPhotoShops] = useState();

  useEffect(() => {
    axios({
      method: "get",
      url: `${Port}/getPhotoShop`,
      responseType: "json",
    })
      .then(({ data, status }) => {
        if (status == 200) setPhotoShops(data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  return (
    <ListCard>
      <SortBtnList photoShops={photoShops} setPhotoShops={setPhotoShops} />
      {photoShops &&
        photoShops.map((val, idx) => {
          return (
            <Card
              key={val.seq}
              onPress={() => navigation.navigate("Detail", { row: val })}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 150, height: 150, borderRadius: 6 }}
                  source={{
                    uri: `${val.present_img}`,
                  }}
                />
                <View
                  style={{
                    marginLeft: 10,
                    alignItems: "baseline",
                    position: "relative",
                  }}
                >
                  <ShopTitle>{val.title}</ShopTitle>
                  <ShopDes>{val.local}</ShopDes>
                  <ShopDes>매일 10시~9시</ShopDes>
                  <AirbnbRating
                    type="custom"
                    reviews={[1, 2, 3, 4, 5]}
                    ratingBackgroundColor="#c8c7c8"
                    ratingCount={5}
                    isDisabled={true}
                    defaultRating={val.satis_avg}
                    size={15}
                  />
                </View>
              </View>
            </Card>
          );
        })}
    </ListCard>
  );
};
