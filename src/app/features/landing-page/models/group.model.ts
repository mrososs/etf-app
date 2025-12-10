export interface GroupMember {
  name: string;
  title?: string;
  image: string;
  order?: string | number; // Added for API response compatibility
}
