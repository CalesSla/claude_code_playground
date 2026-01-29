"use client";

import { useState } from "react";
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

// Mock workout data for UI demonstration
const mockWorkouts = [
  {
    id: "1",
    name: "Bench Press",
    sets: [
      { reps: 10, weight: 135 },
      { reps: 8, weight: 155 },
      { reps: 6, weight: 175 },
    ],
  },
  {
    id: "2",
    name: "Squats",
    sets: [
      { reps: 10, weight: 185 },
      { reps: 8, weight: 205 },
      { reps: 6, weight: 225 },
    ],
  },
  {
    id: "3",
    name: "Deadlift",
    sets: [
      { reps: 5, weight: 225 },
      { reps: 5, weight: 275 },
      { reps: 3, weight: 315 },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workout Log</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="size-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {mockWorkouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="text-muted-foreground mb-4 size-12" />
              <p className="text-muted-foreground text-center">
                No workouts logged for this day.
              </p>
            </CardContent>
          </Card>
        ) : (
          mockWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>
                  {workout.sets.length} sets logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workout.sets.map((set, index) => (
                    <div
                      key={index}
                      className="bg-muted flex items-center justify-between rounded-md px-3 py-2"
                    >
                      <span className="text-muted-foreground text-sm">
                        Set {index + 1}
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
        )}
      </div>
    </div>
  );
}
