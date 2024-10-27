import { nextHits } from "./hits.js";
import time from './time.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function draw() {
	const laneWidth = 200;

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(laneWidth, 0);
	context.stroke();

	nextHits().forEach((hit) => {
		context.beginPath();

		const spacingRatio = 2
		const y = (hit.startTime - time()) / spacingRatio

		context.moveTo(0, y);
		context.lineTo(laneWidth, y);
		context.stroke();
	});
}

function refresh() {
	draw();
	requestAnimationFrame(refresh);
}

export default function startDisplaying() {
	requestAnimationFrame(refresh);
}
