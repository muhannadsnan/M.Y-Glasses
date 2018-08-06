import { Item } from "./item";
import { Eye } from "./eyePrescription";
import { Client } from "./client";

export class Order {
	constructor(
                public id?: string,
                public client?: Client,
                public branchId?: string,
                public insuranceId?: string,
                public items?: Item[],
                public eyePrescriptions?: Eye[],
				public desc?: string){}
}
