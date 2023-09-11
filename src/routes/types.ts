export type Stripe = {
	colorCode: string; // Color of this block of threads
	threadCount: number; // Number of threads of this color in this block
	isHalfPivot: boolean;
	isFullStartPivot: boolean;
	isFullEndPivot: boolean;
};

export type PivotFormat = 'none' | 'half' | 'full';
