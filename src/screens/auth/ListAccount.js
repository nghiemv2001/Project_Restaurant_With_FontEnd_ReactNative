import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import shareVarible from './../../AppContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector, useDispatch } from 'react-redux';
const ListAccount = () => {
  const [dataUser, SetDataUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [idUser, setIdUser] = useState(null)
  const users = useSelector(state => state.userReducer.users)
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch({ type: "GET_USER" });
      fetchData()
    }, [])
  )
  // //test data 
  const fetchData = () => {
    fetch(shareVarible.URLink + '/users/ ', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        SetDataUser(data)
      },
      )
      .catch(error => console.log(error));
  };
  const DeteleUser = () => {
    fetch(shareVarible.URLink + '/user/delete/' + `${idUser}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setAlertSuccess(true)
        fetchData()
      })
      .catch(error => {
        console.error('Lỗi xóa đối tượng:', error);
      }
      )
  }
  const renderlist = ((item) => {
    return (
      <View style={{ backgroundColor: 'black' }}>
        {
          item.role === '0' ? null : <View style={{ marginBottom: 3, backgroundColor: '#EDF6D8', paddingVertical: 5, paddingRight: 20, paddingLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ height: 70, width: 70, borderRadius: 50 }}
              source={{ uri: item.image }} />
            <View style={{ flexDirection: 'column', paddingLeft: 5, width: '68%' }}>
              <Text style={{ fontSize: 18, }}>Name : {item.name}</Text>
              <Text style={{ fontSize: 18 }}>Email : {item.email}</Text>
              <Text style={{ fontSize: 18 }}>Phone : {item.phone}</Text>
              {item.role == 1 ? (
                <Text style={{ fontSize: 18 }}>Role: Waitress</Text>
              ) : item.role == 2 ? (
                <Text style={{ fontSize: 18 }}>Role: Chef</Text>
              ) : (
                <Text style={{ fontSize: 18 }}>Role: Unknown</Text>
              )}
            </View>
            <View style={{ justifyContent: 'center', paddingLeft: 30 }}>
            </View>
            <TouchableOpacity
              style={{ marginRight: 40 }}
              onPress={() => {
                setIdUser(item._id)
                setConfirmDelete(true)
              }}>
              <Ionicons name='remove-circle-sharp' size={35} />
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  })
  return (
    <View style={{ height: '100%', backgroundColor: '#EDF6D8', paddingTop: 40 }}>
      <Modal
        transparent={true}
        visible={alertSuccess}
        animationType='fade'
      >
        <View style={styles.centeredView}>
          <View style={{
            height: 300,
            width: 300,
            backgroundColor: "white",
            borderRadius: 40,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>

            <View style={{ height: 100, width: 100, backgroundColor: '#2D60D6', borderRadius: 70, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='checkmark-done-circle-outline' size={60} color={"#FFFCFF"} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: '#3564C1' }}>
              Success
            </Text>
            <TouchableOpacity
              onPress={() => { setAlertSuccess(false) }}
              style={{ height: 40, width: 140, backgroundColor: '#3564C1', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: '#FFFCFF' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={confirmDelete}
        animationType='fade'
      >
        <View style={styles.centeredView}>
          <View style={{
            height: 70,
            width: 300,
            backgroundColor: "#FDD736",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Ionicons name='help' size={70} color="white" style={{ marginTop: 3, position: 'absolute' }} />
            <Ionicons name='cloudy-outline' size={30} color="white" style={{ marginRight: 140 }} />
            <Ionicons name='cloudy-outline' size={30} color="white" style={{ marginLeft: 140 }} />
          </View>
          <View style={{
            height: 150,
            width: 300,
            backgroundColor: "white",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 22, fontWeight: '900', marginTop: -10 }}>Delete User</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', height: '40%', alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => { setConfirmDelete(false) }}
                style={[styles.styButton, { backgroundColor: '#D85261' }]}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmDelete(false)
                  DeteleUser()
                }}
                style={[styles.styButton, { backgroundColor: '#038857' }]}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View >
        <FlatList
          style={{ backgroundColor: 'black' }}
          data={ users}
          renderItem={({ item }) => {
            return renderlist(item)
          }}
          keyExtractor={item => item._id}

        />
      </View>


    </View>
  )
}

export default ListAccount
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  styButton: {
    height: 45, width: 100,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})