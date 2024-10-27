"use client"
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from '@/components/ui';
import { MoreVertical } from 'lucide-react';
import AddMenuItemDialog from './components/AddMenuItemDialog';
import EditMenuItemDialog from './components/EditMenuItemDialog';
import MenuItemCard from './components/MenuItemCard';

export default function Menu() {
  const [open, setOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(false)
  const testMenuItems = [
    {
      id: 1,
      name: "Jollof Rice",
      price: 12.99,
      type: "swallow",
      description: "A flavorful rice dish cooked in a spicy tomato sauce.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 2,
      name: "Egusi Soup",
      price: 8.99,
      type: "soup",
      description: "A traditional Nigerian soup made with ground melon seeds.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 3,
      name: "Fried Plantain",
      price: 5.49,
      type: "swallow",
      description: "Sweet and ripe plantains fried to golden perfection.",
      isAddon: true,
      servingAmount: 1,
    },
    {
      id: 4,
      name: "Grilled Chicken",
      price: 15.00,
      type: "protein",
      description: "Juicy grilled chicken marinated with spices.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 5,
      name: "Pepper Soup",
      price: 9.50,
      type: "soup",
      description: "A spicy soup with fish or meat and lots of peppers.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 6,
      name: "Moi Moi",
      price: 7.50,
      type: "swallow",
      description: "A steamed bean pudding made from blended beans and spices.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 7,
      name: "Beef Suya",
      price: 10.00,
      type: "protein",
      description: "Spicy skewered beef served with onions and tomatoes.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 8,
      name: "Pounded Yam",
      price: 6.00,
      type: "swallow",
      description: "A smooth and stretchy yam dish, perfect with soups.",
      isAddon: false,
      servingAmount: 1,
    },
    {
      id: 9,
      name: "Samosa",
      price: 4.00,
      type: "swallow",
      description: "Crispy pastry filled with spiced potatoes and peas.",
      isAddon: true,
      servingAmount: 2,
    },
  ];


  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {testMenuItems.map((item, index) => (
         <MenuItemCard key={index} item={item} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
      <AddMenuItemDialog />
      {/* <EditMenuItemDialog open={false} setOpen={setOpen} item={itemToEdit} /> */}

      </div>
    </div>
  );
}
