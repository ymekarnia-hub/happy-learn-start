import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeTrackingOptions {
  contentType: "chapter" | "quiz" | "exercise";
  contentId: string;
  chapterId?: string;
  autoStart?: boolean;
  saveIntervalMs?: number;
}

interface TimeTrackingResult {
  elapsedSeconds: number;
  formattedTime: string;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
};

export const useTimeTracking = ({
  contentType,
  contentId,
  chapterId,
  autoStart = true,
  saveIntervalMs = 30000, // Sauvegarder toutes les 30 secondes
}: TimeTrackingOptions): TimeTrackingResult => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Récupérer le temps déjà passé depuis la BDD
  const fetchInitialTime = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUserId(user.id);

    const { data } = await supabase
      .from("time_tracking")
      .select("time_spent_seconds")
      .eq("user_id", user.id)
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .maybeSingle();

    if (data) {
      setElapsedSeconds(data.time_spent_seconds);
      lastSavedRef.current = data.time_spent_seconds;
    }
  }, [contentType, contentId]);

  // Sauvegarder le temps en BDD
  const saveTime = useCallback(async (additionalSeconds: number) => {
    if (!userId || additionalSeconds <= 0) return;

    try {
      await supabase.rpc("upsert_time_tracking", {
        p_user_id: userId,
        p_content_type: contentType,
        p_content_id: contentId,
        p_chapter_id: chapterId || null,
        p_additional_seconds: additionalSeconds,
      });
      lastSavedRef.current = elapsedSeconds;
    } catch (error) {
      console.error("Error saving time tracking:", error);
    }
  }, [userId, contentType, contentId, chapterId, elapsedSeconds]);

  // Démarrer le compteur
  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Sauvegarder périodiquement
    saveIntervalRef.current = setInterval(() => {
      const currentElapsed = elapsedSeconds;
      const toSave = currentElapsed - lastSavedRef.current;
      if (toSave > 0) {
        saveTime(toSave);
      }
    }, saveIntervalMs);
  }, [isRunning, saveIntervalMs, elapsedSeconds, saveTime]);

  // Mettre en pause
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    setIsPaused(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Sauvegarder immédiatement lors de la pause
    const toSave = elapsedSeconds - lastSavedRef.current;
    if (toSave > 0) {
      saveTime(toSave);
    }
  }, [isRunning, isPaused, elapsedSeconds, saveTime]);

  // Reprendre
  const resume = useCallback(() => {
    if (!isPaused) return;
    
    setIsPaused(false);
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, [isPaused]);

  // Réinitialiser
  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  // Gestion de la visibilité de l'onglet (pause auto)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else if (isPaused && isRunning) {
        resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pause, resume, isPaused, isRunning]);

  // Initialisation
  useEffect(() => {
    fetchInitialTime();
  }, [fetchInitialTime]);

  // Auto-start
  useEffect(() => {
    if (autoStart && userId && !isRunning) {
      start();
    }
  }, [autoStart, userId, isRunning, start]);

  // Cleanup et sauvegarde finale
  useEffect(() => {
    const currentUserId = userId;
    const currentElapsedSeconds = elapsedSeconds;
    const currentLastSaved = lastSavedRef.current;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      
      // Sauvegarder le temps restant non sauvegardé
      const toSave = currentElapsedSeconds - currentLastSaved;
      if (toSave > 0 && currentUserId) {
        // Appel asynchrone sans attendre le résultat
        supabase.rpc("upsert_time_tracking", {
          p_user_id: currentUserId,
          p_content_type: contentType,
          p_content_id: contentId,
          p_chapter_id: chapterId || null,
          p_additional_seconds: toSave,
        });
      }
    };
  }, [userId, elapsedSeconds, contentType, contentId, chapterId]);

  return {
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
  };
};

// Hook pour récupérer les temps de tous les chapitres
export const useChaptersTimes = (chapterIds: string[]) => {
  const [times, setTimes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimes = async () => {
      if (chapterIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("time_tracking")
        .select("content_id, time_spent_seconds")
        .eq("user_id", user.id)
        .eq("content_type", "chapter")
        .in("content_id", chapterIds);

      if (data) {
        const timesMap: Record<string, number> = {};
        data.forEach((item) => {
          timesMap[item.content_id] = item.time_spent_seconds;
        });
        setTimes(timesMap);
      }
      setLoading(false);
    };

    fetchTimes();
  }, [chapterIds.join(",")]);

  return { times, loading, formatTime };
};

// Hook pour récupérer les temps de tous les exercices d'un chapitre
export const useExercisesTimes = (chapterId: string, exerciseIds: string[]) => {
  const [times, setTimes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimes = async () => {
      if (exerciseIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("time_tracking")
        .select("content_id, time_spent_seconds")
        .eq("user_id", user.id)
        .eq("content_type", "exercise")
        .in("content_id", exerciseIds);

      if (data) {
        const timesMap: Record<string, number> = {};
        data.forEach((item) => {
          timesMap[item.content_id] = item.time_spent_seconds;
        });
        setTimes(timesMap);
      }
      setLoading(false);
    };

    fetchTimes();
  }, [chapterId, exerciseIds.join(",")]);

  return { times, loading, formatTime };
};
