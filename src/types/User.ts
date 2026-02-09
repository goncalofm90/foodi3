export interface User {
  $id: string;               
  name: string | null;       
  email: string;             
  prefs?: {                  
    avatar?: string;
  };
  $createdAt: string;        
  $updatedAt?: string;       
}