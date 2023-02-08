import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useReducer, useState } from "react";
import { useGetUnicorns, useUnicornMutations } from "@/hooks/unicorns";
import ShowUnicorn from "@/components/ShowUnicorn";
import Loader from "@/components/Loader";
import { Unicorn } from "./api/unicorns";
import createGuid from "@/utils/createGuid";

export default function Home() {
  const { data: unicorns, isFetching } = useGetUnicorns();
  const { create, update, remove } = useUnicornMutations();

  const createUnicorn = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;

    const name = target.name.value;
    const age = target.age.value;
    const ability = target.ability.value;

    create({
      id: createGuid(),
      name,
      age,
      ability,
    });

    target.reset();
  };

  const [editState, setEditState] = useReducer(
    (prev: Unicorn, next: Unicorn) => {
      return { ...prev, ...next };
    },
    {
      id: undefined,
      name: "",
      age: 0,
      ability: "",
    }
  );

  const [view, setView] = useState<string>();

  const updateUnicorn = (data: Unicorn) => {
    if (
      typeof data.id === "undefined" ||
      !data.name ||
      !data.age ||
      !data.ability
    )
      return;

    update(data);
    setEditState({ ...editState, id: undefined });
  };

  const removeUnicorn = (id?: string) => {
    if (!id) return;
    remove(id);
  };

  return (
    <>
      <Head>
        <title>React Query Mutations demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>React Query Mutations Demo</h1>

        <h2>Unicorns 🦄</h2>

        {isFetching && <Loader />}

        {!isFetching && !unicorns?.length && <em>No unicorns yet :(</em>}

        {!isFetching && !!unicorns?.length && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Ability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {unicorns?.map((item) => (
                <tr key={`item-${item.id}`}>
                  <td>
                    {editState.id === item.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editState.name}
                        onChange={(e) =>
                          setEditState({
                            ...editState,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {editState.id === item.id ? (
                      <input
                        type="number"
                        name="age"
                        value={editState.age}
                        onChange={(e) =>
                          setEditState({
                            ...editState,
                            age: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      item.age
                    )}
                  </td>
                  <td>
                    {editState.id === item.id ? (
                      <input
                        type="text"
                        name="ability"
                        value={editState.ability}
                        onChange={(e) =>
                          setEditState({
                            ...editState,
                            ability: e.target.value,
                          })
                        }
                      />
                    ) : (
                      item.ability
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {editState.id === item.id ? (
                        <>
                          <button
                            onClick={() => updateUnicorn({ ...editState })}
                          >
                            💾 Save
                          </button>
                          <button
                            onClick={() =>
                              setEditState({ ...editState, id: undefined })
                            }
                          >
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditState({ ...item })}>
                          ✏️ Edit
                        </button>
                      )}
                      <button onClick={() => setView(item.id)}>🔍 View</button>
                      <button onClick={() => removeUnicorn(item.id)}>
                        ⚔️ Kill
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Create a unicorn 🪄</h2>

        <form onSubmit={createUnicorn}>
          <div style={{ display: "flex" }}>
            <input type="text" name="name" placeholder="Name" />
            <input type="number" name="age" placeholder="Age" />
            <input type="text" name="ability" placeholder="Ability" />
          </div>

          <button
            type="submit"
            style={{
              marginBlock: 12,
              marginInline: 8,
              width: 120,
              height: 32,
              fontSize: 16,
            }}
          >
            💾 Save
          </button>
        </form>

        {typeof view !== "undefined" && <ShowUnicorn id={view} />}
      </main>
    </>
  );
}
