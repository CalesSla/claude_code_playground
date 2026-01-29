"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Workout = {
  id: string;
  name: string;
  workoutExercises: {
    id: string;
    exercise: {
      id: string;
      name: string;
    };
    sets: {
      id: string;
      setNumber: number;
      reps: number;
      weight: number;
    }[];
  }[];
};

type WorkoutLogProps = {
  workouts: Workout[];
  selectedDate: Date;
};

export function WorkoutLog({ workouts, selectedDate }: WorkoutLogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDateSelect(newDate: Date | undefined) {
    if (!newDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(newDate, "yyyy-MM-dd"));
    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workout Log</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="size-4" />
              {format(selectedDate, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="text-muted-foreground mb-4 size-12" />
              <p className="text-muted-foreground text-center">
                No workouts logged for this day.
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) =>
            workout.workoutExercises.map((workoutExercise) => (
              <Card key={workoutExercise.id}>
                <CardHeader>
                  <CardTitle>{workoutExercise.exercise.name}</CardTitle>
                  <CardDescription>
                    {workoutExercise.sets.length} sets logged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workoutExercise.sets
                      .sort((a, b) => a.setNumber - b.setNumber)
                      .map((set) => (
                        <div
                          key={set.id}
                          className="bg-muted flex items-center justify-between rounded-md px-3 py-2"
                        >
                          <span className="text-muted-foreground text-sm">
                            Set {set.setNumber}
                          </span>
                          <span className="font-medium">
                            {set.reps} reps @ {set.weight} lbs
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}
