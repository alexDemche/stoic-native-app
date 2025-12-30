// components/ui/StoicFlowLoader.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { Colors, SPACING, STOIC_STYLE } from '../../constants/theme';
import { StoicButton } from './StoicButton';
import { StoicLoader } from './StoicLoader'; // Наш попередній візуал з крапкою

interface Props {
  isReady: boolean;
  onStart: () => void;
}

export const StoicFlowLoader = ({ isReady, onStart }: Props) => {
  // Анімація для плавного переходу контенту
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (isReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        })
      ]).start();
    }
  }, [isReady]);

  return (
    <View style={styles.container}>
      {/* 1. Наш візуальний StoicLoader (крапка та кільце) */}
      <View style={styles.visualSection}>
        <StoicLoader label="" /> 
      </View>

      {/* 2. Текстовий блок із перемиканням */}
      <View style={styles.textSection}>
        {!isReady ? (
          <Text style={styles.loadingText}>ЗАВАНТАЖЕННЯ</Text>
        ) : (
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }],
            alignItems: 'center' 
          }}>
            <Text style={styles.readyText}>ПРИГОТУЙСЯ</Text>
            
            <StoicButton 
              title="Увійти в потік" 
              onPress={onStart} 
              style={styles.button}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  visualSection: {
    height: 200,
    justifyContent: 'center',
  },
  textSection: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 14,
    letterSpacing: STOIC_STYLE.letterSpacing.ultra,
    opacity: 0.5,
    fontWeight: '300',
  },
  readyText: {
    color: Colors.dark.text,
    fontSize: 22,
    letterSpacing: STOIC_STYLE.letterSpacing.ultra,
    fontWeight: '300',
    marginBottom: 40,
  },
  button: {
    width: 260, // Фіксована ширина як на скриншоті
  }
});