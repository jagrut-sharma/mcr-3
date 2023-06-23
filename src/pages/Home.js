import React, { useState } from "react";
import { snacks } from "../utils/data";
import { useImmer } from "use-immer";

export default function Home() {
  const [filters, setFilters] = useImmer({
    inputSearch: "",
    headingFilter: "",
    filterState: true,
  });

  console.log(filters);

  const handleInput = (e) => {
    setFilters((draft) => {
      draft.inputSearch = e.target.value;
    });
  };

  const handleHeadingClick = (nameFilter) => {
    setFilters((draft) => {
      draft.headingFilter = nameFilter;
      if (nameFilter !== filters.headingFilter) {
        draft.filterState = false;
      } else {
        draft.filterState = !filters.filterState;
      }
    });
  };

  const searchFilter = (snacksList, appliedFiltersVal) => {
    return appliedFiltersVal.inputSearch.length > 0
      ? snacksList.filter(({ product_name, ingredients }) => {
          const isProductPresent = product_name
            .toLowerCase()
            .includes(appliedFiltersVal.inputSearch.toLowerCase());

          const isIngredientPresent = ingredients.some((ingredient) =>
            ingredient
              .toLowerCase()
              .includes(appliedFiltersVal.inputSearch.toLowerCase())
          );

          return isIngredientPresent || isProductPresent;
        })
      : snacksList;
  };

  const getSortFilter = (snacksList, appliedFiltersVal) => {
    let filtered = [...snacksList];

    filtered.sort((a, b) => {
      if (
        a[appliedFiltersVal.headingFilter] < b[appliedFiltersVal.headingFilter]
      ) {
        return -1;
      }
      if (
        a[appliedFiltersVal.headingFilter] > b[appliedFiltersVal.headingFilter]
      ) {
        return 1;
      }
      return 0;
    });

    if (appliedFiltersVal.filterState) {
      return filtered;
    } else {
      return filtered.reverse();
    }
  };

  const filteredSearchData = searchFilter(snacks, filters);

  const filteredData = getSortFilter(filteredSearchData, filters);

  return (
    <>
      <h1 className="text-3xl font-bold font-Merriweather">Snack Table</h1>
      <div className="my-4">
        <input
          type="text"
          className="border border-gray-500 w-[20rem] p-1"
          placeholder="Search with products or ingredients"
          value={filters.inputSearch}
          onChange={handleInput}
        />

        <table>
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                payload="id"
                onClick={() => handleHeadingClick("id")}
              >
                ID
              </th>
              <th
                className="cursor-pointer"
                name="product_name"
                onClick={() => handleHeadingClick("product_name")}
              >
                Product Name
              </th>
              <th
                className="cursor-pointer"
                name="product_weight"
                onClick={() => handleHeadingClick("product_weight")}
              >
                Product Weight(g)
              </th>
              <th
                className="cursor-pointer"
                name="price"
                onClick={() => handleHeadingClick("price")}
              >
                Price
              </th>
              <th
                className="cursor-pointer"
                name="calories"
                onClick={() => handleHeadingClick("calories")}
              >
                Calories
              </th>
              <th
                className="cursor-pointer"
                name="ingredients"
                onClick={() => handleHeadingClick("ingredients")}
              >
                Ingredients
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((snack) => (
              <tr key={snack.id}>
                <td>{snack.id}</td>
                <td>{snack.product_name}</td>
                <td>{snack.product_weight}</td>
                <td>{snack.price}</td>
                <td>{snack.calories}</td>
                <td>{snack.ingredients.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
