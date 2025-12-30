import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { Colors, STOIC_STYLE } from '../../constants/theme';

interface StoicLoaderProps {
  label?: string;
}

export const StoicLoader = ({ label = "ЗАВАНТАЖЕННЯ" }: StoicLoaderProps) => {
  // Анімаційне значення для пульсації (від 0 до 1)
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Створюємо нескінченний цикл пульсації
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  // Інтерполяція масштабу для "туману" (від 1 до 1.4)
  const scaleGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  // Інтерполяція прозорості (від 0.1 до 0.3)
  const opacityGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <View style={styles.container}>
      <View style={styles.visualWrapper}>
        
        {/* ШАР 1: Пульсуюче м'яке світиння (імітація blur-3xl) */}
        <Animated.View 
          style={[
            styles.blurGlow, 
            { transform: [{ scale: scaleGlow }], opacity: opacityGlow }
          ]} 
        />

        {/* ШАР 2: Тонке зовнішнє кільце */}
        <View style={styles.outerRing}>
          {/* ШАР 3: Центральна чітка точка з власним легким світінням */}
          <View style={styles.centerPoint} />
        </View>

      </View>

      {/* ТЕКСТ: З великим трекінгом як на скриншоті */}
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualWrapper: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  blurGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    // На iOS shadow створює ідеальний ефект блюру
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
      },
      web: {
        filter: 'blur(20px)',
      }
    }),
  },
  outerRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)', // white/15
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    // Сяйво самої точки
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '300',
    // Використовуємо твій ultra-трекінг (6)
    letterSpacing: STOIC_STYLE.letterSpacing.ultra,
    textAlign: 'center',
    opacity: 0.7,
  },
});