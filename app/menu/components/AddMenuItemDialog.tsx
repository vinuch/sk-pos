"use client";

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type AddMenuItemDialogProps = {
  // onClose: () => void
}
const AddMenuItemDialog = ({  }: AddMenuItemDialogProps) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemType, setItemType] = useState('swallow');
  const [isAddon, setIsAddon] = useState(false);
  const [servingAmount, setServingAmount] = useState(1);
  const [open, setOpen] = useState(false); 

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle adding the new menu item here
    console.log({
      itemName,
      itemPrice,
      itemType,
      isAddon,
      servingAmount,
    });

    // Close the dialog after submission
    // onClose();
    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add New Menu Item</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>
        <p id="dialog-description" className="mb-4">
          Fill in the details below to add a new menu item.
        </p>
        <form onSubmit={handleSubmit}>
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
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuItemDialog;
