import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, SPACING, STOIC_STYLE } from '../../constants/theme';

interface PracticeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

export const PracticeCard = ({ title, subtitle, icon, onPress }: PracticeCardProps) => (
  <TouchableOpacity 
    activeOpacity={0.7} 
    onPress={onPress} 
    style={styles.card}
  >
    <View style={styles.iconWrapper}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: STOIC_STYLE.borderRadius.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    width: '100%',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 4,
  },
});