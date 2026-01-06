import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface ExamDate {
  id: string;
  subject: string;
  date: string;
}

interface ChapterTopic {
  id: string;
  title: string;
  subject: string;
  selected: boolean;
}

interface PlanDay {
  date: string;
  tasks: { title: string; subject: string; type: 'study' | 'revision' }[];
}

export default function QuartzRoad() {
  const { experienceProfile, isGuestMode } = useMode();
  const { user } = useAuth();
  const { toast } = useToast();

  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<ChapterTopic[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<PlanDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('chapters')
        .select('id, title, subjects(name)')
        .eq('board', 'CBSE')
        .eq('grade', 9)
        .order('chapter_number');

      if (data) {
        setChapters(data.map(c => ({
          id: c.id,
          title: c.title,
          subject: (c.subjects as any)?.name || 'Unknown',
          selected: true,
        })));
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
    setLoading(false);
  };

  const addExamDate = () => {
    if (!newExamSubject || !newExamDate) return;
    setExamDates([
      ...examDates,
      { id: Date.now().toString(), subject: newExamSubject, date: newExamDate }
    ]);
    setNewExamSubject('');
    setNewExamDate('');
  };

  const removeExamDate = (id: string) => {
    setExamDates(examDates.filter(e => e.id !== id));
  };

  const toggleChapter = (id: string) => {
    setChapters(chapters.map(c => 
      c.id === id ? { ...c, selected: !c.selected } : c
    ));
  };

  const togglePriority = (subject: string) => {
    setPrioritySubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    
    try {
      const selectedChapters = chapters.filter(c => c.selected);
      const subjects = [...new Set(selectedChapters.map(c => c.subject))];
      
      // Simple rule-based planner
      const today = new Date();
      const plan: PlanDay[] = [];
      
      // Sort by priority
      const sortedChapters = [...selectedChapters].sort((a, b) => {
        const aIsPriority = prioritySubjects.includes(a.subject);
        const bIsPriority = prioritySubjects.includes(b.subject);
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        return 0;
      });

      // Distribute chapters across days
      const chaptersPerDay = Math.ceil(hoursPerDay / 1.5); // ~1.5 hours per chapter
      let chapterIndex = 0;

      for (let day = 0; day < 30 && chapterIndex < sortedChapters.length; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        
        const dayTasks: { title: string; subject: string; type: 'study' | 'revision' }[] = [];
        
        // Add new chapters
        for (let i = 0; i < chaptersPerDay && chapterIndex < sortedChapters.length; i++) {
          dayTasks.push({
            title: sortedChapters[chapterIndex].title,
            subject: sortedChapters[chapterIndex].subject,
            type: 'study',
          });
          chapterIndex++;
        }
        
        // Add revision for chapters studied 3 days ago
        if (day >= 3 && plan[day - 3]) {
          const revisionChapter = plan[day - 3].tasks[0];
          if (revisionChapter) {
            dayTasks.push({
              title: `Review: ${revisionChapter.title}`,
              subject: revisionChapter.subject,
              type: 'revision',
            });
          }
        }
        
        if (dayTasks.length > 0) {
          plan.push({
            date: date.toISOString().split('T')[0],
            tasks: dayTasks,
          });
        }
      }

      setGeneratedPlan(plan);

      // Save to database if logged in
      if (!isGuestMode && user) {
        const planData = {
          user_id: user.id,
          name: 'Quartz Road Plan',
          exam_dates: examDates as unknown as any,
          topics: selectedChapters.map(c => ({ id: c.id, title: c.title })) as unknown as any,
          available_hours_per_day: hoursPerDay,
          priority_subjects: prioritySubjects,
          generated_plan: plan as unknown as any,
          is_active: true,
        };
        
        await supabase.from('study_plans').insert(planData);
      }

      toast({
        title: 'Plan Generated!',
        description: `${plan.length} days of study planned with ${selectedChapters.length} chapters.`,
      });

    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: 'Error',
        description: 'Could not generate plan.',
        variant: 'destructive',
      });
    }
    
    setIsGenerating(false);
  };

  const addToTodaysPlan = async () => {
    if (generatedPlan.length === 0) return;
    
    const todayPlan = generatedPlan[0];
    
    if (!isGuestMode && user) {
      const today = new Date().toISOString().split('T')[0];
      
      for (let i = 0; i < todayPlan.tasks.length; i++) {
        const task = todayPlan.tasks[i];
        await supabase.from('daily_tasks').insert({
          user_id: user.id,
          date: today,
          title: task.title,
          subject_name: task.subject,
          estimated_minutes: 25,
          status: 'pending',
          order_index: i,
          micro_steps: ['Open materials', 'Read summary', 'Review key points', 'Practice questions'],
          completed_micro_steps: 0,
        });
      }
    }

    toast({
      title: 'Added to Today\'s Plan!',
      description: `${todayPlan.tasks.length} tasks added to your home screen.`,
    });
  };

  const uniqueSubjects = [...new Set(chapters.map(c => c.subject))];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Quartz Road</h1>
          <p className="text-muted-foreground">
            Smart study planner that creates a personalized schedule based on your exams and available time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            {/* Exam Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Exam Dates
                </CardTitle>
                <CardDescription>Add your upcoming exam dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Subject"
                    value={newExamSubject}
                    onChange={(e) => setNewExamSubject(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-40"
                  />
                  <Button size="icon" onClick={addExamDate}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {examDates.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span>{exam.subject}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{exam.date}</Badge>
                      <Button size="icon" variant="ghost" onClick={() => removeExamDate(exam.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Available Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label>Hours per day</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 2)}
                  className="w-24 mt-2"
                />
              </CardContent>
            </Card>

            {/* Priority Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Priority Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {uniqueSubjects.map(subject => (
                  <Badge
                    key={subject}
                    variant={prioritySubjects.includes(subject) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => togglePriority(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full h-12 text-lg"
              onClick={generatePlan}
              disabled={isGenerating || chapters.filter(c => c.selected).length === 0}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Chapters & Plan */}
          <div className="space-y-6">
            {/* Chapters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Topics to Cover
                </CardTitle>
                <CardDescription>
                  {chapters.filter(c => c.selected).length} of {chapters.length} selected
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-muted-foreground">Loading chapters...</p>
                ) : (
                  uniqueSubjects.map(subject => (
                    <div key={subject} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{subject}</p>
                      {chapters.filter(c => c.subject === subject).map(chapter => (
                        <div
                          key={chapter.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          <Checkbox checked={chapter.selected} />
                          <span className="text-sm">{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Generated Plan */}
            {generatedPlan.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Your Study Plan
                  </CardTitle>
                  <CardDescription>{generatedPlan.length} days planned</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={addToTodaysPlan}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Today's Tasks to Home
                  </Button>
                  
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {generatedPlan.slice(0, 7).map((day, index) => (
                      <div key={day.date} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.date}
                        </p>
                        <div className="space-y-1">
                          {day.tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Badge variant={task.type === 'revision' ? 'secondary' : 'default'} className="text-xs">
                                {task.subject}
                              </Badge>
                              <span className={task.type === 'revision' ? 'text-muted-foreground' : ''}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {generatedPlan.length > 7 && (
                      <p className="text-sm text-muted-foreground text-center">
                        + {generatedPlan.length - 7} more days
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}