import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  AsyncStorage,
} from "react-native";
import { SafeCon } from "../assets/common/common";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { connect } from "react-redux";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Port from "./Port";

const Stack = createStackNavigator();

const Login = ({ navigation }) => {
  const [loginId, setLoginId] = useState();
  const [loginPw, setLoginPw] = useState();

  const handleLoginId = (text) => {
    setLoginId(text);
  };
  const handleLoginPw = (text) => {
    setLoginPw(text);
  };

  const handleLoginRes = async () => {
    const loginUser = await checkLoginData();

    if (Object.keys(loginUser).length > 0) await doLogin(loginUser);
    else alert("Hey Bro Noo~~~");
  };

  const doLogin = async (loginUser) => {
    await AsyncStorage.setItem(
      "loginUser",
      JSON.stringify(loginUser[0]),
      () => {}
    );
    alert("Bro Login Success~");
  };

  const checkLoginData = async () => {
    const flag = await axios({
      method: "get",
      url: `${Port}/doLogin`,
      params: {
        loginId: loginId,
        loginPw: loginPw,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) return data;
        else return false;
      })
      .catch((e) => alert(e));

    return flag;
  };

  return (
    <SafeCon
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ padding: 15 }}>
        <View
          style={{
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              width: 300,
              textAlign: "left",
            }}
          >
            아이디
          </Text>
          <TextInput
            onChangeText={handleLoginId}
            style={{
              borderBottomColor: "white",
              marginTop: 6,
              padding: 3,
              paddingLeft: 10,
              width: 300,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 15, alignItems: "center" }}>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: "white", width: 300 }}>비밀번호</Text>
          </View>
          <TextInput
            secureTextEntry={true}
            onChangeText={handleLoginPw}
            style={{
              borderBottomColor: "white",
              marginTop: 6,
              padding: 3,
              paddingLeft: 10,
              width: 300,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 15, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleLoginRes}
            style={{
              marginTop: 25,
              backgroundColor: "red",
              width: 300,
              padding: 9,
              borderRadius: 6,
              alignItems: "center",
              backgroundColor: "green",
            }}
          >
            <Text style={{ color: "white" }}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeCon>
  );
};

const Join = ({ navigation }) => {
  const [loginId, setLoginId] = useState();
  const [loginPw, setLoginPw] = useState();
  const [loginPwC, setLoginPwC] = useState();

  const handleJoinId = (text) => {
    setLoginId(text);
  };

  const handleJoinPw = (text) => {
    setLoginPw(text);
  };

  const handleJoinPwC = (text) => {
    setLoginPwC(text);
  };

  const handleJoinRes = async () => {
    if (loginPw != loginPwC) {
      alert("비밀번호가 서로 다릅니다.");
      return;
    }

    const flag = await checkDuplicateId();

    if (flag) await joinUser();
  };

  const checkDuplicateId = async () => {
    const flag = await axios({
      method: "get",
      url: `${Port}/getLoginUser`,
      params: {
        loginId: loginId,
      },
    })
      .then(({ data, status }) => {
        if (status === 200 && Object.keys(data).length > 0) {
          alert("Bro 중복 Bro");
          return false;
        } else {
          return true;
        }
      })
      .catch((e) => {
        alert(e);
      });

    return flag;
  };

  const joinUser = async () => {
    await axios({
      method: "get",
      url: `${Port}/joinUser`,
      params: {
        loginId: loginId,
        loginPw: loginPw,
        loginPwC: loginPwC,
      },
    })
      .then(({ data, status }) => {
        if (status === 200) alert("Thanks Bro Man!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <SafeCon
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ padding: 15 }}>
        <View
          style={{
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              width: 300,
              textAlign: "left",
            }}
          >
            아이디
          </Text>
          <TextInput
            onChangeText={handleJoinId}
            style={{
              borderBottomColor: "white",
              marginTop: 6,
              padding: 3,
              paddingLeft: 10,
              width: 300,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 15, alignItems: "center" }}>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: "white", width: 300 }}>비밀번호</Text>
          </View>
          <TextInput
            onChangeText={handleJoinPw}
            secureTextEntry={true}
            style={{
              borderBottomColor: "white",
              marginTop: 6,
              padding: 3,
              paddingLeft: 10,
              width: 300,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 15, alignItems: "center" }}>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: "white", width: 300 }}>비밀번호 재확인</Text>
          </View>
          <TextInput
            onChangeText={handleJoinPwC}
            secureTextEntry={true}
            style={{
              borderBottomColor: "white",
              marginTop: 6,
              padding: 3,
              paddingLeft: 10,
              width: 300,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
          <TouchableOpacity
            onPress={handleJoinRes}
            style={{
              marginTop: 25,
              backgroundColor: "red",
              width: 300,
              padding: 9,
              borderRadius: 6,
              alignItems: "center",
              backgroundColor: "green",
            }}
          >
            <Text style={{ color: "white" }}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeCon>
  );
};

const FirstPage = ({ navigation, loginUser }) => {
  const userWidth = Dimensions.get("window").width;
  const presentImg = [
    "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210723_159%2F1627019426922iv3cl_PNG%2FP5hBe-KoUjMp8WmzDPs1MvB2.PNG.png",
    "https://img.khan.co.kr/news/2020/10/16/l_2020101601001687000138341.jpg",
    "https://file.mk.co.kr/meet/neds/2021/04/image_readtop_2021_330747_16177500644599916.jpg",
    "https://dimg.donga.com/wps/NEWS/IMAGE/2021/01/17/104953245.2.jpg",
    "http://spnimage.edaily.co.kr/images/Photo/files/NP/S/2021/05/PS21051800093.jpg",
  ];

  useLayoutEffect(() => {}, []);

  return (
    <SafeCon>
      <ScrollView
        style={{
          padding: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
          우리동네 사진관 확인하고 인생사진 얻자!
        </Text>
        <View
          style={{
            marginTop: 15,
          }}
        >
          <Image
            style={{ width: userWidth - 50, height: 300, borderRadius: 15 }}
            source={{
              uri: "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210723_159%2F1627019426922iv3cl_PNG%2FP5hBe-KoUjMp8WmzDPs1MvB2.PNG.png",
            }}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: "white", fontSize: 20 }}>
            현재 동네 21개 사진관 예약가능
          </Text>
          {loginUser === null ? (
            <View style={{ width: userWidth - 50, flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 6,
                  borderRadius: 12,
                  height: 50,
                  marginRight: 12,
                }}
              >
                <Text style={{ color: "black", fontSize: 16 }}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Join")}
                style={{
                  flex: 1,
                  backgroundColor: "#3f51b5",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 6,
                  borderRadius: 12,
                  height: 50,
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>회원가입</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeCon>
  );
};

const WelCome = (props) => {
  const navigation = props.navigation;
  const navState = navigation.getState();

  useLayoutEffect(() => {
    const isDisplay = navState?.routes[0]?.state?.index ? "none" : null;

    navigation.setOptions({
      tabBarStyle: { display: isDisplay },
    });
  }, [navState]);

  return (
    <Stack.Navigator
      initialRouteName="FirstPage"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
      }}
    >
      <Stack.Screen name="FirstPage" component={FirstPage.bind(this, props)} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Join" component={Join} />
    </Stack.Navigator>
  );
};

function StateChange(loginUser) {
  return {
    loginUser: loginUser,
  };
}

export default connect(StateChange)(WelCome);
