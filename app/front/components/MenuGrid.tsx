import { MenuItem } from "@/resources/types";
import MenuItemCard from "./MenuItemCard";



type Props = {
  menu: MenuItem[];
};

export default function MenuGrid({ menu }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-950">Menu</h2>
        <span className="text-sm text-gray-400">{menu.length} items</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {menu.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}