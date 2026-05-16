import { getMenu } from "@/actions/menu";
import MenuGrid from "@/components/MenuGrid";
import NewOrder from "@/components/NewOrder";
import NewOrderHeader from "@/components/NewOrderHeader";
import OrderSummary from "@/components/OrderSummary";


export default async function NewOrderPage() {
  const menu = await getMenu();

  return (
    <section className="space-y-8">
      <NewOrder menu={menu}/>
    </section>
  );
}