import { Customer } from "../types/Customer";

export const CustomerService = {
  getCustomersLarge: async (): Promise<Customer[]> => {
    return [
      {
        id: 1000,
        name: "James Butt",
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "unqualified",
        verified: true,
        activity: 17,
        balance: 70663,
        country: {
          name: "Algeria",
          code: "dz",
        },
        representative: {
          name: "Ioni Bowcher",
          image: "ionibowcher.png",
        },
      },
    ];
  },
};
