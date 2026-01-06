import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CBSE Class 9 Content - Condensed version for seeding
const SUBJECTS = [
  { name: 'Mathematics', icon: '📐' },
  { name: 'Science', icon: '🔬' },
  { name: 'English', icon: '📚' },
  { name: 'Social Science', icon: '🌍' },
];

const CHAPTERS_DATA: Record<string, any[]> = {
  'Mathematics': [
    { number: 1, title: 'Number Systems', summary: 'Number systems form the foundation of mathematics. We explore different types of numbers including natural numbers, whole numbers, integers, rational numbers, and irrational numbers.', keyPoints: ['Natural numbers are positive counting numbers', 'Whole numbers include zero', 'Integers include negative numbers', 'Rational numbers can be written as p/q', 'Irrational numbers have non-repeating decimals'], skills: ['concept recall', 'number classification'] },
    { number: 2, title: 'Polynomials', summary: 'Polynomials are algebraic expressions consisting of variables and coefficients. They are classified by degree: constant, linear, quadratic, and cubic.', keyPoints: ['Degree is the highest power', 'Factor theorem connects factors and zeros', 'Remainder theorem helps in division'], skills: ['algebra manipulation', 'problem solving'] },
    { number: 3, title: 'Coordinate Geometry', summary: 'Coordinate geometry combines algebra and geometry using a coordinate plane with x-axis and y-axis.', keyPoints: ['Origin is at (0,0)', 'Every point has unique coordinates', 'Four quadrants divide the plane'], skills: ['data interpretation', 'problem solving'] },
    { number: 4, title: 'Linear Equations in Two Variables', summary: 'Linear equations have infinitely many solutions forming a straight line when graphed.', keyPoints: ['Standard form: ax + by + c = 0', 'Graph is always a straight line', 'Parallel lines have no common solution'], skills: ['algebra manipulation', 'problem solving'] },
    { number: 5, title: 'Introduction to Euclid\'s Geometry', summary: 'Euclid systematized geometry with axioms and postulates as the foundation.', keyPoints: ['Point, line, plane are undefined terms', 'Axioms are self-evident truths', 'Theorems are proved statements'], skills: ['concept recall', 'scientific reasoning'] },
    { number: 6, title: 'Lines and Angles', summary: 'Properties of lines and angles including vertically opposite angles and transversal properties.', keyPoints: ['Vertically opposite angles are equal', 'Corresponding angles are equal for parallel lines', 'Co-interior angles are supplementary'], skills: ['problem solving', 'scientific reasoning'] },
    { number: 7, title: 'Triangles', summary: 'Triangles are polygons with three sides. Congruence criteria include SSS, SAS, ASA, AAS, and RHS.', keyPoints: ['Sum of angles is 180°', 'Congruent triangles have same size and shape', 'CPCT: Corresponding Parts of Congruent Triangles'], skills: ['scientific reasoning', 'problem solving'] },
    { number: 8, title: 'Quadrilaterals', summary: 'Quadrilaterals have four sides with angle sum of 360°. Special types include parallelograms, rectangles, rhombus, and squares.', keyPoints: ['Angle sum is 360°', 'Parallelogram diagonals bisect each other', 'Square is both rectangle and rhombus'], skills: ['concept recall', 'problem solving'] },
  ],
  'Science': [
    { number: 1, title: 'Matter in Our Surroundings', summary: 'Everything around us is made of matter, which occupies space and has mass. Matter exists in three states: solid, liquid, and gas.', keyPoints: ['Matter has mass and occupies space', 'Three states: solid, liquid, gas', 'State changes through heating or cooling'], skills: ['concept recall', 'scientific reasoning'] },
    { number: 2, title: 'Is Matter Around Us Pure?', summary: 'Matter can be classified as pure substances or mixtures. Pure substances have fixed composition.', keyPoints: ['Elements contain one type of atom', 'Compounds are chemically combined', 'Mixtures are physically combined'], skills: ['concept recall', 'scientific reasoning'] },
    { number: 3, title: 'Atoms and Molecules', summary: 'Atoms are the smallest particles of elements. Molecules are groups of atoms bonded together.', keyPoints: ['Avogadro\'s number: 6.022 × 10²³', 'Mole is the amount with Avogadro\'s number of particles', 'Chemical formulas show composition'], skills: ['concept recall', 'numeracy'] },
    { number: 4, title: 'Structure of the Atom', summary: 'Atoms consist of protons, neutrons, and electrons. The nucleus contains protons and neutrons.', keyPoints: ['Protons are positive, electrons negative', 'Atomic number = number of protons', 'Electrons arranged in shells'], skills: ['concept recall', 'numeracy'] },
    { number: 5, title: 'The Fundamental Unit of Life', summary: 'The cell is the basic structural and functional unit of all living organisms.', keyPoints: ['Nucleus is the control center', 'Mitochondria are the powerhouse', 'Cell membrane is selectively permeable'], skills: ['concept recall', 'scientific reasoning'] },
    { number: 6, title: 'Tissues', summary: 'Tissues are groups of similar cells performing a specific function. Animal tissues include epithelial, connective, muscular, and nervous.', keyPoints: ['Tissue is a group of similar cells', 'Xylem transports water upward', 'Phloem transports food'], skills: ['concept recall', 'scientific reasoning'] },
    { number: 7, title: 'Motion', summary: 'Motion is the change in position of an object with time. Speed, velocity, and acceleration describe motion.', keyPoints: ['Speed = distance/time', 'Velocity includes direction', 'Equations of motion: v=u+at'], skills: ['numeracy', 'problem solving'] },
    { number: 8, title: 'Force and Laws of Motion', summary: 'Newton\'s three laws describe how forces affect motion. Force causes acceleration.', keyPoints: ['First law: inertia', 'Second law: F = ma', 'Third law: action-reaction'], skills: ['numeracy', 'scientific reasoning'] },
  ],
  'English': [
    { number: 1, title: 'The Fun They Had', summary: 'A story by Isaac Asimov set in 2157 about children learning through mechanical teachers and discovering old printed books about traditional schools.', keyPoints: ['Set in the future year 2157', 'Children learn through mechanical teachers', 'Theme: technology vs human connection'], skills: ['reading inference', 'concept recall'] },
    { number: 2, title: 'The Sound of Music', summary: 'Two parts: Evelyn Glennie, a deaf percussionist who feels music through vibrations, and Bismillah Khan, the shehnai maestro.', keyPoints: ['Evelyn feels music through vibrations', 'Khan was awarded Bharat Ratna', 'Theme: passion overcomes obstacles'], skills: ['reading inference', 'concept recall'] },
    { number: 3, title: 'The Little Girl', summary: 'A story about Kezia learning to understand her stern father\'s different way of showing love.', keyPoints: ['Kezia fears her strict father', 'She realizes he loves her differently', 'Theme: understanding expressions of love'], skills: ['reading inference', 'writing clarity'] },
    { number: 4, title: 'A Truly Beautiful Mind', summary: 'Biography of Albert Einstein from slow-speaking childhood to becoming the greatest physicist.', keyPoints: ['Einstein spoke late as a child', 'E=mc² relates energy and mass', 'He was a pacifist'], skills: ['reading inference', 'concept recall'] },
    { number: 5, title: 'The Snake and the Mirror', summary: 'A humorous story about a doctor\'s encounter with a snake while admiring himself in the mirror.', keyPoints: ['Narrator was admiring himself', 'Snake was distracted by the mirror', 'Theme: mockery of human vanity'], skills: ['reading inference', 'writing clarity'] },
    { number: 6, title: 'My Childhood', summary: 'A.P.J. Abdul Kalam\'s autobiography about growing up in Rameswaram with communal harmony.', keyPoints: ['Kalam grew up in Rameswaram', 'Hindus and Muslims lived in harmony', 'Theme: childhood shapes character'], skills: ['reading inference', 'concept recall'] },
  ],
  'Social Science': [
    { number: 1, title: 'The French Revolution', summary: 'The 1789 revolution that overthrew the monarchy and established principles of liberty, equality, and fraternity.', keyPoints: ['Began in 1789', 'Society divided into three Estates', 'Storming of Bastille on July 14'], skills: ['concept recall', 'reading inference'] },
    { number: 2, title: 'Socialism in Europe and the Russian Revolution', summary: 'The 1917 Russian Revolution that overthrew the Tsar and established communist rule.', keyPoints: ['February 1917: Tsar abdicated', 'October 1917: Bolsheviks seized power', 'Lenin led the Bolsheviks'], skills: ['concept recall', 'reading inference'] },
    { number: 3, title: 'Nazism and the Rise of Hitler', summary: 'How Hitler and the Nazi Party exploited Germany\'s post-WWI conditions to establish dictatorship.', keyPoints: ['Hitler became Chancellor in 1933', 'Holocaust killed 6 million Jews', 'Nazi Germany defeated in 1945'], skills: ['concept recall', 'reading inference'] },
    { number: 4, title: 'Forest Society and Colonialism', summary: 'How colonial powers changed forest management, displacing indigenous communities.', keyPoints: ['Colonial powers exploited forests', 'Traditional communities lost access', 'Scientific forestry prioritized timber'], skills: ['concept recall', 'reading inference'] },
    { number: 5, title: 'Pastoralists in the Modern World', summary: 'How pastoral communities adapted to colonial policies and modern boundaries.', keyPoints: ['Pastoralists move with seasons', 'Colonial laws restricted movement', 'Traditional knowledge is valuable'], skills: ['concept recall', 'reading inference'] },
    { number: 6, title: 'Peasants and Farmers', summary: 'Agricultural changes from small farms to large commercial agriculture across different regions.', keyPoints: ['Enclosure movement in England', 'American expansion affected natives', 'Green revolution modernized farming'], skills: ['concept recall', 'data interpretation'] },
  ],
};

// Generate questions for a chapter
function generateQuestions(subject: string, chapterTitle: string, skills: string[]) {
  const questions = [];
  const types = ['mcq', 'mcq', 'mcq', 'short'];
  
  for (let i = 0; i < 12; i++) {
    const level = Math.min(6, Math.floor(i / 2) + 1);
    const type = types[i % 4];
    questions.push({
      question_text: `Question ${i + 1} about ${chapterTitle} (${subject})`,
      question_type: type,
      options: type === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
      correct_answer: type === 'mcq' ? 'Option A' : 'Sample answer',
      level,
      skills: [skills[i % skills.length]],
      explanation: `Explanation for question ${i + 1}`,
      is_math: subject === 'Mathematics',
      math_steps: subject === 'Mathematics' ? ['Step 1', 'Step 2', 'Step 3'] : [],
    });
  }
  return questions;
}

// Generate flashcards for a chapter
function generateFlashcards(chapterTitle: string, keyPoints: string[]) {
  const flashcards = [];
  for (let i = 0; i < Math.max(10, keyPoints.length); i++) {
    const point = keyPoints[i % keyPoints.length];
    flashcards.push({
      front: `What is key concept ${i + 1} in ${chapterTitle}?`,
      back: point,
    });
  }
  return flashcards;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting content seeding...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if content already exists
    const { count: existingCount } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('board', 'CBSE')
      .eq('grade', 9);

    if (existingCount && existingCount > 0) {
      console.log('Content already exists, skipping seed');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Content already seeded',
        chaptersCount: existingCount 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Seed subjects
    console.log('Seeding subjects...');
    for (const subject of SUBJECTS) {
      const { error: subjectError } = await supabase
        .from('subjects')
        .upsert({ name: subject.name, icon: subject.icon }, { onConflict: 'name' });
      
      if (subjectError) console.error('Subject error:', subjectError);
    }

    // Get subject IDs
    const { data: subjectsData } = await supabase.from('subjects').select('id, name');
    const subjectMap: Record<string, string> = {};
    subjectsData?.forEach(s => { subjectMap[s.name] = s.id; });

    let totalChapters = 0;
    let totalQuestions = 0;
    let totalFlashcards = 0;

    // Seed chapters, questions, and flashcards
    for (const [subjectName, chapters] of Object.entries(CHAPTERS_DATA)) {
      const subjectId = subjectMap[subjectName];
      if (!subjectId) {
        console.error(`Subject not found: ${subjectName}`);
        continue;
      }

      console.log(`Seeding ${subjectName}...`);

      for (const chapter of chapters) {
        // Insert chapter
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .insert({
            subject_id: subjectId,
            board: 'CBSE',
            grade: 9,
            chapter_number: chapter.number,
            title: chapter.title,
            summary: chapter.summary,
            key_points: chapter.keyPoints,
            skills: chapter.skills,
          })
          .select()
          .single();

        if (chapterError) {
          console.error('Chapter error:', chapterError);
          continue;
        }

        totalChapters++;
        const chapterId = chapterData.id;

        // Insert questions
        const questions = generateQuestions(subjectName, chapter.title, chapter.skills);
        for (const q of questions) {
          const { error: qError } = await supabase
            .from('practice_questions')
            .insert({
              chapter_id: chapterId,
              question_text: q.question_text,
              question_type: q.question_type,
              options: q.options,
              correct_answer: q.correct_answer,
              level: q.level,
              skills: q.skills,
              explanation: q.explanation,
              is_math: q.is_math,
              math_steps: q.math_steps,
            });
          
          if (!qError) totalQuestions++;
        }

        // Insert flashcards
        const flashcards = generateFlashcards(chapter.title, chapter.keyPoints);
        for (const f of flashcards) {
          const { error: fError } = await supabase
            .from('flashcards')
            .insert({
              chapter_id: chapterId,
              front: f.front,
              back: f.back,
            });
          
          if (!fError) totalFlashcards++;
        }
      }
    }

    console.log('Seeding complete!');

    return new Response(JSON.stringify({
      success: true,
      message: 'Content seeded successfully',
      stats: {
        subjects: SUBJECTS.length,
        chapters: totalChapters,
        questions: totalQuestions,
        flashcards: totalFlashcards,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Seeding error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});