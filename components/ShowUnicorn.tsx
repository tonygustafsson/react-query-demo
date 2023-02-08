import { useGetUnicorn } from "@/hooks/unicorns";
import Loader from "./Loader";

const ShowUnicorn = ({ id }: { id: number }) => {
  const { data: unicorn, isFetching } = useGetUnicorn(id);

  if (!unicorn && !isFetching) return null;

  return (
    <div>
      <h2>Unicorn info</h2>

      {isFetching && <Loader />}

      {!isFetching && (
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{unicorn?.name}</td>
            </tr>

            <tr>
              <td>Age:</td>
              <td>{unicorn?.age}</td>
            </tr>

            <tr>
              <td>Ability:</td>
              <td>{unicorn?.ability}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowUnicorn;
