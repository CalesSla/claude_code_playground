import 'dotenv/config';
import { db, exercises, workouts, workoutExercises, sets } from '../db';

async function seed() {
  console.log('Seeding database...');

  // Insert exercises
  const exerciseData = [
    { id: 'a1b2c3d4-e5f6-7890-abcd-111111111111', name: 'Bench Press' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-222222222222', name: 'Squat' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-333333333333', name: 'Deadlift' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-444444444444', name: 'Overhead Press' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-555555555555', name: 'Barbell Row' },
    { id: 'a1b2c3d4-e5f6-7890-abcd-666666666666', name: 'Pull-ups' },
  ];

  console.log('Inserting exercises...');
  await db.insert(exercises).values(exerciseData);

  // Insert workouts for user
  const userId = 'user_38tPzGGKR4w1lr9QrUx3CAVKqyo';
  const workoutData = [
    { id: 'b1b2c3d4-e5f6-7890-abcd-111111111111', userId, name: 'Push Day', date: '2025-01-25', duration: 65, notes: 'Felt strong today' },
    { id: 'b1b2c3d4-e5f6-7890-abcd-222222222222', userId, name: 'Pull Day', date: '2025-01-26', duration: 55, notes: 'Good back pump' },
    { id: 'b1b2c3d4-e5f6-7890-abcd-333333333333', userId, name: 'Leg Day', date: '2025-01-27', duration: 70, notes: null },
  ];

  console.log('Inserting workouts...');
  await db.insert(workouts).values(workoutData);

  // Insert workout exercises
  const workoutExerciseData = [
    // Push Day
    { id: 'c1b2c3d4-e5f6-7890-abcd-111111111111', workoutId: 'b1b2c3d4-e5f6-7890-abcd-111111111111', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-111111111111', order: 1 },
    { id: 'c1b2c3d4-e5f6-7890-abcd-222222222222', workoutId: 'b1b2c3d4-e5f6-7890-abcd-111111111111', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-444444444444', order: 2 },
    // Pull Day
    { id: 'c1b2c3d4-e5f6-7890-abcd-333333333333', workoutId: 'b1b2c3d4-e5f6-7890-abcd-222222222222', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-333333333333', order: 1 },
    { id: 'c1b2c3d4-e5f6-7890-abcd-444444444444', workoutId: 'b1b2c3d4-e5f6-7890-abcd-222222222222', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-555555555555', order: 2 },
    { id: 'c1b2c3d4-e5f6-7890-abcd-555555555555', workoutId: 'b1b2c3d4-e5f6-7890-abcd-222222222222', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-666666666666', order: 3 },
    // Leg Day
    { id: 'c1b2c3d4-e5f6-7890-abcd-666666666666', workoutId: 'b1b2c3d4-e5f6-7890-abcd-333333333333', exerciseId: 'a1b2c3d4-e5f6-7890-abcd-222222222222', order: 1 },
  ];

  console.log('Inserting workout exercises...');
  await db.insert(workoutExercises).values(workoutExerciseData);

  // Insert sets
  const setsData = [
    // Bench Press sets (Push Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-111111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-111111111111', setNumber: 1, weight: 135.0, reps: 10 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-112222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-111111111111', setNumber: 2, weight: 155.0, reps: 8 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-113333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-111111111111', setNumber: 3, weight: 175.0, reps: 6 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-114444444444', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-111111111111', setNumber: 4, weight: 175.0, reps: 5 },
    // Overhead Press sets (Push Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-221111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-222222222222', setNumber: 1, weight: 85.0, reps: 10 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-222222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-222222222222', setNumber: 2, weight: 95.0, reps: 8 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-223333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-222222222222', setNumber: 3, weight: 105.0, reps: 6 },
    // Deadlift sets (Pull Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-331111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-333333333333', setNumber: 1, weight: 225.0, reps: 8 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-332222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-333333333333', setNumber: 2, weight: 275.0, reps: 5 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-333333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-333333333333', setNumber: 3, weight: 315.0, reps: 3 },
    // Barbell Row sets (Pull Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-441111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-444444444444', setNumber: 1, weight: 115.0, reps: 10 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-442222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-444444444444', setNumber: 2, weight: 135.0, reps: 8 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-443333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-444444444444', setNumber: 3, weight: 145.0, reps: 8 },
    // Pull-ups sets (Pull Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-551111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-555555555555', setNumber: 1, weight: 0.0, reps: 12 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-552222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-555555555555', setNumber: 2, weight: 0.0, reps: 10 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-553333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-555555555555', setNumber: 3, weight: 0.0, reps: 8 },
    // Squat sets (Leg Day)
    { id: 'd1b2c3d4-e5f6-7890-abcd-661111111111', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-666666666666', setNumber: 1, weight: 185.0, reps: 10 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-662222222222', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-666666666666', setNumber: 2, weight: 225.0, reps: 8 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-663333333333', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-666666666666', setNumber: 3, weight: 255.0, reps: 6 },
    { id: 'd1b2c3d4-e5f6-7890-abcd-664444444444', workoutExerciseId: 'c1b2c3d4-e5f6-7890-abcd-666666666666', setNumber: 4, weight: 275.0, reps: 4 },
  ];

  console.log('Inserting sets...');
  await db.insert(sets).values(setsData);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
