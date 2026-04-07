import { Fragment } from "react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  fees: string;
};

type Totals = {
  subtotal: string;
  fees: string;
  total: string;
  currency: string;
};

const Line = ({
  label,
  value,
  amount = 1,
  variant,
}: {
  label: string;
  value: number;
  amount?: number;
  variant: "default" | "light";
}) => {
  const formattedValue = (
    <>
      ${value.toFixed(2)} {amount > 1 ? `x${amount}` : ""}
    </>
  );
  return (
    <li
      className={`line mb-2 flex justify-between border-b border-gray-600 pb-2 last:border-b-0 ${variant === "light" ? "border-white" : "border-gray-600"}`}
    >
      <span>{label}</span>
      <span className="whitespace-nowrap">{formattedValue}</span>
    </li>
  );
};

export function Receipt({
  lineItems,
  totals,
  variant = "default",
}: {
  lineItems: LineItem[];
  totals: Totals;
  variant?: "default" | "light";
}) {
  return (
    <div
      className={`border-t pt-3 text-sm ${variant === "light" ? "border-white" : "border-white/10"}`}
    >
      <h3 className="mb-4 text-lg font-bold">Purchase</h3>
      <ul>
        {lineItems.map((item) => (
          <Fragment key={item.id}>
            <li className="mb-3">
              <div className="font-bold">{item.description}</div>
            </li>
            <Line
              label="Price"
              value={parseFloat(item.unitPrice)}
              amount={item.quantity}
              variant={variant}
            />
            <Line
              label="Fees"
              value={parseFloat(item.fees)}
              amount={item.quantity}
              variant={variant}
            />
          </Fragment>
        ))}
        <Line
          label="Total"
          value={parseFloat(totals.total)}
          variant={variant}
        />
      </ul>
    </div>
  );
}
