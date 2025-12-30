import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, SPACING, STOIC_STYLE } from '../constants/theme';

export const StatCard = ({ label, value, icon }: any) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{icon} {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.glass,
    padding: SPACING.md,
    borderRadius: STOIC_STYLE.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    flex: 1,
  },
  label: { color: Colors.dark.tint, fontSize: 10, letterSpacing: 1, marginBottom: 5 },
  value: { color: Colors.dark.text, fontSize: 18, fontWeight: '500' },
});