export async function submitProgress(
  algoId,
  {
    rank,
    status,
    notes,
    answer,
    isStarred,
    attemptsToday,
    pattern,
    dataStructure,
    traversalOrTechnique,
    coreInvariant,
    baseCases,
    commonMistake,
  }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${algoId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rank,
        status,
        notes,
        answer,
        isStarred,
        attemptsToday,
        pattern,
        dataStructure,
        traversalOrTechnique,
        coreInvariant,
        baseCases,
        commonMistake,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to submit progress");
  return await res.json();
}
