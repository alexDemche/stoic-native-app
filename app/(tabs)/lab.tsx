import { Colors, SPACING, STOIC_STYLE } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// UI & Wrappers
import { StoicFlowContainer } from '@/components/containers/StoicFlowContainer';
import { FadeViewWrapper } from '@/components/ui/FadeViewWrapper';
import { PracticeCard } from '@/components/ui/PracticeCard';

// Features
import { BreathFlow } from '@/features/breath/BreathFlow';
import { FlowSelectionScreen } from '@/features/breath/FlowSelectionScreen';
import { BodyRelaxFlow } from '@/features/relax/BodyRelaxFlow';
import { SleepScreen } from '@/features/sleep/SleepScreen';

// Типи станів для кращого контролю
type LabView = 
  | 'selection' 
  | 'breath_config' | 'breath_loading' | 'breath_active'
  | 'sleep_loading' | 'sleep_active'
  | 'relax_loading' | 'relax_active';

export default function LabScreen() {
  const [view, setView] = useState<LabView>('selection');
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  // 1. МАПА НАВІГАЦІЇ (куди повертатись натискаючи "Назад")
  const BACK_MAP: Partial<Record<LabView, LabView>> = {
    'breath_config': 'selection',
    'breath_loading': 'breath_config',
    'sleep_loading': 'selection',
    'relax_loading': 'selection',
  };

  const handleBack = () => {
    const prevView = BACK_MAP[view];
    if (prevView) setView(prevView);
  };

  // 2. ЦЕНТРАЛЬНИЙ РЕНДЕРЕР (Оптимізація замість &&)
  const renderContent = useMemo(() => {
    switch (view) {
      case 'selection':
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Stoic Lab</Text>
              <Text style={styles.subtitle}>ОБЕРИ СВІЙ ШЛЯХ</Text>
            </View>
            <View style={styles.grid}>
              <PracticeCard title="Дихання" subtitle="Square Breathing" icon="🫁" onPress={() => setView('breath_config')} />
              <PracticeCard title="Сон" subtitle="Cognitive Shuffle" icon="🌙" onPress={() => setView('sleep_loading')} />
              <PracticeCard title="Тіло" subtitle="Relaxation" icon="🧘" onPress={() => setView('relax_loading')} />
            </View>
            <Text style={styles.footerText}>СИНХРОНІЗАЦІЯ З РОЗУМОМ</Text>
          </View>
        );

      // ГРУПА: ДИХАННЯ
      case 'breath_config':
        return <FlowSelectionScreen onSelect={(f, d) => { setSelectedFlow({...f, duration: d}); setView('breath_loading'); }} />;
      case 'breath_loading':
        return <StoicFlowContainer onFlowStart={() => setView('breath_active')} />;
      case 'breath_active':
        return <BreathFlow mood={selectedFlow} onBack={() => setView('breath_config')} />;

      // ГРУПА: СОН
      case 'sleep_loading':
        return <StoicFlowContainer onFlowStart={() => setView('sleep_active')} />;
      case 'sleep_active':
        return <SleepScreen onBack={() => setView('selection')} />;

      // ГРУПА: ТІЛО (РЕЛАКСАЦІЯ)
      case 'relax_loading':
        return <StoicFlowContainer onFlowStart={() => setView('relax_active')} />;
      case 'relax_active':
        return <BodyRelaxFlow onBack={() => setView('selection')} />;

      default:
        return null;
    }
  }, [view, selectedFlow]);

  // 3. ПЕРЕВІРКА: чи показувати кнопку "Назад"
  const showBackButton = !!BACK_MAP[view];

  return (
    <View style={styles.mainLayout}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark.textSecondary} />
          <Text style={styles.backText}>НАЗАД</Text>
        </TouchableOpacity>
      )}

      <FadeViewWrapper key={view}>
        {renderContent}
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