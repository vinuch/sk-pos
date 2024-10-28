"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Database } from "@/utils/types/supabase";
import { getMenuItems, getMenuItemsNonAddon } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
// Type aliases for easier access
export type MenuItemsRow = Database["public"]["Tables"]["MenuItems"]["Row"];

interface MenuItemsContextType {
  menuItems: MenuItemsRow[];
}

type MenuItemsProviderProps = {
  children: ReactNode;
};
const MenuItemsContext = createContext<MenuItemsContextType | undefined>(
  undefined
);

function MenuItemsProvider({ children }: MenuItemsProviderProps) {
  const supabase = createClient();

  const [menuItems, setMenuItems] = useState<MenuItemsRow[]>([]);

  const fetchMenuItems = useCallback(async () => {
    const menuItems = await getMenuItems(supabase);
    setMenuItems(menuItems);
  }, [supabase]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);
  return (
    <MenuItemsContext.Provider value={{ menuItems }}>
      {children}
    </MenuItemsContext.Provider>
  );
}

const useMenuItems = () => {
  const context = useContext(MenuItemsContext);
  if (!context) {
    throw new Error("useMenuItems must be used within a MenuItemsProvider");
  }

  return context;
};
export { MenuItemsProvider, useMenuItems };
