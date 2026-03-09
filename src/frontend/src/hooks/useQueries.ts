import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Event,
  GivingFund,
  PrayerRequest,
  Sermon,
  Testimony,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Sermons ──────────────────────────────────────────────────────────────────

export function useGetAllSermons() {
  const { actor, isFetching } = useActor();
  return useQuery<Sermon[]>({
    queryKey: ["sermons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSermons();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Events ───────────────────────────────────────────────────────────────────

export function useGetAllUpcomingEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUpcomingEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Testimonies ───────────────────────────────────────────────────────────────

export function useGetApprovedTestimonies() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimony[]>({
    queryKey: ["testimonies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedTestimonies();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Giving Funds ──────────────────────────────────────────────────────────────

export function useGetAllGivingFunds() {
  const { actor, isFetching } = useActor();
  return useQuery<GivingFund[]>({
    queryKey: ["givingFunds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGivingFunds();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSubmitPrayerRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (request: PrayerRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitPrayerRequest(request);
    },
  });
}

export function useSubmitTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (testimony: Testimony) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitTestimony(testimony);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeNewsletter(email);
    },
  });
}
