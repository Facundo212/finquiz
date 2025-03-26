/* eslint-disable no-nested-ternary */
import { useParams, NavLink } from 'react-router';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useGetPokemonByIdQuery } from '@/services/pokemon';

function Pokemon() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetPokemonByIdQuery(id!);

  return (
    <div className="flex justify-center items-center">
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <div className="w-sm">
          <Card className="w-full p-8">
            <CardHeader>
              <CardTitle className="capitalize">{data.species.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <img src={data.sprites.front_default} alt={data.species.name} />
                <img src={data.sprites.back_default} alt={data.species.name} />
              </div>

              <div className="flex justify-around">
                <img src={data.sprites.front_shiny} alt={data.species.name} />
                <img src={data.sprites.back_shiny} alt={data.species.name} />
              </div>
            </CardContent>
          </Card>

          <div className="w-full mt-8 flex justify-between">
            <NavLink to={`/pokemon/${Number(id) - 1}`}>
              <Button>
                Previous
              </Button>
            </NavLink>

            <NavLink to={`/pokemon/${Number(id) + 1}`}>
              <Button>
                Next
              </Button>
            </NavLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Pokemon;
