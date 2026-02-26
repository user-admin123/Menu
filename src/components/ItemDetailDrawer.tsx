import { MenuItem } from "@/lib/types";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import VegBadge from "@/components/VegBadge";
import { Badge } from "@/components/ui/badge";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

const ItemDetailDrawer = ({ item, onClose }: Props) => {
  if (!item) return null;

  return (
    <Drawer open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="rounded-t-3xl max-h-[90vh] bg-background flex flex-col">

        {/* Image */}
        {item.image_url && (
          <div className="relative w-full h-72 overflow-hidden flex-shrink-0 rounded-t-3xl">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {!item.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 flex flex-col flex-1 min-h-0">
          {/* flex-1 + min-h-0 ensures scroll works properly */}

          {/* Header: Veg Badge + Name + Price */}
<div className="flex justify-between items-start mb-4 flex-shrink-0">
  <div className="flex items-baseline gap-2 max-w-[65%]">
    <VegBadge type={item.item_type || "veg"} size="md" />
    <h2 className="text-2xl font-semibold">
      {item.name}
    </h2>
  </div>

  <div className="flex flex-col items-end gap-2">
    <p className="text-2xl font-bold text-primary">
      ${item.price.toFixed(2)}
    </p>
    {!item.available && (
      <Badge className="bg-destructive/20 text-destructive border-none w-fit">
        Sold Out
      </Badge>
    )}
  </div>
</div>

          <div className="h-px bg-border/60 flex-shrink-0 mb-4" />

          {/* Scrollable Description */}
          {item.description && (
            <div className="flex-1 overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-thumb-rounded">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Description
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ItemDetailDrawer;
