import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserStatsContainer } from '../../components/containers/UserStatsContainer';
import { Colors, SPACING, STOIC_STYLE } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>STOIC HUB</Text>
        <Text style={styles.subLogo}>NATIVE ALPHA</Text>
      </View>
      
      <UserStatsContainer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, padding: SPACING.lg },
  header: { marginTop: 60, alignItems: 'center', marginBottom: 40 },
  logo: { color: Colors.dark.text, fontSize: 22, letterSpacing: STOIC_STYLE.letterSpacing.ultra, fontWeight: '200' },
  subLogo: { color: Colors.dark.tint, fontSize: 10, letterSpacing: 4, marginTop: 8 }
});