import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { exercises, workouts, workoutExercises, sets } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const USER_ID = "user_38tPzGGKR4w1lr9QrUx3CAVKqyo";

// Exercise IDs (already in database)
const EXERCISE_IDS = {
  benchPress: "e1a00000-0000-0000-0000-000000000001",
  squat: "e1a00000-0000-0000-0000-000000000002",
  deadlift: "e1a00000-0000-0000-0000-000000000003",
  overheadPress: "e1a00000-0000-0000-0000-000000000004",
  barbellRow: "e1a00000-0000-0000-0000-000000000005",
};

// Workout IDs (already in database)
const WORKOUT_IDS = {
  pushDay: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  pullDay: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  legDay: "cccccccc-cccc-cccc-cccc-cccccccccccc",
};

const WORKOUT_EXERCISE_IDS = {
  pushBench: "dd111111-1111-1111-1111-111111111111",
  pushOhp: "dd222222-2222-2222-2222-222222222222",
  pullDeadlift: "dd333333-3333-3333-3333-333333333333",
  pullRow: "dd444444-4444-4444-4444-444444444444",
  legSquat: "dd555555-5555-5555-5555-555555555555",
};

async function seed() {
  console.log("Seeding database...");

  // 1. Insert exercises (already exist, skip)
  console.log("Exercises already seeded, skipping...");

  // 2. Insert workouts (already exist, skip)
  console.log("Workouts already seeded, skipping...");

  // 3. Insert workout exercises
  const workoutExerciseData = [
    { id: WORKOUT_EXERCISE_IDS.pushBench, workoutId: WORKOUT_IDS.pushDay, exerciseId: EXERCISE_IDS.benchPress, order: 1 },
    { id: WORKOUT_EXERCISE_IDS.pushOhp, workoutId: WORKOUT_IDS.pushDay, exerciseId: EXERCISE_IDS.overheadPress, order: 2 },
    { id: WORKOUT_EXERCISE_IDS.pullDeadlift, workoutId: WORKOUT_IDS.pullDay, exerciseId: EXERCISE_IDS.deadlift, order: 1 },
    { id: WORKOUT_EXERCISE_IDS.pullRow, workoutId: WORKOUT_IDS.pullDay, exerciseId: EXERCISE_IDS.barbellRow, order: 2 },
    { id: WORKOUT_EXERCISE_IDS.legSquat, workoutId: WORKOUT_IDS.legDay, exerciseId: EXERCISE_IDS.squat, order: 1 },
  ];

  console.log("Inserting workout exercises...");
  await db.insert(workoutExercises).values(workoutExerciseData).onConflictDoNothing();

  // 4. Insert sets
  const setsData = [
    // Bench Press sets (Push Day)
    { id: "ee111111-1111-1111-1111-111111111111", workoutExerciseId: WORKOUT_EXERCISE_IDS.pushBench, setNumber: 1, weight: 135.0, reps: 10 },
    { id: "ee111111-1111-1111-1111-111111111112", workoutExerciseId: WORKOUT_EXERCISE_IDS.pushBench, setNumber: 2, weight: 155.0, reps: 8 },
    { id: "ee111111-1111-1111-1111-111111111113", workoutExerciseId: WORKOUT_EXERCISE_IDS.pushBench, setNumber: 3, weight: 175.0, reps: 6 },
    // Overhead Press sets (Push Day)
    { id: "ee222222-2222-2222-2222-222222222221", workoutExerciseId: WORKOUT_EXERCISE_IDS.pushOhp, setNumber: 1, weight: 85.0, reps: 10 },
    { id: "ee222222-2222-2222-2222-222222222222", workoutExerciseId: WORKOUT_EXERCISE_IDS.pushOhp, setNumber: 2, weight: 95.0, reps: 8 },
    // Deadlift sets (Pull Day)
    { id: "ee333333-3333-3333-3333-333333333331", workoutExerciseId: WORKOUT_EXERCISE_IDS.pullDeadlift, setNumber: 1, weight: 225.0, reps: 5 },
    { id: "ee333333-3333-3333-3333-333333333332", workoutExerciseId: WORKOUT_EXERCISE_IDS.pullDeadlift, setNumber: 2, weight: 275.0, reps: 5 },
    { id: "ee333333-3333-3333-3333-333333333333", workoutExerciseId: WORKOUT_EXERCISE_IDS.pullDeadlift, setNumber: 3, weight: 315.0, reps: 3 },
    // Barbell Row sets (Pull Day)
    { id: "ee444444-4444-4444-4444-444444444441", workoutExerciseId: WORKOUT_EXERCISE_IDS.pullRow, setNumber: 1, weight: 135.0, reps: 10 },
    { id: "ee444444-4444-4444-4444-444444444442", workoutExerciseId: WORKOUT_EXERCISE_IDS.pullRow, setNumber: 2, weight: 155.0, reps: 8 },
    // Squat sets (Leg Day)
    { id: "ee555555-5555-5555-5555-555555555551", workoutExerciseId: WORKOUT_EXERCISE_IDS.legSquat, setNumber: 1, weight: 185.0, reps: 8 },
    { id: "ee555555-5555-5555-5555-555555555552", workoutExerciseId: WORKOUT_EXERCISE_IDS.legSquat, setNumber: 2, weight: 225.0, reps: 6 },
    { id: "ee555555-5555-5555-5555-555555555553", workoutExerciseId: WORKOUT_EXERCISE_IDS.legSquat, setNumber: 3, weight: 245.0, reps: 5 },
  ];

  console.log("Inserting sets...");
  await db.insert(sets).values(setsData).onConflictDoNothing();

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
