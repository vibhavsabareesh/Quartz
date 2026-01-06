import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMode } from '@/contexts/ModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  ChevronRight, 
  Search,
  Loader2,
  Sparkles,
  FlaskConical,
  Gamepad2
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Subject {
  id: string;
  name: string;
  icon: string;
  chapterCount: number;
}

export default function Library() {
  const { experienceProfile } = useMode();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    
    try {
      // Get subjects with chapter counts
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('id, name, icon');

      if (subjectsData && subjectsData.length > 0) {
        // Get chapter counts for each subject
        const subjectsWithCounts = await Promise.all(
          subjectsData.map(async (subject) => {
            const { count } = await supabase
              .from('chapters')
              .select('*', { count: 'exact', head: true })
              .eq('subject_id', subject.id)
              .eq('board', 'CBSE')
              .eq('grade', 9);

            return {
              id: subject.id,
              name: subject.name,
              icon: subject.icon || getDefaultIcon(subject.name),
              chapterCount: count || 0,
            };
          })
        );

        setSubjects(subjectsWithCounts.filter(s => s.chapterCount > 0));
      }
      
      // If no content, seed it
      if (!subjectsData || subjectsData.length === 0) {
        await seedContent();
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
    
    setLoading(false);
  };

  const seedContent = async () => {
    setSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-content');
      if (error) throw error;
      console.log('Seed result:', data);
      await loadSubjects();
    } catch (error) {
      console.error('Error seeding:', error);
    }
    setSeeding(false);
  };

  const getDefaultIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Mathematics': '📐',
      'Science': '🔬',
      'English': '📚',
      'Social Science': '🌍',
      'Hindi': '🇮🇳',
      'Computer Science': '💻',
    };
    return icons[name] || '📖';
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Library</h1>
          <p className="text-muted-foreground">
            CBSE Class 9 • Choose a subject to explore
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Subjects Grid */}
        {loading || seeding ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {seeding ? 'Setting up content...' : 'Loading subjects...'}
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No subjects found</p>
            <p className="text-muted-foreground mb-4">Content is being set up</p>
            <Button onClick={seedContent} disabled={seeding}>
              <Sparkles className="w-4 h-4 mr-2" />
              Load Content
            </Button>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredSubjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link to={`/subject/${encodeURIComponent(subject.name)}`}>
                  <Card className="card-interactive h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                          {subject.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {subject.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {subject.chapterCount} chapters
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Interactive Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Interactive Learning</h2>
          <Link to="/chemistry-interactive">
            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Chemistry Interactive Lab
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        <Gamepad2 className="w-3 h-3 mr-1" />
                        Game
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Explore molecules, simulate reactions, and learn through play
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Select a subject to view chapters, notes, flashcards, and practice questions</p>
        </motion.div>
      </div>
    </AppLayout>
  );
}