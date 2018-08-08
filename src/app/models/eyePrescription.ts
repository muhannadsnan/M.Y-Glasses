export class Eye {
	constructor( 
                public left: EyePrescription,
                public right: EyePrescription,
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