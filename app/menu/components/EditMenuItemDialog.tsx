"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EditMenuItemDialogProps = {
  item: {
    id: number;
    name: string;
    price: number;
    type: string;
    description: string;
    isAddon: boolean;
    servingAmount: number;
  };
  open: boolean;
  onClose: () => void;
};
const EditMenuItemDialog = ({
  item,
  open,
  onClose,
}: EditMenuItemDialogProps) => {
  const [itemName, setItemName] = useState(item.name);
  const [itemPrice, setItemPrice] = useState(item.price);
  const [itemType, setItemType] = useState(item.type);
  const [isAddon, setIsAddon] = useState(item.isAddon);
  const [servingAmount, setServingAmount] = useState(item.servingAmount);

  const handleEdit = (e: any) => {
    e.preventDefault();
    // Handle editing the menu item here
    console.log({
      ...item,
      itemName,
      itemPrice,
      itemType,
      isAddon,
      servingAmount,
    });

    // Close the dialog after editing
    onClose(); // Call the onClose prop function
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="edit-dialog-description">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <p id="edit-dialog-description" className="mb-4">
          Update the details below to edit the menu item.
        </p>
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label className="block mb-1">Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Price:</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Type:</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="swallow">Swallow</option>
              <option value="soup">Soup</option>
              <option value="protein">Protein</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAddon}
                onChange={(e) => setIsAddon(e.target.checked)}
              />
              <span className="ml-2">Is Addon</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount per Serving:</label>
            <input
              type="number"
              value={servingAmount}
              onChange={(e) => setServingAmount(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuItemDialog;