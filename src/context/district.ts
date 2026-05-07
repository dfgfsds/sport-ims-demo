export interface District {
  stateId: number | undefined;
  id: number;
  name: string;
}

export const fetchDistricts = async (): Promise<District[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/districts/`);
  if (!res.ok) throw new Error('Failed to fetch districts');
  return res.json();
};
