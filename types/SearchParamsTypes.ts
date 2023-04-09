// Description: This file contains the types for the search params, they come from stripe

type Params = {
  id: string;
};

type SearchParams = {
  name: string;
  unit_amount: number | null;
  image: string;
  id: string;
  description: string | null;
  features: string;
};

export type SearchParamTypes = {
    params: Params,
    searchParams: SearchParams,
};
