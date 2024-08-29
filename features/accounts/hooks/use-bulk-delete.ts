import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDelete = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"]});
            queryClient.invalidateQueries({ queryKey: ["summary"]});
            toast.success('Accounts deleted');
        },
        onError: () => {
            toast.error('Failed to delete accounts');
        }
    });
    return mutation;
}