import axios from "axios";
import { API_CONFIG } from "./config";
import type { Clients } from "./types";

class RepairShop {
  async fetchClients(): Promise<Clients> {
    try {
      const response = await axios.get(API_CONFIG.BASE_URL)
      return response.data
    } catch (error) {
      console.error(error);
      throw error
    }
  }
}

export const repairShop = new RepairShop();