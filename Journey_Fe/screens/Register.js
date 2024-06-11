import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import API, { endpoints } from "../configs/API";
import ImagePicker from "react-native-image-crop-picker";
import { KeyboardAvoidingView, ScrollView, Text, View, Image, StyleSheet, Alert, Platform, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";

const Register = () => {
  const [user, setUser] = useState({ role: "customer" }); // Initialize with role
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const fields = [
    { label: "Tên", icon: "text", name: "first_name" },
    { label: "Họ và tên lót", icon: "text", name: "last_name" },
    { label: "Tên đăng nhập", icon: "account", name: "username" },
    { label: "Email", icon: "email", name: "email" },
    { label: "Mật khẩu", icon: "eye", name: "password", secureTextEntry: true },
    { label: "Xác nhận mật khẩu", icon: "eye", name: "confirm", secureTextEntry: true }
  ];

  const updateState = (field, value) => {
    setUser(current => {
      return { ...current, [field]: value };
    });
  };

  const picker = async () => {
    try {
      const res = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });
      updateState("avatar", {
        uri: res.path,
        type: res.mime,
        name: res.path.split("/").pop(),
      });
    } catch (error) {
      Alert.alert("Error", "Unable to select image");
    }
  };

  const register = async () => {
    if (user['password'] !== user['confirm']) {
      setErr(true);
    } else {
      setErr(false);

      let form = new FormData();
      for (let key in user) {
        if (key !== 'confirm') {
          if (key === 'avatar') {
            form.append(key, {
              uri: user.avatar.uri,
              name: user.avatar.name,
              type: user.avatar.type,
            });
          } else {
            form.append(key, user[key]);
          }
        }
      }

      setLoading(true);
      try {
        let res = await API.post(endpoints['register'], form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.status === 201) {
          nav.navigate("LoginScreen");
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>ĐĂNG KÝ NGƯỜI DÙNG</Text>

          {fields.map(c => (
            <TextInput
              key={c.name}
              secureTextEntry={c.secureTextEntry}
              value={user[c.name]}
              onChangeText={t => updateState(c.name, t)}
              label={c.label}
              right={<TextInput.Icon icon={c.icon} />}
              style={styles.input}
            />
          ))}

          <HelperText type="error" visible={err}>
            Mật khẩu không khớp!
          </HelperText>

          <TouchableRipple onPress={picker} style={styles.picker}>
            <Text style={styles.pickerText}>Chọn ảnh đại diện...</Text>
          </TouchableRipple>

          {user.avatar && <Image source={{ uri: user.avatar.uri }} style={styles.avatar} />}

          <Button icon="account" loading={loading} mode="contained" onPress={register} style={styles.button}>
            ĐĂNG KÝ
          </Button>
          <TouchableOpacity onPress={() => nav.navigate("LoginScreen")}>
            <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  picker: {
    marginVertical: 10,
    alignItems: 'center',
  },
  pickerText: {
    color: '#007BFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default Register;
