import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { NAME_APP } from '../constants/NameApp';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.brandLink}>
            <Text style={styles.brandText}>{NAME_APP}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.links}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                onPress={() => router.push('/CreateSmashPage')}
                style={styles.link}
              >
                <FaUser style={styles.icon} />
                <Text style={styles.linkText}>Créer Smasher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/ConnectedUsersPage')}
                style={styles.link}
              >
                <FaUser style={styles.icon} />
                <Text style={styles.linkText}>Utilisateurs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/ProfilePage')}
                style={styles.link}
              >
                <Image
                  source={{ uri: 'https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg' }}
                  alt="Profile"
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.link, styles.logout]}
              >
                <FaSignOutAlt style={styles.icon} />
                <Text style={styles.linkText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => router.push('/LoginPage')}
                style={styles.link}
              >
                <FaSignInAlt style={styles.icon} />
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/RegisterPage')}
                style={styles.link}
              >
                <FaUserPlus style={styles.icon} />
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'black',
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  linkText: {
    color: 'gray',
    marginLeft: 5,
  },
  icon: {
    color: 'gray',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logout: {
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});