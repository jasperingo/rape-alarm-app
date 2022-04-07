
export default interface Alert {
  id?: string;
  userId: string;
  userDisplayName: string;
  date: number;
  longitude: number;
  latitude: number;
  address: string;
  status: 'Active' | 'Inactive'
}
