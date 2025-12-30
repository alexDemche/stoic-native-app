import { AFFIRMATIONS } from '@/constants/Affirmations';
import { MOOD_IMAGES } from '@/constants/ImageAssets';
import { SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  mood: any;
  onBack: () => void; // Змінено назву для ясності
}

const PHASES = ['ВДИХ', 'ЗАТРИМКА', 'ВИДИХ', 'ЗАТРИМКА'];
const PHASE_DURATION = 4000;

export const BreathFlow = ({ mood, onBack }: Props) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timer, setTimer] = useState(mood?.duration || 300);
  const [currentAff, setCurrentAff] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const activeAffirmations = AFFIRMATIONS[mood?.id || 'calm'];
  const moodImages = MOOD_IMAGES[mood?.id] || MOOD_IMAGES.calm;

  const circleScale = useRef(new Animated.Value(1)).current;
  const affOpacity = useRef(new Animated.Value(1)).current;
  const bgOpacity = useRef(new Animated.Value(0.4)).current;
  const sound = useRef<Audio.Sound | null>(null);

  // Використовуємо ref для відстеження самого першого входу
  const skipFirstChange = useRef(true);

  async function playGong() {
    if (isMuted) return;
    try {
      if (sound.current) await sound.current.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/gong.mp3')
      );
      sound.current = newSound;
      await newSound.playAsync();
    } catch (e) { console.log("Sound error", e); }
  }

  useEffect(() => {
    // 1. Анімація кола (працює завжди)
    const nextScale = (phaseIndex === 0 || phaseIndex === 1) ? 1.5 : 1;
    Animated.timing(circleScale, {
      toValue: nextScale,
      duration: PHASE_DURATION,
      useNativeDriver: true,
    }).start();

    // --- ЛОГІКА ВІБРАЦІЇ ---
    const triggerHaptic = async () => {
      if (Platform.OS === 'web') return; // Веб не підтримує складну хаптіку

      if (phaseIndex === 0) {
        // Сильніший відгук на початок циклу
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Легкий "тік" на зміну фази
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };
    triggerHaptic();
    // -----------------------

    // 2. ЛОГІКА ЗМІНИ ФОНУ ТА АФІРМАЦІЇ
    if (phaseIndex === 0) {
      playGong();

      // ЯКЩО ЦЕ НЕ ПЕРШИЙ ЗАПУСК - робимо анімацію зміни
      if (!skipFirstChange.current) {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(affOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(affOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(bgOpacity, { toValue: 0.1, duration: 800, useNativeDriver: true }),
            Animated.timing(bgOpacity, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
          ])
        ]).start();

        setTimeout(() => {
          setCurrentImageIndex(prev => (prev + 1) % moodImages.length);
          setCurrentAff(prev => (prev + 1) % activeAffirmations.length);
        }, 800);
      } else {
        // Якщо це перший запуск - просто скидаємо прапорець для наступного разу
        skipFirstChange.current = false;
      }
    }

    const timeout = setTimeout(() => setPhaseIndex((prev) => (prev + 1) % 4), PHASE_DURATION);
    return () => clearTimeout(timeout);
  }, [phaseIndex]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((p: number) => (p > 0 ? p - 1 : 0)), 1000);
    if (timer === 0) onBack();
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <View style={styles.container}>
      {/* ФОН: Видалили key, щоб не було скачка при перерендері */}
      <Animated.Image 
        source={moodImages[currentImageIndex]} 
        style={[styles.backgroundImage, { opacity: bgOpacity }]}
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.timerText}>
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </Text>
        
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.iconButton}>
          <Ionicons name={isMuted ? "volume-mute-outline" : "volume-medium-outline"} size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* CIRCLE */}
      <View style={styles.centerSection}>
        <Animated.View style={[
          styles.breathCircle, 
          { 
            transform: [{ scale: circleScale }],
            borderColor: mood?.color || 'rgba(255,255,255,0.3)',
            backgroundColor: mood?.color ? `${mood.color}20` : 'rgba(255,255,255,0.1)'
          }
        ]}>
          <Text style={styles.phaseText}>{PHASES[phaseIndex]}</Text>
        </Animated.View>
      </View>

      {/* AFFIRMATION */}
      <View style={styles.affirmationSection}>
        <Animated.Text style={[styles.affirmationText, { opacity: affOpacity }]}>
          {activeAffirmations[currentAff]}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { 
    position: 'absolute',
    width: width,
    height: height,
    zIndex: -1 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 0 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    letterSpacing: 4,
    fontWeight: '300',
  },
  centerSection: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  breathCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: { color: '#fff', fontSize: 13, letterSpacing: 6, fontWeight: '400' },
  affirmationSection: {
    paddingBottom: 110,
    paddingHorizontal: 40,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  affirmationText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 34,
    fontStyle: 'italic',
  }
});