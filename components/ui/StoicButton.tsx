import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, SPACING, STOIC_STYLE } from '../../constants/theme';

export const StoicButton = ({ title, onPress, style }: any) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.button, style]}>
    <Text style={styles.text}>{title.toUpperCase()}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: STOIC_STYLE.borderRadius.xl,
    alignItems: 'center',
  },
  text: {
    color: Colors.dark.text,
    fontSize: 10,
    letterSpacing: STOIC_STYLE.letterSpacing.wide,
    fontWeight: 'bold',
  },
});