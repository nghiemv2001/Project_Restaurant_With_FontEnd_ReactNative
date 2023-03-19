import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import mainpicture from '../../../assets/mainpicture.png'
import { buttonlogin } from '../../comon/button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import shareVarible from './../../AppContext'

const Signin = ({ navigation }) => {
  // take data 
  const [fdata, setFdata] = useState({
    email: '',
    password: ''
  })
  ///set Error 
  const [errormgs, setErrormsg] = useState(null);
  /// Call API
  const SendtoBackend = () => {
    if (fdata.email == '' || fdata.password == '') {
      setErrormsg('All filed are required');
      return;
    }
    else {
      fetch(shareVarible.URLink + '/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fdata)
        }).then(res => res.json()).then(
          data => {
            if (data.error) {
              setErrormsg(data.error);
              alert(data.error);
            }
            else {
              alert('Login successfully');
              navigation.navigate('CreateCategory');
            }
          }
        )
    }
  }

  
  //Hide or see  password
  const useTogglePasswordVisibility = () => {
    const [passwordVisibility1, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');

    const handlePasswordVisibility = () => {
      if (rightIcon === 'eye') {
        setRightIcon('eye-off');
        setPasswordVisibility(!passwordVisibility1);
      } else if (rightIcon === 'eye-off') {
        setRightIcon('eye');
        setPasswordVisibility(!passwordVisibility1);
      }
    };

    return {
      passwordVisibility1,
      rightIcon,
      handlePasswordVisibility
    };
  };
  const { passwordVisibility1, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [password, setPassword] = useState('');



  return (
    <KeyboardAwareScrollView style={styles.boss}>
      <Image style={styles.picturemain} source={mainpicture} />
      <Text style={styles.loginText}>Login</Text>
      <Text style={styles.nodetextemail}>Please enter your email</Text>
      <TextInput
        onPressIn={() => setErrormsg(null)}
        placeholder='abc123@gmail.com' style={styles.inputemail}
        onChangeText={(text) => setFdata({ ...fdata, email: text })}>
      </TextInput>
      <Text style={styles.nodetextpass}>Please enter your password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='******'
          style={styles.inputpassword}
          onChangeText={(text) => { setFdata({ ...fdata, password: text }), setPassword(text) }}
          secureTextEntry={passwordVisibility1}
          enablesReturnKeyAutomatically
        />
        <Pressable onPress={handlePasswordVisibility}>
          <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>
      <Text style={styles.textForgot}
        onPress={() => navigation.navigate('ForgotPassword')}
      >Forgot Password</Text>
      {
        errormgs ? <Text style={styles.errmessage}>
          {errormgs}</Text> : null
      }
      <TouchableOpacity
        onPress={() => SendtoBackend()}>
        <Text style={buttonlogin}
        >LOGIN</Text>
      </TouchableOpacity>
      <View style={styles.Viewbottom}>
        <Text style={styles.textnormal}>Already have an account ? </Text>
        <Text style={styles.textcontinue} onPress={() => navigation.navigate('Signup')}
        >Sign in</Text>
      </View>
    </KeyboardAwareScrollView>

  )
}

export default Signin

const styles = StyleSheet.create({
  boss: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#EDF6D8',
  },
  screenbottom: {
    width: '100%',
    height: '70%',
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loginText: {
    fontSize: 60,
    color: '#C29E11',
    fontWeight: '900',
    marginTop: -290,
    textAlign: 'center'
  },
  inputemail: {
    marginLeft: 30,
    position: 'relative',
    paddingLeft: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 340,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 18,
    fontSize: 22,
    marginRight: 0,
    borderColor: 'black',
    borderWidth: 1
  },
  nodetextemail: {
    marginLeft: 45,
    marginRight: 150,
    marginTop: 30
  },
  nodetextpass: {
    marginLeft: 45,
    marginTop: 20,
    marginRight: 120,
  },
  top: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  picturemain: {
    zIndex: -1,
    marginTop: -380,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  textForgot: {
    fontSize: 18,
    color: '#FF1616',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '400',
    marginLeft: 220,
    marginTop: 5
  },
  textcontinue: {
    fontSize: 18,
    color: '#FF1616',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '400',
    marginTop: 10

  },
  inputpassword: {
    marginLeft: 30,
    fontSize: 22,
    height: 44,
    width: 250,

  },
  textnormal: {
    fontSize: 15,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 87
  },
  Viewbottom: {
    flexDirection: 'row'
  },
  errmessage: {
    marginTop: 530,
    marginLeft: 140,
    color: 'red',
    position: 'absolute'
  },
  inputContainer: {
    backgroundColor: 'white',
    marginLeft: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#d7d7d7',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 18,
    height: 44,
    width: 340,
    justifyContent: 'space-between',
    paddingRight: 20,
  },
})