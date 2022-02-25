
export default interface Alert {
  id?: string;
  userId: string;
  date: string;
  longitude: number;
  latitude: number;
  status: 'Active' | 'Inactive'
}
