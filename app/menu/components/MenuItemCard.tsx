
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'; // Adjust this import to match your setup
import EditMenuItemDialog from './EditMenuItemDialog'; // Import the edit dialog component
import { MoreVertical } from 'lucide-react'; // Ensure you have this import if you're using lucide for icons

type MenuItemCardProps ={
  item : {
    id: number;
    name: string;
    price: number;
    type: string;
    description: string;
    isAddon: boolean;
    servingAmount: number;
};
}
const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  const handleEditOpen = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleEditClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  return (
    <div className="flex flex-col justify-between p-4 w-full bg-white rounded shadow relative">
      {/* Dropdown Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900">
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={handleEditOpen}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            Mark as Sold Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h3 className="text-lg mb-2">{item.name}</h3>
      <p className="text-gray-600">Description of the menu item goes here.</p>
      <p className="mt-2 text-base font-medium">${item.price.toFixed(2)}</p>
    
     {/* Render the Edit Menu Item Dialog */}
     <EditMenuItemDialog 
        item={item} 
        onClose={handleEditClose} 
        open={dialogOpen} // Pass the open state to the dialog
      />
    </div>
  );
};

export default MenuItemCard;
