import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, XCircle, Clock, Stethoscope, Banknote, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

interface Teacher {
  id: string;
  arabicName: string;
  email: string;
  phone: string;
  monthlySalary: string;
  status: string;
}

interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string;
  status: 'present' | 'absent' | 'paid_leave' | 'unpaid_leave' | 'sick_leave';
  deductFromSalary: boolean;
  notes: string | null;
}

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  activeTeachers: number;
  totalRevenue: number;
  pendingPayments: number;
  totalClasses: number;
}

const statusOptions = [
  { value: 'present', label: 'حاضر', icon: CheckCircle, color: 'text-green-600', deduct: false },
  { value: 'absent', label: 'غائب', icon: XCircle, color: 'text-red-600', deduct: false },
  { value: 'paid_leave', label: 'إجازة براتب', icon: Banknote, color: 'text-blue-600', deduct: false },
  { value: 'unpaid_leave', label: 'إجازة بدون راتب', icon: Clock, color: 'text-orange-600', deduct: true },
  { value: 'sick_leave', label: 'إجازة مرضية', icon: Stethoscope, color: 'text-purple-600', deduct: false },
];

export default function AttendanceSection() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [teacherStatuses, setTeacherStatuses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: teachers = [] } = useQuery<Teacher[]>({
    queryKey: ['/api/teachers'],
  });

  const { data: teacherAttendance = [] } = useQuery<TeacherAttendance[]>({
    queryKey: ['/api/teacher-attendance', { date: format(selectedDate, 'yyyy-MM-dd') }],
    queryFn: async () => {
      const response = await fetch(`/api/teacher-attendance?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('فشل في جلب بيانات الحضور');
      return response.json();
    },
  });

  const handleStatusChange = (teacherId: string, status: string) => {
    setTeacherStatuses(prev => ({ ...prev, [teacherId]: status }));
  };

  const handleSaveAttendance = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setIsSaving(true);
    
    try {
      const savePromises = Object.entries(teacherStatuses).map(async ([teacherId, status]) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        
        return await apiRequest(
          'POST',
          '/api/teacher-attendance',
          {
            teacherId,
            date: dateStr,
            status,
            deductFromSalary: statusOption?.deduct || false,
          }
        );
      });

      await Promise.all(savePromises);
      
      queryClient.invalidateQueries({ queryKey: ['/api/teacher-attendance'] });
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ بيانات الحضور بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حفظ بيانات الحضور',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize statuses only when attendance data or date changes
  useEffect(() => {
    setTeacherStatuses(prev => {
      const initialStatuses: Record<string, string> = {};
      
      // First, set all active teachers to 'present' as default
      teachers.filter(t => t.status === 'active').forEach(teacher => {
        initialStatuses[teacher.id] = 'present';
      });
      
      // Then, overlay with existing attendance data
      teacherAttendance.forEach(att => {
        initialStatuses[att.teacherId] = att.status;
      });
      
      // Only update if different from current state
      const hasChanges = JSON.stringify(prev) !== JSON.stringify(initialStatuses);
      return hasChanges ? initialStatuses : prev;
    });
  }, [teacherAttendance, selectedDate, teachers]);

  const activeTeachers = teachers.filter(t => t.status === 'active');
  const presentCount = Object.values(teacherStatuses).filter(s => s === 'present').length;
  const absentCount = Object.values(teacherStatuses).filter(s => s === 'absent').length;
  const leaveCount = Object.values(teacherStatuses).filter(s => 
    s === 'paid_leave' || s === 'unpaid_leave' || s === 'sick_leave'
  ).length;

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الحضور والغياب</h1>
        <p className="text-gray-600 dark:text-gray-400">متابعة حضور الطلاب والمعلمين</p>
      </div>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full grid-cols-2" data-testid="tabs-attendance">
          <TabsTrigger value="students" data-testid="tab-students">حضور الطلاب</TabsTrigger>
          <TabsTrigger value="teachers" data-testid="tab-teachers">حضور المعلمين</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">معدل الحضور العام</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">94%</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">طلاب حاضرين اليوم</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeStudents || 0}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">طلاب غائبين اليوم</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="text-4xl">❌</div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">طلاب متأخرين</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="text-4xl">⏰</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">✅</div>
              <p>قم بتسجيل الحضور للطلاب</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">إجمالي المعلمين</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeTeachers.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">معلمين حاضرين</p>
                  <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">معلمين غائبين</p>
                  <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold mb-2">في إجازة</p>
                  <p className="text-3xl font-bold text-orange-600">{leaveCount}</p>
                </div>
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">تسجيل حضور المعلمين</h3>
              <div className="flex gap-3 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-right font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                      data-testid="button-select-date"
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ar}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" 
                  onClick={handleSaveAttendance}
                  disabled={isSaving || Object.keys(teacherStatuses).length === 0}
                  data-testid="button-save-attendance"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الحضور'}
                </Button>
              </div>
            </div>

            {activeTeachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>لا يوجد معلمين نشطين</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم المعلم</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTeachers.map((teacher) => {
                      const currentStatus = teacherStatuses[teacher.id] || 'present';
                      const statusOption = statusOptions.find(opt => opt.value === currentStatus);
                      const Icon = statusOption?.icon || CheckCircle;

                      return (
                        <TableRow key={teacher.id} data-testid={`row-teacher-${teacher.id}`}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {teacher.arabicName}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={currentStatus}
                              onValueChange={(value) => handleStatusChange(teacher.id, value)}
                            >
                              <SelectTrigger 
                                className="w-[200px]" 
                                data-testid={`select-status-${teacher.id}`}
                              >
                                <SelectValue>
                                  <div className="flex items-center gap-2">
                                    <Icon className={cn('w-4 h-4', statusOption?.color)} />
                                    <span>{statusOption?.label}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => {
                                  const OptionIcon = option.icon;
                                  return (
                                    <SelectItem 
                                      key={option.value} 
                                      value={option.value}
                                      data-testid={`option-${option.value}-${teacher.id}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <OptionIcon className={cn('w-4 h-4', option.color)} />
                                        <span>{option.label}</span>
                                        {option.deduct && (
                                          <span className="text-xs text-orange-600 mr-2">(خصم)</span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {statusOption?.deduct && (
                              <span className="text-sm text-orange-600">سيتم خصم من الراتب</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
