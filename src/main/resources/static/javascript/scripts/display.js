import { nextHits } from "./hits.js";
import time from './time.js';
import { columns } from "./hits.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function draw() {
	const laneWidth = canvas.width / columns.length;

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvas.width, 0);
	context.stroke();

	nextHits().forEach((hit) => {
		context.beginPath();

		const spacingRatio = 2 // TODO use parameter
		const y = (hit.startTime - time()) / spacingRatio

		const laneX = laneWidth * columns.findIndex(x => x === hit.startX)
		context.moveTo(laneX, y);
		context.lineTo(laneX + laneWidth, y);
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
