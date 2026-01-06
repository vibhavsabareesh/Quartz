// CBSE Class 9 Content - Original, non-copyrighted educational content
// This file contains seeded content for instant demo capability

export interface ChapterContent {
  title: string;
  chapterNumber: number;
  summary: string;
  keyPoints: string[];
  skills: string[];
  flashcards: { front: string; back: string }[];
  questions: {
    text: string;
    type: 'mcq' | 'short';
    options?: string[];
    answer: string;
    level: number;
    skills: string[];
    explanation: string;
  }[];
}

export interface SubjectContent {
  name: string;
  icon: string;
  chapters: ChapterContent[];
}

// Level definitions for reference:
// 1: Recall - Remember facts
// 2: Explain - Understand concepts
// 3: Apply - Use in new situations
// 4: Compare - Analyze relationships
// 5: Judge - Evaluate and critique
// 6: Create - Generate new ideas

export const CBSE_CLASS_9_CONTENT: SubjectContent[] = [
  {
    name: 'Mathematics',
    icon: '📐',
    chapters: [
      {
        title: 'Number Systems',
        chapterNumber: 1,
        summary: 'Number systems form the foundation of mathematics. We explore different types of numbers including natural numbers, whole numbers, integers, rational numbers, and irrational numbers. Natural numbers are counting numbers starting from 1. Whole numbers include zero along with natural numbers. Integers extend to negative numbers. Rational numbers can be expressed as fractions where the denominator is not zero. Irrational numbers cannot be expressed as simple fractions and have non-terminating, non-repeating decimal expansions. The real number line helps visualize all these numbers together, showing their relationships and positions relative to each other.',
        keyPoints: [
          'Natural numbers are positive counting numbers: 1, 2, 3, 4...',
          'Whole numbers include zero: 0, 1, 2, 3, 4...',
          'Integers include negative numbers: ...-3, -2, -1, 0, 1, 2, 3...',
          'Rational numbers can be written as p/q where q ≠ 0',
          'Irrational numbers have non-repeating, non-terminating decimals',
          'Every rational number can be represented on the number line',
          'The square root of 2 is a famous irrational number',
          'Real numbers include both rational and irrational numbers'
        ],
        skills: ['concept recall', 'number classification', 'problem solving'],
        flashcards: [
          { front: 'Classify the number -7. Is it a natural, whole, or integer?', back: 'Integer. -7 is negative, so it cannot be natural (positive) or whole (non-negative), but integers include all negative numbers.' },
          { front: 'Between 3 and 4, how many irrational numbers exist?', back: 'Infinitely many! Examples include √10, √11, √12, √13, √14, √15, π, and countless others.' },
          { front: 'If √n is rational, what must be true about n?', back: 'n must be a perfect square (like 1, 4, 9, 16, 25...). Only perfect squares have rational square roots.' },
          { front: 'Find one rational number between 1/3 and 1/2.', back: '5/12 (or 2/5, 3/7, etc.). One method: average them → (1/3 + 1/2) ÷ 2 = 5/12' },
          { front: 'Is 0.101001000100001... (pattern continues) rational or irrational?', back: 'Irrational. The decimal is non-terminating AND non-repeating (the pattern grows, it doesn\'t repeat).' }
        ],
        questions: [
          { text: 'Which of the following is a natural number?', type: 'mcq', options: ['-5', '0', '7', '3.14'], answer: '7', level: 1, skills: ['concept recall'], explanation: 'Natural numbers are positive counting numbers starting from 1' },
          { text: 'Is √3 a rational number?', type: 'mcq', options: ['Yes', 'No', 'Sometimes', 'Cannot determine'], answer: 'No', level: 2, skills: ['number classification'], explanation: 'Square roots of non-perfect squares are irrational' },
          { text: 'Express 0.75 as a fraction', type: 'mcq', options: ['3/4', '7/5', '1/4', '3/5'], answer: '3/4', level: 2, skills: ['algebra manipulation'], explanation: '0.75 = 75/100 = 3/4 when simplified' },
          { text: 'Which number is between √2 and √3?', type: 'mcq', options: ['1.2', '1.5', '1.8', '2.0'], answer: '1.5', level: 3, skills: ['problem solving'], explanation: '√2 ≈ 1.41 and √3 ≈ 1.73, so 1.5 lies between them' },
          { text: 'Which set includes all the others?', type: 'mcq', options: ['Natural', 'Whole', 'Integers', 'Real'], answer: 'Real', level: 4, skills: ['number classification'], explanation: 'Real numbers include all rational and irrational numbers' }
        ]
      },
      {
        title: 'Polynomials',
        chapterNumber: 2,
        summary: 'Polynomials are algebraic expressions consisting of variables and coefficients combined using addition, subtraction, and multiplication. They are classified by degree: constant (0), linear (1), quadratic (2), and cubic (3). The degree is the highest power of the variable in the expression. Key concepts include zeros of polynomials, which are values that make the polynomial equal to zero. The Factor Theorem connects factors and zeros, stating that if a is a zero of p(x), then (x-a) is a factor. Important identities help simplify polynomial expressions and solve problems efficiently.',
        keyPoints: [
          'A polynomial is an expression with variables and coefficients',
          'Degree is the highest power of the variable',
          'Linear polynomial has degree 1, quadratic has degree 2',
          'Zero of a polynomial makes the expression equal to zero',
          'Factor Theorem: (x-a) is a factor if p(a) = 0',
          'Remainder Theorem: p(a) gives the remainder when dividing by (x-a)',
          'Standard form writes terms in descending order of degree',
          'Algebraic identities simplify calculations'
        ],
        skills: ['algebra manipulation', 'problem solving', 'concept recall'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Coordinate Geometry',
        chapterNumber: 3,
        summary: 'Coordinate geometry combines algebra and geometry using a coordinate plane. The plane consists of two perpendicular number lines: the horizontal x-axis and vertical y-axis. Their intersection is the origin (0,0). Every point on the plane has unique coordinates (x,y) called an ordered pair. The plane is divided into four quadrants. In Quadrant I, both coordinates are positive. In Quadrant II, x is negative and y is positive. In Quadrant III, both are negative. In Quadrant IV, x is positive and y is negative. This system allows us to precisely locate and describe geometric shapes algebraically.',
        keyPoints: [
          'The coordinate plane has horizontal (x) and vertical (y) axes',
          'The origin is at (0,0) where axes intersect',
          'Every point has unique coordinates (x,y)',
          'Quadrant I: (+,+), Quadrant II: (-,+), Quadrant III: (-,-), Quadrant IV: (+,-)',
          'Points on x-axis have y-coordinate = 0',
          'Points on y-axis have x-coordinate = 0',
          'The x-coordinate is also called abscissa',
          'The y-coordinate is also called ordinate'
        ],
        skills: ['data interpretation', 'problem solving', 'concept recall'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Linear Equations in Two Variables',
        chapterNumber: 4,
        summary: 'A linear equation in two variables has the form ax + by + c = 0, where a, b, and c are real numbers with a and b not both zero. Such equations have infinitely many solutions forming a straight line when graphed. Each solution is an ordered pair (x, y) that satisfies the equation. To find solutions, we can substitute any value for one variable and solve for the other. The graph of a linear equation is always a straight line, and every point on this line represents a solution. Parallel lines have no common solution, while intersecting lines have exactly one.',
        keyPoints: [
          'Standard form: ax + by + c = 0 where a, b not both zero',
          'A linear equation has infinitely many solutions',
          'Each solution is an ordered pair (x, y)',
          'Graph of linear equation is a straight line',
          'To find solutions, substitute values and solve',
          'Every point on the line satisfies the equation',
          'Equations like x = 3 represent vertical lines',
          'Equations like y = 2 represent horizontal lines'
        ],
        skills: ['algebra manipulation', 'problem solving', 'data interpretation'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Introduction to Euclid\'s Geometry',
        chapterNumber: 5,
        summary: 'Euclid, a Greek mathematician, systematized geometry in his work "Elements." He started with basic terms that cannot be defined: point, line, and plane. From these, he developed definitions, axioms (self-evident truths), and postulates (geometric assumptions). Axioms apply to all mathematics, while postulates are specific to geometry. Euclid\'s five postulates form the foundation of plane geometry. The fifth postulate, about parallel lines, is particularly famous and led to the development of non-Euclidean geometries centuries later.',
        keyPoints: [
          'Euclid organized geometry in his book "Elements"',
          'Point, line, and plane are undefined basic terms',
          'Axioms are self-evident truths accepted without proof',
          'Postulates are assumptions specific to geometry',
          'Euclid\'s first postulate: A line can be drawn from any point to any other point',
          'Theorems are statements proved using axioms and postulates',
          'Things equal to the same thing are equal to each other',
          'The whole is greater than the part'
        ],
        skills: ['concept recall', 'scientific reasoning', 'problem solving'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Lines and Angles',
        chapterNumber: 6,
        summary: 'This chapter explores the properties of lines and angles. When two lines intersect, they form two pairs of vertically opposite angles, which are always equal. When a transversal crosses two parallel lines, it creates several angle pairs: corresponding angles (equal), alternate interior angles (equal), alternate exterior angles (equal), and co-interior angles (supplementary, sum to 180°). These properties help us prove lines parallel and find unknown angles. Understanding these relationships is fundamental to proving geometric theorems.',
        keyPoints: [
          'Vertically opposite angles are equal',
          'Corresponding angles are equal when lines are parallel',
          'Alternate interior angles are equal when lines are parallel',
          'Co-interior (same-side interior) angles are supplementary',
          'Linear pair of angles sum to 180°',
          'If a transversal makes equal corresponding angles, lines are parallel',
          'Alternate exterior angles are equal when lines are parallel',
          'Angles on the same side of transversal and between parallel lines are co-interior'
        ],
        skills: ['problem solving', 'scientific reasoning', 'concept recall'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Triangles',
        chapterNumber: 7,
        summary: 'Triangles are the simplest polygons, having three sides and three angles. The sum of angles in any triangle is 180°. Triangles are congruent if they have the same size and shape. Several criteria establish congruence: SSS (all three sides equal), SAS (two sides and included angle equal), ASA (two angles and included side equal), AAS (two angles and a non-included side equal), and RHS (right angle, hypotenuse, and one side equal for right triangles). Congruent triangles have all corresponding parts equal.',
        keyPoints: [
          'Sum of angles in a triangle is 180°',
          'Congruent triangles have same shape and size',
          'SSS: Three sides equal means triangles are congruent',
          'SAS: Two sides and included angle equal',
          'ASA: Two angles and included side equal',
          'AAS: Two angles and any corresponding side equal',
          'RHS: Right triangles with hypotenuse and one side equal',
          'Corresponding parts of congruent triangles are equal (CPCT)'
        ],
        skills: ['scientific reasoning', 'problem solving', 'concept recall'],
        flashcards: [],
        questions: []
      },
      {
        title: 'Quadrilaterals',
        chapterNumber: 8,
        summary: 'Quadrilaterals are four-sided polygons with angle sum of 360°. Special types include parallelograms (opposite sides parallel), rectangles (parallelograms with right angles), rhombuses (parallelograms with all sides equal), squares (both rectangle and rhombus properties), and trapeziums (one pair of parallel sides). In a parallelogram, opposite sides and angles are equal, and diagonals bisect each other. The midpoint theorem states that the line joining midpoints of two sides of a triangle is parallel to the third side and half its length.',
        keyPoints: [
          'Sum of angles in a quadrilateral is 360°',
          'Parallelogram: opposite sides are parallel and equal',
          'In a parallelogram, diagonals bisect each other',
          'Rectangle: parallelogram with 90° angles',
          'Rhombus: parallelogram with all sides equal',
          'Square: both rectangle and rhombus',
          'Trapezium: exactly one pair of parallel sides',
          'Mid-point theorem: line joining midpoints is parallel to third side and half its length'
        ],
        skills: ['concept recall', 'problem solving', 'scientific reasoning'],
        flashcards: [],
        questions: []
      }
    ]
  },
  {
    name: 'Science',
    icon: '🔬',
    chapters: [
      {
        title: 'Matter in Our Surroundings',
        chapterNumber: 1,
        summary: 'Everything around us is made of matter, which occupies space and has mass. Matter exists in three states: solid, liquid, and gas. Solids have fixed shape and volume due to closely packed particles with strong forces between them. Liquids have fixed volume but take the shape of their container as particles can move past each other. Gases have neither fixed shape nor volume as particles move freely with weak forces. Matter can change state through heating (melting, evaporation, sublimation) or cooling (freezing, condensation). These changes are reversible physical changes.',
        keyPoints: [
          'Matter is anything that has mass and occupies space',
          'Three states: solid, liquid, gas',
          'Solids have definite shape and volume',
          'Liquids have definite volume but no fixed shape',
          'Gases have neither definite shape nor volume',
          'Particles in solids vibrate in fixed positions',
          'Melting point: temperature at which solid becomes liquid',
          'Evaporation occurs at all temperatures at the surface'
        ],
        skills: ['concept recall', 'scientific reasoning', 'data interpretation'],
        flashcards: [
          { front: 'What is matter?', back: 'Anything that has mass and occupies space' },
          { front: 'Name the three states of matter', back: 'Solid, liquid, and gas' },
          { front: 'What is melting point?', back: 'Temperature at which a solid changes to liquid' },
          { front: 'How do particles move in gases?', back: 'Freely in all directions with high speed' },
          { front: 'What is sublimation?', back: 'Direct change from solid to gas without becoming liquid' },
          { front: 'Why do solids have fixed shape?', back: 'Particles are tightly packed with strong forces' },
          { front: 'What is evaporation?', back: 'Liquid changing to gas at any temperature from the surface' },
          { front: 'Give an example of sublimation', back: 'Dry ice (solid CO₂) or camphor' },
          { front: 'What is condensation?', back: 'Gas changing to liquid when cooled' },
          { front: 'Why can gases be compressed?', back: 'Large spaces between particles allow compression' }
        ],
        questions: [
          { text: 'Which state of matter has definite volume but no definite shape?', type: 'mcq', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid', level: 1, skills: ['concept recall'], explanation: 'Liquids take container shape but volume is fixed' },
          { text: 'What happens to particles when a solid melts?', type: 'mcq', options: ['Move faster', 'Stop moving', 'Break apart', 'Disappear'], answer: 'Move faster', level: 2, skills: ['scientific reasoning'], explanation: 'Heat energy increases particle movement' },
          { text: 'Dry ice is an example of:', type: 'mcq', options: ['Melting', 'Evaporation', 'Sublimation', 'Condensation'], answer: 'Sublimation', level: 2, skills: ['concept recall'], explanation: 'Dry ice changes directly from solid to gas' },
          { text: 'Why do gases fill their container completely?', type: 'mcq', options: ['Strong forces', 'Weak forces and high kinetic energy', 'Fixed positions', 'No movement'], answer: 'Weak forces and high kinetic energy', level: 3, skills: ['scientific reasoning'], explanation: 'Weak intermolecular forces allow particles to spread' },
          { text: 'Compare evaporation and boiling', type: 'short', answer: 'Evaporation occurs at any temperature at surface only; boiling occurs throughout liquid at boiling point', level: 4, skills: ['concept recall'], explanation: 'Both are liquid to gas but differ in location and temperature' },
          { text: 'At what temperature does water freeze?', type: 'mcq', options: ['0°C', '100°C', '25°C', '-100°C'], answer: '0°C', level: 1, skills: ['concept recall'], explanation: 'Water freezes at 0°C at normal pressure' },
          { text: 'Why does ice float on water?', type: 'short', answer: 'Ice is less dense than water because water expands when it freezes', level: 5, skills: ['scientific reasoning'], explanation: 'Unusual property of water - solid is less dense than liquid' },
          { text: 'Which factor increases evaporation rate?', type: 'mcq', options: ['Lower temperature', 'Higher humidity', 'More surface area', 'Less wind'], answer: 'More surface area', level: 3, skills: ['data interpretation'], explanation: 'More surface area means more particles can escape' },
          { text: 'What is latent heat?', type: 'mcq', options: ['Heat that changes temperature', 'Hidden heat for state change', 'Heat in solids', 'Cold temperature'], answer: 'Hidden heat for state change', level: 3, skills: ['concept recall'], explanation: 'Heat absorbed during state change without temperature change' },
          { text: 'Create an experiment to show evaporation', type: 'short', answer: 'Put water in two plates - one in sun, one in shade. The sunlit one loses water faster through evaporation', level: 6, skills: ['scientific reasoning'], explanation: 'Controlled experiment showing effect of heat on evaporation' },
          { text: 'What happens during condensation?', type: 'mcq', options: ['Liquid to gas', 'Gas to liquid', 'Solid to liquid', 'Solid to gas'], answer: 'Gas to liquid', level: 1, skills: ['concept recall'], explanation: 'Condensation is the reverse of evaporation' },
          { text: 'Judge: All matter can exist in all three states.', type: 'mcq', options: ['True', 'False'], answer: 'True', level: 4, skills: ['scientific reasoning'], explanation: 'At appropriate temperature and pressure, any matter can change state' }
        ]
      },
      {
        title: 'Is Matter Around Us Pure?',
        chapterNumber: 2,
        summary: 'Matter can be classified as pure substances or mixtures. Pure substances have fixed composition and properties - they can be elements (made of one type of atom) or compounds (atoms of different elements chemically combined). Mixtures contain two or more substances physically combined with variable composition. Mixtures can be homogeneous (uniform, like solutions) or heterogeneous (non-uniform, like sand and water). Solutions have a solute dissolved in a solvent. Separation techniques like filtration, evaporation, distillation, and chromatography help separate mixture components.',
        keyPoints: [
          'Pure substances have fixed composition and properties',
          'Elements contain only one type of atom',
          'Compounds are chemically combined elements',
          'Mixtures are physically combined substances',
          'Homogeneous mixtures are uniform throughout (solutions)',
          'Heterogeneous mixtures have visible different parts',
          'Solute + Solvent = Solution',
          'Separation techniques: filtration, evaporation, distillation, chromatography'
        ],
        skills: ['concept recall', 'scientific reasoning', 'data interpretation'],
        flashcards: [
          { front: 'What is a pure substance?', back: 'A substance with fixed composition and definite properties' },
          { front: 'What is the difference between element and compound?', back: 'Element has one type of atom; compound has different elements chemically combined' },
          { front: 'What is a solution?', back: 'A homogeneous mixture of solute dissolved in solvent' },
          { front: 'Name a heterogeneous mixture', back: 'Sand and water, oil and water, salad' },
          { front: 'What is filtration used for?', back: 'Separating insoluble solids from liquids' },
          { front: 'What is distillation?', back: 'Separating liquids based on different boiling points' },
          { front: 'What is chromatography?', back: 'Separating colored components of a mixture' },
          { front: 'What is an alloy?', back: 'A homogeneous mixture of metals' },
          { front: 'Is air a mixture or compound?', back: 'Mixture (of gases like N₂, O₂, CO₂)' },
          { front: 'What is saturation?', back: 'When no more solute can dissolve in a solvent at given temperature' }
        ],
        questions: [
          { text: 'Which is a pure substance?', type: 'mcq', options: ['Air', 'Sea water', 'Distilled water', 'Milk'], answer: 'Distilled water', level: 1, skills: ['concept recall'], explanation: 'Distilled water is pure H₂O' },
          { text: 'Sugar dissolved in water is a:', type: 'mcq', options: ['Compound', 'Element', 'Heterogeneous mixture', 'Homogeneous mixture'], answer: 'Homogeneous mixture', level: 2, skills: ['concept recall'], explanation: 'Sugar solution is uniform throughout' },
          { text: 'Which method separates salt from sea water?', type: 'mcq', options: ['Filtration', 'Evaporation', 'Magnet', 'Hand picking'], answer: 'Evaporation', level: 2, skills: ['concept recall'], explanation: 'Water evaporates, leaving salt behind' },
          { text: 'In a solution of salt water, salt is the:', type: 'mcq', options: ['Solvent', 'Solute', 'Solution', 'Mixture'], answer: 'Solute', level: 1, skills: ['concept recall'], explanation: 'The dissolved substance is the solute' },
          { text: 'Compare elements and compounds', type: 'short', answer: 'Elements contain one type of atom and cannot be broken down; compounds contain different elements chemically combined and can be separated by chemical means', level: 4, skills: ['concept recall'], explanation: 'Fundamental difference in composition' },
          { text: 'Brass is an example of:', type: 'mcq', options: ['Compound', 'Element', 'Alloy', 'Suspension'], answer: 'Alloy', level: 2, skills: ['concept recall'], explanation: 'Brass is a mixture of copper and zinc' },
          { text: 'Which technique uses difference in boiling points?', type: 'mcq', options: ['Filtration', 'Distillation', 'Chromatography', 'Sedimentation'], answer: 'Distillation', level: 2, skills: ['concept recall'], explanation: 'Distillation separates by boiling point difference' },
          { text: 'Why is air considered a mixture?', type: 'short', answer: 'It contains multiple gases (N₂, O₂, etc.) in variable proportions, not chemically combined', level: 3, skills: ['scientific reasoning'], explanation: 'Composition can vary, no fixed ratio' },
          { text: 'What is a suspension?', type: 'mcq', options: ['Clear solution', 'Particles settle on standing', 'Uniform mixture', 'Chemical compound'], answer: 'Particles settle on standing', level: 2, skills: ['concept recall'], explanation: 'Suspensions have large particles that settle' },
          { text: 'Design a method to separate iron filings from sand', type: 'short', answer: 'Use a magnet - iron filings are magnetic and will stick to the magnet, leaving sand behind', level: 6, skills: ['scientific reasoning'], explanation: 'Uses magnetic property difference' },
          { text: 'Ink can be separated using:', type: 'mcq', options: ['Distillation', 'Filtration', 'Chromatography', 'Evaporation'], answer: 'Chromatography', level: 3, skills: ['concept recall'], explanation: 'Chromatography separates colored components' },
          { text: 'Judge: A colloid is more stable than a suspension.', type: 'mcq', options: ['True', 'False'], answer: 'True', level: 5, skills: ['scientific reasoning'], explanation: 'Colloid particles are smaller and don\'t settle easily' }
        ]
      },
      {
        title: 'Atoms and Molecules',
        chapterNumber: 3,
        summary: 'Atoms are the smallest particles of elements that maintain chemical identity. Molecules are groups of atoms bonded together. John Dalton proposed the atomic theory: elements are made of indivisible atoms, atoms of the same element are identical, and compounds form when atoms combine in fixed ratios. Atomic mass is measured in atomic mass units (amu), with carbon-12 as the standard. A mole contains 6.022 × 10²³ particles (Avogadro\'s number). Chemical formulas represent the composition of compounds, showing the types and numbers of atoms present.',
        keyPoints: [
          'Atoms are the smallest particles of an element',
          'Molecules are groups of atoms bonded together',
          'Dalton\'s atomic theory explains the nature of atoms',
          'Atoms of the same element are identical',
          'Compounds form when atoms combine in fixed ratios',
          'Atomic mass unit (amu) is 1/12 of carbon-12 mass',
          'Mole: 6.022 × 10²³ particles (Avogadro\'s number)',
          'Molecular formula shows types and numbers of atoms'
        ],
        skills: ['concept recall', 'numeracy', 'scientific reasoning'],
        flashcards: [
          { front: 'What is an atom?', back: 'The smallest particle of an element that retains its chemical properties' },
          { front: 'What is a molecule?', back: 'A group of two or more atoms bonded together' },
          { front: 'What is Avogadro\'s number?', back: '6.022 × 10²³' },
          { front: 'What is a mole?', back: 'Amount of substance containing Avogadro\'s number of particles' },
          { front: 'What is atomic mass unit?', back: '1/12 of the mass of a carbon-12 atom' },
          { front: 'What does H₂O mean?', back: '2 hydrogen atoms and 1 oxygen atom in a molecule' },
          { front: 'Who proposed atomic theory?', back: 'John Dalton' },
          { front: 'What is valency?', back: 'The combining capacity of an atom' },
          { front: 'What is molecular mass?', back: 'Sum of atomic masses of all atoms in a molecule' },
          { front: 'What is a chemical formula?', back: 'Symbolic representation of a compound showing atoms and their numbers' }
        ],
        questions: [
          { text: 'The smallest particle of an element is:', type: 'mcq', options: ['Molecule', 'Atom', 'Proton', 'Electron'], answer: 'Atom', level: 1, skills: ['concept recall'], explanation: 'Atoms are the basic units of elements' },
          { text: 'Avogadro\'s number is:', type: 'mcq', options: ['6.022 × 10²³', '6.022 × 10²⁴', '3.14', '2.71'], answer: '6.022 × 10²³', level: 1, skills: ['concept recall'], explanation: 'This is the number of particles in one mole' },
          { text: 'The molecular formula of water is:', type: 'mcq', options: ['HO', 'H₂O', 'H₂O₂', 'HO₂'], answer: 'H₂O', level: 1, skills: ['concept recall'], explanation: 'Water has 2 hydrogen atoms and 1 oxygen atom' },
          { text: 'Calculate the molecular mass of CO₂ (C=12, O=16)', type: 'mcq', options: ['28', '44', '32', '56'], answer: '44', level: 3, skills: ['numeracy'], explanation: '12 + 16 + 16 = 44 amu' },
          { text: 'Who proposed that atoms are indivisible?', type: 'mcq', options: ['Newton', 'Dalton', 'Einstein', 'Bohr'], answer: 'Dalton', level: 2, skills: ['concept recall'], explanation: 'John Dalton proposed this in his atomic theory' },
          { text: 'Compare atoms and molecules', type: 'short', answer: 'Atoms are single particles of an element; molecules are two or more atoms bonded together, can be same or different elements', level: 4, skills: ['concept recall'], explanation: 'Fundamental difference in structure' },
          { text: 'What is the mass of 1 mole of oxygen gas (O₂)? (O=16)', type: 'mcq', options: ['16g', '32g', '8g', '64g'], answer: '32g', level: 3, skills: ['numeracy'], explanation: 'O₂ molecular mass = 16 × 2 = 32g/mol' },
          { text: 'The valency of carbon is:', type: 'mcq', options: ['1', '2', '3', '4'], answer: '4', level: 2, skills: ['concept recall'], explanation: 'Carbon can form 4 bonds' },
          { text: 'Calculate number of atoms in 2 moles of H₂', type: 'short', answer: '2 moles × 2 atoms/molecule × 6.022 × 10²³ = 2.4088 × 10²⁴ atoms', level: 5, skills: ['numeracy'], explanation: 'Each H₂ molecule has 2 atoms' },
          { text: 'Create the formula for sodium chloride', type: 'short', answer: 'NaCl (Na has valency 1, Cl has valency 1)', level: 6, skills: ['scientific reasoning'], explanation: 'Valencies must balance' },
          { text: 'What is the atomicity of ozone (O₃)?', type: 'mcq', options: ['1', '2', '3', '4'], answer: '3', level: 2, skills: ['concept recall'], explanation: 'Atomicity is the number of atoms in a molecule' },
          { text: 'Judge: One mole of any substance contains the same number of particles.', type: 'mcq', options: ['True', 'False'], answer: 'True', level: 4, skills: ['scientific reasoning'], explanation: 'By definition, 1 mole = 6.022 × 10²³ particles' }
        ]
      },
      {
        title: 'Structure of the Atom',
        chapterNumber: 4,
        summary: 'Atoms consist of subatomic particles: protons (positive), neutrons (neutral), and electrons (negative). Thomson proposed the plum pudding model, but Rutherford\'s gold foil experiment revealed a dense positive nucleus with electrons orbiting around it. Bohr refined this with electron shells at fixed energy levels. The atomic number equals protons, and mass number equals protons plus neutrons. Electrons are arranged in shells (K, L, M, N) following the 2n² rule. Isotopes are atoms of the same element with different neutrons.',
        keyPoints: [
          'Atoms have protons (+), neutrons (0), and electrons (-)',
          'Protons and neutrons are in the nucleus; electrons orbit around',
          'Rutherford discovered the nucleus through gold foil experiment',
          'Bohr proposed electrons in fixed energy levels (shells)',
          'Atomic number = number of protons',
          'Mass number = protons + neutrons',
          'Electron shells: K(2), L(8), M(18), N(32)',
          'Isotopes: same atomic number, different mass number'
        ],
        skills: ['concept recall', 'numeracy', 'scientific reasoning'],
        flashcards: [
          { front: 'What is the charge on a proton?', back: 'Positive (+1)' },
          { front: 'What is atomic number?', back: 'Number of protons in an atom' },
          { front: 'What is mass number?', back: 'Number of protons + neutrons' },
          { front: 'Who discovered the nucleus?', back: 'Ernest Rutherford' },
          { front: 'What is an isotope?', back: 'Atoms of same element with different neutrons' },
          { front: 'What is the maximum electrons in K shell?', back: '2 electrons' },
          { front: 'What is the formula for max electrons in a shell?', back: '2n² where n is shell number' },
          { front: 'What is a neutron?', back: 'A neutral particle in the nucleus' },
          { front: 'Who proposed the plum pudding model?', back: 'J.J. Thomson' },
          { front: 'What keeps electrons in orbit?', back: 'Electrostatic attraction to the positive nucleus' }
        ],
        questions: [
          { text: 'The nucleus contains:', type: 'mcq', options: ['Protons only', 'Electrons only', 'Protons and neutrons', 'Protons and electrons'], answer: 'Protons and neutrons', level: 1, skills: ['concept recall'], explanation: 'Nucleus has protons and neutrons' },
          { text: 'An atom has atomic number 11 and mass number 23. How many neutrons does it have?', type: 'mcq', options: ['11', '12', '23', '34'], answer: '12', level: 2, skills: ['numeracy'], explanation: 'Neutrons = Mass number - Atomic number = 23 - 11 = 12' },
          { text: 'Which experiment led to the discovery of the nucleus?', type: 'mcq', options: ['Oil drop', 'Gold foil', 'Cathode ray', 'Photoelectric'], answer: 'Gold foil', level: 2, skills: ['concept recall'], explanation: 'Rutherford\'s gold foil experiment' },
          { text: 'Maximum electrons in M shell is:', type: 'mcq', options: ['2', '8', '18', '32'], answer: '18', level: 2, skills: ['numeracy'], explanation: 'Using 2n²: 2(3)² = 18' },
          { text: 'Compare protons and electrons', type: 'short', answer: 'Protons are positive, in nucleus, mass ≈ 1 amu; Electrons are negative, orbit nucleus, mass negligible', level: 4, skills: ['concept recall'], explanation: 'Key differences in charge, location, and mass' },
          { text: 'Carbon-12 and Carbon-14 are:', type: 'mcq', options: ['Isobars', 'Isotopes', 'Isotones', 'Different elements'], answer: 'Isotopes', level: 2, skills: ['concept recall'], explanation: 'Same element, different mass numbers' },
          { text: 'The electronic configuration of sodium (atomic number 11) is:', type: 'mcq', options: ['2,8,1', '2,9', '8,3', '2,8,2'], answer: '2,8,1', level: 3, skills: ['numeracy'], explanation: 'Fill shells: K(2), L(8), M(1) = 11 electrons' },
          { text: 'Why is most of an atom empty space?', type: 'short', answer: 'The tiny nucleus contains most mass; electrons orbit at relatively large distances', level: 4, skills: ['scientific reasoning'], explanation: 'Rutherford discovered this through gold foil experiment' },
          { text: 'What is the valence shell?', type: 'mcq', options: ['First shell', 'Innermost shell', 'Outermost shell', 'Nucleus'], answer: 'Outermost shell', level: 2, skills: ['concept recall'], explanation: 'Valence shell determines chemical properties' },
          { text: 'Design an atom with atomic number 6 and mass number 12', type: 'short', answer: 'Carbon: 6 protons, 6 neutrons, 6 electrons. Config: 2,4', level: 6, skills: ['numeracy'], explanation: 'Apply definitions and electron filling rules' },
          { text: 'Which shell fills after K shell?', type: 'mcq', options: ['M', 'L', 'N', 'O'], answer: 'L', level: 1, skills: ['concept recall'], explanation: 'Shells fill in order: K, L, M, N...' },
          { text: 'Judge: Atoms are electrically neutral.', type: 'mcq', options: ['True', 'False'], answer: 'True', level: 3, skills: ['scientific reasoning'], explanation: 'Equal protons and electrons give neutral charge' }
        ]
      },
      {
        title: 'The Fundamental Unit of Life',
        chapterNumber: 5,
        summary: 'The cell is the basic structural and functional unit of all living organisms. Robert Hooke first observed cells in cork. Cells can be prokaryotic (no membrane-bound nucleus, like bacteria) or eukaryotic (with nucleus, like plants and animals). Cell organelles include the nucleus (control center), mitochondria (powerhouse), chloroplasts (photosynthesis in plants), endoplasmic reticulum (transport), Golgi body (packaging), ribosomes (protein synthesis), and vacuoles (storage). The cell membrane controls what enters and exits the cell.',
        keyPoints: [
          'Cell is the basic unit of life',
          'Robert Hooke discovered cells in 1665',
          'Prokaryotic cells lack membrane-bound nucleus',
          'Eukaryotic cells have a true nucleus',
          'Nucleus contains DNA and controls cell activities',
          'Mitochondria are the powerhouse of the cell',
          'Chloroplasts are found only in plant cells',
          'Cell membrane is selectively permeable'
        ],
        skills: ['concept recall', 'scientific reasoning', 'data interpretation'],
        flashcards: [
          { front: 'Who discovered cells?', back: 'Robert Hooke in 1665' },
          { front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
          { front: 'Where is DNA found in a cell?', back: 'In the nucleus' },
          { front: 'What is the function of chloroplast?', back: 'Photosynthesis in plant cells' },
          { front: 'What is the difference between prokaryotic and eukaryotic cells?', back: 'Prokaryotic lack membrane-bound nucleus; eukaryotic have true nucleus' },
          { front: 'What does the cell membrane do?', back: 'Controls entry and exit of materials' },
          { front: 'What is cytoplasm?', back: 'Jelly-like substance inside the cell' },
          { front: 'Function of ribosomes?', back: 'Protein synthesis' },
          { front: 'What is the cell wall made of?', back: 'Cellulose in plant cells' },
          { front: 'What are vacuoles?', back: 'Storage sacs in cells' }
        ],
        questions: [
          { text: 'The control center of the cell is:', type: 'mcq', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'], answer: 'Nucleus', level: 1, skills: ['concept recall'], explanation: 'Nucleus contains DNA and controls cell functions' },
          { text: 'Which organelle is found only in plant cells?', type: 'mcq', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'], answer: 'Chloroplast', level: 2, skills: ['concept recall'], explanation: 'Chloroplasts carry out photosynthesis' },
          { text: 'Bacteria are examples of:', type: 'mcq', options: ['Eukaryotic cells', 'Prokaryotic cells', 'Multicellular', 'Dead cells'], answer: 'Prokaryotic cells', level: 2, skills: ['concept recall'], explanation: 'Bacteria lack membrane-bound nucleus' },
          { text: 'Which organelle produces energy?', type: 'mcq', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], answer: 'Mitochondria', level: 1, skills: ['concept recall'], explanation: 'Mitochondria produce ATP through respiration' },
          { text: 'Compare plant and animal cells', type: 'short', answer: 'Plant cells have cell wall, chloroplasts, and large vacuole; animal cells have centrioles and small vacuoles', level: 4, skills: ['concept recall'], explanation: 'Key structural differences' },
          { text: 'What is the function of the Golgi apparatus?', type: 'mcq', options: ['Protein synthesis', 'Packaging and transport', 'Respiration', 'Photosynthesis'], answer: 'Packaging and transport', level: 2, skills: ['concept recall'], explanation: 'Golgi packages materials for transport' },
          { text: 'Why is the cell membrane called selectively permeable?', type: 'short', answer: 'It allows only certain substances to pass through while blocking others', level: 3, skills: ['scientific reasoning'], explanation: 'Selective permeability controls cell contents' },
          { text: 'What is osmosis?', type: 'mcq', options: ['Movement of solute', 'Movement of water through membrane', 'Movement of air', 'Cell division'], answer: 'Movement of water through membrane', level: 2, skills: ['concept recall'], explanation: 'Osmosis is water movement across semipermeable membrane' },
          { text: 'Ribosomes are responsible for:', type: 'mcq', options: ['Energy production', 'Protein synthesis', 'DNA storage', 'Waste removal'], answer: 'Protein synthesis', level: 2, skills: ['concept recall'], explanation: 'Ribosomes make proteins' },
          { text: 'Create a labeled diagram of a cell (describe key parts)', type: 'short', answer: 'Nucleus (center, contains DNA), Mitochondria (oval, energy), ER (network), Cell membrane (outer boundary), Cytoplasm (filling)', level: 6, skills: ['scientific reasoning'], explanation: 'Visualizing cell structure' },
          { text: 'What gives plant cells their shape?', type: 'mcq', options: ['Nucleus', 'Cell wall', 'Vacuole', 'Cytoplasm'], answer: 'Cell wall', level: 2, skills: ['concept recall'], explanation: 'Rigid cell wall provides structure' },
          { text: 'Judge: All cells have a nucleus.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['scientific reasoning'], explanation: 'Prokaryotes and RBCs lack nuclei' }
        ]
      },
      {
        title: 'Tissues',
        chapterNumber: 6,
        summary: 'Tissues are groups of similar cells performing a specific function. There are four main types of animal tissues: epithelial (covering), connective (binding), muscular (movement), and nervous (signal transmission). Plant tissues are meristematic (growth at tips) and permanent (differentiated cells). Permanent tissues include parenchyma, collenchyma, sclerenchyma, and complex tissues like xylem and phloem. Xylem transports water upward, while phloem transports food throughout the plant.',
        keyPoints: [
          'Tissue is a group of similar cells with a common function',
          'Animal tissues: epithelial, connective, muscular, nervous',
          'Epithelial tissue covers and protects body surfaces',
          'Connective tissue binds and supports organs',
          'Meristematic tissue is found at growing points of plants',
          'Xylem transports water and minerals',
          'Phloem transports food (sugars)',
          'Blood is a connective tissue'
        ],
        skills: ['concept recall', 'scientific reasoning', 'data interpretation'],
        flashcards: [
          { front: 'What is a tissue?', back: 'A group of similar cells performing a common function' },
          { front: 'Name the four animal tissue types', back: 'Epithelial, connective, muscular, nervous' },
          { front: 'What does xylem transport?', back: 'Water and minerals upward' },
          { front: 'What does phloem transport?', back: 'Food (sugars) throughout the plant' },
          { front: 'Where is meristematic tissue found?', back: 'At growing points - tips of roots and stems' },
          { front: 'What is the function of epithelial tissue?', back: 'Covers and protects body surfaces' },
          { front: 'Is blood a tissue?', back: 'Yes, it is a connective tissue' },
          { front: 'What is sclerenchyma?', back: 'Dead plant tissue providing mechanical support' },
          { front: 'What is the function of nervous tissue?', back: 'Transmits signals/impulses' },
          { front: 'What are stomata?', back: 'Pores in leaves for gas exchange' }
        ],
        questions: [
          { text: 'Which tissue is responsible for movement?', type: 'mcq', options: ['Epithelial', 'Muscular', 'Nervous', 'Connective'], answer: 'Muscular', level: 1, skills: ['concept recall'], explanation: 'Muscular tissue enables movement' },
          { text: 'Xylem and phloem are examples of:', type: 'mcq', options: ['Simple tissue', 'Complex tissue', 'Meristematic tissue', 'Animal tissue'], answer: 'Complex tissue', level: 2, skills: ['concept recall'], explanation: 'They contain multiple cell types' },
          { text: 'Which plant tissue is responsible for growth?', type: 'mcq', options: ['Parenchyma', 'Sclerenchyma', 'Meristematic', 'Phloem'], answer: 'Meristematic', level: 2, skills: ['concept recall'], explanation: 'Meristematic cells divide to produce new cells' },
          { text: 'Blood is classified as which tissue type?', type: 'mcq', options: ['Epithelial', 'Muscular', 'Connective', 'Nervous'], answer: 'Connective', level: 2, skills: ['concept recall'], explanation: 'Blood connects and transports throughout body' },
          { text: 'Compare xylem and phloem', type: 'short', answer: 'Xylem: dead cells, transports water upward. Phloem: living cells, transports food both ways', level: 4, skills: ['concept recall'], explanation: 'Both are vascular tissues with different functions' },
          { text: 'Which tissue lines the mouth and blood vessels?', type: 'mcq', options: ['Muscular', 'Epithelial', 'Connective', 'Nervous'], answer: 'Epithelial', level: 2, skills: ['concept recall'], explanation: 'Epithelium covers internal and external surfaces' },
          { text: 'What is the function of parenchyma?', type: 'mcq', options: ['Support', 'Photosynthesis and storage', 'Transport', 'Growth'], answer: 'Photosynthesis and storage', level: 3, skills: ['concept recall'], explanation: 'Parenchyma stores food and performs photosynthesis' },
          { text: 'Why are cardiac muscles called involuntary?', type: 'short', answer: 'They contract automatically without conscious control to keep heart beating', level: 4, skills: ['scientific reasoning'], explanation: 'Heart muscles work continuously without rest' },
          { text: 'Which tissue has the longest cells?', type: 'mcq', options: ['Epithelial', 'Muscle', 'Nervous', 'Connective'], answer: 'Nervous', level: 3, skills: ['concept recall'], explanation: 'Neurons can be very long (meters in some cases)' },
          { text: 'Design a comparison table of animal tissues', type: 'short', answer: 'Epithelial: covers surfaces. Connective: binds/supports. Muscular: movement. Nervous: signals', level: 6, skills: ['data interpretation'], explanation: 'Organizing tissue information' },
          { text: 'Collenchyma provides:', type: 'mcq', options: ['Conduction', 'Flexibility and support', 'Storage', 'Protection'], answer: 'Flexibility and support', level: 2, skills: ['concept recall'], explanation: 'Collenchyma is flexible supporting tissue' },
          { text: 'Judge: All plant tissues are living.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['scientific reasoning'], explanation: 'Sclerenchyma and xylem vessels are dead at maturity' }
        ]
      },
      {
        title: 'Motion',
        chapterNumber: 8,
        summary: 'Motion is the change in position of an object with time. Distance is the total path traveled, while displacement is the shortest distance between start and end points. Speed is distance per unit time; velocity is displacement per unit time with direction. Acceleration is the rate of change of velocity. The three equations of motion relate velocity, acceleration, distance, and time for uniformly accelerated motion. Graphical representations help visualize motion patterns.',
        keyPoints: [
          'Motion is change in position with time',
          'Distance: total path length (scalar)',
          'Displacement: shortest distance with direction (vector)',
          'Speed = distance/time (scalar)',
          'Velocity = displacement/time (vector)',
          'Acceleration = change in velocity/time',
          'Equations of motion: v=u+at, s=ut+½at², v²=u²+2as',
          'Uniform motion: equal distances in equal time intervals'
        ],
        skills: ['numeracy', 'problem solving', 'data interpretation'],
        flashcards: [
          { front: 'What is the SI unit of speed?', back: 'metres per second (m/s)' },
          { front: 'What is displacement?', back: 'Shortest distance between initial and final positions with direction' },
          { front: 'What is acceleration?', back: 'Rate of change of velocity' },
          { front: 'State the first equation of motion', back: 'v = u + at' },
          { front: 'What is uniform motion?', back: 'Motion with constant velocity' },
          { front: 'Difference between speed and velocity?', back: 'Speed is scalar, velocity is vector (has direction)' },
          { front: 'What does the slope of distance-time graph represent?', back: 'Speed' },
          { front: 'What is retardation?', back: 'Negative acceleration (deceleration)' },
          { front: 'When is acceleration zero?', back: 'When velocity is constant' },
          { front: 'What is the SI unit of acceleration?', back: 'm/s²' }
        ],
        questions: [
          { text: 'The SI unit of velocity is:', type: 'mcq', options: ['m', 'm/s', 'm/s²', 'km/h'], answer: 'm/s', level: 1, skills: ['concept recall'], explanation: 'Velocity is displacement per second' },
          { text: 'A car travels 100m in 10s. Its speed is:', type: 'mcq', options: ['10 m/s', '100 m/s', '1000 m/s', '1 m/s'], answer: '10 m/s', level: 2, skills: ['numeracy'], explanation: 'Speed = 100m ÷ 10s = 10 m/s' },
          { text: 'An object moving with constant velocity has:', type: 'mcq', options: ['Zero displacement', 'Zero acceleration', 'Zero speed', 'Negative acceleration'], answer: 'Zero acceleration', level: 2, skills: ['concept recall'], explanation: 'No change in velocity means zero acceleration' },
          { text: 'A ball is thrown up and falls back. What is its displacement?', type: 'mcq', options: ['Maximum height', 'Zero', 'Twice the height', 'Cannot tell'], answer: 'Zero', level: 3, skills: ['problem solving'], explanation: 'Starts and ends at same position' },
          { text: 'Compare distance and displacement', type: 'short', answer: 'Distance: total path, scalar, always positive. Displacement: shortest path, vector, can be negative', level: 4, skills: ['concept recall'], explanation: 'Fundamental difference in physics' },
          { text: 'Using v = u + at, find v if u=5 m/s, a=2 m/s², t=3s', type: 'mcq', options: ['8 m/s', '11 m/s', '15 m/s', '10 m/s'], answer: '11 m/s', level: 3, skills: ['numeracy'], explanation: 'v = 5 + (2)(3) = 11 m/s' },
          { text: 'What does a straight line in v-t graph indicate?', type: 'mcq', options: ['Uniform acceleration', 'No motion', 'Uniform velocity', 'Cannot tell'], answer: 'Uniform acceleration', level: 3, skills: ['data interpretation'], explanation: 'Constant slope in v-t graph means constant acceleration' },
          { text: 'Calculate distance using s = ut + ½at² with u=0, a=4 m/s², t=3s', type: 'mcq', options: ['12m', '18m', '36m', '6m'], answer: '18m', level: 4, skills: ['numeracy'], explanation: 's = 0 + ½(4)(9) = 18m' },
          { text: 'What does area under v-t graph represent?', type: 'mcq', options: ['Speed', 'Acceleration', 'Displacement', 'Time'], answer: 'Displacement', level: 3, skills: ['data interpretation'], explanation: 'Area = velocity × time = displacement' },
          { text: 'Create a problem using v² = u² + 2as', type: 'short', answer: 'A car starting from rest accelerates at 2 m/s² for 50m. Find final velocity. v² = 0 + 2(2)(50) = 200, v = √200 ≈ 14.1 m/s', level: 6, skills: ['problem solving'], explanation: 'Applying third equation of motion' },
          { text: 'The slope of displacement-time graph gives:', type: 'mcq', options: ['Distance', 'Speed', 'Velocity', 'Acceleration'], answer: 'Velocity', level: 2, skills: ['data interpretation'], explanation: 'Slope = Δs/Δt = velocity' },
          { text: 'Judge: A body can have zero velocity but non-zero acceleration.', type: 'mcq', options: ['True', 'False'], answer: 'True', level: 5, skills: ['scientific reasoning'], explanation: 'E.g., ball at highest point still has g downward' }
        ]
      }
    ]
  },
  {
    name: 'English',
    icon: '📚',
    chapters: [
      {
        title: 'The Fun They Had',
        chapterNumber: 1,
        summary: 'This story by Isaac Asimov is set in the year 2157, where children learn through mechanical teachers at home. Margie and Tommy discover an old paper book about schools where children learned together with human teachers. Margie is fascinated by the concept of having a real person as a teacher and children learning together. She imagines the fun they must have had in those old schools, contrasting it with her lonely, mechanical education. The story explores themes of technology versus human connection in education.',
        keyPoints: [
          'Story is set in the future year 2157',
          'Children learn through mechanical teachers at home',
          'Margie and Tommy find an old printed book',
          'The book describes old schools with human teachers',
          'Margie dislikes her mechanical teacher',
          'Theme: technology in education vs human interaction',
          'Author questions if technology truly improves learning',
          'Highlights the value of learning together'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'Who wrote "The Fun They Had"?', back: 'Isaac Asimov' },
          { front: 'In what year is the story set?', back: '2157' },
          { front: 'What did Margie and Tommy find?', back: 'An old printed book about schools' },
          { front: 'How do children learn in the story?', back: 'Through mechanical teachers at home' },
          { front: 'What fascinates Margie about old schools?', back: 'Children learned together with human teachers' },
          { front: 'What is a "telebook"?', back: 'A book displayed on a screen' },
          { front: 'Why does Margie hate school?', back: 'She dislikes her mechanical teacher' },
          { front: 'What genre is this story?', back: 'Science fiction' },
          { front: 'What is the main theme?', back: 'Technology vs. human connection in education' },
          { front: 'What does Margie think about old schools?', back: 'She thinks children had fun learning together' }
        ],
        questions: [
          { text: 'When is the story set?', type: 'mcq', options: ['1957', '2057', '2157', '2257'], answer: '2157', level: 1, skills: ['concept recall'], explanation: 'The story is set 200 years in the future' },
          { text: 'What did Tommy find in the attic?', type: 'mcq', options: ['A mechanical teacher', 'A real book', 'A telebook', 'A map'], answer: 'A real book', level: 1, skills: ['concept recall'], explanation: 'Tommy found an old printed paper book' },
          { text: 'Why was Margie doing badly in geography?', type: 'mcq', options: ['She didn\'t study', 'The mechanical teacher was too fast', 'She was lazy', 'She had no teacher'], answer: 'The mechanical teacher was too fast', level: 2, skills: ['reading inference'], explanation: 'Her teacher was giving tests at too high a level' },
          { text: 'What is the meaning of "crinkly" in the story?', type: 'mcq', options: ['Smooth', 'Having wrinkles or folds', 'Shiny', 'Thick'], answer: 'Having wrinkles or folds', level: 2, skills: ['concept recall'], explanation: 'The old book pages were crinkly from age' },
          { text: 'Compare Margie\'s school with old schools', type: 'short', answer: 'Margie: learns alone at home with mechanical teacher. Old schools: children learned together with human teachers', level: 4, skills: ['reading inference'], explanation: 'Key contrast in the story' },
          { text: 'Why does Margie find old schools interesting?', type: 'mcq', options: ['No homework', 'Human teachers', 'Shorter hours', 'Better books'], answer: 'Human teachers', level: 2, skills: ['reading inference'], explanation: 'She is fascinated by learning with a human teacher' },
          { text: 'What does the story suggest about technology?', type: 'short', answer: 'Technology can isolate learners; human connection and social learning are valuable', level: 5, skills: ['reading inference'], explanation: 'The author questions if technological education is better' },
          { text: 'What is Tommy\'s reaction to the old book?', type: 'mcq', options: ['Bored', 'Curious', 'Scared', 'Angry'], answer: 'Curious', level: 2, skills: ['reading inference'], explanation: 'He is interested in this unusual object' },
          { text: 'The title "The Fun They Had" refers to:', type: 'mcq', options: ['Margie\'s games', 'Fun in future schools', 'Fun in old schools', 'Tommy\'s jokes'], answer: 'Fun in old schools', level: 3, skills: ['reading inference'], explanation: 'Margie imagines the fun children had in old schools' },
          { text: 'Create an alternative ending for the story', type: 'short', answer: 'Margie could start a movement to bring back group learning, or she could build friendships with neighbors to study together', level: 6, skills: ['writing clarity'], explanation: 'Creative response to themes' },
          { text: 'What was the County Inspector\'s job?', type: 'mcq', options: ['Teaching students', 'Fixing mechanical teachers', 'Giving exams', 'Writing books'], answer: 'Fixing mechanical teachers', level: 2, skills: ['concept recall'], explanation: 'He adjusted Margie\'s mechanical teacher' },
          { text: 'Judge: Asimov supports fully technological education.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'The story questions technology\'s role in education' }
        ]
      },
      {
        title: 'The Sound of Music',
        chapterNumber: 2,
        summary: 'This chapter has two parts. Part I tells the story of Evelyn Glennie, a profoundly deaf musician who became a world-famous percussionist by feeling vibrations through her body. Despite being told she could never pursue music, she learned to "hear" through other senses. Part II describes Bismillah Khan, the legendary shehnai maestro who brought the classical Indian instrument to global recognition while remaining deeply connected to his hometown Varanasi. Both stories celebrate perseverance and passion for music.',
        keyPoints: [
          'Evelyn Glennie is a deaf percussionist',
          'She learned to feel music through vibrations in her body',
          'Ron Forbes helped her discover her ability',
          'Bismillah Khan was a shehnai maestro',
          'He was awarded the Bharat Ratna',
          'Khan remained devoted to Varanasi and the Ganga',
          'Both stories show dedication to music',
          'Theme: passion can overcome any obstacle'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'What instrument does Evelyn Glennie play?', back: 'Percussion instruments' },
          { front: 'What is Evelyn\'s disability?', back: 'She is profoundly deaf' },
          { front: 'Who helped Evelyn discover her musical ability?', back: 'Ron Forbes' },
          { front: 'What instrument is Bismillah Khan famous for?', back: 'Shehnai' },
          { front: 'Which city was Bismillah Khan devoted to?', back: 'Varanasi (Benaras)' },
          { front: 'What is India\'s highest civilian award that Khan received?', back: 'Bharat Ratna' },
          { front: 'How does Evelyn "hear" music?', back: 'Through vibrations in her body' },
          { front: 'What was Khan\'s favorite place?', back: 'Banks of the Ganga in Varanasi' },
          { front: 'Why did Evelyn play barefoot?', back: 'To feel vibrations through the floor' },
          { front: 'What genre of music did Khan play?', back: 'Indian classical music' }
        ],
        questions: [
          { text: 'Evelyn Glennie is famous as a:', type: 'mcq', options: ['Singer', 'Percussionist', 'Violinist', 'Pianist'], answer: 'Percussionist', level: 1, skills: ['concept recall'], explanation: 'She plays percussion instruments' },
          { text: 'How does Evelyn sense music?', type: 'mcq', options: ['Through hearing aids', 'Through vibrations', 'Through reading', 'She cannot'], answer: 'Through vibrations', level: 2, skills: ['concept recall'], explanation: 'She feels music through her body' },
          { text: 'Bismillah Khan was associated with which city?', type: 'mcq', options: ['Delhi', 'Mumbai', 'Varanasi', 'Kolkata'], answer: 'Varanasi', level: 1, skills: ['concept recall'], explanation: 'He was devoted to Varanasi' },
          { text: 'Who encouraged Evelyn to pursue music?', type: 'mcq', options: ['Her parents', 'Ron Forbes', 'A doctor', 'A friend'], answer: 'Ron Forbes', level: 2, skills: ['concept recall'], explanation: 'Ron Forbes was her music teacher' },
          { text: 'Compare how Evelyn and Khan overcame challenges', type: 'short', answer: 'Evelyn overcame deafness through feeling vibrations; Khan overcame obscurity of shehnai through dedication and practice', level: 4, skills: ['reading inference'], explanation: 'Both showed exceptional dedication' },
          { text: 'What made the shehnai popular?', type: 'mcq', options: ['Western influence', 'Khan\'s mastery', 'Television', 'Government'], answer: 'Khan\'s mastery', level: 2, skills: ['reading inference'], explanation: 'His skill brought recognition to the instrument' },
          { text: 'Why did Evelyn play barefoot?', type: 'mcq', options: ['Comfort', 'To feel floor vibrations', 'Tradition', 'No shoes'], answer: 'To feel floor vibrations', level: 2, skills: ['reading inference'], explanation: 'Floor vibrations helped her sense the music' },
          { text: 'What does Khan\'s love for Varanasi show?', type: 'short', answer: 'It shows his deep roots, humility, and connection to tradition despite international fame', level: 4, skills: ['reading inference'], explanation: 'He valued his cultural roots' },
          { text: 'Evelyn attended which famous music school?', type: 'mcq', options: ['Oxford', 'Royal Academy of Music', 'Juilliard', 'Cambridge'], answer: 'Royal Academy of Music', level: 2, skills: ['concept recall'], explanation: 'She studied at the Royal Academy in London' },
          { text: 'Create a message of inspiration from these stories', type: 'short', answer: 'Passion and dedication can help overcome any obstacle; disabilities don\'t define our potential', level: 6, skills: ['writing clarity'], explanation: 'Drawing life lessons from the texts' },
          { text: 'Khan played shehnai at which historic occasion?', type: 'mcq', options: ['Republic Day', 'Independence Day 1947', 'Olympics', 'World War end'], answer: 'Independence Day 1947', level: 2, skills: ['concept recall'], explanation: 'He played from Red Fort on Independence Day' },
          { text: 'Judge: Success requires only talent, not hard work.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'Both stories emphasize hard work and dedication' }
        ]
      },
      {
        title: 'The Little Girl',
        chapterNumber: 3,
        summary: 'Written by Katherine Mansfield, this story explores the changing relationship between a little girl, Kezia, and her stern father. Initially, Kezia is terrified of her father and stutters in his presence. After being punished for accidentally destroying his important papers (she used them to stuff a cushion she was making for his birthday), she feels her father is cruel. However, when her mother is hospitalized and her father comforts her during a nightmare, she realizes he works hard because he loves the family. She understands that different people express love differently.',
        keyPoints: [
          'Kezia is afraid of her father',
          'She stutters when speaking to him',
          'She tears up his important papers for a gift cushion',
          'She is punished with a ruler for this',
          'Later her mother goes to hospital',
          'Father comforts Kezia during a nightmare',
          'She realizes he loves her in his own way',
          'Theme: understanding different expressions of love'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'Who wrote "The Little Girl"?', back: 'Katherine Mansfield' },
          { front: 'Why was Kezia afraid of her father?', back: 'He was stern and strict' },
          { front: 'What gift did Kezia make for her father?', back: 'A pin cushion' },
          { front: 'What did she stuff the cushion with?', back: 'Her father\'s important papers' },
          { front: 'How was Kezia punished?', back: 'She was hit with a ruler' },
          { front: 'When did Kezia\'s view of her father change?', back: 'When he comforted her during a nightmare' },
          { front: 'Why does Kezia stutter?', back: 'She is nervous around her father' },
          { front: 'What is the main theme?', back: 'Understanding different expressions of love' },
          { front: 'Who comforted Kezia when she had nightmares?', back: 'Her father' },
          { front: 'What did Kezia realize about her father?', back: 'He works hard because he loves the family' }
        ],
        questions: [
          { text: 'Kezia was afraid of her father because he was:', type: 'mcq', options: ['Absent', 'Strict', 'Funny', 'Gentle'], answer: 'Strict', level: 1, skills: ['concept recall'], explanation: 'Her father was stern and strict' },
          { text: 'What did Kezia accidentally destroy?', type: 'mcq', options: ['A book', 'Important papers', 'A vase', 'Photographs'], answer: 'Important papers', level: 1, skills: ['concept recall'], explanation: 'She tore up his work papers for the cushion' },
          { text: 'Why did Kezia make the cushion?', type: 'mcq', options: ['School project', 'Birthday gift', 'For herself', 'Mother asked'], answer: 'Birthday gift', level: 2, skills: ['concept recall'], explanation: 'It was a birthday present for her father' },
          { text: 'How did Kezia\'s view of her father change?', type: 'mcq', options: ['After the punishment', 'After the nightmare', 'Never changed', 'After school'], answer: 'After the nightmare', level: 2, skills: ['reading inference'], explanation: 'His comfort during nightmare changed her view' },
          { text: 'Compare Kezia\'s father with the neighbor Mr. McDonald', type: 'short', answer: 'Kezia\'s father: strict, works hard, shows love through providing. McDonald: playful, openly affectionate with children', level: 4, skills: ['reading inference'], explanation: 'Contrast in parenting styles' },
          { text: 'Why does Kezia stutter?', type: 'mcq', options: ['Medical condition', 'Fear and nervousness', 'Language problem', 'Just playing'], answer: 'Fear and nervousness', level: 2, skills: ['reading inference'], explanation: 'Her anxiety around father causes stuttering' },
          { text: 'What is the meaning of "a figure to be feared"?', type: 'mcq', options: ['A tall person', 'Someone frightening', 'A statue', 'A teacher'], answer: 'Someone frightening', level: 2, skills: ['concept recall'], explanation: 'Her father scared her' },
          { text: 'What lesson does the story teach?', type: 'short', answer: 'People express love differently; we should try to understand others\' ways of showing affection', level: 4, skills: ['reading inference'], explanation: 'Main message of the story' },
          { text: 'How did the father react when Kezia had a nightmare?', type: 'mcq', options: ['Ignored her', 'Scolded her', 'Comforted her', 'Called mother'], answer: 'Comforted her', level: 2, skills: ['concept recall'], explanation: 'He took her to his bed and comforted her' },
          { text: 'Create dialogue showing Kezia understanding her father', type: 'short', answer: '"Papa, now I know you work so hard because you love us. I\'m sorry I didn\'t understand before."', level: 6, skills: ['writing clarity'], explanation: 'Creative response showing understanding' },
          { text: 'The father\'s "big heart" referred to:', type: 'mcq', options: ['His size', 'His kindness', 'His health', 'His anger'], answer: 'His kindness', level: 3, skills: ['reading inference'], explanation: 'Kezia realizes his inner goodness' },
          { text: 'Judge: Kezia\'s father was cruel and unloving.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'He showed love differently, not absence of love' }
        ]
      },
      {
        title: 'A Truly Beautiful Mind',
        chapterNumber: 4,
        summary: 'This biographical piece tells the story of Albert Einstein, from his slow-speaking childhood to becoming the greatest physicist of the twentieth century. Einstein developed late - he didn\'t speak until age two and a half. He was unconventional in school, questioning authority and preferring self-study. His "miracle year" 1905 produced revolutionary papers including the Special Theory of Relativity and E=mc². Later, he fled Nazi Germany for America. Despite developing theories that enabled atomic bombs, Einstein was a pacifist who advocated for world peace and nuclear disarmament.',
        keyPoints: [
          'Einstein was slow to speak as a child',
          'He was an unconventional student who questioned authority',
          'He worked at a patent office in Bern',
          '1905 was his "miracle year" - he published major papers',
          'E=mc² relates energy and mass',
          'He won the Nobel Prize in Physics in 1921',
          'He fled Nazi Germany for the USA',
          'He was a pacifist who opposed nuclear weapons'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'When did Einstein learn to speak?', back: 'Around age 2.5 years' },
          { front: 'What is Einstein\'s famous equation?', back: 'E = mc²' },
          { front: 'What was Einstein\'s "miracle year"?', back: '1905' },
          { front: 'Where did Einstein work before becoming famous?', back: 'Patent office in Bern' },
          { front: 'What prize did Einstein win in 1921?', back: 'Nobel Prize in Physics' },
          { front: 'Why did Einstein leave Germany?', back: 'To escape the Nazi regime' },
          { front: 'What was Einstein\'s view on nuclear weapons?', back: 'He opposed them and advocated peace' },
          { front: 'What is the Special Theory of Relativity about?', back: 'The relationship between space, time, and motion' },
          { front: 'Who was Einstein\'s first wife?', back: 'Mileva Maric' },
          { front: 'Where did Einstein settle in America?', back: 'Princeton, New Jersey' }
        ],
        questions: [
          { text: 'Einstein first spoke at age:', type: 'mcq', options: ['1 year', '2.5 years', '4 years', '6 years'], answer: '2.5 years', level: 1, skills: ['concept recall'], explanation: 'He was slow to develop speech' },
          { text: 'What does E = mc² mean?', type: 'mcq', options: ['Energy equals mass', 'Energy equals mass times speed of light squared', 'Einstein\'s formula', 'Nothing specific'], answer: 'Energy equals mass times speed of light squared', level: 2, skills: ['concept recall'], explanation: 'The mass-energy equivalence formula' },
          { text: 'Why was 1905 called Einstein\'s "miracle year"?', type: 'mcq', options: ['He got married', 'Published revolutionary papers', 'Won Nobel Prize', 'Left Germany'], answer: 'Published revolutionary papers', level: 2, skills: ['concept recall'], explanation: 'He published several groundbreaking papers' },
          { text: 'Einstein\'s attitude toward school was:', type: 'mcq', options: ['Enthusiastic', 'Questioning and rebellious', 'Indifferent', 'Perfect student'], answer: 'Questioning and rebellious', level: 2, skills: ['reading inference'], explanation: 'He questioned authority and rigid methods' },
          { text: 'Compare Einstein\'s childhood with his achievements', type: 'short', answer: 'Despite late development in speech and unconventional schooling, he became the greatest physicist, showing early difficulties don\'t determine success', level: 4, skills: ['reading inference'], explanation: 'Contrast between early life and achievements' },
          { text: 'Einstein won the Nobel Prize for:', type: 'mcq', options: ['Relativity', 'Photoelectric effect', 'Nuclear physics', 'Mathematics'], answer: 'Photoelectric effect', level: 3, skills: ['concept recall'], explanation: 'Not for relativity as commonly thought' },
          { text: 'Why did Einstein oppose nuclear weapons?', type: 'short', answer: 'He was a pacifist who believed in peace; he was horrified by the destruction his theories enabled', level: 4, skills: ['reading inference'], explanation: 'His moral stance on weapons' },
          { text: 'What position did Einstein hold at Princeton?', type: 'mcq', options: ['Student', 'Professor', 'Janitor', 'President'], answer: 'Professor', level: 2, skills: ['concept recall'], explanation: 'He was a professor at Princeton' },
          { text: 'What does "truly beautiful mind" refer to?', type: 'mcq', options: ['Good looks', 'Brilliant intellect', 'Kind heart', 'Artistic skill'], answer: 'Brilliant intellect', level: 2, skills: ['reading inference'], explanation: 'Refers to his exceptional mind' },
          { text: 'Create a timeline of Einstein\'s key life events', type: 'short', answer: '1879: Born, 1905: Miracle year papers, 1921: Nobel Prize, 1933: Fled to USA, 1955: Died', level: 6, skills: ['concept recall'], explanation: 'Organizing biographical information' },
          { text: 'Einstein\'s first wife was:', type: 'mcq', options: ['Marie Curie', 'Mileva Maric', 'Elsa Einstein', 'He never married'], answer: 'Mileva Maric', level: 2, skills: ['concept recall'], explanation: 'Mileva was a fellow physics student' },
          { text: 'Judge: Einstein\'s childhood difficulties predicted his failures.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'He overcame challenges to achieve greatness' }
        ]
      },
      {
        title: 'The Snake and the Mirror',
        chapterNumber: 5,
        summary: 'A humorous first-person narrative by Vaikom Muhammad Basheer about a young homeopathic doctor\'s encounter with a snake. One hot night, the doctor, admiring himself in the mirror and making plans to impress a fat woman doctor he wanted to marry, sees a snake coil around his arm. Frozen with fear, he thinks about death. The snake moves toward the mirror, seemingly admiring its own reflection, giving the doctor a chance to escape. He later jokes that the snake was impressed by its own beauty. The story gently mocks human vanity.',
        keyPoints: [
          'The narrator is a young homeopathic doctor',
          'He was admiring himself in the mirror',
          'A snake coiled around his arm',
          'He was too scared to move',
          'The snake moved toward the mirror',
          'The doctor escaped while the snake was distracted',
          'Theme: gentle mockery of human vanity',
          'Humorous ending about snake\'s vanity'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'What is the narrator\'s profession?', back: 'Homeopathic doctor' },
          { front: 'What was the narrator doing when he saw the snake?', back: 'Admiring himself in the mirror' },
          { front: 'Where did the snake coil?', back: 'Around the doctor\'s arm' },
          { front: 'How did the snake help the doctor escape?', back: 'It got distracted by the mirror' },
          { front: 'What was the doctor\'s income?', back: 'Meager (he had just started practice)' },
          { front: 'What is the story\'s tone?', back: 'Humorous and self-deprecating' },
          { front: 'What was the doctor\'s room like?', back: 'Simple, with limited furniture' },
          { front: 'What plan was the doctor making?', back: 'To marry a fat woman doctor' },
          { front: 'Why did the doctor think of death?', back: 'He thought the snake would bite him' },
          { front: 'What is the theme of the story?', back: 'Mockery of human vanity' }
        ],
        questions: [
          { text: 'The narrator was a:', type: 'mcq', options: ['Lawyer', 'Homeopathic doctor', 'Teacher', 'Engineer'], answer: 'Homeopathic doctor', level: 1, skills: ['concept recall'], explanation: 'He practiced homeopathy' },
          { text: 'What was the doctor doing when the snake appeared?', type: 'mcq', options: ['Sleeping', 'Looking in mirror', 'Reading', 'Eating'], answer: 'Looking in mirror', level: 1, skills: ['concept recall'], explanation: 'He was admiring himself' },
          { text: 'What kind of snake was it?', type: 'mcq', options: ['Cobra', 'Python', 'Not specified clearly', 'Garden snake'], answer: 'Not specified clearly', level: 2, skills: ['concept recall'], explanation: 'The exact species isn\'t clearly mentioned' },
          { text: 'Why didn\'t the doctor move?', type: 'mcq', options: ['He was brave', 'Frozen with fear', 'Snake was harmless', 'He was sleeping'], answer: 'Frozen with fear', level: 2, skills: ['reading inference'], explanation: 'He was paralyzed by fear' },
          { text: 'Compare the doctor\'s and the snake\'s vanity', type: 'short', answer: 'Both were attracted to the mirror - the doctor admiring himself before the snake came, and the snake seemingly doing the same, allowing the doctor to escape', level: 4, skills: ['reading inference'], explanation: 'Ironic parallel between human and snake' },
          { text: 'What saved the doctor\'s life?', type: 'mcq', options: ['His bravery', 'The snake was harmless', 'The snake looked at the mirror', 'Someone came to help'], answer: 'The snake looked at the mirror', level: 2, skills: ['reading inference'], explanation: 'The snake was distracted by its reflection' },
          { text: 'What is the humor in the ending?', type: 'short', answer: 'The doctor jokes that the snake was more vain than him, looking at its own reflection in the mirror', level: 3, skills: ['reading inference'], explanation: 'Self-deprecating humor about vanity' },
          { text: 'What did the doctor plan about his appearance?', type: 'mcq', options: ['Lose weight', 'Grow a thin mustache', 'Get glasses', 'Cut hair'], answer: 'Grow a thin mustache', level: 2, skills: ['concept recall'], explanation: 'He planned to improve his appearance' },
          { text: 'The story criticizes:', type: 'mcq', options: ['Snakes', 'Doctors', 'Vanity', 'Poverty'], answer: 'Vanity', level: 3, skills: ['reading inference'], explanation: 'It gently mocks excessive self-admiration' },
          { text: 'Rewrite the ending from the snake\'s perspective', type: 'short', answer: '"I was just checking my beautiful scales when this scared human ran away. Humans are so strange."', level: 6, skills: ['writing clarity'], explanation: 'Creative retelling from snake\'s view' },
          { text: 'The tone of the story is:', type: 'mcq', options: ['Tragic', 'Humorous', 'Horror', 'Romantic'], answer: 'Humorous', level: 2, skills: ['reading inference'], explanation: 'It uses humor throughout' },
          { text: 'Judge: The narrator was a rich, successful doctor.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['reading inference'], explanation: 'He was poor and just starting his practice' }
        ]
      },
      {
        title: 'My Childhood',
        chapterNumber: 6,
        summary: 'This autobiographical excerpt by Dr. A.P.J. Abdul Kalam describes his childhood in Rameswaram. Despite being from a poor family, Kalam had a rich upbringing thanks to his loving parents, especially his mother who fed many people daily. He describes the communal harmony in his town where Hindus and Muslims lived peacefully together. His teachers, including his father and Sivasubramania Iyer, instilled values of hard work and equality. The story emphasizes how childhood experiences shaped Kalam\'s character and love for science.',
        keyPoints: [
          'Kalam grew up in Rameswaram, Tamil Nadu',
          'His family was poor but loving',
          'His mother fed many people daily',
          'Hindus and Muslims lived in harmony',
          'Teachers had great influence on him',
          'Sivasubramania Iyer broke caste barriers',
          'Theme: childhood shapes adult character',
          'Importance of education and values'
        ],
        skills: ['reading inference', 'concept recall', 'writing clarity'],
        flashcards: [
          { front: 'Where did Kalam grow up?', back: 'Rameswaram, Tamil Nadu' },
          { front: 'What was Kalam\'s father\'s name?', back: 'Jainulabdeen' },
          { front: 'What did his mother do daily?', back: 'Fed many people' },
          { front: 'Who was Kalam\'s science teacher?', back: 'Sivasubramania Iyer' },
          { front: 'What social issue did Iyer challenge?', back: 'Caste discrimination' },
          { front: 'How did Hindus and Muslims coexist?', back: 'In harmony and mutual respect' },
          { front: 'What did Kalam learn from his father?', back: 'Honesty and self-discipline' },
          { front: 'What was Kalam\'s childhood ambition?', back: 'To study and succeed through education' },
          { front: 'Who was Kalam\'s friend from a different religion?', back: 'Ramanadha Sastry' },
          { front: 'What values shaped Kalam\'s life?', back: 'Hard work, equality, and education' }
        ],
        questions: [
          { text: 'Kalam was born in:', type: 'mcq', options: ['Delhi', 'Chennai', 'Rameswaram', 'Mumbai'], answer: 'Rameswaram', level: 1, skills: ['concept recall'], explanation: 'He was born in Rameswaram, Tamil Nadu' },
          { text: 'What did Kalam\'s mother do that showed her generosity?', type: 'mcq', options: ['Gave money', 'Fed many people', 'Built schools', 'Taught children'], answer: 'Fed many people', level: 2, skills: ['concept recall'], explanation: 'She fed many people daily' },
          { text: 'What did Sivasubramania Iyer do that challenged social norms?', type: 'mcq', options: ['Taught girls', 'Had Kalam dine with his family', 'Started a school', 'Married outside caste'], answer: 'Had Kalam dine with his family', level: 2, skills: ['reading inference'], explanation: 'He challenged caste barriers by inviting Kalam' },
          { text: 'How did Kalam\'s family treat religious differences?', type: 'mcq', options: ['With prejudice', 'With respect', 'Ignored them', 'Created conflict'], answer: 'With respect', level: 2, skills: ['reading inference'], explanation: 'They lived in harmony with other religions' },
          { text: 'Compare the influence of Kalam\'s parents on him', type: 'short', answer: 'Father: self-discipline, honesty, simplicity. Mother: generosity, compassion, feeding the hungry', level: 4, skills: ['reading inference'], explanation: 'Different but complementary influences' },
          { text: 'Who was Ramanadha Sastry?', type: 'mcq', options: ['Teacher', 'Hindu friend', 'Brother', 'Doctor'], answer: 'Hindu friend', level: 2, skills: ['concept recall'], explanation: 'His childhood friend from a different religion' },
          { text: 'What does the title "My Childhood" emphasize?', type: 'short', answer: 'The formative years that shaped Kalam\'s values, beliefs, and character', level: 3, skills: ['reading inference'], explanation: 'Childhood experiences influence adult life' },
          { text: 'What was Kalam\'s economic background?', type: 'mcq', options: ['Wealthy', 'Middle class', 'Poor', 'Very rich'], answer: 'Poor', level: 2, skills: ['concept recall'], explanation: 'His family was not financially well-off' },
          { text: 'What lesson about society does the text convey?', type: 'mcq', options: ['Rich succeed', 'Division is natural', 'Harmony is possible', 'Competition is key'], answer: 'Harmony is possible', level: 3, skills: ['reading inference'], explanation: 'People of different backgrounds can live together' },
          { text: 'Write about how childhood shapes character', type: 'short', answer: 'Childhood experiences, values from parents, teachers\' guidance, and community influence all shape who we become as adults', level: 6, skills: ['writing clarity'], explanation: 'Connecting personal experience to general truth' },
          { text: 'Kalam later became:', type: 'mcq', options: ['Businessman', 'President of India', 'Movie star', 'Athlete'], answer: 'President of India', level: 1, skills: ['concept recall'], explanation: 'He became India\'s President' },
          { text: 'Judge: Kalam\'s childhood was unhappy due to poverty.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'Despite poverty, he describes a happy, loving childhood' }
        ]
      }
    ]
  },
  {
    name: 'Social Science',
    icon: '🌍',
    chapters: [
      {
        title: 'The French Revolution',
        chapterNumber: 1,
        summary: 'The French Revolution of 1789 was a watershed moment in world history that overthrew the monarchy and established a republic based on principles of liberty, equality, and fraternity. The revolution was caused by social inequality in the Estates System, financial crisis, Enlightenment ideas, and poor leadership under Louis XVI. Key events include the storming of the Bastille, the Declaration of the Rights of Man, the Reign of Terror under Robespierre, and the rise of Napoleon. The revolution spread ideas of democracy and nationalism across Europe.',
        keyPoints: [
          'French Revolution began in 1789',
          'Caused by social inequality and financial crisis',
          'Society divided into three Estates',
          'Storming of Bastille on July 14, 1789',
          'Declaration of Rights of Man adopted',
          'Reign of Terror under Robespierre',
          'Napoleon rose to power afterward',
          'Spread ideas of liberty, equality, fraternity'
        ],
        skills: ['concept recall', 'reading inference', 'data interpretation'],
        flashcards: [
          { front: 'When did the French Revolution begin?', back: '1789' },
          { front: 'What are the three Estates?', back: 'Clergy, Nobility, Commoners' },
          { front: 'What was stormed on July 14, 1789?', back: 'The Bastille prison' },
          { front: 'Who was the King during the Revolution?', back: 'Louis XVI' },
          { front: 'What is "Reign of Terror"?', back: 'Period of extreme violence under Robespierre' },
          { front: 'What are the revolution\'s ideals?', back: 'Liberty, Equality, Fraternity' },
          { front: 'Who rose to power after the revolution?', back: 'Napoleon Bonaparte' },
          { front: 'What document declared rights?', back: 'Declaration of the Rights of Man and Citizen' },
          { front: 'What was the National Assembly?', back: 'Representative body formed by Third Estate' },
          { front: 'What ended the monarchy in France?', back: 'The French Revolution' }
        ],
        questions: [
          { text: 'The French Revolution began in:', type: 'mcq', options: ['1776', '1789', '1799', '1815'], answer: '1789', level: 1, skills: ['concept recall'], explanation: 'The revolution started in 1789' },
          { text: 'Which Estate comprised common people?', type: 'mcq', options: ['First', 'Second', 'Third', 'Fourth'], answer: 'Third', level: 1, skills: ['concept recall'], explanation: 'Third Estate was the commoners' },
          { text: 'The Bastille was:', type: 'mcq', options: ['A palace', 'A prison', 'A church', 'A market'], answer: 'A prison', level: 1, skills: ['concept recall'], explanation: 'It was a state prison symbolizing tyranny' },
          { text: 'What caused the French Revolution?', type: 'mcq', options: ['Foreign invasion', 'Natural disaster', 'Social inequality', 'Religious conflict'], answer: 'Social inequality', level: 2, skills: ['reading inference'], explanation: 'Multiple causes including inequality' },
          { text: 'Compare the causes of American and French Revolutions', type: 'short', answer: 'Both sought liberty from tyranny; American was colonial independence, French was internal class struggle against monarchy', level: 4, skills: ['reading inference'], explanation: 'Comparing revolutionary causes' },
          { text: 'Who led the Reign of Terror?', type: 'mcq', options: ['Napoleon', 'Louis XVI', 'Robespierre', 'Lafayette'], answer: 'Robespierre', level: 2, skills: ['concept recall'], explanation: 'Robespierre led this violent period' },
          { text: 'What happened to King Louis XVI?', type: 'mcq', options: ['Escaped', 'Executed', 'Ruled again', 'Became Pope'], answer: 'Executed', level: 2, skills: ['concept recall'], explanation: 'He was guillotined in 1793' },
          { text: 'What were the effects of the revolution?', type: 'short', answer: 'End of monarchy, spread of democratic ideas, nationalism in Europe, reform movements worldwide', level: 4, skills: ['reading inference'], explanation: 'Wide-reaching consequences' },
          { text: '"Liberty, Equality, Fraternity" means:', type: 'mcq', options: ['French motto', 'Three Estates', 'Napoleon\'s title', 'A law'], answer: 'French motto', level: 2, skills: ['concept recall'], explanation: 'The revolutionary ideals' },
          { text: 'Analyze how the revolution changed power structures', type: 'short', answer: 'Power shifted from king and nobles to citizens; democracy replaced monarchy; merit over birth', level: 6, skills: ['reading inference'], explanation: 'Understanding revolutionary changes' },
          { text: 'The National Assembly was formed by:', type: 'mcq', options: ['King', 'Nobles', 'Third Estate', 'Church'], answer: 'Third Estate', level: 2, skills: ['concept recall'], explanation: 'Commoners formed the National Assembly' },
          { text: 'Judge: The Revolution was peaceful.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['reading inference'], explanation: 'It was violent, including the Terror' }
        ]
      },
      {
        title: 'Socialism in Europe and the Russian Revolution',
        chapterNumber: 2,
        summary: 'The Russian Revolution of 1917 overthrew the Tsar and eventually established a communist state. Before the revolution, Russia was an autocracy under Tsar Nicholas II with extreme inequality between rich nobles and poor peasants and workers. Socialist ideas spread among workers. The February Revolution ended tsarist rule; the October Revolution, led by Lenin and the Bolsheviks, established communist rule. The revolution created the Soviet Union and influenced socialist movements worldwide.',
        keyPoints: [
          'Russia was an autocracy under Tsar Nicholas II',
          'Workers and peasants faced extreme inequality',
          'February 1917: Tsar abdicated',
          'October 1917: Bolsheviks seized power',
          'Lenin led the Bolshevik Party',
          'Civil war followed between Reds and Whites',
          'Soviet Union was formed in 1922',
          'Revolution inspired socialist movements globally'
        ],
        skills: ['concept recall', 'reading inference', 'data interpretation'],
        flashcards: [
          { front: 'Who was the last Tsar of Russia?', back: 'Nicholas II' },
          { front: 'When did the Russian Revolution occur?', back: '1917' },
          { front: 'Who led the Bolsheviks?', back: 'Vladimir Lenin' },
          { front: 'What happened in February 1917?', back: 'Tsar abdicated, monarchy ended' },
          { front: 'What happened in October 1917?', back: 'Bolsheviks seized power' },
          { front: 'What was formed after the revolution?', back: 'Soviet Union (1922)' },
          { front: 'What is socialism?', back: 'Economic system with collective ownership' },
          { front: 'Who were the Mensheviks?', back: 'Moderate socialist group, opposed Bolsheviks' },
          { front: 'What was the civil war about?', back: 'Reds (communists) vs Whites (anti-communists)' },
          { front: 'What idea spread from Russia?', back: 'Communist/socialist ideology' }
        ],
        questions: [
          { text: 'The last Tsar of Russia was:', type: 'mcq', options: ['Lenin', 'Stalin', 'Nicholas II', 'Alexander'], answer: 'Nicholas II', level: 1, skills: ['concept recall'], explanation: 'Nicholas II was the last tsar' },
          { text: 'The October Revolution was led by:', type: 'mcq', options: ['Tsar', 'Bolsheviks', 'Mensheviks', 'Peasants alone'], answer: 'Bolsheviks', level: 1, skills: ['concept recall'], explanation: 'Lenin\'s Bolsheviks led the October Revolution' },
          { text: 'What does USSR stand for?', type: 'mcq', options: ['United States Soviet Republic', 'Union of Soviet Socialist Republics', 'United Socialist States', 'Union of Soviet States'], answer: 'Union of Soviet Socialist Republics', level: 2, skills: ['concept recall'], explanation: 'Full name of the Soviet Union' },
          { text: 'Why did workers support the revolution?', type: 'mcq', options: ['They were rich', 'Extreme inequality', 'Religious reasons', 'They didn\'t'], answer: 'Extreme inequality', level: 2, skills: ['reading inference'], explanation: 'Workers faced poor conditions and inequality' },
          { text: 'Compare the February and October Revolutions', type: 'short', answer: 'February: ended monarchy, not fully socialist. October: Bolsheviks took power, established communist rule', level: 4, skills: ['reading inference'], explanation: 'Two stages of the Russian Revolution' },
          { text: 'What is collectivization?', type: 'mcq', options: ['Individual farming', 'Government-owned farms', 'Private property', 'Free market'], answer: 'Government-owned farms', level: 2, skills: ['concept recall'], explanation: 'Collective ownership of agriculture' },
          { text: 'What economic system replaced capitalism in Russia?', type: 'mcq', options: ['Feudalism', 'Socialism/Communism', 'Democracy', 'Monarchy'], answer: 'Socialism/Communism', level: 2, skills: ['concept recall'], explanation: 'Socialist economy was established' },
          { text: 'How did the revolution affect class structure?', type: 'short', answer: 'Abolished noble privileges, workers and peasants gained power, private property nationalized', level: 4, skills: ['reading inference'], explanation: 'Fundamental class changes' },
          { text: 'The civil war was between:', type: 'mcq', options: ['Russia and Germany', 'Reds and Whites', 'Peasants and workers', 'East and West'], answer: 'Reds and Whites', level: 2, skills: ['concept recall'], explanation: 'Communists (Reds) vs anti-communists (Whites)' },
          { text: 'Create a timeline of the Russian Revolution', type: 'short', answer: '1917 Feb: Tsar abdicates. Oct: Bolsheviks seize power. 1918-1921: Civil war. 1922: USSR formed', level: 6, skills: ['concept recall'], explanation: 'Organizing historical events' },
          { text: 'Who succeeded Lenin?', type: 'mcq', options: ['Trotsky', 'Stalin', 'Nicholas', 'Marx'], answer: 'Stalin', level: 2, skills: ['concept recall'], explanation: 'Stalin became leader after Lenin' },
          { text: 'Judge: The revolution immediately improved everyone\'s life.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 5, skills: ['reading inference'], explanation: 'Civil war and hardships followed initially' }
        ]
      },
      {
        title: 'Nazism and the Rise of Hitler',
        chapterNumber: 3,
        summary: 'After World War I, Germany faced economic depression, political instability, and national humiliation from the Treaty of Versailles. Adolf Hitler and the Nazi Party exploited these conditions, using propaganda and promises of national glory. Once in power in 1933, Hitler established a totalitarian dictatorship, persecuted Jews and other minorities in the Holocaust, militarized Germany, and started World War II. Nazi ideology was based on racism, extreme nationalism, and anti-Semitism. The war ended with Hitler\'s defeat in 1945.',
        keyPoints: [
          'Germany was humiliated by Treaty of Versailles (1919)',
          'Economic depression and unemployment',
          'Hitler became Chancellor in 1933',
          'Nazi ideology: racism, nationalism, anti-Semitism',
          'Holocaust: systematic murder of 6 million Jews',
          'World War II started in 1939',
          'Nazi Germany defeated in 1945',
          'Propaganda was key to Nazi control'
        ],
        skills: ['concept recall', 'reading inference', 'data interpretation'],
        flashcards: [
          { front: 'When did Hitler become Chancellor?', back: '1933' },
          { front: 'What was the Holocaust?', back: 'Systematic murder of 6 million Jews' },
          { front: 'What treaty humiliated Germany?', back: 'Treaty of Versailles (1919)' },
          { front: 'What was Nazi ideology based on?', back: 'Racism, nationalism, anti-Semitism' },
          { front: 'When did World War II start?', back: '1939' },
          { front: 'When did Nazi Germany fall?', back: '1945' },
          { front: 'What were concentration camps?', back: 'Camps where Jews and others were imprisoned and killed' },
          { front: 'What is propaganda?', back: 'Biased information to influence public opinion' },
          { front: 'What is totalitarianism?', back: 'Total government control over all aspects of life' },
          { front: 'What was the Nazi symbol?', back: 'The swastika' }
        ],
        questions: [
          { text: 'Hitler became Chancellor in:', type: 'mcq', options: ['1919', '1929', '1933', '1939'], answer: '1933', level: 1, skills: ['concept recall'], explanation: 'He came to power in 1933' },
          { text: 'The Holocaust was:', type: 'mcq', options: ['A war', 'Genocide of Jews', 'A treaty', 'An election'], answer: 'Genocide of Jews', level: 1, skills: ['concept recall'], explanation: 'Systematic murder of 6 million Jews' },
          { text: 'Which treaty hurt Germany after WWI?', type: 'mcq', options: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of Berlin', 'Treaty of Rome'], answer: 'Treaty of Versailles', level: 2, skills: ['concept recall'], explanation: 'Versailles imposed harsh terms on Germany' },
          { text: 'What conditions helped Hitler rise?', type: 'mcq', options: ['Prosperity', 'Economic crisis', 'Strong democracy', 'Peace'], answer: 'Economic crisis', level: 2, skills: ['reading inference'], explanation: 'Depression and unemployment aided his rise' },
          { text: 'Compare Nazi Germany with a democracy', type: 'short', answer: 'Nazi: totalitarian, one party, no free speech, persecution. Democracy: multiple parties, free speech, rule of law, equality', level: 4, skills: ['reading inference'], explanation: 'Fundamental differences in governance' },
          { text: 'What role did propaganda play?', type: 'mcq', options: ['None', 'Minor', 'Central to Nazi control', 'Opposed Hitler'], answer: 'Central to Nazi control', level: 2, skills: ['reading inference'], explanation: 'Propaganda spread Nazi ideology' },
          { text: 'World War II started when Germany invaded:', type: 'mcq', options: ['France', 'Poland', 'Russia', 'Britain'], answer: 'Poland', level: 2, skills: ['concept recall'], explanation: 'Germany invaded Poland in 1939' },
          { text: 'Why is studying this period important?', type: 'short', answer: 'To understand how dictatorships rise, the dangers of hatred, and to prevent such horrors from recurring', level: 5, skills: ['reading inference'], explanation: 'Learning from history' },
          { text: 'What happened to Hitler in 1945?', type: 'mcq', options: ['Won war', 'Escaped', 'Died', 'Was captured'], answer: 'Died', level: 2, skills: ['concept recall'], explanation: 'He died as Germany lost the war' },
          { text: 'Create a poster warning against fascism', type: 'short', answer: 'Show divided society vs. united society; message: "Unity in Diversity - Never Again Let Hate Divide Us"', level: 6, skills: ['reading inference'], explanation: 'Creative response to historical lesson' },
          { text: 'Anti-Semitism means:', type: 'mcq', options: ['Love of Jews', 'Hatred of Jews', 'Jewish culture', 'A religion'], answer: 'Hatred of Jews', level: 2, skills: ['concept recall'], explanation: 'Prejudice against Jewish people' },
          { text: 'Judge: Hitler came to power through violence alone.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['reading inference'], explanation: 'He was elected before becoming dictator' }
        ]
      },
      {
        title: 'Forest Society and Colonialism',
        chapterNumber: 4,
        summary: 'Colonial powers dramatically changed forest management in Asia and Africa. The British in India introduced scientific forestry, designating reserved forests for timber and restricting local communities\' traditional access. Forest laws criminalized practices like shifting cultivation and grazing. This displaced forest communities, causing resistance movements. The chapter contrasts colonial commercial exploitation with traditional sustainable practices. It explores how colonialism affected livelihoods, ecology, and led to deforestation, while indigenous communities fought to protect their rights.',
        keyPoints: [
          'Colonial powers exploited forests for timber',
          'British introduced forest laws in India',
          'Traditional communities lost access to forests',
          'Shifting cultivation was banned',
          'Forest communities resisted colonial rules',
          'Deforestation increased under colonialism',
          'Scientific forestry prioritized commercial timber',
          'Indigenous practices were more sustainable'
        ],
        skills: ['concept recall', 'reading inference', 'data interpretation'],
        flashcards: [
          { front: 'What is scientific forestry?', back: 'Colonial method of managing forests for timber production' },
          { front: 'What happened to forest communities under colonial rule?', back: 'Lost traditional access and rights' },
          { front: 'What is shifting cultivation?', back: 'Moving farming from plot to plot, allowing forest regrowth' },
          { front: 'Why did colonizers want forest control?', back: 'For timber, railways, ships, and trade' },
          { front: 'What were Reserved Forests?', back: 'Areas where only timber was allowed, restricting local use' },
          { front: 'How did communities resist?', back: 'Protests, movements, illegal grazing, and hunting' },
          { front: 'What is deforestation?', back: 'Cutting down forests on a large scale' },
          { front: 'What is sustainable use?', back: 'Using resources without depleting them for the future' },
          { front: 'Who suffered most under forest laws?', back: 'Indigenous forest communities' },
          { front: 'What impact did railways have on forests?', back: 'Massive deforestation for railway sleepers' }
        ],
        questions: [
          { text: 'Colonial forest policies mainly aimed to:', type: 'mcq', options: ['Protect wildlife', 'Help locals', 'Extract timber', 'Promote farming'], answer: 'Extract timber', level: 1, skills: ['concept recall'], explanation: 'Commercial timber extraction was the goal' },
          { text: 'Scientific forestry was introduced by:', type: 'mcq', options: ['Indians', 'British', 'French', 'Mughals'], answer: 'British', level: 1, skills: ['concept recall'], explanation: 'British introduced this system in India' },
          { text: 'Shifting cultivation was banned because:', type: 'mcq', options: ['It was scientific', 'Colonizers didn\'t understand it', 'It produced more timber', 'Locals wanted it banned'], answer: 'Colonizers didn\'t understand it', level: 2, skills: ['reading inference'], explanation: 'They saw it as wasteful, not understanding its sustainability' },
          { text: 'What happened to forest communities?', type: 'mcq', options: ['Became rich', 'Lost traditional rights', 'Gained power', 'Left forests'], answer: 'Lost traditional rights', level: 2, skills: ['reading inference'], explanation: 'Laws restricted their access and practices' },
          { text: 'Compare colonial and traditional forest management', type: 'short', answer: 'Colonial: commercial timber focus, restricted access. Traditional: sustainable use, community access, diverse uses', level: 4, skills: ['reading inference'], explanation: 'Fundamental differences in approach' },
          { text: 'Why did railways cause deforestation?', type: 'mcq', options: ['No connection', 'Needed timber for sleepers', 'Forests were obstacles', 'People moved away'], answer: 'Needed timber for sleepers', level: 2, skills: ['reading inference'], explanation: 'Railway expansion needed massive timber' },
          { text: 'What was the Bastar rebellion about?', type: 'mcq', options: ['Tax', 'Forest rights', 'Religion', 'Education'], answer: 'Forest rights', level: 3, skills: ['concept recall'], explanation: 'Forest communities resisted loss of rights' },
          { text: 'How did colonialism affect ecology?', type: 'short', answer: 'Deforestation, loss of biodiversity, soil erosion, disrupted water cycles, climate changes', level: 4, skills: ['reading inference'], explanation: 'Environmental consequences of colonial forestry' },
          { text: 'Reserved forests were:', type: 'mcq', options: ['Open to all', 'Restricted for timber', 'Protected from cutting', 'Sacred areas'], answer: 'Restricted for timber', level: 2, skills: ['concept recall'], explanation: 'Reserved primarily for commercial timber' },
          { text: 'Create a plan for sustainable forest use', type: 'short', answer: 'Community management, regulated harvesting, protected zones, reforestation, diverse use rights', level: 6, skills: ['reading inference'], explanation: 'Applying lessons from colonial mistakes' },
          { text: 'Who benefited from colonial forest laws?', type: 'mcq', options: ['Forest dwellers', 'Colonial traders', 'Animals', 'Farmers'], answer: 'Colonial traders', level: 2, skills: ['reading inference'], explanation: 'Colonizers and traders benefited' },
          { text: 'Judge: Colonial forestry was environmentally sustainable.', type: 'mcq', options: ['True', 'False'], answer: 'False', level: 4, skills: ['reading inference'], explanation: 'It led to massive deforestation' }
        ]
      }
    ]
  }
];

// Chemistry Interactive placeholder data
export const CHEMISTRY_INTERACTIVE_PLACEHOLDER = {
  subject: 'Science',
  chapter: {
    title: 'Chemistry Interactive Lab',
    chapterNumber: 99,
    summary: 'Coming soon: Interactive chemistry experiments and visualizations.',
    keyPoints: ['Interactive 3D molecule viewer', 'Virtual lab experiments', 'Chemical reaction simulations'],
    skills: [],
    flashcards: [],
    questions: []
  }
};

// Skills taxonomy
export const SKILLS_LIST = [
  'concept recall',
  'problem solving',
  'algebra manipulation',
  'data interpretation',
  'reading inference',
  'writing clarity',
  'scientific reasoning',
  'numeracy',
  'number classification'
];

// Level definitions
export const LEVELS = [
  { level: 1, name: 'Recall', description: 'Remember facts and basic concepts' },
  { level: 2, name: 'Explain', description: 'Understand and explain ideas' },
  { level: 3, name: 'Apply', description: 'Use knowledge in new situations' },
  { level: 4, name: 'Compare', description: 'Analyze and compare relationships' },
  { level: 5, name: 'Judge', description: 'Evaluate and make judgments' },
  { level: 6, name: 'Create', description: 'Generate new ideas and solutions' }
];