import StatCard from '../StatCard';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 gradient-primary-bg min-h-screen">
      <StatCard 
        title="إجمالي الطلاب" 
        value="450" 
        subtitle="+12 هذا الشهر" 
        icon="👥" 
        gradient="primary" 
      />
      <StatCard 
        title="المعلمين النشطين" 
        value="45" 
        subtitle="معلم مؤهل" 
        icon="👨‍🏫" 
        gradient="success" 
      />
      <StatCard 
        title="معدل الحضور" 
        value="94%" 
        subtitle="ممتاز" 
        icon="✅" 
        gradient="warning" 
      />
      <StatCard 
        title="الإيرادات الشهرية" 
        value="540,000" 
        subtitle="ريال سعودي" 
        icon="💰" 
        gradient="info" 
      />
    </div>
  );
}
