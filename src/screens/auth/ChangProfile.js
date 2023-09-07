import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import imagetop from '../../../assets/login1.png'
import penimage from '../../../assets/pen.png'
import user_profile from '../../../assets/user_profile.png'
import changepassword from '../../../assets/changpassword.png'
import imagechangeprofile from '../../../assets/changeProfile.png'
import imageLogout from '../../../assets/imagelogout.png'
import imageHome from '../../../assets/imghome.png'
import { TextInput } from 'react-native-element-textinput';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shareVarible from './../../AppContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
const ChangProfile = ({ navigation, route }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const CustomAlert = ({ isVisible, message, onConfirm }) => {
    return (
      <Modal isVisible={isVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>{message}</Text>
          </View>
        </View>
      </Modal>
    );
  };
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false);
        navigation.navigate('Profile', { data: route.params.dataAPI });
      }, 1000); 
    }
  }, [isVisible, navigation]);
  const showCustomAlert = (message) => {
    setErrorMsg(message);
    setIsVisible(true);
  };

  const handleConfirm = () => {
    setIsVisible(false);
  };
  const getDetails = (type) => {
    if (route.params.dataAPI) {
      switch (type) {
        case "id":
          return route.params.dataAPI._id
        case "email":
          return route.params.dataAPI.email
        case "role":
          return route.params.dataAPI.role
        case "keycode":
          return route.params.dataAPI.keycode
        case "name":
          return route.params.dataAPI.name
        case "phone":
          return route.params.dataAPI.phone
        case "image":
          return route.params.dataAPI.image
        case "birthday":
          return route.params.dataAPI.birthday
        case "password":
          return route.params.dataAPI.password
      }
    }
    return ""
  }
  const [fdata, setFdata] = useState({
    id: getDetails("id"),
    email: getDetails("email"),
    name: getDetails("name"),
    phone: getDetails("phone"),
    birthday: getDetails("birthday"),
    image: getDetails("image"),
    keycode: getDetails("keycode"),
    role: getDetails("role"),
    password: getDetails("password")
  })


  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    const dateStr = currentDate.toISOString().substring(0, 10);
    setFdata({ ...fdata, birthday: dateStr })

  };
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const showDatepicker = () => {
    setShow(true);
  };

  //changeprofile
  const [ipemail, SetIpEmail] = useState(null);
  const SentoBackend = async () => {
    if (fdata.name == "") {
      alert('Khong duoc bo trong name')
      return;
    }
    if (fdata.phone.length != 0) {
      for (const item of fdata.phone) {
        if (item != '0' && item != '1' && item != '2' && item != '3' && item != '4' && item != '5' && item != '6' && item != '7' && item != '8' && item != '9' || (fdata.phone.length < 9 || fdata.phone.length > 11)) {
          alert('Khong duoc bo trong phone')
          return;
        }
      }
    }
    const updates = {
      name: fdata.name,
      email: fdata.email,
      phone: fdata.phone,
      password: fdata.password,
      keycode: fdata.keycode,
      role: fdata.role,
      image: fdata.image,
      birthday: fdata.birthday
    };
    const response = await fetch(shareVarible.URLink + '/user/update/' + `${fdata.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }).then(res => res.json()).then(
      data => {
        if (data.error) {
          setErrormgs(data.error);
          alert(data.error);
        }
        else {
          showCustomAlert('Login successfully');
        }
      }
    )
  }
  //upload image from drive to cloudinary 
  const handleUpload = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'restaurant')
    data.append("cloud_name", "dmsgfvp0y")
    fetch("https://api.cloudinary.com/v1_1/dmsgfvp0y/upload", {
      method: "post",
      body: data
    }).then(res => res.json()).
      then(data => {
        setImage(data.secure_url)
        setFdata({ ...fdata, image: data.secure_url })
      }).catch(err => {
        Alert.alert("An Error Occured While Uploading")
        console.log(err)
      })
  }
  //take image from libary
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      let newfile = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".")[1]}`,
        name: `test.${result.assets[0].uri.split(".")[1]}`
      }
      handleUpload(newfile)
      setImage(result.assets[0].uri);
    }
    else {
      setImage(null);
    }
  };
  return (
    <View style={styles.V1}>
       <CustomAlert
        isVisible={isVisible}
        message={errorMsg}
        onConfirm={handleConfirm}
      />
      <TouchableOpacity onPress={pickImage} style={{ zIndex: 1 }}>
        {
          fdata.image == "" ?
            <Image
              style={{
                position: 'absolute',
                height: 150,
                width: 150,
                zIndex: 1,
                backgroundColor: 'gray',
                marginLeft: 120,
                borderRadius: 100,
                marginTop: 40
              }}
              source={user_profile}
            /> :
            <Image
              style={{
                position: 'absolute',
                height: 150,
                width: 150,
                zIndex: 1,
                backgroundColor: 'gray',
                marginLeft: 120,
                borderRadius: 100,
                marginTop: 40
              }}
              source={{ uri: fdata.image }}
            />
        }
      </TouchableOpacity>

      <View style={styles.V11}>
        <Image
          style={{
            marginLeft: -90,
            marginTop: -70
          }}
          source={imagetop}
        />
      </View>

      <View style={styles.V12}>
        <View style={{
          alignItems: 'center'
        }}>
          <Text style={styles.stextname}>
          </Text>
        </View>
        <Text style={styles.slableemail}>Name</Text>
        <TextInput
          onChangeText={(text) => setFdata({ ...fdata, name: text })}
          value={fdata.name}
          style={styles.stextemail}>

        </TextInput>
        <Text style={styles.slableemail}>Phone</Text>
        <TextInput style={styles.stextemail}
          onChangeText={(text) => setFdata({ ...fdata, phone: text })}
          value={fdata.phone}>
        </TextInput>
        <Text style={styles.slableemail}>Birthday</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textBirtday}>
            {fdata.birthday}
          </Text>
          <Ionicons
            onPress={showDatepicker}
            name='calendar-sharp' size={52} style={{ marginLeft: 30 }}
          />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}

            />
          )}

        </View>

        <TouchableOpacity
          onPress={() => SentoBackend()}
          style={{
            zIndex: 1,
            marginTop: 150,
          }}>
          <View
            style={{
              flexDirection: 'row',

              borderWidth: 3,
              borderRadius: 30,
              justifyContent: 'center',
              width: '80%',
              marginLeft: 35,
              backgroundColor: 'white',

            }}
          >
            <Text style={styles.styleChangPassword}>
              ChangeProfile
            </Text>
            <Image
              style={styles.ImagePassword}
              source={imagechangeprofile}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { data: route.params.dataAPI })}
          style={{
            zIndex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              borderWidth: 3,
              borderRadius: 30,
              justifyContent: 'center',
              width: '80%',
              marginLeft: 35,
              backgroundColor: '#fff'
            }}
          >

            <Image
              style={styles.ImagePassword}
              source={imageLogout}
            />
          </View>

        </TouchableOpacity>
      </View>
    </View>
  )
}
export default ChangProfile
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  v1: {
    height: '100%',
    width: '100%',
  },
  V11: {
    height: '15%',
    width: '100%',
    backgroundColor: '#EDF6D8'
  },
  V12: {
    height: '85%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  stextname: {
    height: 50,
    width: "100%",
    marginTop: 25,
    fontSize: 27,
    textAlign: 'center',
    marginLeft: -30
  },
  slableemail: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5
  },
  stextemail: {
    height: 50,
    width: "80%",
    marginLeft: 35,
    borderWidth: 3,
    borderRadius: 20,
    textAlignVertical: 'center',
    paddingLeft: 10
  },
  textBirtday: {
    height: 50,
    width: "60%",
    marginLeft: 35,
    borderWidth: 3,
    borderRadius: 20,
    textAlignVertical: 'center',
    paddingLeft: 10
  },
  styleChangPassword: {
    height: 50,
    width: "80%",
    textAlignVertical: 'center',
    paddingLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black'
  },
  ImagePassword: {
    height: 50,
    width: 50,
    borderRadius: 40,

  },
  styleLogout: {
    height: 50,
    width: "80%",
    textAlignVertical: 'center',
    paddingLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
  }

})