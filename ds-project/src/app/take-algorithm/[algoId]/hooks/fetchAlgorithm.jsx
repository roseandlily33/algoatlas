export async function fetchAlgorithm(algoId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms/${algoId}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch algorithm");
  return await res.json();
}
