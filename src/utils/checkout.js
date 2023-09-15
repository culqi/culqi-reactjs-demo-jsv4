import api from "services/api";
import moment from "moment-timezone";

const date = moment.tz("America/Lima");
const timestamp = date.add(1, "days").unix();

export const createOrder = async ({ amount, order_number, currency, sk }) => {
  try {
    const response = await api.post(
      "/orders",
      {
        amount: amount,
        currency_code: currency,
        description: "Gafas de sol Ryan Ban",
        order_number: order_number,
        client_details: {
          first_name: "Name Demo",
          last_name: "LastName Demo",
          email: "demo.demo@culqi.com",
          phone_number: "+51999999999",
        },
        expiration_date: timestamp,
        confirm: false,
        metadata: {
          order_id: "demo-01",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sk}`,
        },
      }
    );
    console.log("createOrder ~> response: ", response);
    if (response.status === 201 || response.status === 200) {
      return { res: response.data, success: true };
    }
  } catch (error) {
    console.log("error createOrder", error.response.data);
    return { res: error.response.data, success: false };
  }
};

export const getAllOrders = async ({ sk }) => {
  console.log('sk: ', sk);
  try {
    const response = await api.get("/orders", {
      headers: {
        Authorization: `Bearer ${sk}`,
      },
    });
    if (response.status === 201 || response.status === 200) {
      return { res: response.data, success: true };
    }
  } catch (error) {
    let res;
    if (error.response === undefined) {
      res = "undefined";
    } else {
      res = error.response.data;
    }
    return { res, success: false };
  }
};
