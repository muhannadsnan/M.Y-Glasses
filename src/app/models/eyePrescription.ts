export class Eyes {
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
                public sphere?: number,
				public cylinder?: number,
				public axis?: number,
				public addition?: number )
    {
        this.sphere = sphere || 0
        this.cylinder = cylinder || 0
        this.axis = axis || 0
        this.addition = addition || 0
    }
}