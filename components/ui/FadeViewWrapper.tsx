import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  duration?: number;
}

export const FadeViewWrapper = ({ children, duration = 500 }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Скидаємо значення перед початком, якщо контент змінився
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true, // Використовуємо нативний драйвер для плавності
    }).start();
  }, [children]); // Спрацьовує щоразу, коли змінюється внутрішній контент

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});