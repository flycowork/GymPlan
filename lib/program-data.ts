export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutBlock {
  label: string;
  type: "strength" | "conditioning" | "warmup" | "full";
  description?: string;
  exercises: Exercise[];
  footer?: string;
}

export interface WorkoutDay {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  emoji: string;
  type: "core" | "optional";
  blocks: WorkoutBlock[];
  logExercises?: string[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  weeks: number;
  days: WorkoutDay[];
  status?: "active" | "coming-soon";
}

export const warmup: WorkoutBlock = {
  label: "WARM-UP",
  type: "warmup",
  description: "Every session · ~7 min",
  exercises: [
    { name: "Bike or Row (easy pace)", sets: "1", reps: "5 min", rest: "—", notes: "RPE 4-5, get blood moving" },
    { name: "Cat-Cow + Thoracic Rotation", sets: "1", reps: "10 each", rest: "—", notes: "Upper back mobility focus" },
    { name: "Hip 90/90 Switches", sets: "1", reps: "8/side", rest: "—", notes: "Controlled, no forcing range" },
    { name: "Band Pull-Aparts", sets: "1", reps: "15", rest: "—", notes: "Shoulder warm-up, light band" },
    { name: "Goblet Squat Hold", sets: "1", reps: "30 sec", rest: "—", notes: "BW or light KB, open hips" },
    { name: "Neck CARs (slow circles)", sets: "1", reps: "5/dir", rest: "—", notes: "Gentle — respect the neck" },
  ],
};

export const workoutDays: WorkoutDay[] = [
  {
    id: "day-1",
    day: 1,
    title: "Squat + Push + Row",
    subtitle: "Lower body strength · Horizontal push/pull",
    emoji: "🏋️",
    type: "core",
    blocks: [
      {
        label: "STRENGTH BLOCK",
        type: "strength",
        description: "25 min · Straight sets",
        exercises: [
          { name: "Back Squat", sets: "4", reps: "6", rest: "2 min", notes: "Wk1: bar+20kg. Add 2.5-5kg/week" },
          { name: "Dumbbell Bench Press", sets: "4", reps: "8", rest: "90 sec", notes: "Neutral grip if shoulders feel off" },
          { name: "Bent-Over Row (barbell)", sets: "4", reps: "8", rest: "90 sec", notes: "Controlled eccentric, squeeze top" },
          { name: "Plank Hold", sets: "3", reps: "30-40s", rest: "45 sec", notes: "Brace hard, no sagging" },
        ],
      },
      {
        label: "CONDITIONING",
        type: "conditioning",
        description: "4 Rounds for Time · Cap 12 min",
        exercises: [
          { name: "KB Swing (16kg)", sets: "—", reps: "15", rest: "—", notes: "Explosive hips, hinge pattern" },
          { name: "Goblet Squat (16kg)", sets: "—", reps: "10", rest: "—", notes: "Full depth, controlled" },
          { name: "Push-Ups", sets: "—", reps: "10", rest: "—", notes: "Full ROM, knees if needed" },
          { name: "Row (calories)", sets: "—", reps: "12 cal", rest: "—", notes: "Moderate effort, steady pace" },
        ],
        footer: "Minimal rest between exercises. 60-90 sec between rounds. Record your time.",
      },
    ],
    logExercises: ["Back Squat", "DB Bench Press", "Bent-Over Row", "Conditioning Time"],
  },
  {
    id: "day-2",
    day: 2,
    title: "Hinge + Overhead + Pull",
    subtitle: "Posterior chain · Vertical push/pull",
    emoji: "💪",
    type: "core",
    blocks: [
      {
        label: "STRENGTH BLOCK",
        type: "strength",
        description: "25 min · Straight sets",
        exercises: [
          { name: "Deadlift (conventional)", sets: "4", reps: "5", rest: "2 min", notes: "Wk1: 40-50kg. Brace every rep" },
          { name: "Push Press (barbell)", sets: "4", reps: "6", rest: "90 sec", notes: "Light bar to start, protect neck" },
          { name: "Lat Pulldown / Assisted Pull-Up", sets: "4", reps: "8", rest: "90 sec", notes: "Full stretch at bottom" },
          { name: "Pallof Press (band/cable)", sets: "3", reps: "10/side", rest: "45 sec", notes: "Anti-rotation core work" },
        ],
      },
      {
        label: "CONDITIONING",
        type: "conditioning",
        description: "AMRAP 10 min",
        exercises: [
          { name: "Thruster (30kg bar or 2×12kg DB)", sets: "—", reps: "8", rest: "—", notes: "Front squat into press" },
          { name: "Burpees (no push-up Wk1-2)", sets: "—", reps: "6", rest: "—", notes: "Step-back ok in Wk1-2" },
          { name: "Russian Twist (no wt Wk1)", sets: "—", reps: "16 total", rest: "—", notes: "Add 5kg med ball from Wk3" },
          { name: "Bike (calories)", sets: "—", reps: "15 cal", rest: "—", notes: "Push the pace here" },
        ],
        footer: "Move continuously. Score = total rounds + reps. Beat it in Week 3.",
      },
    ],
    logExercises: ["Deadlift", "Push Press", "Lat Pulldown", "AMRAP Score"],
  },
  {
    id: "day-3",
    day: 3,
    title: "Front Squat + Incline + Sled",
    subtitle: "Quad-dominant · Upper body hypertrophy · Sled finisher",
    emoji: "🔥",
    type: "core",
    blocks: [
      {
        label: "STRENGTH BLOCK",
        type: "strength",
        description: "25 min · Straight sets",
        exercises: [
          { name: "Front Squat", sets: "4", reps: "6", rest: "2 min", notes: "Wk1: bar+10-15kg. Elbows high" },
          { name: "Incline DB Press", sets: "4", reps: "8", rest: "90 sec", notes: "30° bench, moderate weight" },
          { name: "Single-Arm DB Row", sets: "4", reps: "8/side", rest: "60 sec", notes: "Bench supported, full range" },
          { name: "DB Lateral Raise", sets: "3", reps: "12", rest: "45 sec", notes: "Light weight, controlled" },
        ],
      },
      {
        label: "CONDITIONING",
        type: "conditioning",
        description: "5 Rounds for Time · Cap 15 min",
        exercises: [
          { name: "Wall Balls (6-8kg)", sets: "—", reps: "12", rest: "—", notes: "Full squat, target high" },
          { name: "KB Swing (16→20kg Wk3)", sets: "—", reps: "12", rest: "—", notes: "16kg Wk1-2, 20kg Wk3+" },
          { name: "Box Jump or Step-Up", sets: "—", reps: "8", rest: "—", notes: "Green plyo box, step down always" },
          { name: "Sit-Ups", sets: "—", reps: "12", rest: "—", notes: "Controlled, don't yank the neck" },
          { name: "Sled Push (turf track)", sets: "—", reps: "Full lane", rest: "—", notes: "Moderate load. Low and drive." },
        ],
        footer: "Sled push closes every round. Step down from box jumps. Record your time.",
      },
    ],
    logExercises: ["Front Squat", "Incline DB Press", "Single-Arm Row", "Conditioning Time"],
  },
  {
    id: "day-4",
    day: 4,
    title: "Conditioning + Skill",
    subtitle: "Work capacity · Coordination · Calorie burn",
    emoji: "⚡",
    type: "optional",
    blocks: [
      {
        label: "FULL SESSION",
        type: "full",
        description: "Quality over grind",
        exercises: [
          { name: "Bike or Row intervals", sets: "1", reps: "20 min", rest: "—", notes: "30s hard / 30s easy" },
          { name: "Turkish Get-Up (8-12kg)", sets: "3", reps: "2/side", rest: "60 sec", notes: "Slow and controlled" },
          { name: "KB Snatch or High Pull", sets: "3", reps: "8/side", rest: "60 sec", notes: "Explosive but controlled" },
          { name: "Corebag Carry (bear hug)", sets: "3", reps: "40m", rest: "45 sec", notes: "15-25kg corebag" },
          { name: "Hanging Knee Raise", sets: "3", reps: "10", rest: "45 sec", notes: "Or floor leg raises" },
        ],
      },
    ],
  },
  {
    id: "day-5",
    day: 5,
    title: "Recovery + Mobility + Core",
    subtitle: "Restore · Decompress · Maintain mobility",
    emoji: "🧘",
    type: "optional",
    blocks: [
      {
        label: "FULL SESSION",
        type: "full",
        description: "The day that makes the other four work",
        exercises: [
          { name: "Bike or Row (steady)", sets: "1", reps: "15 min", rest: "—", notes: "RPE 5-6, conversation pace" },
          { name: "Foam Roll (full body)", sets: "1", reps: "5 min", rest: "—", notes: "Quads, lats, thoracic, glutes" },
          { name: "Hip 90/90 + Pigeon Stretch", sets: "1", reps: "60s/side", rest: "—", notes: "Breathe into it, no forcing" },
          { name: "Banded Shoulder Dislocates", sets: "1", reps: "15", rest: "—", notes: "Wide grip, slow" },
          { name: "Dead Hang", sets: "3", reps: "20-30s", rest: "30 sec", notes: "Decompress the spine" },
          { name: "Ab Wheel (from knees)", sets: "3", reps: "8", rest: "45 sec", notes: "Control the eccentric" },
          { name: "Neck Stretches", sets: "1", reps: "30s/side", rest: "—", notes: "Gentle lateral + rotation" },
        ],
      },
    ],
  },
];

export const programs: Program[] = [
  {
    id: "phase-1",
    name: "Phase 1",
    description: "4-Week Ramp-Up · Strength + Fat Loss",
    weeks: 4,
    days: workoutDays,
    status: "active",
  },
  {
    id: "phase-2",
    name: "Phase 2",
    description: "Push/Pull Split · Strength Progression",
    weeks: 4,
    days: [],
    status: "coming-soon",
  },
];
