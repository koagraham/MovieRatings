import { useLoaderData } from 'react-router-dom';

export default function MovieDetailPage() {
  const {
    movie: { title, posterPath, overview },
  } = useLoaderData();

  return (
    <>
      <h1>{title}</h1>
      <img src={posterPath} alt={title} style={{ width: '200px' }} />
      <p>{overview}</p>
    </>
  );
}
