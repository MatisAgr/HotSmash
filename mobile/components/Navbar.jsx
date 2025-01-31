import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { NAME_APP } from '../constants/NameApp';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  return (
    <View className="bg-black">
      <View className="container mx-auto flex justify-between items-center">
        <View className="text-white text-lg font-bold">
          <TouchableOpacity onPress={() => navigation.navigate('Home')} className="flex items-center text-white">
            <Text>{NAME_APP}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex items-center">
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateSmash')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
              >
                <FaUser className="mr-1" />
                <Text>Créer Smasher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ConnectedUsers')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
              >
                <FaUser className="mr-1" />
                <Text>Utilisateurs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                className="text-gray-300 hover:bg-gray-700 px-3 py-3 flex items-center"
              >
                <Image
                  source={{ uri: 'https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg' }}
                  alt="Profile"
                  className="rounded-full"
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 text-white  px-5 py-5 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                <Text>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
              >
                <FaSignInAlt className="mr-1" />
                <Text>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
              >
                <FaUserPlus className="mr-1" />
                <Text>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}