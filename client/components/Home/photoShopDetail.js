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
  Linking,
  Modal,
  Platform,
} from "react-native";
import axios from "axios";
import {
  ShopDetailTitle,
  FixedBottomBtn,
  FixedBtn,
} from "../../assets/common/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import * as ImagePicker from "expo-image-picker";
import Toast from "@rimiti/react-native-toastify";
import Port from "../Port";
import { connect } from "react-redux";

const photoShopDetail = ({ loginUser, navigation, route, dispatch }) => {
  const [selectImage, setSelectImage] = useState();
  const [userImage, setUserImage] = useState();
  const [like, setLike] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoMenuVisible, setPhotoMenuVisible] = useState(false);
  const [clickImg, setClickImg] = useState();
  const row = route.params.row;
  const userWidth = Dimensions.get("window").width;
  const userHeight = Dimensions.get("window").height;
  const presentImg = [
    `${row.present_img}`,
    `${row.sub_img_1}`,
    `${row.sub_img_2}`,
    `${row.sub_img_3}`,
    `${row.sub_img_4}`,
  ];

  useEffect(() => {
    getWishPoint();
  }, []);

  const getWishPoint = async () => {
    await axios({
      method: "get",
      url: `${Port}/getWishPoint`,
      params: {
        shopSeq: row.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) setLike(data[0].cnt);
        else alert("데이터 불러오기 실패.");
      })
      .catch((e) => {
        alert(e);
      });
  };

  const PickGallery = async () => {
    await CheckEnabledGallery();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setUserImage(result);
    } else {
      // setPhotoMenuVisible(false);
    }
  };

  const CheckEnabledGallery = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry .. Man");
      }
    }
  };

  const handleWish = async () => {
    const isCheckDupWish = await CheckDupWish();
    if (isCheckDupWish) await saveWishPhotoShop();
    else await deleteWishPhotoShop();
  };

  const deleteWishPhotoShop = async () => {
    await axios({
      method: "get",
      url: `${Port}/DeleteWishPhotoShop`,
      params: {
        shopSeq: row.seq,
        userNo: loginUser.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) {
          setLike(like - 1);
          dispatch({ type: "deleteWishPhotoShop", payload: row });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const saveWishPhotoShop = async () => {
    await axios({
      method: "get",
      url: `${Port}/WishPhotoShop`,
      params: {
        shopSeq: row.seq,
        userNo: loginUser.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) {
          setLike(like + 1);
          console.log(data);
          dispatch({ type: "saveWishPhotoShop", payload: row });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const CheckDupWish = async () => {
    const flag = await axios({
      method: "get",
      url: `${Port}/CheckDupWish`,
      params: {
        shopSeq: row.seq,
        userNo: loginUser.seq,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) {
          if (Object.keys(data).length > 0) {
            return false;
          } else return true;
        } else {
          alert("네트워크 오류발생");
          return false;
        }
      })
      .catch((e) => {
        alert(e);
      });

    return flag;
  };

  const handleChat = (seq) => {
    navigation.navigate("Chat", { seq });
  };

  const ReservePhoto = async ({ uri }) => {
    setSelectImage(uri);
    setPhotoMenuVisible(false);
    setUserImage(null);

    await axios({
      method: "get",
      url: `${Port}/ReserveSuccess`,
      params: {
        shopSeq: row.seq,
        userNo: loginUser.seq,
        type: "photo",
      },
    })
      .then(({ data, status }) => {})
      .catch((e) => {
        alert(e);
      });

    const msg = `안녕하세요 회원님~~ ${row.title} 입니다. 예약해주신 사진 잘받았습니다.작업 완료 후 바로 연락드리겠습니다 , 이용해주셔서 감사합니다`;

    await axios({
      method: "get",
      url: `${Port}/ReserveSuccessMsg`,
      params: {
        imageUri: uri,
        roomSeq: 2,
        receiveUser: 2,
        sendUser: row.host_user,
        msg: msg,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) {
          alert("예약 완료되었습니다");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const ShowDetailImg = (index) => {
    const img = presentImg[index];
    setClickImg(img);
    setModalVisible(true);
  };

  return (
    <View>
      {modalVisible ? (
        <Modal
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Image
            style={{
              flex: 1,
            }}
            source={{ uri: `${clickImg}` }}
          />
        </Modal>
      ) : null}
      {photoMenuVisible ? (
        <Modal
          animationType="fade"
          visible={photoMenuVisible}
          transparent={true}
          onRequestClose={() => setPhotoMenuVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#212121",
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              {userImage?.uri !== undefined ? (
                <View>
                  <Image
                    style={{
                      width: userWidth - 50,
                      height: userWidth - 50,
                      borderRadius: 6,
                    }}
                    source={{ uri: userImage?.uri }}
                  />
                  <TouchableOpacity
                    style={{
                      marginTop: 15,
                      backgroundColor: "#4caf50",
                      padding: 12,
                      borderRadius: 3,
                    }}
                    onPress={ReservePhoto.bind(this, userImage)}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      해당 사진 예약
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View
                style={{
                  marginTop: 25,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    padding: 12,
                    justifyContent: "center",
                    elevation: 6,
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.3,
                    backgroundColor: "#fff",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Icon name="camera-wireless-outline" size={30} />
                    <Text style={{ textAlign: "center" }}>카메라</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={PickGallery}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    padding: 12,
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    elevation: 6,
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.3,
                    marginLeft: 18,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Icon name="image-outline" size={30} />
                    <Text style={{ textAlign: "center" }}>갤러리</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
      <ScrollView style={{ backgroundColor: "#161616" }}>
        <SwiperFlatList
          data={presentImg}
          onChangeIndex={({ index, prevIndex }) => {}}
          renderItem={(img) => (
            <TouchableOpacity
              style={[{ backgroundColor: "black" }]}
              activeOpacity={1}
              onPress={ShowDetailImg.bind(this, img.index)}
            >
              <Image
                style={{ width: userWidth, height: 450 }}
                source={{ uri: img.item }}
              />
            </TouchableOpacity>
          )}
        />
        <View
          style={{
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <ShopDetailTitle>{row.title}</ShopDetailTitle>
          <View
            style={{
              flexDirection: "row",
              width: userWidth - 30,
              justifyContent: "space-evenly",
              padding: 12,
              marginTop: 8,
              borderRadius: 6,
              // elevation: 3,
              // shadowOffset: { width: 1, height: 1 },
              // shadowOpacity: 0.3,
              marginVertical: 6,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={handleWish}
            >
              <Text
                style={{ textAlign: "center", fontSize: 15, color: "white" }}
              >
                {like ? (
                  <Text>❤️</Text>
                ) : (
                  <Icon name="heart-outline" size={15} />
                )}
                찜 {like}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={handleChat.bind(this, row.seq)}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 15 }}
              >
                <Icon name="chat-outline" size={15} />
                채팅
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => Linking.openURL(`tel:${row.num}`)}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 15 }}
              >
                <Icon name="cellphone" size={15} />
                전화
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: userWidth - 30,
              marginTop: 12,
              borderRadius: 10,
            }}
          >
            <View>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: "#7986cb",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    padding: 3,
                    borderRadius: 3,
                  }}
                >
                  <Text style={{ color: "white" }}>장소</Text>
                  <Icon
                    name="map-marker-radius-outline"
                    size={15}
                    color="white"
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: "#e0e0e0" }}>{row.local}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#7986cb",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    padding: 3,
                    borderRadius: 3,
                  }}
                >
                  <Text style={{ color: "white" }}>시간</Text>
                  <Icon name="clock-outline" size={15} color="white" />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: "#e0e0e0" }}>매일9시 ~ 오후 8시</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={{ marginTop: 12, color: "#e0e0e0", lineHeight: 20 }}>
            {row.intro}
          </Text>
        </View>
        <View style={{ height: 80 }}></View>
      </ScrollView>
      <FixedBottomBtn>
        <FixedBtn onPress={() => setPhotoMenuVisible(true)}>
          <Text style={{ fontSize: 18, color: "#fafafa", fontWeight: "bold" }}>
            사진 전송 예약
          </Text>
        </FixedBtn>
        <FixedBtn>
          <Text style={{ fontSize: 18, color: "#fafafa", fontWeight: "bold" }}>
            방문 예약
          </Text>
        </FixedBtn>
      </FixedBottomBtn>
    </View>
  );
};

function ChageState(props) {
  return {
    loginUser: props.loginUserRd,
    wishList: props.wishListRd,
    reservationList: props.reservationListRd,
  };
}
export default connect(ChageState)(photoShopDetail);
