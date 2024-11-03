export function getResultName(hitResultId) {
	const mapping = {
		0: 'None',
		1: 'Miss',
		2: 'Meh',
		3: 'Ok',
		4: 'Good',
		5: 'Great',
		6: 'Perfect',
	}
	return mapping[hitResultId];
}