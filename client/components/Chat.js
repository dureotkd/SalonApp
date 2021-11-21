import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Button,
} from "react-native";
import axios from "axios";
import { Con, SafeCon } from "../assets/common/common";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CardAnimationContext,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { timeForToday } from "../assets/helper/timeHelper";
import Port from "./Port";

const ChatList = ({ route, navigation }) => {
  const [chatRoom, setChatRoom] = useState();
  const [msgList, setMsgList] = useState();
  const userWidth = Dimensions.get("window").width;

  useEffect(() => {
    const keyBoardShow = () => {
      // alert("keyboard show");
    };
    const keyBoardHide = () => {
      // alert("keyboard Hide");
    };

    Keyboard.addListener("keyboardDidShow", keyBoardShow);
    Keyboard.addListener("keyboardDidHide", keyBoardHide);

    axios({
      method: "get",
      url: `${Port}/getChatRoom`,
      params: {
        seq: 1,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) setChatRoom(data);
      })
      .catch((e) => alert(e));
  }, [msgList]);

  return (
    <ScrollView style={{ backgroundColor: "#161616" }}>
      {chatRoom &&
        chatRoom.map((val, idx) => {
          return (
            <TouchableOpacity
              key={val.seq}
              onPress={() =>
                navigation.navigate("ChatDetail", {
                  val,
                  setMsgList,
                })
              }
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: "row",
                    padding: 15,
                    backgroundColor: "#353535",
                    width: userWidth - 40,
                    alignItems: "center",
                    borderRadius: 12,
                  }}
                >
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                    source={{
                      uri: "https://file.mk.co.kr/meet/neds/2021/04/image_readtop_2021_330747_16177500644599916.jpg",
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 12,
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#4caf50",
                          fontWeight: "bold",
                        }}
                      >
                        {val.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#9e9e9e",
                          marginLeft: 6,
                        }}
                      >
                        {timeForToday(val.reg_date)}
                      </Text>
                    </View>
                    <View style={{ width: userWidth - 100 }}>
                      <Text
                        style={{
                          flexWrap: "wrap",
                          color: "white",
                        }}
                      >
                        {val.msg}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
};

const ChatDetail = ({ route, navigation }) => {
  const val = route.params.val;
  const setParentMsgList = route?.params?.setMsgList;
  const [msgList, setMsgList] = useState();
  const [inputMsg, setInputMsg] = useState();
  const loginUserNo = 2;
  const userWidth = Dimensions.get("window").width;
  const scrollViewRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    axios({
      method: "get",
      url: `${Port}/getChatMsg`,
      params: { room_seq: val.room_seq },
    })
      .then(({ data, status }) => {
        if (status === 200) setMsgList(data);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const saveMsg = async () => {
    if (inputMsg?.length === 0) {
      alert("메시지를 입력해주세요.");
      return;
    }

    await axios({
      method: "get",
      url: `${Port}/getInsertMsg`,
      params: {
        msg: inputMsg,
        roomSeq: val.room_seq,
        sendUser: loginUserNo,
        receiveUser: val.receive_user,
        isRead: val.isRead,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) {
          realSaveMsg(val, data.insertId);
        } else {
          alert("에러");
        }
      })
      .catch((e) => alert(e));
  };

  const realSaveMsg = (val, insertId) => {
    const now = new Date();
    const msg = {
      is_read: "N",
      msg: inputMsg,
      receive_user: val.receive_user,
      receive_user_name: val.receive_user_name,
      reg_date: val.reg_date,
      room_seq: val.room_seq,
      send_user: loginUserNo,
      send_user_name: val.send_user_name,
      seq: insertId,
      title: val.title,
    };

    const cloneList = [...msgList];
    cloneList.push(msg);
    setMsgList(cloneList);
    setInputMsg("");
    setParentMsgList(now.getTime());
  };

  return (
    <Con>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {msgList &&
          msgList.map((val, idx) => {
            return (
              <View
                key={val.seq}
                style={{
                  flexDirection: "row",
                  padding: 15,
                }}
              >
                {loginUserNo === val.send_user ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#a5d6a7",
                        borderRadius: 12,
                        marginRight: 12,
                        padding: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          flexWrap: "wrap",
                          maxWidth: userWidth - 150,
                        }}
                      >
                        {val.msg}
                      </Text>
                      {/* <Text>{timeForToday(val.reg_date)}</Text> */}
                    </View>
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                      source={{
                        uri: "https://cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/GRUY3S3TLKVUE5O2IR7OKFK4O4.jpg",
                      }}
                      alt="게스트사진"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                      source={{
                        uri: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F2438573358070C1535",
                      }}
                      alt="사장님사진"
                    />
                    <View
                      style={{
                        backgroundColor: "#424242",
                        borderRadius: 12,
                        marginLeft: 12,
                        padding: 12,
                      }}
                    >
                      {val.img_uri == "" ? null : (
                        <Image
                          style={{
                            width: userWidth - 150,
                            height: userWidth - 150,
                            marginBottom: 10,
                          }}
                          source={{ uri: val.img_uri }}
                        />
                      )}
                      <Text
                        style={{
                          color: "white",
                          flexWrap: "wrap",
                          maxWidth: userWidth - 150,
                        }}
                      >
                        {val.msg}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
      </ScrollView>
      <View style={{ height: 60 }}></View>
      <View
        style={{
          position: "absolute",
          height: 60,
          bottom: 0,
          width: userWidth,
          justifyContent: "center",
          padding: 12,
          backgroundColor: "#424242",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TextInput
            onChangeText={(text) => {
              setInputMsg(text);
            }}
            ref={inputRef}
            placeholder="메시지"
            value={inputMsg}
            placeholderTextColor="#ffffff"
            fontSize={15}
            style={{
              color: "white",
              width: userWidth - 70,
            }}
          ></TextInput>
          <TouchableOpacity
            onPress={saveMsg}
            style={{
              padding: 12,
              backgroundColor: "white",
              borderRadius: 6,
            }}
          >
            <Text>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Con>
  );
};

const Stack = createStackNavigator();

const Chat = ({ route, navigation }) => {
  const navigationState = navigation.getState();

  useLayoutEffect(() => {
    const isDetail =
      navigationState?.routes[2]?.state?.index === 1 ? "none" : null;

    navigation.setOptions({
      tabBarStyle: { display: isDetail },
    });
  }, [navigationState]);

  const config = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen
        name="ChatDetail"
        options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        component={ChatDetail}
      />
    </Stack.Navigator>
  );
};

export default Chat;
