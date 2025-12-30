import { BREATH_FLOWS } from '@/constants/Flows';
import { Colors, SPACING } from '@/constants/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onSelect: (flow: any, duration: number) => void;
}

export const FlowSelectionScreen = ({ onSelect }: Props) => {
  const [selectedTime, setSelectedTime] = useState(300); // 5 хв за замовчуванням
  const timeOptions = [
    { label: '1 хв', value: 60 },
    { label: '3 хв', value: 180 },
    { label: '5 хв', value: 300 },
    { label: '10 хв', value: 600 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Верхній тег */}
      <View style={styles.badgeWrapper}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>КВАДРАТНЕ ДИХАННЯ • 4-4-4-4</Text>
        </View>
      </View>

      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Обері свій <Text style={styles.titleItalic}>потік</Text>
        </Text>
        <Text style={styles.subtitle}>Синхронізуй дихання та розум</Text>
      </View>

      {/* Селектор часу */}
      <View style={styles.timeSelector}>
        {timeOptions.map((opt) => (
          <TouchableOpacity 
            key={opt.value}
            style={[styles.timeBtn, selectedTime === opt.value && styles.timeBtnActive]}
            onPress={() => setSelectedTime(opt.value)}
          >
            <Text style={[styles.timeBtnText, selectedTime === opt.value && styles.timeBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Список карток потоків */}
      <View style={styles.flowList}>
        {BREATH_FLOWS.map((flow) => (
          <TouchableOpacity 
            key={flow.id} 
            style={[styles.flowCard, { backgroundColor: flow.color }]}
            onPress={() => onSelect(flow, selectedTime)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
               <View style={styles.cardIconBox}>
                 <Text style={{fontSize: 20}}>{flow.icon}</Text>
               </View>
               <View style={styles.affBadge}>
                  <Text style={styles.affText}>{flow.affirmations} АФІРМАЦІЙ</Text>
               </View>
            </View>
            <View>
              <Text style={styles.flowSub}>{flow.sub}</Text>
              <Text style={styles.flowTitle}>{flow.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content: { 
    padding: SPACING.lg, 
    paddingTop: 100, // Збільшили відступ, щоб кнопка "Назад" не накладалася
  },
  badgeWrapper: { 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 10, // Додатковий відступ для баджа
  },
  badge: { 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    paddingHorizontal: 16, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  badgeText: { color: 'rgba(255,255,255,0.3)', fontSize: 8, letterSpacing: 2, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { color: '#fff', fontSize: 32, fontWeight: '300' },
  titleItalic: { fontStyle: 'italic', fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 },
  
  timeSelector: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 25, 
    padding: 4, 
    marginBottom: 30 
  },
  timeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 22 },
  timeBtnActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  timeBtnText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '700' },
  timeBtnTextActive: { color: '#fff' },

  flowList: { gap: 16 },
  flowCard: { 
    height: 180, 
    borderRadius: 32, 
    padding: 24, 
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIconBox: { 
    width: 48, height: 48, borderRadius: 16, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  affBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  affText: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '700' },
  flowSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  flowTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' }
});