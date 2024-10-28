import { useMenuItems } from "@/context/MenuItemContext";
import React from "react";
import MenuItemCard from "./MenuItemCard";

export default function MenuList() {
  const { menuItems } = useMenuItems();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {menuItems.map((item, index) => (
        <MenuItemCard key={index} item={item} />
      ))}
    </div>
  );
}
