import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TailwindProvider } from 'tailwindcss-react-native';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Navbar from '@/components/Navbar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <TailwindProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={styles.container}>
            <Navbar />
            <View style={styles.content}>
              <Stack />
            </View>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TailwindProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});