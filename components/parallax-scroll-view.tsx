import type { PropsWithChildren, ReactElement } from 'react';
import { useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  
  // Використовуємо стандартний Animated.Value для відстеження скролу
  const scrollY = useRef(new Animated.Value(0)).current;

  // Створюємо інтерполяції для паралакс-ефекту
  const headerTranslate = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [2, 1, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.ScrollView
        // Прив'язуємо скрол до нашої змінної scrollY
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
           { useNativeDriver: Platform.OS !== 'web' } // ВИМКНЕНО ДЛЯ ВЕБУ
        )}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.header,
            { 
              backgroundColor: headerBackgroundColor[colorScheme],
              transform: [
                { translateY: headerTranslate },
                { scale: headerScale }
              ]
            },
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});