import { SLEEP_WORDS } from '@/constants/SleepWords';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export const SleepScreen = ({ onBack }: { onBack: () => void }) => {
  const [index, setIndex] = useState(0);
  const [isBgMuted, setIsBgMuted] = useState(false);
  const [isSpeechMuted, setIsSpeechMuted] = useState(false);
  
  const fade = useRef(new Animated.Value(1)).current;
  const bgSound = useRef<Audio.Sound | null>(null);

  const speakWord = (wordIndex: number) => {
    if (!isSpeechMuted) {
      Speech.stop();
      Speech.speak(SLEEP_WORDS[wordIndex].word, {
        language: 'uk-UA',
        pitch: 0.75,
        rate: 0.75,
      });
    }
  };

  useEffect(() => {
    async function setupBgSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/rain.mp3'),
          { 
            shouldPlay: !isBgMuted, 
            isLooping: true, 
            volume: 0.02 // Відразу ставимо дуже низьку гучність
          }
        );
        bgSound.current = sound;
      } catch (e) { 
        console.log("Sound error", e); 
      }
    }
    setupBgSound();

    const initialSpeechTimeout = setTimeout(() => speakWord(0), 1000);

    return () => {
      if (bgSound.current) bgSound.current.unloadAsync();
      clearTimeout(initialSpeechTimeout);
      Speech.stop();
    };
  }, []);

  // Керування Mute для фону
  useEffect(() => {
    if (bgSound.current) {
      bgSound.current.setIsMutedAsync(isBgMuted);
    }
  }, [isBgMuted]);

  // Логіка зміни слів
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 1500, useNativeDriver: true }).start();
      
      setTimeout(() => {
        const nextIndex = Math.floor(Math.random() * SLEEP_WORDS.length);
        setIndex(nextIndex);
        speakWord(nextIndex);
        Animated.timing(fade, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
      }, 1500);
    }, 7000);

    return () => clearInterval(interval);
  }, [isSpeechMuted]);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        {/* Кнопка НАЗАД */}
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.controls}>
          {/* Кнопка фонового звуку */}
          <TouchableOpacity onPress={() => setIsBgMuted(!isBgMuted)} style={styles.muteBtn}>
            <Ionicons 
              name={isBgMuted ? "musical-notes-outline" : "musical-notes"} 
              size={20} 
              color={isBgMuted ? "rgba(255,255,255,0.2)" : "#FFF"} 
            />
          </TouchableOpacity>
          
          {/* Кнопка озвучки слів */}
          <TouchableOpacity onPress={() => setIsSpeechMuted(!isSpeechMuted)} style={styles.muteBtn}>
            <Ionicons 
              name={isSpeechMuted ? "volume-off-outline" : "volume-high-outline"} 
              size={20} 
              color={isSpeechMuted ? "rgba(255,255,255,0.2)" : "#FFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Text style={styles.icon}>{SLEEP_WORDS[index].icon}</Text>
        <Text style={styles.word}>{SLEEP_WORDS[index].word.toUpperCase()}</Text>
      </Animated.View>

      <Text style={styles.hint}>ПРОСТО УЯВЛЯЙ ЦЕЙ ОБ'ЄКТ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controls: { 
    flexDirection: 'row', 
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  muteBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', width: '100%' },
  icon: { fontSize: 90, marginBottom: 30, opacity: 0.7 },
  word: { 
    color: '#FFF', 
    fontSize: 26, 
    letterSpacing: 12, 
    fontWeight: '200',
    textAlign: 'center' 
  },
  hint: { 
    position: 'absolute', 
    bottom: 60, 
    color: 'rgba(255,255,255,0.15)', 
    fontSize: 10, 
    letterSpacing: 5 
  }
});