export interface FavouriteRow {
  $id: string;       
  userId: string;   
  itemId: string;    
  itemName: string;      
  itemType: "dish" | "cocktail"; 
  thumbnail?: string; 
}
