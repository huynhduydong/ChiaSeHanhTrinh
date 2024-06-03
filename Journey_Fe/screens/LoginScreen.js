// src/screens/LoginScreen.js

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import API, { authApi, endpoints } from '../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyContext, { MyDispatchContext } from '../configs/MyContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const dispatch = useContext(MyDispatchContext); 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  const handleLogin = async  () => {
    // Xử lý logic đăng nhập tại đây
    setLoading(true);

        try {
          
            let res = await API.post(endpoints['login'], {
                "username": username,
                "password": password,
                "client_id": "NRhtsNVDdFncJIQ8JPR1jyhCNgajxLJKFtDAOleG",
                "client_secret": "fEIpXZRzXR16HZDBC9gONxe74ayinzwU7dZUUsvt2JUcnsfvU6FX8d3N5ow62RroNPkI6z6auYfo9kcAW8N6EL7KEerqtoVbBJte2lkMVJIdTgKx0mLbylQCtBlI9EtV",
                "grant_type": "password"
            }, {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }});
            console.log(res.data.access_token);
            await AsyncStorage.setItem("access-token", res.data.access_token)
            setTimeout(async () => {
              let user = await authApi(res.data.access_token).get(endpoints['current-user']);
              dispatch({
                  type: "login",
                  payload: user.data
              });
              navigation.navigate("Home");
            },100);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
  };

  const handleSignUp = () => {
    // Điều hướng tới màn hình đăng ký
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    // Xử lý quên mật khẩu
    console.log('Forgot Password');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: 'https://path/to/your/icon.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome back.</Text>
      <TextInput value={username} onChangeText={t => setUsername(t)} style={styles.input} placeholder="Tên đăng nhập..." />
       <TextInput secureTextEntry={true} value={password} onChangeText={t => setPassword(t)} style={styles.input} placeholder="Mật khẩu..." />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      {loading===true?<ActivityIndicator />:<>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
            </>}
      <View style={styles.footer}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B0082',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#4B0082',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#4B0082',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
