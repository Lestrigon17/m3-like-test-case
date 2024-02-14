export enum EBlockType {
	None 		= 1 << 0,
	Generation 	= 1 << 1,
	Animation 	= 1 << 2,
	Shuffle 	= 1 << 4,
	Destruction = 1 << 5,
	Dying		= 1 << 6,
	TakeDamage  = 1 << 7,
}