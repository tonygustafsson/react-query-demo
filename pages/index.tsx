import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useReducer, useState } from "react";
import {
  UnicornWithId,
  useGetUnicorns,
  useUnicornMutations,
} from "@/hooks/unicorns";
import ShowUnicorn from "@/components/ShowUnicorn";
import Loader from "@/components/Loader";

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
      name,
      age,
      ability,
    });

    target.reset();
  };

  const [editState, setEditState] = useReducer(
    (prev: UnicornWithId, next: UnicornWithId) => {
      return { ...prev, ...next };
    },
    {
      id: undefined,
      name: "",
      age: 0,
      ability: "",
    }
  );

  const [view, setView] = useState<number>();

  const updateUnicorn = (data: UnicornWithId) => {
    if (
      typeof data.id === "undefined" ||
      !data.name ||
      !data.age ||
      !data.ability
    )
      return;

    update(data);
    setEditState({ id: undefined });
  };

  const removeUnicorn = (id: number) => {
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
              {unicorns?.map((item, id) => (
                <tr key={`item-${item.name}`}>
                  <td>
                    {editState.id === id ? (
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
                    {editState.id === id ? (
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
                    {editState.id === id ? (
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
                      {editState.id === id ? (
                        <>
                          <button
                            onClick={() => updateUnicorn({ ...editState })}
                          >
                            Save 💾
                          </button>
                          <button
                            onClick={() => setEditState({ id: undefined })}
                          >
                            Cancel ❌
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditState({ id, ...item })}>
                          Edit ✏️
                        </button>
                      )}
                      <button onClick={() => setView(id)}>View 🔍</button>
                      <button onClick={() => removeUnicorn(id)}>Kill ⚔️</button>
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
              width: 80,
              height: 32,
              fontSize: 20,
            }}
          >
            Save
          </button>
        </form>

        {typeof view !== "undefined" && <ShowUnicorn id={view} />}
      </main>
    </>
  );
}
