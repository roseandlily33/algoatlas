// Utility to fetch user progress and algorithms
export async function fetchUserDashboardData() {
  // Get user progress (requires authentication)
  const progressRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/progress`,
    { credentials: "include" }
  );
  if (!progressRes.ok) throw new Error("Failed to fetch user progress");
  const progress = await progressRes.json();

  // Get all algorithms
  const algosRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms`,
    { credentials: "include" }
  );
  if (!algosRes.ok) throw new Error("Failed to fetch algorithms");
  const algorithms = await algosRes.json();

  return { progress, algorithms };
}
