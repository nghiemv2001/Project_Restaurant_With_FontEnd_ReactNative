import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import shareVarible from './../../AppContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons'
const Bill = ({ navigation, route }) => {
  const [dataipa, SetDataApi] = useState([]);
  const [data, setData] = useState(null);
  const idtable = route.params.data.item._id
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  var total = 0;
  
  if (dataipa.length !== 0) {
    console.log("chay vo roi")
    console.log(dataipa)
    // total = dataipa.danh_sach_mon_an.reduce((acc, danh_sach_mon_an) => {
    //   return acc + danh_sach_mon_an.gia;
    // }, 0);
  }




  //get data 1 bill 
  const fetchData = () => {
    fetch(shareVarible.URLink + '/bill/' + `${idtable}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => SetDataApi(data),
      )
      .catch(error => console.log(error));
  };
  //Render Faglist
  const renderlist = ((item) => {
    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#EDF6D8'
      }}>
        <View style={{
          marginLeft: 10,
          flexDirection: 'row',
          height: 105,
          width: '100%',
          padding: 5
        }}>
          <Image style={{
            width: '30%',
            borderRadius: 10
          }}
            source={{ uri: item.hinh_mon }}
          /><View
            style={{
              flexDirection: 'column',
              marginLeft: 10,
              borderWidth: 1,
              borderRadius: 10
            }}
          >
            <Text style={{
              width: '45%',
              height: 50,
              paddingLeft: 10,
              fontSize: 23,
              textAlignVertical: 'center',

            }}>{item.ten_mon}</Text>
            <View style={{
              flexDirection: 'row'
            }}>

              <Text
                style={{
                  width: '25%',
                  fontSize: 18,
                  textAlignVertical: 'center',
                  marginLeft: 10
                }}
              >{item.gia} $</Text>
              <Text
                style={{
                  width: '20%',
                  fontSize: 18,
                  textAlignVertical: 'center',

                }}
              >x {item.so_luong}</Text>
              <Text
                style={{
                  width: '50%',
                  fontSize: 18,
                  textAlignVertical: 'center',

                }}
              >=   {item.gia * item.so_luong} $</Text>
            </View>
          </View>
        </View>
      </View>
    )
  })
  return (
    <SafeAreaView style={{
      height: '100%',
      width: '100%',
      backgroundColor: '#EDF6D8'
    }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 10
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10, }}
          onPress={() => navigation.navigate('HomeWaitress')}
        >
          <Ionicons name='arrow-back-sharp' size={35} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 10, }}
          onPress={() => navigation.navigate('ListCategory', { route })}
        >
          <Ionicons name='add' size={40} />
        </TouchableOpacity>
      </View>

      {
        (dataipa !== null && typeof dataipa === 'object') ?
          <SwipeListView
            data={dataipa.danh_sach_mon_an}
            renderItem={({ item }) => {
              return renderlist(item)
            }}
            renderHiddenItem={(dataipa, rowMap) => (
              <View style={{
                flexDirection: 'row',
                height: 135,
                width: 200,
                marginLeft: 211,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#808080',
                margin: 5
              }}>
                <TouchableOpacity
                >
                  <Ionicons style={{
                    marginBottom: 40,
                    marginLeft: 100,

                  }} name='trash-bin' size={45} />
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={0}
            rightOpenValue={-100}
            keyExtractor={item => item._id}
          />
          :
          <Text style={{
          }}>Chưa có bất kì món ăn nào</Text>
      }
      <View style={{
        height: 150,
        width: "100%",
        borderWidth: 1,
        padding: 5,
        marginLeft: 15,
        marginTop: 5,
        borderTopLeftRadius: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor:'white'
      }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold'
          }}
        >{total}.00$</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop : 10
          }}
        >
          <Ionicons name='card' size={50} />
          <Text
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              marginLeft: 100
            }}
          >$</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Bill