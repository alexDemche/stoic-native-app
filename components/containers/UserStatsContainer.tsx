// components/containers/UserStatsContainer.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { StoicLoader } from '../ui/StoicLoader';

export const UserStatsContainer = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/${process.env.EXPO_PUBLIC_USER_TELEGRAM_ID}`);
        setData(res.data);
      } catch (e) {
        console.error("Fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <StoicLoader />;

  return (
    <GlassCard>
      <Text style={styles.label}>ПОТОЧНИЙ СТАТУС</Text>
      <Text style={styles.statusText}>💙 {data?.rank}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>МУДРІСТЬ</Text>
          <Text style={styles.value}>💎 {data?.score}</Text>
        </View>
        <View>
          <Text style={styles.label}>ЕНЕРГІЯ</Text>
          <Text style={styles.value}>⚡ {data?.energy}/5</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  label: { color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  statusText: { color: '#fff', fontSize: 18, marginBottom: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  value: { color: '#fff', fontSize: 20, fontWeight: '600' }
});