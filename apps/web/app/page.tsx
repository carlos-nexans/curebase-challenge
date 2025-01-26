export default async function Home() {
  const data = await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
