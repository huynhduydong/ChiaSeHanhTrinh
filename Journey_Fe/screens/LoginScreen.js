// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Xử lý logic đăng nhập tại đây
    console.log('Login:', email, password);
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
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
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
