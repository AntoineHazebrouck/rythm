import { nextHits } from "./hits.js";
import time from './time.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	nextHits().forEach((hit) => {
		context.beginPath();
		context.moveTo(0, hit.startTime - time());
		context.lineTo(200, hit.startTime - time());
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
