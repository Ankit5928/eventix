import React from "react";
import { TicketCategoryResponse } from "../../types/ticket-category.types";

const CategoryCard: React.FC<{ category: TicketCategoryResponse }> = ({
  category,
}) => {
  const soldCount = category.quantityTotal - category.quantityAvailable;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-900">{category.name}</h4>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
        <span className="text-lg font-bold text-blue-600">
          ${category.price}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Capacity</span>
          <span>
            {soldCount} / {category.quantityTotal} sold
          </span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${(soldCount / category.quantityTotal) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
