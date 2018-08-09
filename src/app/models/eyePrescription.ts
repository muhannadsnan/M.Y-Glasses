export class Eye {
	constructor( 
                public left?: EyePrescription,
                public right?: EyePrescription )
    {
        this.left = left || new EyePrescription()
        this.right = right || new EyePrescription()
    }
}

export class EyePrescription {
	constructor( 
                public sphere?: string,
				public cylinder?: string,
				public axis?: string,
				public addition?: string )
    {
        this.sphere = sphere || ""
        this.cylinder = cylinder || ""
        this.axis = axis || ""
        this.addition = addition || ""
    }
}