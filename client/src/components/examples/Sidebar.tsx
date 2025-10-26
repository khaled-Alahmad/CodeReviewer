import { useState } from 'react';
import Sidebar from '../Sidebar';

export default function SidebarExample() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="gradient-primary-bg min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="mr-80 p-8">
        <h1 className="text-3xl font-bold text-white">القسم النشط: {activeSection}</h1>
      </div>
    </div>
  );
}
