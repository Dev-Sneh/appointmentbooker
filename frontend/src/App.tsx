import { useState } from 'react';
import Calendar from './components/Calendar';
import type { Client } from './types/types';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [refreshKey, setRefreshKey] = useState(0); // 🔄 For forcing Calendar reload

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const clients: Client[] = Array.from({ length: 20 }, (_, i) => ({
    id: `c${i + 1}`,
    name: `Client ${i + 1}`,
    phone: `+91-90000${(100 + i).toString().slice(-5)}`
  }));

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-gray-300 text-gray-800 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          🗓️ Appointment Booker
        </h1>

        <div className="flex justify-center mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <Calendar
          key={`${selectedDate}-${refreshKey}`} 
          date={selectedDate}
          clients={clients}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}

export default App;
