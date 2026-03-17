<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fraud Detection Dashboard - Pakistani Banking</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/recharts@2.5.0/dist/Recharts.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState } = React;
        const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } = Recharts;

        // Simple Icon Component
        const Icon = ({ name, size = 24, color = "currentColor" }) => {
            const icons = {
                shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                activity: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
                target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
                clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
                download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
                trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            };
            return icons[name] || icons.activity;
        };

        const FraudDetectionDashboard = () => {
          const [activeTab, setActiveTab] = useState('overview');

          const fraudByCity = [
            { city: 'Karachi', fraudulent: 245, legitimate: 12450, total: 12695 },
            { city: 'Lahore', fraudulent: 198, legitimate: 10230, total: 10428 },
            { city: 'Islamabad', fraudulent: 156, legitimate: 8900, total: 9056 },
            { city: 'Rawalpindi', fraudulent: 134, legitimate: 7650, total: 7784 },
            { city: 'Faisalabad', fraudulent: 89, legitimate: 5420, total: 5509 },
            { city: 'Multan', fraudulent: 67, legitimate: 4230, total: 4297 },
          ];

          const fraudTrend = [
            { month: 'Jan', frauds: 145, prevented: 123 },
            { month: 'Feb', frauds: 167, prevented: 142 },
            { month: 'Mar', frauds: 189, prevented: 156 },
            { month: 'Apr', frauds: 210, prevented: 178 },
            { month: 'May', frauds: 234, prevented: 198 },
            { month: 'Jun', frauds: 198, prevented: 167 },
            { month: 'Jul', frauds: 176, prevented: 149 },
            { month: 'Aug', frauds: 154, prevented: 131 },
            { month: 'Sep', frauds: 142, prevented: 120 },
            { month: 'Oct', frauds: 138, prevented: 117 },
            { month: 'Nov', frauds: 156, prevented: 132 },
            { month: 'Dec', frauds: 169, prevented: 143 },
          ];

          const fraudByType = [
            { type: 'Card Not Present', value: 389, color: '#ef4444' },
            { type: 'Account Takeover', value: 267, color: '#f97316' },
            { type: 'Identity Theft', value: 234, color: '#eab308' },
            { type: 'Phishing', value: 178, color: '#84cc16' },
            { type: 'ATM Skimming', value: 145, color: '#06b6d4' },
            { type: 'Other', value: 98, color: '#8b5cf6' },
          ];

          const customerSegments = [
            { segment: 'Premium', customers: 15000, fraudRate: 0.8, avgLoss: 78000 },
            { segment: 'Business', customers: 8500, fraudRate: 2.1, avgLoss: 125000 },
            { segment: 'Regular', customers: 45000, fraudRate: 1.5, avgLoss: 28000 },
            { segment: 'Student', customers: 12000, fraudRate: 1.2, avgLoss: 15000 },
          ];

          const mlMetrics = [
            { metric: 'Accuracy', current: 94.7, target: 95.0 },
            { metric: 'Precision', current: 91.2, target: 92.0 },
            { metric: 'Recall', current: 87.3, target: 90.0 },
            { metric: 'F1-Score', current: 89.2, target: 91.0 },
            { metric: 'AUC-ROC', current: 96.5, target: 97.0 },
          ];

          const realtimeAlerts = [
            { id: 1, time: '2 min ago', type: 'High Risk', desc: 'Multiple transactions from Karachi - PKR 250K', status: 'investigating' },
            { id: 2, time: '8 min ago', type: 'Velocity', desc: '5 transactions in 3 minutes', status: 'blocked' },
            { id: 3, time: '15 min ago', type: 'Location', desc: 'Card used in Lahore & Dubai within 1 hour', status: 'flagged' },
            { id: 4, time: '23 min ago', type: 'Amount', desc: 'Transaction PKR 500K - New merchant', status: 'reviewing' },
          ];

          const timePatterns = [
            { hour: '00-03', frauds: 89, normal: 234 },
            { hour: '03-06', frauds: 134, normal: 189 },
            { hour: '06-09', frauds: 67, normal: 1456 },
            { hour: '09-12', frauds: 45, normal: 3421 },
            { hour: '12-15', frauds: 56, normal: 3890 },
            { hour: '15-18', frauds: 78, normal: 4123 },
            { hour: '18-21', frauds: 123, normal: 2987 },
            { hour: '21-00', frauds: 156, normal: 1876 },
          ];

          const featureImportance = [
            { feature: 'Transaction Amount', importance: 28 },
            { feature: 'Time of Day', importance: 22 },
            { feature: 'Location Change', importance: 18 },
            { feature: 'Frequency', importance: 15 },
            { feature: 'Device Change', importance: 12 },
            { feature: 'Merchant Type', importance: 5 },
          ];

          const StatCard = ({ icon, title, value, subtitle, color }) => (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-2xl transition-all" style={{ borderLeftColor: color }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
                  <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
                </div>
                <div className="p-4 rounded-full bg-gray-50">
                  <Icon name={icon} size={28} color={color} />
                </div>
              </div>
            </div>
          );

          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
              <div className="max-w-7xl mx-auto">
                
                <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-5xl font-extrabold flex items-center gap-3">
                        <Icon name="shield" size={48} color="white" />
                        Fraud Detection System
                      </h1>
                      <p className="text-red-100 mt-3 text-lg">Pakistani Banking Sector - 2024 Analysis</p>
                      <div className="flex gap-3 mt-4 flex-wrap">
                        <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">🤖 AI Powered</span>
                        <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">⚡ Real-time</span>
                        <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">🎯 87.3% Accurate</span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-red-700 rounded-xl font-bold shadow-xl hover:bg-red-50 flex items-center gap-2">
                      <Icon name="download" size={20} color="#b91c1c" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="mb-6 bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                    <Icon name="zap" color="#eab308" size={28} />
                    Live Alerts
                    <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">2 Active</span>
                  </h3>
                  <div className="grid gap-3">
                    {realtimeAlerts.map(alert => (
                      <div key={alert.id} className="bg-white border-l-4 border-red-500 p-4 rounded-lg shadow-md">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Icon name="bell" size={16} color="#dc2626" />
                              <span className="text-xs text-gray-500 font-medium">{alert.time}</span>
                              <span className="text-xs font-bold text-red-700 uppercase">{alert.type}</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">{alert.desc}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap">
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                  <StatCard icon="activity" title="Transactions" value="156,789" subtitle="Total in 2024" color="#3b82f6" />
                  <StatCard icon="alert" title="Fraud Cases" value="1,311" subtitle="1.83% rate" color="#ef4444" />
                  <StatCard icon="dollar" title="Prevented" value="PKR 23.4M" subtitle="Loss stopped" color="#10b981" />
                  <StatCard icon="brain" title="AI Accuracy" value="87.3%" subtitle="Detection rate" color="#8b5cf6" />
                  <StatCard icon="target" title="Response" value="1.2s" subtitle="Avg time" color="#f59e0b" />
                </div>

                <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-x-auto">
                  <div className="flex border-b-2 min-w-max">
                    {[
                      { id: 'overview', label: 'Overview', icon: 'activity' },
                      { id: 'patterns', label: 'Patterns', icon: 'clock' },
                      { id: 'location', label: 'Location', icon: 'map' },
                      { id: 'customers', label: 'Customers', icon: 'users' },
                      { id: 'ml', label: 'AI Model', icon: 'brain' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 whitespace-nowrap ${
                          activeTab === tab.id ? 'bg-red-50 border-b-4 border-red-600 text-red-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon name={tab.icon} size={20} color={activeTab === tab.id ? '#b91c1c' : '#4b5563'} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Monthly Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={fraudTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="frauds" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Detected" />
                          <Area type="monotone" dataKey="prevented" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Prevented" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Fraud Types</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={fraudByType} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                            {fraudByType.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'patterns' && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">24-Hour Pattern</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={timePatterns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="frauds" fill="#ef4444" name="Fraudulent" />
                        <Bar dataKey="normal" fill="#10b981" name="Legitimate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Geographic Distribution</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-bold">City</th>
                            <th className="px-4 py-3 text-left font-bold">Total</th>
                            <th className="px-4 py-3 text-left font-bold">Fraudulent</th>
                            <th className="px-4 py-3 text-left font-bold">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fraudByCity.map((city, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 font-bold">{city.city}</td>
                              <td className="px-4 py-3">{city.total.toLocaleString()}</td>
                              <td className="px-4 py-3 text-red-600 font-bold">{city.fraudulent}</td>
                              <td className="px-4 py-3">{((city.fraudulent/city.total)*100).toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'customers' && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Customer Segments</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={customerSegments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segment" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="fraudRate" fill="#ef4444" name="Fraud Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'ml' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Model Performance</h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={mlMetrics}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar name="Current" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                          <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Feature Importance</h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={featureImportance} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="feature" type="category" width={150} />
                          <Tooltip />
                          <Bar dataKey="importance" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
                      <h3 className="text-xl font-bold mb-4">Key Insights & Recommendations</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
                          <h4 className="font-bold text-red-900">Critical Findings</h4>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>• 68% fraud occurs 9 PM - 6 AM</li>
                            <li>• Karachi accounts for 18.7% of all fraud</li>
                            <li>• Business accounts show 2.1% fraud rate</li>
                            <li>• Card-not-present fraud increased 12%</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                          <h4 className="font-bold text-green-900">Recommendations</h4>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>• Enhanced monitoring during night hours</li>
                            <li>• Multi-factor auth for high-value transactions</li>
                            <li>• Stricter velocity checks</li>
                            <li>• Geographic validation for location jumps</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        };

        ReactDOM.render(<FraudDetectionDashboard />, document.getElementById('root'));
    </script>
</body>
</html>