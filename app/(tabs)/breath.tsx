import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function BreathScreen() {
  const [phase, setPhase] = useState('Вдих');
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    const animateBreath = () => {
      // Цикл Квадратного дихання (4-4-4-4)
      Animated.sequence([
        // Вдих
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // Затримка
        Animated.delay(4000),
        // Видих
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // Затримка
        Animated.delay(4000),
      ]).start(() => animateBreath());
    };

    animateBreath();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale: scaleValue }] }]}>
        <View style={styles.innerCircle} />
      </Animated.View>
      <Text style={styles.phaseText}>{phase}</Text>
      <Text style={styles.instruction}>Тримай ритм спокою</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  circle: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)' },
  phaseText: { color: '#fff', fontSize: 24, marginTop: 50, fontWeight: '200', letterSpacing: 2 },
  instruction: { color: '#555', marginTop: 10, fontSize: 14 },
});