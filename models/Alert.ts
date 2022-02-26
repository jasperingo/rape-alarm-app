
export default interface Alert {
  id?: string;
  userId: string;
  date: string;
  longitude: number;
  latitude: number;
  address: string;
  status: 'Active' | 'Inactive'
}
