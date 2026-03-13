import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Child } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllChildren() {
  const { actor, isFetching } = useActor();
  return useQuery<Child[]>({
    queryKey: ["children"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChildren();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterChild() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: number;
      chipID: string;
      parentPhone: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerChild(
        data.name,
        BigInt(data.age),
        data.chipID,
        data.parentPhone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}

export function useScanChip() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (chipID: string): Promise<Child> => {
      if (!actor) throw new Error("Not connected");
      return actor.scanChip(chipID);
    },
  });
}
