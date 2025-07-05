import React from 'react';
import Layout from '../components/Layout/Layout';
import SensorDashboard from '../components/sensors/sensordashboard';

export default function DashboardPage() {
  return (
    <Layout title="Dashboard - SensorView">
      <SensorDashboard />
    </Layout>
  );
}
