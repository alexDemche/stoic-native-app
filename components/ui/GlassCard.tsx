import { StyleSheet, View } from 'react-native';
import { SPACING, STOIC_STYLE } from '../../constants/theme';

export const GlassCard = ({ children }: any) => (
  <View style={styles.card}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)', // Дуже легке скло
    borderRadius: STOIC_STYLE.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: SPACING.lg,
    width: '100%',
  }
});