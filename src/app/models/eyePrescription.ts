export class Eye {
	constructor( 
                public eye: string, // left or right,
                public prescriptions: EyePrescription,
				){}
}

export class EyePrescription {
	constructor( 
                public sphere: string,
				public cylinder: string,
				public axis: string,
				public addition: string,
				){}
}