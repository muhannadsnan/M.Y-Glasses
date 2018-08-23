import { Eyes } from "./eyePrescription";
import { Client } from "./client";
import { Branch } from "./branch";
import { Insurance } from "./insurance";

export class Order {
	constructor(
                public id?,
                public client?,
                public branch?,
                public insurance?,
                public items?,
                public eyePrescriptions?,
				public desc?){
        this.client = client || new Client()
        this.branch = branch || new Branch()
        this.insurance = insurance || new Insurance()
        this.items = items || []
        this.eyePrescriptions = eyePrescriptions || new Eyes()
    }
    
}
