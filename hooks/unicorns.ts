import type { Unicorn } from "@/pages/api/unicorns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const sleep = async () => await new Promise((r) => setTimeout(r, 1000));

export const useGetUnicorns = () =>
  useQuery<Unicorn[]>(["unicorns"], async () => {
    await sleep(); // simulate slow network

    const response = await fetch("http://localhost:3000/api/unicorns");
    const json = response.json();

    return json;
  });

export const useGetUnicorn = (id: string) =>
  useQuery<Unicorn>([`unicorn_${id}`], async () => {
    await sleep(); // simulate slow network

    const response = await fetch(`http://localhost:3000/api/unicorns?id=${id}`);
    return response.json();
  });

export const useUnicornMutations = () => {
  const queryClient = useQueryClient();

  const { mutate: create, isLoading: createIsLoading } = useMutation(
    async (data: Unicorn) => {
      const response = await fetch("http://localhost:3000/api/unicorns", {
        method: "POST",
        body: JSON.stringify(data),
      });

      return response.json();
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["unicorns"]);
        //queryClient.setQueryData(["unicorns"], data);

        console.log("save", { data });
      },
      onError: (error) => {
        console.error(error);
      },
      onSettled: () => {
        // I will run either way, if success or error - could be useful!
      },
    }
  );

  const { mutate: update, isLoading: updateIsLoading } = useMutation(
    async (data: Unicorn) => {
      const response = await fetch("http://localhost:3000/api/unicorns", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return response.json();
    },
    {
      onSuccess: (response, updatedUnicorn) => {
        queryClient.invalidateQueries(["unicorns"]);
        queryClient.setQueryData(
          [`unicorn_${updatedUnicorn.id}`],
          updatedUnicorn
        );
        //queryClient.setQueryData(["unicorns"], data);

        console.log("update", { response });
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const { mutate: remove, isLoading: removeIsLoading } = useMutation(
    async (id: string) => {
      const response = await fetch("http://localhost:3000/api/unicorns", {
        method: "DELETE",
        body: JSON.stringify(id),
      });

      return response.json();
    },
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(["unicorns"]);
        queryClient.invalidateQueries([`unicorn_${id}`]);
        console.log("remove", { id });
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    create,
    createIsLoading,
    update,
    updateIsLoading,
    remove,
    removeIsLoading,
  };
};
