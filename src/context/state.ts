export interface State {
  id: number;
  code: string;
  name: string;
}

export const fetchStates = async (): Promise<State[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/states/`);
  if (!res.ok) throw new Error('Failed to fetch states');
  return res.json();
};
