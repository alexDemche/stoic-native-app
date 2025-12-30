import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Імпортуємо Audio
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react'; // Додаємо useEffect

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Налаштування глобального аудіо-режиму
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true, // Дозволяє звук, навіть якщо телефон на "беззвучному"
          staysActiveInBackground: true, // Звук не переривається, якщо згорнути додаток
          shouldDuckAndroid: true, // Приглушує інші додатки, коли грає наш
          allowsRecordingIOS: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.log("Audio Mode Error:", e);
      }
    }
    setupAudio();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}