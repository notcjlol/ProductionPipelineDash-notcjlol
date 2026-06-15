import { getDashboardData } from '@/lib/api';
import Dashboard from '@/components/Dashboard';

export const revalidate = 60; // ISR: re-fetch from API at most every 60s

export default async function Home() {
  let data;
  try {
    data = await getDashboardData();
  } catch (err) {
    console.error('[page] failed to load dashboard data:', err);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        color: '#FB5779',
        fontSize: 14,
      }}>
        Failed to load dashboard data. Is the API running?
      </div>
    );
  }

  return <Dashboard data={data} />;
}
