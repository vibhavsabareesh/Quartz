import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft,
  BookOpen, 
  ChevronRight, 
  FileText,
  HelpCircle,
  Layers,
  Loader2,
} from 'lucide-react';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  summary: string;
  key_points: string[];
  skills: string[];
  flashcardCount?: number;
  questionCount?: number;
  progress?: number;
}

export default function SubjectPage() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const { experienceProfile } = useMode();
  const { user } = useAuth();
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectIcon, setSubjectIcon] = useState('📖');

  useEffect(() => {
    if (subjectName) {
      loadChapters();
    }
  }, [subjectName]);

  const loadChapters = async () => {
    setLoading(true);
    
    try {
      // Get subject info
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id, icon')
        .eq('name', decodeURIComponent(subjectName!))
        .single();

      if (subjectData) {
        setSubjectIcon(subjectData.icon || getDefaultIcon(subjectName!));

        // Get chapters with counts
        const { data: chaptersData } = await supabase
          .from('chapters')
          .select('id, chapter_number, title, summary, key_points, skills')
          .eq('subject_id', subjectData.id)
          .eq('board', 'CBSE')
          .eq('grade', 9)
          .order('chapter_number');

        if (chaptersData) {
          // Get counts for each chapter
          const chaptersWithCounts = await Promise.all(
            chaptersData.map(async (chapter) => {
              const [flashcardRes, questionRes] = await Promise.all([
                supabase
                  .from('flashcards')
                  .select('*', { count: 'exact', head: true })
                  .eq('chapter_id', chapter.id),
                supabase
                  .from('practice_questions')
                  .select('*', { count: 'exact', head: true })
                  .eq('chapter_id', chapter.id),
              ]);

              return {
                ...chapter,
                flashcardCount: flashcardRes.count || 0,
                questionCount: questionRes.count || 0,
                progress: 0, // Would calculate from user progress
              };
            })
          );

          setChapters(chaptersWithCounts as Chapter[]);
        }
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
    
    setLoading(false);
  };

  const getDefaultIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Mathematics': '📐',
      'Science': '🔬',
      'English': '📚',
      'Social Science': '🌍',
    };
    return icons[decodeURIComponent(name)] || '📖';
  };

  const decodedSubjectName = decodeURIComponent(subjectName || '');

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
              {subjectIcon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{decodedSubjectName}</h1>
              <p className="text-muted-foreground">
                CBSE Class 9 • {chapters.length} chapters
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center card-interactive">
            <FileText className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Notes</p>
            <p className="text-xs text-muted-foreground">{chapters.length} chapters</p>
          </Card>
          <Card className="p-4 text-center card-interactive">
            <Layers className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Flashcards</p>
            <p className="text-xs text-muted-foreground">
              {chapters.reduce((sum, c) => sum + (c.flashcardCount || 0), 0)} cards
            </p>
          </Card>
          <Card className="p-4 text-center card-interactive">
            <HelpCircle className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Questions</p>
            <p className="text-xs text-muted-foreground">
              {chapters.reduce((sum, c) => sum + (c.questionCount || 0), 0)} questions
            </p>
          </Card>
        </motion.div>

        {/* Skills covered */}
        {chapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skills covered in this subject
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[...new Set(chapters.flatMap(c => c.skills || []))].map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chapters List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : chapters.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No chapters found</p>
            <p className="text-muted-foreground">Check back soon!</p>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="font-semibold text-foreground">Chapters</h2>
            
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
              >
                <Link to={`/chapter/${chapter.id}`}>
                  <Card className="card-interactive">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {chapter.chapter_number}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{chapter.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {chapter.summary?.substring(0, 100)}...
                          </p>
                          
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{chapter.flashcardCount} flashcards</span>
                            <span>•</span>
                            <span>{chapter.questionCount} questions</span>
                            {chapter.skills && chapter.skills.length > 0 && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {chapter.skills[0]}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                      
                      {chapter.progress !== undefined && chapter.progress > 0 && (
                        <Progress value={chapter.progress} className="mt-3 h-1" />
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}