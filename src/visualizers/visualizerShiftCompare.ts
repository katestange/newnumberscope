import p5 from "p5";
import { visualizerDefault } from './visualizerDefault';
import { visualizerInterface, visualizerExportModule, visualizerParamsSchema } from './visualizerInterface';
import { ValidationStatus } from '@/shared/validationStatus';
import { SequenceInterface } from '@/sequences/sequenceInterface';

class VizShiftCompare extends visualizerDefault implements visualizerInterface {
    name = "Shift Compare";
	private img: p5.Image;
	params = [new visualizerParamsSchema(
		"mod",
		"number",
		"Mod factor",
		true,
		2,
		"The shift that will be applied"
	)];

	constructor(){
		super();

		this.img = this.sketch.createImage(this.sketch.width, this.sketch.height);
		this.img.loadPixels(); // Enables pixel-level editing.
	}

	initialize(sketch: p5, seq: SequenceInterface){
		this.sketch = sketch;
		this.seq = seq;

	}

	validate() {
		this.assignParams();
		this.isValid = true;
		return new ValidationStatus(true);
	}

	setup() {
		console.log(this.sketch.height, this.sketch.width);
	}

	clip(a: number, min: number, max: number) {
		if (a < min) {
			return min;
		} else if (a > max) {
			return max;
		}
		return a;
	}


	draw() { //This will be called everytime to draw
		// Ensure mouse coordinates are sane.
		// Mouse coordinates look they're floats by default.
		let mod = Number(this.settings.mod);

		const d = this.sketch.pixelDensity();
		const mx = this.clip(Math.round(this.sketch.mouseX), 0, this.sketch.width);
		const my = this.clip(Math.round(this.sketch.mouseY), 0, this.sketch.height);
		if (this.sketch.key == 'ArrowUp') {
			mod += 1;
			this.sketch.key = '';
			console.log("UP PRESSED, NEW MOD: " + this.settings.mod);
		} else if (this.sketch.key == 'ArrowDown') {
			mod -= 1;
			this.sketch.key = '';
			console.log("DOWN PRESSED, NEW MOD: " + mod);
		} else if (this.sketch.key == 'ArrowRight') {
			console.log(console.log("MX: " + mx + " MY: " + my));
		}
		// Write to image, then to screen for speed.
		for (let x = 0; x < this.sketch.width; x++) {
			for (let y = 0; y < this.sketch.height; y++) {
				for (let i = 0; i < d; i++) {
					for (let j = 0; j < d; j++) {
						const index = 4 * ((y * d + j) * this.sketch.width * d + (x * d + i));
						if (this.seq.getElement(x) % (mod) == this.seq.getElement(y) % (mod)) {
							this.img.pixels[index] = 255;
							this.img.pixels[index + 1] = 255;
							this.img.pixels[index + 2] = 255;
							this.img.pixels[index + 3] = 255;
						} else {
							this.img.pixels[index] = 0;
							this.img.pixels[index + 1] = 0;
							this.img.pixels[index + 2] = 0;
							this.img.pixels[index + 3] = 255;
						}
					}
				}
			}
		}

		this.img.updatePixels(); // Copies our edited pixels to the image.

		this.sketch.image(this.img, 0, 0); // Display image to screen.this.sketch.line(50,50,100,100);
	}
}


export const exportModule = new visualizerExportModule(
	"Shift Compare",
	VizShiftCompare,
	""
);
