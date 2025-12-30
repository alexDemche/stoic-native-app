import { Colors, SPACING, STOIC_STYLE } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// UI Components
import { StoicFlowContainer } from '@/components/containers/StoicFlowContainer';
import { FadeViewWrapper } from '@/components/ui/FadeViewWrapper';
import { PracticeCard } from '@/components/ui/PracticeCard';

// Features
import { BreathFlow } from '@/features/breath/BreathFlow';
import { FlowSelectionScreen } from '@/features/breath/FlowSelectionScreen';
import { SleepScreen } from '@/features/sleep/SleepScreen';

export default function LabScreen() {
  const [view, setView] = useState<'selection' | 'breath_config' | 'breath_loading' | 'breath_active' | 'sleep_loading' | 'sleep_active'>('selection');
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  // Функція для повернення назад
 const handleBack = () => {
    if (view === 'breath_config' || view === 'sleep_loading') {
      setView('selection');
    } else if (view === 'breath_loading') {
      setView('breath_config');
    }
  };

  return (
    <View style={styles.mainLayout}>
      {/* Кнопка НАЗАД */}
      {(view !== 'selection' && view !== 'breath_active' && view !== 'sleep_active') && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark.textSecondary} />
          <Text style={styles.backText}>НАЗАД</Text>
        </TouchableOpacity>
      )}

      <FadeViewWrapper key={view}>
        {/* 1. ВИБІР ПРАКТИКИ */}
        {view === 'selection' && (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Stoic Lab</Text>
              <Text style={styles.subtitle}>ОБЕРИ СВІЙ ШЛЯХ</Text>
            </View>

            <View style={styles.grid}>
              <PracticeCard 
                title="Дихання" 
                subtitle="Focus & Calm" 
                icon="🫁" 
                onPress={() => setView('breath_config')} 
              />
              <PracticeCard 
                title="Сон" 
                subtitle="Deep Rest" 
                icon="🌙" 
                onPress={() => setView('sleep_loading')} // ТЕПЕР ВЕДЕ НА ЗАВАНТАЖЕННЯ
              />
            </View>
          </View>
        )}

        {/* 2. ЗАВАНТАЖЕННЯ ДЛЯ СНУ (новий блок) */}
        {view === 'sleep_loading' && (
          <StoicFlowContainer onFlowStart={() => setView('sleep_active')} />
        )}

        {/* 3. АКТИВНИЙ ЕКРАН СНУ */}
        {view === 'sleep_active' && (
          <SleepScreen onBack={() => setView('selection')} />
        )}

        {/* РЕШТА БЛОКІВ ДЛЯ ДИХАННЯ... */}
        {view === 'breath_config' && (
          <FlowSelectionScreen onSelect={(flow, duration) => {
            setSelectedFlow({ ...flow, duration });
            setView('breath_loading');
          }} />
        )}

        {view === 'breath_loading' && (
          <StoicFlowContainer onFlowStart={() => setView('breath_active')} />
        )}

        {view === 'breath_active' && (
          <BreathFlow mood={selectedFlow} onBack={() => setView('breath_config')} />
        )}
      </FadeViewWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  backText: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    marginLeft: 8,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: '200',
    letterSpacing: STOIC_STYLE.letterSpacing.ultra,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    letterSpacing: 4,
    marginTop: 12,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    color: Colors.dark.textMuted,
    fontSize: 9,
    letterSpacing: 5,
    textAlign: 'center',
    width: '100%',
  }
});