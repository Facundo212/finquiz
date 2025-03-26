import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pokemon } from '@/customTypes/pokemon';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonById: builder.query<Pokemon, string>({
      query: (id) => `pokemon/${id}`,
    }),
  }),
});

export const { useGetPokemonByIdQuery } = pokemonApi;
