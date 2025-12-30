import { BODY_RELAX_STEPS } from '@/constants/BodyRelaxSteps';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export const BodyRelaxFlow = ({ onBack }: { onBack: () => void }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BODY_RELAX_STEPS[0].duration);
  const currentStep = BODY_RELAX_STEPS[stepIndex];

  const circleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Speech.stop();
    Speech.speak(`${currentStep.part}. ${currentStep.action}`, {
      language: 'uk-UA',
      pitch: 0.8,
      rate: 0.85,
    });

    if (currentStep.isTense) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Animated.spring(circleScale, { toValue: 1.15, useNativeDriver: true }).start();
    } else {
      Animated.spring(circleScale, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [stepIndex]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (stepIndex < BODY_RELAX_STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
        setTimeLeft(BODY_RELAX_STEPS[stepIndex + 1].duration);
      } else {
        onBack();
      }
    }
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      {/* HEADER: Тепер тільки кнопка НАЗАД зліва */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Animated.View style={[
          styles.mainCircle,
          { 
            transform: [{ scale: circleScale }],
            borderColor: currentStep.isTense ? '#FFF' : 'rgba(255,255,255,0.2)',
            backgroundColor: currentStep.isTense ? 'rgba(255,255,255,0.05)' : 'transparent'
          }
        ]}>
          <Text style={styles.partLabel}>{currentStep.part.toUpperCase()}</Text>
          <Text style={styles.timerLabel}>{timeLeft}</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={[
            styles.actionText, 
            { color: currentStep.isTense ? '#FFF' : 'rgba(255,255,255,0.6)' }
          ]}>
            {currentStep.action}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${((stepIndex + 1) / BODY_RELAX_STEPS.length) * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
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
  centerContent: { alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  mainCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  partLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 5, marginBottom: 5 },
  timerLabel: { color: '#FFF', fontSize: 64, fontWeight: '200' },
  textContainer: { height: 120, justifyContent: 'center' },
  actionText: { 
    fontSize: 22, 
    textAlign: 'center', 
    lineHeight: 32, 
    fontWeight: '300',
    fontStyle: 'italic'
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
  }
});