export default async function User({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <>User Profile: {id}</>;
}
