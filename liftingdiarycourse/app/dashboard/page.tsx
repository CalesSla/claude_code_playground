import { format } from "date-fns";
import { getWorkoutsByDate } from "@/data/workouts";
import { WorkoutLog } from "./workout-log";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const dateString = params.date || format(new Date(), "yyyy-MM-dd");
  const selectedDate = new Date(dateString + "T00:00:00");

  const workouts = await getWorkoutsByDate(dateString);

  return <WorkoutLog workouts={workouts} selectedDate={selectedDate} />;
}
