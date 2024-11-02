import { nextHits } from "./hits.js";
import time from './time.js';
import { columns } from "./hits.js";
import { getParameter } from "./parameters-handler.js";
import { HoldableObject } from "osu-parsers";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function fitToScreen() {
	canvas.width = screen.width / 2;
	canvas.height = screen.height;
}

function drawNoteLimitLine() {
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvas.width, 0);
	context.stroke();
}

function draw() {
	fitToScreen();

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawNoteLimitLine();




	nextHits().forEach((hit) => {
		const laneWidth = canvas.width / columns.length;

		function getDisplayedY(actualY) {
			const spacingRatio = getParameter('note-spacing');
			return (actualY - time()) / spacingRatio;
		}

		context.beginPath();
		const laneX = laneWidth * columns.findIndex(x => x === hit.startX)
		context.moveTo(laneX, getDisplayedY(hit.startTime));

		if (hit instanceof HoldableObject) {
			context.rect(laneX, getDisplayedY(hit.startTime), laneWidth, getDisplayedY(hit.endTime) - getDisplayedY(hit.startTime));
			context.fill();
		} else {
			context.lineTo(laneX + laneWidth, getDisplayedY(hit.startTime));
			context.stroke();
		}
	});
}

function refresh() {
	draw();
	requestAnimationFrame(refresh);
}

export default function startDisplaying() {
	requestAnimationFrame(refresh);
}
