const osuAudio = await fetch("/audio");

var audio = new Audio(osuAudio);

function time() {
	return Math.round(audio.currentTime * 1000);
}

class BeatmapColorSection {
  comboColors = [];
  sliderTrackColor;
  sliderBorderColor;
  clone() {
    const cloned = new BeatmapColorSection();

    cloned.comboColors = this.comboColors.map((c) => c.clone());

    if (this.sliderTrackColor) {
      cloned.sliderTrackColor = this.sliderTrackColor;
    }

    if (this.sliderBorderColor) {
      cloned.sliderBorderColor = this.sliderBorderColor;
    }

    return cloned;
  }
}

class BeatmapDifficultySection {
  static BASE_DIFFICULTY = 5;
  _CS = BeatmapDifficultySection.BASE_DIFFICULTY;
  _HP = BeatmapDifficultySection.BASE_DIFFICULTY;
  _OD = BeatmapDifficultySection.BASE_DIFFICULTY;
  _AR;
  _multiplier = 1;
  _tickRate = 1;
  _rate = 1;
  get circleSize() {
    return Math.fround(this._CS);
  }
  set circleSize(value) {
    this._CS = value;
  }
  get drainRate() {
    return Math.fround(this._HP);
  }
  set drainRate(value) {
    this._HP = value;
  }
  get overallDifficulty() {
    return Math.fround(this._OD);
  }
  set overallDifficulty(value) {
    this._OD = value;
  }
  get approachRate() {
    return Math.fround(this._AR ?? this._OD);
  }
  set approachRate(value) {
    this._AR = value;
  }
  get sliderMultiplier() {
    return this._multiplier;
  }
  set sliderMultiplier(value) {
    this._multiplier = value;
  }
  get sliderTickRate() {
    return this._tickRate;
  }
  set sliderTickRate(value) {
    this._tickRate = value;
  }
  get clockRate() {
    return this._rate;
  }
  set clockRate(value) {
    this._rate = value;
  }
  clone() {
    const cloned = new BeatmapDifficultySection();

    cloned.circleSize = this._CS;
    cloned.drainRate = this._HP;
    cloned.overallDifficulty = this._OD;

    if (typeof this._AR === 'number') {
      cloned.approachRate = this._AR;
    }

    cloned.sliderMultiplier = this._multiplier;
    cloned.sliderTickRate = this._tickRate;
    cloned.clockRate = this._rate;

    return cloned;
  }
  static range(diff, min, mid, max) {
    if (diff > 5) {
      return mid + ((max - mid) * (diff - 5)) / 5;
    }

    if (diff < 5) {
      return mid - ((mid - min) * (5 - diff)) / 5;
    }

    return mid;
  }
}

class BeatmapEditorSection {
  bookmarks = [];
  distanceSpacing = 1;
  beatDivisor = 4;
  gridSize = 1;
  timelineZoom = 2;
  clone() {
    const cloned = new BeatmapEditorSection();

    cloned.bookmarks = this.bookmarks.slice();
    cloned.distanceSpacing = this.distanceSpacing;
    cloned.beatDivisor = this.beatDivisor;
    cloned.gridSize = this.gridSize;
    cloned.timelineZoom = this.timelineZoom;

    return cloned;
  }
}

let BlendingMode;

(function(BlendingMode) {
  BlendingMode[BlendingMode['AdditiveBlending'] = 0] = 'AdditiveBlending';
  BlendingMode[BlendingMode['AlphaBlending'] = 1] = 'AlphaBlending';
})(BlendingMode || (BlendingMode = {}));

class BlendingParameters {
  source;
  destination;
  sourceAlpha;
  destinationAlpha;
  rgbEquation;
  alphaEquation;
  static None = new BlendingParameters({
    source: 5,
    destination: 15,
    sourceAlpha: 5,
    destinationAlpha: 15,
    rgbEquation: 1,
    alphaEquation: 1,
  });
  static Inherit = new BlendingParameters({
    source: 0,
    destination: 0,
    sourceAlpha: 0,
    destinationAlpha: 0,
    rgbEquation: 0,
    alphaEquation: 0,
  });
  static Mixture = new BlendingParameters({
    source: 12,
    destination: 10,
    sourceAlpha: 5,
    destinationAlpha: 5,
    rgbEquation: 1,
    alphaEquation: 1,
  });
  static Additive = new BlendingParameters({
    source: 12,
    destination: 5,
    sourceAlpha: 5,
    destinationAlpha: 5,
    rgbEquation: 1,
    alphaEquation: 1,
  });
  constructor(params) {
    this.source = params.source || 0;
    this.destination = params.destination || 0;
    this.sourceAlpha = params.sourceAlpha || 0;
    this.destinationAlpha = params.destinationAlpha || 0;
    this.rgbEquation = params.rgbEquation || 0;
    this.alphaEquation = params.alphaEquation || 0;
  }
  copyFromParent(parent) {
    if (this.source === 0) {
      this.source = parent.source;
    }

    if (this.destination === 0) {
      this.destination = parent.destination;
    }

    if (this.sourceAlpha === 0) {
      this.sourceAlpha = parent.sourceAlpha;
    }

    if (this.destinationAlpha === 0) {
      this.destinationAlpha = parent.destinationAlpha;
    }

    if (this.rgbEquation === 0) {
      this.rgbEquation = parent.rgbEquation;
    }

    if (this.alphaEquation === 0) {
      this.alphaEquation = parent.alphaEquation;
    }
  }
  applyDefaultToInherited() {
    if (this.source === 0) {
      this.source = 12;
    }

    if (this.destination === 0) {
      this.destination = 10;
    }

    if (this.sourceAlpha === 0) {
      this.sourceAlpha = 5;
    }

    if (this.destinationAlpha === 0) {
      this.destinationAlpha = 5;
    }

    if (this.rgbEquation === 0) {
      this.rgbEquation = 1;
    }

    if (this.alphaEquation === 0) {
      this.alphaEquation = 1;
    }
  }
  equals(other) {
    return other.source === this.source
            && other.destination === this.destination
            && other.sourceAlpha === this.sourceAlpha
            && other.destinationAlpha === this.destinationAlpha
            && other.rgbEquation === this.rgbEquation
            && other.alphaEquation === this.alphaEquation;
  }
  get isDisabled() {
    return this.source === 5
            && this.destination === 15
            && this.sourceAlpha === 5
            && this.destinationAlpha === 15
            && this.rgbEquation === 1
            && this.alphaEquation === 1;
  }
  get rgbEquationMode() {
    return BlendingParameters._translateEquation(this.rgbEquation);
  }
  get alphaEquationMode() {
    return BlendingParameters._translateEquation(this.alphaEquation);
  }
  get sourceBlendingFactor() {
    return BlendingParameters._translateBlendingFactorSrc(this.source);
  }
  get destinationBlendingFactor() {
    return BlendingParameters._translateBlendingFactorDest(this.destination);
  }
  get sourceAlphaBlendingFactor() {
    return BlendingParameters._translateBlendingFactorSrc(this.sourceAlpha);
  }
  get destinationAlphaBlendingFactor() {
    return BlendingParameters._translateBlendingFactorDest(this.destinationAlpha);
  }
  static _translateBlendingFactorSrc(factor) {
    switch (factor) {
      case 1:
        return 32771;
      case 2:
        return 32769;
      case 3:
        return 772;
      case 4:
        return 774;
      case 5:
        return 1;
      case 6:
        return 32772;
      case 7:
        return 32770;
      case 8:
        return 773;
      case 9:
        return 775;
      case 10:
        return 769;
      case 12:
        return 770;
      case 13:
        return 776;
      case 14:
        return 768;
      default:
      case 15:
        return 0;
    }
  }
  static _translateBlendingFactorDest(factor) {
    switch (factor) {
      case 1:
        return 32771;
      case 2:
        return 32769;
      case 3:
        return 772;
      case 4:
        return 774;
      case 5:
        return 1;
      case 6:
        return 32772;
      case 7:
        return 32770;
      case 8:
        return 773;
      case 9:
        return 775;
      case 10:
        return 771;
      case 11:
        return 769;
      case 12:
        return 770;
      case 13:
        return 776;
      case 14:
        return 768;
      default:
      case 15:
        return 0;
    }
  }
  static _translateEquation(equation) {
    switch (equation) {
      default:
      case 0:
      case 1:
        return 32774;
      case 2:
        return 32775;
      case 3:
        return 32776;
      case 4:
        return 32778;
      case 5:
        return 32779;
    }
  }
}

let Anchor;

(function(Anchor) {
  Anchor[Anchor['y0'] = 1] = 'y0';
  Anchor[Anchor['y1'] = 2] = 'y1';
  Anchor[Anchor['y2'] = 4] = 'y2';
  Anchor[Anchor['x0'] = 8] = 'x0';
  Anchor[Anchor['x1'] = 16] = 'x1';
  Anchor[Anchor['x2'] = 32] = 'x2';
  Anchor[Anchor['Custom'] = 64] = 'Custom';
  Anchor[Anchor['TopLeft'] = 9] = 'TopLeft';
  Anchor[Anchor['TopCentre'] = 17] = 'TopCentre';
  Anchor[Anchor['TopRight'] = 33] = 'TopRight';
  Anchor[Anchor['CentreLeft'] = 10] = 'CentreLeft';
  Anchor[Anchor['Centre'] = 18] = 'Centre';
  Anchor[Anchor['CentreRight'] = 34] = 'CentreRight';
  Anchor[Anchor['BottomLeft'] = 12] = 'BottomLeft';
  Anchor[Anchor['BottomCentre'] = 20] = 'BottomCentre';
  Anchor[Anchor['BottomRight'] = 36] = 'BottomRight';
})(Anchor || (Anchor = {}));

let CommandType;

(function(CommandType) {
  CommandType['None'] = '';
  CommandType['Movement'] = 'M';
  CommandType['MovementX'] = 'MX';
  CommandType['MovementY'] = 'MY';
  CommandType['Fade'] = 'F';
  CommandType['Scale'] = 'S';
  CommandType['VectorScale'] = 'V';
  CommandType['Rotation'] = 'R';
  CommandType['Color'] = 'C';
  CommandType['Parameter'] = 'P';
})(CommandType || (CommandType = {}));

let CompoundType;

(function(CompoundType) {
  CompoundType['None'] = '';
  CompoundType['Loop'] = 'L';
  CompoundType['Trigger'] = 'T';
})(CompoundType || (CompoundType = {}));

let EventType;

(function(EventType) {
  EventType[EventType['Background'] = 0] = 'Background';
  EventType[EventType['Video'] = 1] = 'Video';
  EventType[EventType['Break'] = 2] = 'Break';
  EventType[EventType['Colour'] = 3] = 'Colour';
  EventType[EventType['Sprite'] = 4] = 'Sprite';
  EventType[EventType['Sample'] = 5] = 'Sample';
  EventType[EventType['Animation'] = 6] = 'Animation';
  EventType[EventType['StoryboardCommand'] = 7] = 'StoryboardCommand';
})(EventType || (EventType = {}));

let LayerType;

(function(LayerType) {
  LayerType[LayerType['Background'] = 0] = 'Background';
  LayerType[LayerType['Fail'] = 1] = 'Fail';
  LayerType[LayerType['Pass'] = 2] = 'Pass';
  LayerType[LayerType['Foreground'] = 3] = 'Foreground';
  LayerType[LayerType['Overlay'] = 4] = 'Overlay';
  LayerType[LayerType['Video'] = 5] = 'Video';
})(LayerType || (LayerType = {}));

let LoopType;

(function(LoopType) {
  LoopType[LoopType['LoopForever'] = 0] = 'LoopForever';
  LoopType[LoopType['LoopOnce'] = 1] = 'LoopOnce';
})(LoopType || (LoopType = {}));

let Origins;

(function(Origins) {
  Origins[Origins['TopLeft'] = 0] = 'TopLeft';
  Origins[Origins['Centre'] = 1] = 'Centre';
  Origins[Origins['CentreLeft'] = 2] = 'CentreLeft';
  Origins[Origins['TopRight'] = 3] = 'TopRight';
  Origins[Origins['BottomCentre'] = 4] = 'BottomCentre';
  Origins[Origins['TopCentre'] = 5] = 'TopCentre';
  Origins[Origins['Custom'] = 6] = 'Custom';
  Origins[Origins['CentreRight'] = 7] = 'CentreRight';
  Origins[Origins['BottomLeft'] = 8] = 'BottomLeft';
  Origins[Origins['BottomRight'] = 9] = 'BottomRight';
})(Origins || (Origins = {}));

let ParameterType;

(function(ParameterType) {
  ParameterType['None'] = '';
  ParameterType['HorizontalFlip'] = 'H';
  ParameterType['VerticalFlip'] = 'V';
  ParameterType['BlendingMode'] = 'A';
})(ParameterType || (ParameterType = {}));

class Color4 {
  red;
  green;
  blue;
  alpha;
  constructor(red, green, blue, alpha) {
    this.red = red ?? 255;
    this.green = green ?? 255;
    this.blue = blue ?? 255;
    this.alpha = alpha ?? 1;
  }
  get hex() {
    const alpha = Math.round(this.alpha * 255);

    return ('#' +
            this.red.toString(16).padStart(2, '0') +
            this.green.toString(16).padStart(2, '0') +
            this.blue.toString(16).padStart(2, '0') +
            alpha.toString(16).padStart(2, '0'));
  }
  equals(color) {
    return this.red === color.red
            && this.green === color.green
            && this.blue === color.blue
            && this.alpha === color.alpha;
  }
  clone() {
    return new Color4(this.red, this.green, this.blue, this.alpha);
  }
  toString() {
    return `${this.red},${this.green},${this.blue},${this.alpha}`;
  }
}

class Vector2 {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = isFinite(y) ? y : x;
  }
  get floatX() {
    return Math.fround(this.x);
  }
  get floatY() {
    return Math.fround(this.y);
  }
  add(vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }
  fadd(vec) {
    return new Vector2(Math.fround(this.floatX + vec.floatX), Math.fround(this.floatY + vec.floatY));
  }
  subtract(vec) {
    return new Vector2(this.x - vec.x, this.y - vec.y);
  }
  fsubtract(vec) {
    return new Vector2(Math.fround(this.floatX - vec.floatX), Math.fround(this.floatY - vec.floatY));
  }
  scale(multiplier) {
    return new Vector2(this.x * multiplier, this.y * multiplier);
  }
  fscale(multiplier) {
    const floatMultiplier = Math.fround(multiplier);

    return new Vector2(Math.fround(this.floatX * floatMultiplier), Math.fround(this.floatY * floatMultiplier));
  }
  divide(divisor) {
    return new Vector2(this.x / divisor, this.y / divisor);
  }
  fdivide(divisor) {
    const floatDivisor = Math.fround(divisor);

    return new Vector2(Math.fround(this.floatX / floatDivisor), Math.fround(this.floatY / floatDivisor));
  }
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }
  fdot(vec) {
    return Math.fround(Math.fround(Math.fround(this.floatX * vec.floatX) +
            Math.fround(this.floatY * vec.floatY)));
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  flength() {
    return Math.fround(Math.sqrt(Math.fround(Math.fround(this.floatX * this.floatX) +
            Math.fround(this.floatY * this.floatY))));
  }
  distance(vec) {
    const x = this.x - vec.x;
    const y = this.y - vec.y;

    return Math.sqrt(x * x + y * y);
  }
  fdistance(vec) {
    const x = Math.fround(this.floatX - vec.floatX);
    const y = Math.fround(this.floatY - vec.floatY);

    return Math.fround(Math.sqrt(Math.fround(Math.fround(x * x) + Math.fround(y * y))));
  }
  normalize() {
    const scale = 1 / this.length();

    return new Vector2(this.x * scale, this.y * scale);
  }
  fnormalize() {
    const scale = Math.fround(1 / this.flength());

    return new Vector2(Math.fround(this.floatX * scale), Math.fround(this.floatY * scale));
  }
  equals(vec) {
    return this.x === vec.x && this.y === vec.y;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function map(value, from1, to1, from2, to2) {
  if (value < from1) {
    return from2;
  }

  if (value >= to1) {
    return to2;
  }

  return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

function map01(value, from1, to1) {
  return map(value, from1, to1, 0, 1);
}

let EasingType;

(function(EasingType) {
  EasingType[EasingType['None'] = 0] = 'None';
  EasingType[EasingType['Out'] = 1] = 'Out';
  EasingType[EasingType['In'] = 2] = 'In';
  EasingType[EasingType['InQuad'] = 3] = 'InQuad';
  EasingType[EasingType['OutQuad'] = 4] = 'OutQuad';
  EasingType[EasingType['InOutQuad'] = 5] = 'InOutQuad';
  EasingType[EasingType['InCubic'] = 6] = 'InCubic';
  EasingType[EasingType['OutCubic'] = 7] = 'OutCubic';
  EasingType[EasingType['InOutCubic'] = 8] = 'InOutCubic';
  EasingType[EasingType['InQuart'] = 9] = 'InQuart';
  EasingType[EasingType['OutQuart'] = 10] = 'OutQuart';
  EasingType[EasingType['InOutQuart'] = 11] = 'InOutQuart';
  EasingType[EasingType['InQuint'] = 12] = 'InQuint';
  EasingType[EasingType['OutQuint'] = 13] = 'OutQuint';
  EasingType[EasingType['InOutQuint'] = 14] = 'InOutQuint';
  EasingType[EasingType['InSine'] = 15] = 'InSine';
  EasingType[EasingType['OutSine'] = 16] = 'OutSine';
  EasingType[EasingType['InOutSine'] = 17] = 'InOutSine';
  EasingType[EasingType['InExpo'] = 18] = 'InExpo';
  EasingType[EasingType['OutExpo'] = 19] = 'OutExpo';
  EasingType[EasingType['InOutExpo'] = 20] = 'InOutExpo';
  EasingType[EasingType['InCirc'] = 21] = 'InCirc';
  EasingType[EasingType['OutCirc'] = 22] = 'OutCirc';
  EasingType[EasingType['InOutCirc'] = 23] = 'InOutCirc';
  EasingType[EasingType['InElastic'] = 24] = 'InElastic';
  EasingType[EasingType['OutElastic'] = 25] = 'OutElastic';
  EasingType[EasingType['OutElasticHalf'] = 26] = 'OutElasticHalf';
  EasingType[EasingType['OutElasticQuarter'] = 27] = 'OutElasticQuarter';
  EasingType[EasingType['InOutElastic'] = 28] = 'InOutElastic';
  EasingType[EasingType['InBack'] = 29] = 'InBack';
  EasingType[EasingType['OutBack'] = 30] = 'OutBack';
  EasingType[EasingType['InOutBack'] = 31] = 'InOutBack';
  EasingType[EasingType['InBounce'] = 32] = 'InBounce';
  EasingType[EasingType['OutBounce'] = 33] = 'OutBounce';
  EasingType[EasingType['InOutBounce'] = 34] = 'InOutBounce';
  EasingType[EasingType['OutPow10'] = 35] = 'OutPow10';
})(EasingType || (EasingType = {}));

const ELASTIC_CONST = 2 * Math.PI / 0.3;
const ELASTIC_CONST2 = 0.3 / 4;
const BACK_CONST = 1.70158;
const BACK_CONST2 = BACK_CONST * 1.525;
const BOUNCE_CONST = 1 / 2.75;
const EXPO_OFFSET = Math.pow(2, -10);
const ELASTIC_OFFSET_FULL = Math.pow(2, -11);
const ELASTIC_OFFSET_HALF = Math.pow(2, -10) * Math.sin((0.5 - ELASTIC_CONST2) * ELASTIC_CONST);
const ELASTIC_OFFSET_QUARTER = Math.pow(2, -10) * Math.sin((0.25 - ELASTIC_CONST2) * ELASTIC_CONST);
const IN_OUT_ELASTIC_OFFSET = Math.pow(2, -10) * Math.sin(((1 - ELASTIC_CONST2 * 1.5) * ELASTIC_CONST) / 1.5);
const clampEase = (fn) => (p) => fn(clamp01(p));
const linear = clampEase((p) => p);
const inQuad = clampEase((p) => p * p);
const outQuad = clampEase((p) => p * (2 - p));
const inOutQuad = clampEase((p) => {
  if (p < 0.5) {
    return p * p * 2;
  }

  return --p * p * -2 + 1;
});
const inCubic = clampEase((p) => p * p * p);
const outCubic = clampEase((p) => --p * p * p + 1);
const inOutCubic = clampEase((p) => {
  if (p < 0.5) {
    return p * p * p * 4;
  }

  return --p * p * p * 4 + 1;
});
const inQuart = clampEase((p) => p * p * p * p);
const outQuart = clampEase((p) => 1 - --p * p * p * p);
const inOutQuart = clampEase((p) => {
  if (p < 0.5) {
    return p * p * p * p * 8;
  }

  return --p * p * p * p * -8 + 1;
});
const inQuint = clampEase((p) => {
  return p * p * p * p * p;
});
const outQuint = clampEase((p) => {
  return --p * p * p * p * p + 1;
});
const inOutQuint = clampEase((p) => {
  if (p < 0.5) {
    return p * p * p * p * p * 16;
  }

  return --p * p * p * p * p * 16 + 1;
});
const inSine = clampEase((p) => {
  return 1 - Math.cos(p * Math.PI * 0.5);
});
const outSine = clampEase((p) => {
  return Math.sin(p * Math.PI * 0.5);
});
const inOutSine = clampEase((p) => {
  return 0.5 - 0.5 * Math.cos(Math.PI * p);
});
const inExpo = clampEase((p) => {
  return Math.pow(2, 10 * (p - 1)) + EXPO_OFFSET * (p - 1);
});
const outExpo = clampEase((p) => {
  return -Math.pow(2, -10 * p) + 1 + EXPO_OFFSET * p;
});
const inOutExpo = clampEase((p) => {
  if (p < 0.5) {
    return 0.5 * (Math.pow(2, 20 * p - 10) + EXPO_OFFSET * (2 * p - 1));
  }

  return 1 - 0.5 * (Math.pow(2, -20 * p + 10) + EXPO_OFFSET * (-2 * p + 1));
});
const inCirc = clampEase((p) => {
  return 1 - Math.sqrt(1 - p * p);
});
const outCirc = clampEase((p) => {
  return Math.sqrt(1 - --p * p);
});
const inOutCirc = clampEase((p) => {
  if ((p *= 2) < 1) {
    return 0.5 - 0.5 * Math.sqrt(1 - p * p);
  }

  return 0.5 * Math.sqrt(1 - (p -= 2) * p) + 0.5;
});
const inElastic = clampEase((p) => {
  return -Math.pow(2, -10 + 10 * p) * Math.sin((1 - ELASTIC_CONST2 - p) * ELASTIC_CONST) + ELASTIC_OFFSET_FULL * (1 - p);
});
const outElastic = clampEase((p) => {
  return Math.pow(2, -10 * p) * Math.sin((p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_FULL * p;
});
const outElasticHalf = clampEase((p) => {
  return Math.pow(2, -10 * p) * Math.sin((0.5 * p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_HALF * p;
});
const outElasticQuarter = clampEase((p) => {
  return Math.pow(2, -10 * p) * Math.sin((0.25 * p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_QUARTER * p;
});
const inOutElastic = clampEase((p) => {
  if ((p *= 2) < 1) {
    return -0.5 * (Math.pow(2, -10 + 10 * p) * Math.sin(((1 - ELASTIC_CONST2 * 1.5 - p) * ELASTIC_CONST) / 1.5) - IN_OUT_ELASTIC_OFFSET * (1 - p));
  }

  return 0.5 * (Math.pow(2, -10 * --p) * Math.sin(((p - ELASTIC_CONST2 * 1.5) * ELASTIC_CONST) / 1.5) - IN_OUT_ELASTIC_OFFSET * p) + 1;
});
const inBack = clampEase((p) => {
  return p * p * ((BACK_CONST + 1) * p - BACK_CONST);
});
const outBack = clampEase((p) => {
  return --p * p * ((BACK_CONST + 1) * p + BACK_CONST) + 1;
});
const inOutBack = clampEase((p) => {
  if ((p *= 2) < 1) {
    return 0.5 * p * p * ((BACK_CONST2 + 1) * p - BACK_CONST2);
  }

  return 0.5 * ((p -= 2) * p * ((BACK_CONST2 + 1) * p + BACK_CONST2) + 2);
});
const inBounce = clampEase((p) => {
  p = 1 - p;

  if (p < BOUNCE_CONST) {
    return 1 - 7.5625 * p * p;
  }

  if (p < 2 * BOUNCE_CONST) {
    return 1 - (7.5625 * (p -= 1.5 * BOUNCE_CONST) * p + 0.75);
  }

  if (p < 2.5 * BOUNCE_CONST) {
    return 1 - (7.5625 * (p -= 2.25 * BOUNCE_CONST) * p + 0.9375);
  }

  return 1 - (7.5625 * (p -= 2.625 * BOUNCE_CONST) * p + 0.984375);
});
const outBounce = clampEase((p) => {
  if (p < BOUNCE_CONST) {
    return 7.5625 * p * p;
  }

  if (p < 2 * BOUNCE_CONST) {
    return 7.5625 * (p -= 1.5 * BOUNCE_CONST) * p + 0.75;
  }

  if (p < 2.5 * BOUNCE_CONST) {
    return 7.5625 * (p -= 2.25 * BOUNCE_CONST) * p + 0.9375;
  }

  return 7.5625 * (p -= 2.625 * BOUNCE_CONST) * p + 0.984375;
});
const inOutBounce = clampEase((p) => {
  if (p < 0.5) {
    return 0.5 - 0.5 * outBounce(1 - p * 2);
  }

  return outBounce((p - 0.5) * 2) * 0.5 + 0.5;
});
const outPow10 = clampEase((p) => {
  return --p * Math.pow(p, 10) + 1;
});

function getEasingFn(easing) {
  switch (easing) {
    case EasingType.In:
    case EasingType.InQuad: return inQuad;
    case EasingType.Out:
    case EasingType.OutQuad: return outQuad;
    case EasingType.InOutQuad: return inOutQuad;
    case EasingType.InCubic: return inCubic;
    case EasingType.OutCubic: return outCubic;
    case EasingType.InOutCubic: return inOutCubic;
    case EasingType.InQuart: return inQuart;
    case EasingType.OutQuart: return outQuart;
    case EasingType.InOutQuart: return inOutQuart;
    case EasingType.InQuint: return inQuint;
    case EasingType.OutQuint: return outQuint;
    case EasingType.InOutQuint: return inOutQuint;
    case EasingType.InSine: return inSine;
    case EasingType.OutSine: return outSine;
    case EasingType.InOutSine: return inOutSine;
    case EasingType.InExpo: return inExpo;
    case EasingType.OutExpo: return outExpo;
    case EasingType.InOutExpo: return inOutExpo;
    case EasingType.InCirc: return inCirc;
    case EasingType.OutCirc: return outCirc;
    case EasingType.InOutCirc: return inOutCirc;
    case EasingType.InElastic: return inElastic;
    case EasingType.OutElastic: return outElastic;
    case EasingType.OutElasticHalf: return outElasticHalf;
    case EasingType.OutElasticQuarter: return outElasticQuarter;
    case EasingType.InOutElastic: return inOutElastic;
    case EasingType.InBack: return inBack;
    case EasingType.OutBack: return outBack;
    case EasingType.InOutBack: return inOutBack;
    case EasingType.InBounce: return inBounce;
    case EasingType.OutBounce: return outBounce;
    case EasingType.InOutBounce: return inOutBounce;
    case EasingType.OutPow10: return outPow10;
  }

  return linear;
}

class Command {
  type;
  parameter;
  easing;
  startTime;
  endTime;
  constructor(params) {
    this.type = params?.type ?? CommandType.None;
    this.parameter = params?.parameter ?? ParameterType.None;
    this.easing = params?.easing ?? EasingType.None;
    this.startTime = params?.startTime ?? 0;
    this.endTime = params?.endTime ?? 0;
    this.startValue = params?.startValue ?? null;
    this.endValue = params?.endValue ?? null;
  }
  get duration() {
    return this.endTime - this.startTime;
  }
  getProgress(time) {
    const clamped = map01(time, this.startTime, this.endTime);

    return getEasingFn(this.easing)(clamped);
  }
  getValueAtProgress(progress) {
    const getNumber = (progress, start, end) => {
      return start + progress * (end - start);
    };

    const getBoolean = (time, start, end) => {
      return start === end || time >= start && time < end;
    };

    if (typeof this.startValue === 'number') {
      const startValue = this.startValue;
      const endValue = this.endValue;

      return getNumber(progress, startValue, endValue);
    }

    if (this.startValue instanceof Vector2) {
      const startValue = this.startValue;
      const endValue = this.endValue;

      return new Vector2(getNumber(progress, startValue.floatX, endValue.floatX), getNumber(progress, startValue.floatY, endValue.floatY));
    }

    if (this.startValue instanceof Color4) {
      const startValue = this.startValue;
      const endValue = this.endValue;

      return new Color4(getNumber(progress, startValue.red, endValue.red), getNumber(progress, startValue.green, endValue.green), getNumber(progress, startValue.blue, endValue.blue), getNumber(progress, startValue.alpha, endValue.alpha));
    }

    const time = this.startTime + this.duration * progress;

    if (typeof this.startValue === 'boolean') {
      return getBoolean(time, this.startTime, this.endTime);
    }

    if (this.startValue instanceof BlendingParameters) {
      const startValue = this.startValue;
      const endValue = this.endValue;
      const isAdditive = getBoolean(time, this.startTime, this.endTime);

      return isAdditive ? startValue : endValue;
    }

    return this.endValue;
  }
  getValueAtTime(time) {
    return this.getValueAtProgress(this.getProgress(time));
  }
  equals(other) {
    return this.type === other.type
            && this.startTime === other.startTime
            && this.endTime === other.endTime
            && this.startValue === other.startValue
            && this.endValue === other.endValue
            && this.easing === other.easing
            && this.parameter === other.parameter;
  }
}

class CommandTimeline {
  _commands = [];
  startTime = Infinity;
  endTime = -Infinity;
  [Symbol.iterator]() {
    const data = this.commands;
    let i = -1;

    return {
      next: () => ({ value: data[++i], done: !(i in data) }),
    };
  }
  get commands() {
    return this._commands.sort((a, b) => {
      return a.startTime - b.startTime || a.endTime - b.endTime;
    });
  }
  add(type, easing, startTime, endTime, startValue, endValue, parameter) {
    if (endTime < startTime) {
      [startTime, endTime] = [endTime, startTime];
      [startValue, endValue] = [endValue, startValue];
    }

    this._commands.push(new Command({
      type,
      easing,
      startTime,
      endTime,
      startValue,
      endValue,
      parameter,
    }));

    if (startTime < this.startTime) {
      this.startValue = startValue;
      this.startTime = startTime;
    }

    if (endTime > this.endTime) {
      this.endValue = endValue;
      this.endTime = endTime;
    }
  }
  get hasCommands() {
    return this._commands.length > 0;
  }
}

class CommandTimelineGroup {
  x = new CommandTimeline();
  y = new CommandTimeline();
  scale = new CommandTimeline();
  vectorScale = new CommandTimeline();
  rotation = new CommandTimeline();
  color = new CommandTimeline();
  alpha = new CommandTimeline();
  blendingParameters = new CommandTimeline();
  flipH = new CommandTimeline();
  flipV = new CommandTimeline();
  _timelines;
  constructor() {
    this._timelines = [
      this.x,
      this.y,
      this.scale,
      this.vectorScale,
      this.rotation,
      this.color,
      this.alpha,
      this.blendingParameters,
      this.flipH,
      this.flipV,
    ];
  }
  get timelines() {
    return this._timelines;
  }
  get totalCommands() {
    return this._timelines.reduce((c, t) => c + t.commands.length, 0);
  }
  get commands() {
    return this._timelines
      .flatMap((t) => t.commands)
      .sort((a, b) => a.startTime - b.startTime || a.endTime - b.endTime);
  }
  get commandsStartTime() {
    let min = Infinity;

    for (let i = 0; i < this._timelines.length; ++i) {
      min = Math.min(min, this._timelines[i].startTime);
    }

    return min;
  }
  get commandsEndTime() {
    let max = -Infinity;

    for (let i = 0; i < this._timelines.length; ++i) {
      max = Math.max(max, this._timelines[i].endTime);
    }

    return max;
  }
  get commandsDuration() {
    return this.commandsEndTime - this.commandsStartTime;
  }
  get startTime() {
    return this.commandsStartTime;
  }
  get endTime() {
    return this.commandsEndTime;
  }
  get duration() {
    return this.endTime - this.startTime;
  }
  get hasCommands() {
    for (let i = 0; i < this._timelines.length; ++i) {
      if (this._timelines[i].hasCommands) {
        return true;
      }
    }

    return false;
  }
}

class CommandLoop extends CommandTimelineGroup {
  type = CompoundType.Loop;
  loopStartTime;
  loopCount;
  constructor(loopStartTime, loopCount) {
    super();
    this.loopStartTime = loopStartTime || 0;
    this.loopCount = loopCount || 0;
  }
  get totalIterations() {
    return this.loopCount + 1;
  }
  get startTime() {
    return this.loopStartTime + this.commandsStartTime;
  }
  get endTime() {
    return this.startTime + this.commandsDuration * this.totalIterations;
  }
  unrollCommands() {
    const commands = this.commands;

    if (commands.length === 0) {
      return [];
    }

    const { commandsDuration, totalIterations, loopStartTime } = this;
    const unrolledCommands = new Array(totalIterations * commands.length);

    for (let i = 0; i < totalIterations; i++) {
      const iterationStartTime = loopStartTime + i * commandsDuration;

      for (let j = 0; j < commands.length; j++) {
        const currentIndex = i * commands.length + j;
        const command = commands[j];

        unrolledCommands[currentIndex] = new Command({
          ...command,
          startTime: command.startTime + iterationStartTime,
          endTime: command.endTime + iterationStartTime,
        });
      }
    }

    return unrolledCommands;
  }
}

class CommandTrigger extends CommandTimelineGroup {
  type = CompoundType.Trigger;
  triggerName;
  triggerStartTime;
  triggerEndTime;
  groupNumber;
  constructor(triggerName, startTime, endTime, groupNumber) {
    super();
    this.triggerName = triggerName || '';
    this.triggerStartTime = startTime || 0;
    this.triggerEndTime = endTime || 0;
    this.groupNumber = groupNumber || 0;
  }
  unrollCommands() {
    const commands = this.commands;

    if (commands.length === 0) {
      return [];
    }

    const unrolledCommands = new Array(commands.length);

    for (let i = 0; i < commands.length; i++) {
      unrolledCommands[i] = new Command({
        ...commands[i],
        startTime: commands[i].startTime + this.triggerStartTime,
        endTime: commands[i].endTime + this.triggerStartTime,
      });
    }

    return unrolledCommands;
  }
}

class StoryboardSprite {
  origin;
  anchor;
  startTime = Infinity;
  endTime = -Infinity;
  filePath;
  commands = [];
  timelineGroup = new CommandTimelineGroup();
  loops = [];
  triggers = [];
  startPosition;
  scale = new Vector2(1, 1);
  color = new Color4();
  rotation = 0;
  flipX = false;
  flipY = false;
  isAdditive = false;
  constructor(path, origin, anchor, position) {
    this.filePath = path ?? '';
    this.origin = origin ?? Origins.TopLeft;
    this.anchor = anchor ?? Anchor.TopLeft;
    this.startPosition = position ?? new Vector2(0, 0);
  }
  get startX() {
    return this.startPosition.floatX;
  }
  set startX(value) {
    this.startPosition.x = value;
  }
  get startY() {
    return this.startPosition.floatY;
  }
  set startY(value) {
    this.startPosition.y = value;
  }
  get duration() {
    return this.endTime - this.startTime;
  }
  get hasCommands() {
    return this.timelineGroup.hasCommands
            || this.loops.some((l) => l.hasCommands)
            || this.triggers.some((t) => t.hasCommands);
  }
  get isDrawable() {
    return this.color.alpha >= 0.01 && this.hasCommands;
  }
  addLoop(startTime, repeatCount) {
    const loop = new CommandLoop(startTime, repeatCount);

    this.loops.push(loop);

    return loop;
  }
  addTrigger(triggerName, startTime, endTime, groupNumber) {
    const trigger = new CommandTrigger(triggerName, startTime, endTime, groupNumber);

    this.triggers.push(trigger);

    return trigger;
  }
  updateCommands() {
    const unwinded = [
      ...this.timelineGroup.commands,
      ...this.loops.flatMap((l) => l.unrollCommands()),
    ];

    this.commands = unwinded.sort((a, b) => a.startTime - b.startTime);

    return this.commands;
  }
  adjustTimesToCommands() {
    let earliestStartTime = this.startTime;
    let latestEndTime = this.endTime;

    for (const command of this.commands) {
      earliestStartTime = Math.min(earliestStartTime, command.startTime);
      latestEndTime = Math.max(latestEndTime, command.endTime);
    }

    this.startTime = earliestStartTime;
    this.endTime = latestEndTime;
  }
  resetValuesToCommands() {
    const applied = {};

    for (const command of this.commands) {
      if (!applied[command.type]) {
        this.setValueFromCommand(command, 0);
        applied[command.type] = true;
      }
    }
  }
  setValueFromCommand(command, progress) {
    const value = command.getValueAtProgress(progress);

    switch (command.type) {
      case CommandType.Movement:
        this.startPosition.x = value.x;
        this.startPosition.y = value.y;
        break;
      case CommandType.MovementX:
        this.startPosition.x = value;
        break;
      case CommandType.MovementY:
        this.startPosition.y = value;
        break;
      case CommandType.Fade:
        this.color.alpha = value;
        break;
      case CommandType.Scale:
        this.scale.x = value;
        this.scale.y = value;
        break;
      case CommandType.VectorScale:
        this.scale.x = value.x;
        this.scale.y = value.y;
        break;
      case CommandType.Rotation:
        this.rotation = value;
        break;
      case CommandType.Color:
        this.color.red = value.red;
        this.color.green = value.green;
        this.color.blue = value.blue;
        break;
    }

    if (command.type !== CommandType.Parameter) {
      return;
    }

    switch (command.parameter) {
      case ParameterType.BlendingMode:
        this.isAdditive = value.rgbEquation === 1;
        break;
      case ParameterType.HorizontalFlip:
        this.flipX = value;
        break;
      case ParameterType.VerticalFlip:
        this.flipY = value;
    }
  }
}

class StoryboardAnimation extends StoryboardSprite {
  frameCount;
  frameDelay;
  loopType;
  constructor(path, origin, anchor, position, frameCount, frameDelay, loopType) {
    super(path, origin, anchor, position);
    this.frameCount = frameCount ?? 0;
    this.frameDelay = frameDelay ?? 0;
    this.loopType = loopType ?? LoopType.LoopForever;
  }
}

class StoryboardSample {
  startTime;
  volume;
  filePath;
  get isDrawable() {
    return true;
  }
  constructor(path, time, volume) {
    this.filePath = path ?? '';
    this.startTime = time ?? 0;
    this.volume = volume ?? 100;
  }
}

class StoryboardVideo {
  startTime;
  filePath;
  get isDrawable() {
    return true;
  }
  constructor(path, time) {
    this.filePath = path ?? '';
    this.startTime = time ?? 0;
  }
}

class StoryboardLayer {
  name;
  depth;
  masking;
  visibleWhenPassing = true;
  visibleWhenFailing = true;
  elements = [];
  constructor(params) {
    this.name = params.name;
    this.depth = params.depth;
    this.masking = params.masking ?? true;
  }
}

class Storyboard {
  variables = new Map();
  colors = new BeatmapColorSection();
  useSkinSprites = false;
  minimumLayerDepth = 0;
  fileFormat = 14;
  _layers = new Map();
  constructor() {
    this.addLayer(new StoryboardLayer({ name: 'Video', depth: 4, masking: false }));
    this.addLayer(new StoryboardLayer({ name: 'Background', depth: 3 }));
    this.addLayer(new StoryboardLayer({ name: 'Fail', depth: 2, visibleWhenPassing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Pass', depth: 1, visibleWhenFailing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Foreground', depth: 0 }));
    this.addLayer(new StoryboardLayer({ name: 'Overlay', depth: -2147483648 }));
  }
  get layers() {
    return this._layers;
  }
  get hasDrawable() {
    for (const layer of this.layers.values()) {
      if (layer.elements.find((e) => e.isDrawable)) {
        return true;
      }
    }

    return false;
  }
  get hasVariables() {
    for (const _ in this.variables) {
      return true;
    }

    return false;
  }
  get earliestEventTime() {
    let time = Infinity;

    this._layers.forEach((layer) => {
      const elements = layer.elements;
      const min = elements.reduce((m, el) => Math.min(m, el.startTime), 0);

      time = Math.min(min, time);
    });

    return time === Infinity ? null : time;
  }
  get latestEventTime() {
    let time = -Infinity;

    this._layers.forEach((layer) => {
      const elements = layer.elements;
      const max = elements.reduce((max, element) => {
        const durationElement = element;

        return Math.max(max, durationElement?.endTime ?? element.startTime);
      }, 0);

      time = Math.max(max, time);
    });

    return time === -Infinity ? null : time;
  }
  addLayer(layer) {
    if (this._layers.has(layer.name)) {
      return;
    }

    this._layers.set(layer.name, layer);
  }
  getLayerByType(type) {
    return this.getLayerByName(LayerType[type] ?? 'Background');
  }
  getLayerByName(name) {
    const layer = this._layers.get(name)
            ?? new StoryboardLayer({ name, depth: --this.minimumLayerDepth });

    if (!this._layers.has(name)) {
      this._layers.set(name, layer);
    }

    return layer;
  }
}

class BeatmapEventSection {
  backgroundPath = null;
  breaks = [];
  storyboard = null;
  get isBackgroundReplaced() {
    if (!this.backgroundPath || !this.storyboard) {
      return false;
    }

    const filePath = this.backgroundPath.trim().toLowerCase();
    const layer = this.storyboard.getLayerByType(LayerType.Background);

    return layer.elements.some((e) => e.filePath.toLowerCase() === filePath);
  }
  clone() {
    const cloned = new BeatmapEventSection();

    cloned.backgroundPath = this.backgroundPath;
    cloned.breaks = this.breaks;
    cloned.storyboard = this.storyboard;

    return cloned;
  }
}

let SampleSet;

(function(SampleSet) {
  SampleSet[SampleSet['None'] = 0] = 'None';
  SampleSet[SampleSet['Normal'] = 1] = 'Normal';
  SampleSet[SampleSet['Soft'] = 2] = 'Soft';
  SampleSet[SampleSet['Drum'] = 3] = 'Drum';
})(SampleSet || (SampleSet = {}));

class BeatmapGeneralSection {
  audioFilename = '';
  audioHash;
  overlayPosition = 'NoChange';
  skinPreference = '';
  audioLeadIn = 0;
  previewTime = -1;
  countdown = 1;
  stackLeniency = 0.7;
  countdownOffset = 0;
  sampleSet = SampleSet.Normal;
  letterboxInBreaks = false;
  storyFireInFront;
  useSkinSprites = false;
  alwaysShowPlayfield;
  epilepsyWarning = false;
  specialStyle = false;
  widescreenStoryboard = false;
  samplesMatchPlaybackRate = false;
  clone() {
    const cloned = new BeatmapGeneralSection();

    cloned.audioFilename = this.audioFilename;

    if (this.audioHash) {
      cloned.audioHash = this.audioHash;
    }

    cloned.overlayPosition = this.overlayPosition;
    cloned.skinPreference = this.skinPreference;
    cloned.audioLeadIn = this.audioLeadIn;
    cloned.previewTime = this.previewTime;
    cloned.countdown = this.countdown;
    cloned.stackLeniency = this.stackLeniency;
    cloned.countdownOffset = this.countdownOffset;
    cloned.sampleSet = this.sampleSet;
    cloned.letterboxInBreaks = this.letterboxInBreaks;

    if (this.storyFireInFront) {
      cloned.storyFireInFront = this.storyFireInFront;
    }

    cloned.useSkinSprites = this.useSkinSprites;

    if (this.alwaysShowPlayfield) {
      cloned.alwaysShowPlayfield = this.alwaysShowPlayfield;
    }

    cloned.epilepsyWarning = this.epilepsyWarning;
    cloned.specialStyle = this.specialStyle;
    cloned.widescreenStoryboard = this.widescreenStoryboard;
    cloned.samplesMatchPlaybackRate = this.samplesMatchPlaybackRate;

    return cloned;
  }
}

class BeatmapMetadataSection {
  title = 'Unknown Title';
  artist = 'Unknown Artist';
  creator = 'Unknown Creator';
  version = 'Normal';
  source = '';
  tags = [];
  beatmapId = 0;
  beatmapSetId = 0;
  _titleUnicode = 'Unknown Title';
  get titleUnicode() {
    return this._titleUnicode !== 'Unknown Title'
      ? this._titleUnicode : this.title;
  }
  set titleUnicode(value) {
    this._titleUnicode = value;
  }
  _artistUnicode = 'Unknown Artist';
  get artistUnicode() {
    return this._artistUnicode !== 'Unknown Artist'
      ? this._artistUnicode : this.artist;
  }
  set artistUnicode(value) {
    this._artistUnicode = value;
  }
  clone() {
    const cloned = new BeatmapMetadataSection();

    cloned.title = this.title;
    cloned.titleUnicode = this.titleUnicode;
    cloned.artist = this.artist;
    cloned.artistUnicode = this.artistUnicode;
    cloned.creator = this.creator;
    cloned.version = this.version;
    cloned.source = this.source;
    cloned.tags = this.tags.slice();
    cloned.beatmapId = this.beatmapId;
    cloned.beatmapSetId = this.beatmapSetId;

    return cloned;
  }
}

class ControlPoint {
  group;
  constructor(group) {
    this.group = group || null;
  }
  attachGroup(group) {
    this.group = group;
  }
  dettachGroup() {
    this.group = null;
  }
  get startTime() {
    if (this.group) {
      return this.group.startTime;
    }

    return 0;
  }
}

class ControlPointGroup {
  controlPoints = [];
  startTime;
  constructor(time) {
    this.startTime = time;
  }
  add(point) {
    const existing = this.controlPoints.find((p) => {
      return p.pointType === point.pointType;
    });

    if (existing) {
      this.remove(existing);
    }

    point.attachGroup(this);
    this.controlPoints.push(point);
  }
  remove(point) {
    const index = this.controlPoints.findIndex((p) => {
      return p.pointType === point.pointType;
    });

    if (index !== -1) {
      this.controlPoints.splice(index, 1);
      point.dettachGroup();
    }
  }
}

function findNumber(arr, x) {
  let start = 0, mid, end = arr.length - 1;

  while (start <= end) {
    mid = start + ((end - start) >> 1);

    if (arr[mid] === x) {
      return mid;
    }

    if (arr[mid] < x) {
      start = mid + 1;
    }
    else {
      end = mid - 1;
    }
  }

  return ~start;
}

function findControlPointIndex(arr, time) {
  if (!arr.length) {
    return -1;
  }

  if (time < arr[0].startTime) {
    return -1;
  }

  if (time >= arr[arr.length - 1].startTime) {
    return arr.length - 1;
  }

  let l = 0;
  let r = arr.length - 2;

  while (l <= r) {
    const pivot = l + ((r - l) >> 1);

    if (arr[pivot].startTime < time) {
      l = pivot + 1;
    }
    else if (arr[pivot].startTime > time) {
      r = pivot - 1;
    }
    else {
      return pivot;
    }
  }

  return l - 1;
}

function findControlPoint(arr, time) {
  const index = findControlPointIndex(arr, time);

  if (index === -1) {
    return null;
  }

  return arr[index];
}

function barycentricWeights(points) {
  const n = points.length;
  const w = [];

  for (let i = 0; i < n; i++) {
    w[i] = 1;

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        w[i] *= points[i].floatX - points[j].floatX;
      }
    }

    w[i] = 1.0 / w[i];
  }

  return w;
}

function barycentricLagrange(points, weights, time) {
  if (points === null || points.length === 0) {
    throw new Error('points must contain at least one point');
  }

  if (points.length !== weights.length) {
    throw new Error('points must contain exactly as many items as weights');
  }

  let numerator = 0;
  let denominator = 0;

  for (let i = 0, len = points.length; i < len; ++i) {
    if (time === points[i].floatX) {
      return points[i].floatY;
    }

    const li = weights[i] / (time - points[i].floatX);

    numerator += li * points[i].floatY;
    denominator += li;
  }

  return numerator / denominator;
}

class FastRandom {
  static MAX_INT32 = 2147483647;
  static MAX_UINT32 = 4294967295;
  static INT_MASK = 0x7fffffff >> 0;
  static INT_TO_REAL = 1 / (FastRandom.MAX_INT32 + 1);
  _y = 842502087 >>> 0;
  _z = 3579807591 >>> 0;
  _w = 273326509 >>> 0;
  _x = 0;
  _bitBuffer = 0;
  _bitIndex = 32;
  constructor(seed) {
    this._x = seed;
  }
  _next() {
    const t = (this._x ^ ((this._x << 11) >>> 0)) >>> 0;

    this._x = this._y >>> 0;
    this._y = this._z >>> 0;
    this._z = this._w >>> 0;
    this._w = (this._w ^ (this._w >>> 19)) >>> 0;
    this._w = (this._w ^ t) >>> 0;
    this._w = (this._w ^ (t >>> 8)) >>> 0;

    return this._w;
  }
  next() {
    return (FastRandom.INT_MASK & this._next()) >> 0;
  }
  nextUInt(lowerBound = 0, upperBound = FastRandom.MAX_INT32) {
    if (lowerBound === 0 && upperBound === FastRandom.MAX_INT32) {
      return this._next();
    }

    return (lowerBound + this.nextDouble() * (upperBound - lowerBound)) >>> 0;
  }
  nextInt(lowerBound = 0, upperBound = FastRandom.MAX_INT32) {
    return (lowerBound + this.nextDouble() * (upperBound - lowerBound)) >> 0;
  }
  nextDouble() {
    return FastRandom.INT_TO_REAL * this.next();
  }
  nextBool() {
    if (this._bitIndex === 32) {
      this._bitBuffer = this.nextUInt();
      this._bitIndex = 1;

      return (this._bitBuffer & 1) === 1;
    }

    this._bitIndex = (this._bitIndex + 1) >> 0;

    return ((this._bitBuffer >>= 1) & 1) === 1;
  }
}

class RoundHelper {
  static PRECISION_ERROR = 1e-15;
  static round(x, mode = 1) {
    return mode ? this.roundToEven(x) : this.roundAwayFromZero(x);
  }
  static roundToEven(x) {
    return this.isAtMidPoint(x) ? 2 * Math.round(x / 2) : Math.round(x);
  }
  static roundAwayFromZero(x) {
    return this.isAtMidPoint(x) ? (x > 0 ? Math.ceil(x) : Math.floor(x)) : Math.round(x);
  }
  static isAtMidPoint(x) {
    return Math.abs(0.5 - Math.abs(x - (x >> 0))) <= this.PRECISION_ERROR;
  }
}

let ControlPointType;

(function(ControlPointType) {
  ControlPointType[ControlPointType['TimingPoint'] = 0] = 'TimingPoint';
  ControlPointType[ControlPointType['DifficultyPoint'] = 1] = 'DifficultyPoint';
  ControlPointType[ControlPointType['EffectPoint'] = 2] = 'EffectPoint';
  ControlPointType[ControlPointType['SamplePoint'] = 3] = 'SamplePoint';
})(ControlPointType || (ControlPointType = {}));

class DifficultyPoint extends ControlPoint {
  static default = new DifficultyPoint();
  pointType = ControlPointType.DifficultyPoint;
  generateTicks = true;
  isLegacy = false;
  sliderVelocityUnlimited = 1;
  get sliderVelocity() {
    return clamp(this.sliderVelocityUnlimited, 0.1, 10);
  }
  set sliderVelocity(value) {
    this.sliderVelocityUnlimited = value;
  }
  bpmMultiplier = 1;
  isRedundant(existing) {
    return existing instanceof DifficultyPoint
            && existing.sliderVelocity === this.sliderVelocity
            && existing.generateTicks === this.generateTicks;
  }
  equals(other) {
    return other instanceof DifficultyPoint
            && this.sliderVelocity === other.sliderVelocity;
  }
}

class EffectPoint extends ControlPoint {
  static default = new EffectPoint();
  pointType = ControlPointType.EffectPoint;
  kiai = false;
  omitFirstBarLine = false;
  scrollSpeedUnlimited = 1;
  get scrollSpeed() {
    return clamp(this.scrollSpeedUnlimited, 0.1, 10);
  }
  set scrollSpeed(value) {
    this.scrollSpeedUnlimited = value;
  }
  isRedundant(existing) {
    return (!this.omitFirstBarLine
            && existing instanceof EffectPoint
            && this.kiai === existing.kiai
            && this.omitFirstBarLine === existing.omitFirstBarLine
            && this.scrollSpeed === existing.scrollSpeed);
  }
  equals(other) {
    return other instanceof EffectPoint
            && this.kiai === other.kiai
            && this.omitFirstBarLine === other.omitFirstBarLine
            && this.scrollSpeed === other.scrollSpeed;
  }
}

class SamplePoint extends ControlPoint {
  static default = new SamplePoint();
  pointType = ControlPointType.SamplePoint;
  sampleSet = SampleSet[SampleSet.Normal];
  customIndex = 0;
  volume = 100;
  isRedundant(existing) {
    return (existing instanceof SamplePoint
            && this.volume === existing.volume
            && this.customIndex === existing.customIndex
            && this.sampleSet === existing.sampleSet);
  }
  equals(other) {
    return other instanceof SamplePoint
            && this.volume === other.volume
            && this.customIndex === other.customIndex
            && this.sampleSet === other.sampleSet;
  }
}

let TimeSignature;

(function(TimeSignature) {
  TimeSignature[TimeSignature['SimpleTriple'] = 3] = 'SimpleTriple';
  TimeSignature[TimeSignature['SimpleQuadruple'] = 4] = 'SimpleQuadruple';
})(TimeSignature || (TimeSignature = {}));

class TimingPoint extends ControlPoint {
  static default = new TimingPoint();
  static DEFAULT_BEAT_LENGTH = 1000;
  pointType = ControlPointType.TimingPoint;
  beatLengthUnlimited = TimingPoint.DEFAULT_BEAT_LENGTH;
  get beatLength() {
    return clamp(this.beatLengthUnlimited, 6, 60000);
  }
  set beatLength(value) {
    this.beatLengthUnlimited = value;
  }
  timeSignature = TimeSignature.SimpleQuadruple;
  get bpmUnlimited() {
    return 60000 / this.beatLengthUnlimited;
  }
  get bpm() {
    return 60000 / this.beatLength;
  }
  isRedundant() {
    return false;
  }
  equals(other) {
    return other instanceof TimingPoint
            && this.timeSignature === other.timeSignature
            && this.beatLength === other.beatLength;
  }
}

class ControlPointInfo {
  groups = [];
  difficultyPoints = [];
  effectPoints = [];
  samplePoints = [];
  timingPoints = [];
  get allPoints() {
    const points = [];

    this.groups.forEach((g) => points.push(...g.controlPoints));

    return points;
  }
  groupAt(time) {
    let group = this.groups.find((g) => g.startTime === time);

    if (!group) {
      group = new ControlPointGroup(time);
      this.groups.push(group);
      this.groups.sort((a, b) => a.startTime - b.startTime);
    }

    return group;
  }
  difficultyPointAt(time) {
    const point = findControlPoint(this.difficultyPoints, time);
    const fallback = DifficultyPoint.default;

    return point || fallback;
  }
  effectPointAt(time) {
    const point = findControlPoint(this.effectPoints, time);
    const fallback = EffectPoint.default;

    return point || fallback;
  }
  samplePointAt(time) {
    const point = findControlPoint(this.samplePoints, time);
    const fallback = SamplePoint.default;

    return point || fallback;
  }
  timingPointAt(time) {
    const point = findControlPoint(this.timingPoints, time);
    const fallback = this.timingPoints[0] || TimingPoint.default;

    return point || fallback;
  }
  add(point, time) {
    if (this.checkAlreadyExisting(time, point)) {
      return false;
    }

    const list = this.getCurrentList(point);
    const index = findControlPointIndex(list, time);

    list.splice(index + 1, 0, point);
    this.groupAt(time).add(point);

    return true;
  }
  getCurrentList(newPoint) {
    switch (newPoint.pointType) {
      case ControlPointType.DifficultyPoint: return this.difficultyPoints;
      case ControlPointType.EffectPoint: return this.effectPoints;
      case ControlPointType.SamplePoint: return this.samplePoints;
      case ControlPointType.TimingPoint: return this.timingPoints;
    }

    throw new TypeError(`Unknown control point type: ${newPoint.pointType}!`);
  }
  checkAlreadyExisting(time, newPoint) {
    let existing = null;

    switch (newPoint.pointType) {
      case ControlPointType.DifficultyPoint:
        existing = this.difficultyPointAt(time);
        break;
      case ControlPointType.EffectPoint:
        existing = this.effectPointAt(time);
        break;
      case ControlPointType.SamplePoint:
        existing = findControlPoint(this.samplePoints, time);
        break;
      case ControlPointType.TimingPoint:
        existing = findControlPoint(this.timingPoints, time);
    }

    return newPoint?.isRedundant(existing);
  }
  remove(point, time) {
    let list;

    switch (point.pointType) {
      case ControlPointType.DifficultyPoint:
        list = this.difficultyPoints;
        break;
      case ControlPointType.EffectPoint:
        list = this.effectPoints;
        break;
      case ControlPointType.SamplePoint:
        list = this.samplePoints;
        break;
      default:
        list = this.timingPoints;
    }

    const index = list.findIndex((p) => {
      return p.startTime === point.startTime;
    });

    if (index === -1) {
      return false;
    }

    list.splice(index, 1);
    this.groupAt(time).remove(point);

    return true;
  }
  clear() {
    this.groups.length = 0;
    this.difficultyPoints.length = 0;
    this.effectPoints.length = 0;
    this.samplePoints.length = 0;
    this.timingPoints.length = 0;
  }
  clone() {
    const cloned = new ControlPointInfo();

    cloned.groups = this.groups;
    cloned.difficultyPoints = this.difficultyPoints;
    cloned.effectPoints = this.effectPoints;
    cloned.samplePoints = this.samplePoints;
    cloned.timingPoints = this.timingPoints;

    return cloned;
  }
}

let HitSound;

(function(HitSound) {
  HitSound[HitSound['None'] = 0] = 'None';
  HitSound[HitSound['Normal'] = 1] = 'Normal';
  HitSound[HitSound['Whistle'] = 2] = 'Whistle';
  HitSound[HitSound['Finish'] = 4] = 'Finish';
  HitSound[HitSound['Clap'] = 8] = 'Clap';
})(HitSound || (HitSound = {}));

let HitType;

(function(HitType) {
  HitType[HitType['Normal'] = 1] = 'Normal';
  HitType[HitType['Slider'] = 2] = 'Slider';
  HitType[HitType['NewCombo'] = 4] = 'NewCombo';
  HitType[HitType['Spinner'] = 8] = 'Spinner';
  HitType[HitType['ComboSkip1'] = 16] = 'ComboSkip1';
  HitType[HitType['ComboSkip2'] = 32] = 'ComboSkip2';
  HitType[HitType['ComboSkip3'] = 64] = 'ComboSkip3';
  HitType[HitType['ComboOffset'] = 112] = 'ComboOffset';
  HitType[HitType['Hold'] = 128] = 'Hold';
})(HitType || (HitType = {}));

let PathType;

(function(PathType) {
  PathType['Catmull'] = 'C';
  PathType['Bezier'] = 'B';
  PathType['Linear'] = 'L';
  PathType['PerfectCurve'] = 'P';
})(PathType || (PathType = {}));

let SliderEventType;

(function(SliderEventType) {
  SliderEventType[SliderEventType['Tick'] = 1] = 'Tick';
  SliderEventType[SliderEventType['LegacyLastTick'] = 2] = 'LegacyLastTick';
  SliderEventType[SliderEventType['Head'] = 4] = 'Head';
  SliderEventType[SliderEventType['Tail'] = 8] = 'Tail';
  SliderEventType[SliderEventType['Repeat'] = 16] = 'Repeat';
})(SliderEventType || (SliderEventType = {}));

class DifficultyRange {
  result;
  min;
  average;
  max;
  constructor(result, min, average, max) {
    this.result = result;
    this.min = min;
    this.average = average;
    this.max = max;
  }
  static map(difficulty, min, mid, max) {
    if (difficulty > 5) {
      return mid + (max - mid) * (difficulty - 5) / 5;
    }

    if (difficulty < 5) {
      return mid - (mid - min) * (5 - difficulty) / 5;
    }

    return mid;
  }
}

let HitResult;

(function(HitResult) {
  HitResult[HitResult['None'] = 0] = 'None';
  HitResult[HitResult['Miss'] = 1] = 'Miss';
  HitResult[HitResult['Meh'] = 2] = 'Meh';
  HitResult[HitResult['Ok'] = 3] = 'Ok';
  HitResult[HitResult['Good'] = 4] = 'Good';
  HitResult[HitResult['Great'] = 5] = 'Great';
  HitResult[HitResult['Perfect'] = 6] = 'Perfect';
  HitResult[HitResult['SmallTickMiss'] = 7] = 'SmallTickMiss';
  HitResult[HitResult['SmallTickHit'] = 8] = 'SmallTickHit';
  HitResult[HitResult['LargeTickMiss'] = 9] = 'LargeTickMiss';
  HitResult[HitResult['LargeTickHit'] = 10] = 'LargeTickHit';
  HitResult[HitResult['SmallBonus'] = 11] = 'SmallBonus';
  HitResult[HitResult['LargeBonus'] = 12] = 'LargeBonus';
  HitResult[HitResult['IgnoreMiss'] = 13] = 'IgnoreMiss';
  HitResult[HitResult['IgnoreHit'] = 14] = 'IgnoreHit';
})(HitResult || (HitResult = {}));

class HitWindows {
  static _BASE_RANGES = [
    new DifficultyRange(HitResult.Perfect, 22.4, 19.4, 13.9),
    new DifficultyRange(HitResult.Great, 64, 49, 34),
    new DifficultyRange(HitResult.Good, 97, 82, 67),
    new DifficultyRange(HitResult.Ok, 127, 112, 97),
    new DifficultyRange(HitResult.Meh, 151, 136, 121),
    new DifficultyRange(HitResult.Miss, 188, 173, 158),
  ];
  _perfect = 0;
  _great = 0;
  _good = 0;
  _ok = 0;
  _meh = 0;
  _miss = 0;
  _lowestSuccessfulHitResult() {
    for (let result = HitResult.Meh; result <= HitResult.Perfect; ++result) {
      if (this.isHitResultAllowed(result)) {
        return result;
      }
    }

    return HitResult.None;
  }
  *getAllAvailableWindows() {
    for (let result = HitResult.Meh; result <= HitResult.Perfect; ++result) {
      if (this.isHitResultAllowed(result)) {
        yield [result, this.windowFor(result)];
      }
    }
  }
  isHitResultAllowed(result) {
    return true;
  }
  setDifficulty(difficulty) {
    for (const range of this._getRanges()) {
      const value = DifficultyRange.map(difficulty, range.min, range.average, range.max);

      switch (range.result) {
        case HitResult.Miss:
          this._miss = value;
          break;
        case HitResult.Meh:
          this._meh = value;
          break;
        case HitResult.Ok:
          this._ok = value;
          break;
        case HitResult.Good:
          this._good = value;
          break;
        case HitResult.Great:
          this._great = value;
          break;
        case HitResult.Perfect:
          this._perfect = value;
          break;
      }
    }
  }
  resultFor(timeOffset) {
    timeOffset = Math.abs(timeOffset);

    for (let result = HitResult.Perfect; result >= HitResult.Miss; --result) {
      if (this.isHitResultAllowed(result) && timeOffset <= this.windowFor(result)) {
        return result;
      }
    }

    return HitResult.None;
  }
  windowFor(result) {
    switch (result) {
      case HitResult.Perfect:
        return this._perfect;
      case HitResult.Great:
        return this._great;
      case HitResult.Good:
        return this._good;
      case HitResult.Ok:
        return this._ok;
      case HitResult.Meh:
        return this._meh;
      case HitResult.Miss:
        return this._miss;
      default:
        throw new Error('Unknown enum member');
    }
  }
  canBeHit(timeOffset) {
    return timeOffset <= this.windowFor(this._lowestSuccessfulHitResult());
  }
  _getRanges() {
    return HitWindows._BASE_RANGES;
  }
  static EmptyHitWindows = class EmptyHitWindows extends HitWindows {
    static _ranges = [
      new DifficultyRange(HitResult.Perfect, 0, 0, 0),
      new DifficultyRange(HitResult.Miss, 0, 0, 0),
    ];
    isHitResultAllowed(result) {
      switch (result) {
        case HitResult.Perfect:
        case HitResult.Miss:
          return true;
      }

      return false;
    }
    _getRanges() {
      return EmptyHitWindows._ranges;
    }
  };
  static empty = new HitWindows.EmptyHitWindows();
}

class HitObject {
  kiai = false;
  nestedHitObjects = [];
  startTime = 0;
  hitType = HitType.Normal;
  hitSound = HitSound.Normal;
  samples = [];
  startPosition = new Vector2(0, 0);
  hitWindows = new HitWindows();
  get startX() {
    return this.startPosition.floatX;
  }
  set startX(value) {
    this.startPosition.x = value;
  }
  get startY() {
    return this.startPosition.floatY;
  }
  set startY(value) {
    this.startPosition.y = value;
  }
  createNestedHitObjects() {
    this.nestedHitObjects = [];
  }
  applyDefaultsToSelf(controlPoints, difficulty) {
    this.kiai = controlPoints.effectPointAt(this.startTime + 1).kiai;
    this.hitWindows?.setDifficulty(difficulty.overallDifficulty);
  }
  applyDefaultsToNested(controlPoints, difficulty) {
    this.nestedHitObjects.forEach((n) => {
      n.applyDefaults(controlPoints, difficulty);
    });
  }
  applyDefaults(controlPoints, difficulty) {
    this.applyDefaultsToSelf(controlPoints, difficulty);
    this.nestedHitObjects = [];
    this.createNestedHitObjects();
    this.nestedHitObjects.sort((a, b) => a.startTime - b.startTime);
    this.applyDefaultsToNested(controlPoints, difficulty);
  }
  clone() {
    const HitObject = this.constructor;
    const cloned = new HitObject();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;

    return cloned;
  }
}

class PathApproximator {
  static BEZIER_TOLERANCE = Math.fround(0.25);
  static CIRCULAR_ARC_TOLERANCE = Math.fround(0.1);
  static CATMULL_DETAIL = 50;
  static approximateBezier(controlPoints) {
    return this.approximateBSpline(controlPoints);
  }
  static approximateBSpline(controlPoints, p = 0) {
    const output = [];
    const n = controlPoints.length - 1;

    if (n < 0) {
      return output;
    }

    const toFlatten = [];
    const freeBuffers = [];
    const points = controlPoints.slice();

    if (p > 0 && p < n) {
      for (let i = 0; i < n - p; ++i) {
        const subBezier = [points[i]];

        for (let j = 0; j < p - 1; ++j) {
          subBezier[j + 1] = points[i + 1];

          for (let k = 1; k < p - j; ++k) {
            const l = Math.min(k, n - p - i);

            points[i + k] = (points[i + k]
              .fscale(l)
              .fadd(points[i + k + 1]))
              .fdivide(l + 1);
          }
        }

        subBezier[p] = points[i + 1];
        toFlatten.push(subBezier);
      }

      toFlatten.push(points.slice(n - p));
      toFlatten.reverse();
    }
    else {
      p = n;
      toFlatten.push(points);
    }

    const subdivisionBuffer1 = [];
    const subdivisionBuffer2 = [];
    const leftChild = subdivisionBuffer2;

    while (toFlatten.length > 0) {
      const parent = toFlatten.pop() || [];

      if (this._bezierIsFlatEnough(parent)) {
        this._bezierApproximate(parent, output, subdivisionBuffer1, subdivisionBuffer2, p + 1);
        freeBuffers.push(parent);
        continue;
      }

      const rightChild = freeBuffers.pop() || [];

      this._bezierSubdivide(parent, leftChild, rightChild, subdivisionBuffer1, p + 1);

      for (let i = 0; i < p + 1; ++i) {
        parent[i] = leftChild[i];
      }

      toFlatten.push(rightChild);
      toFlatten.push(parent);
    }

    output.push(controlPoints[n]);

    return output;
  }
  static approximateCatmull(controlPoints) {
    const output = [];
    const controlPointsLength = controlPoints.length;

    for (let i = 0; i < controlPointsLength - 1; i++) {
      const v1 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
      const v2 = controlPoints[i];
      const v3 = i < controlPointsLength - 1
        ? controlPoints[i + 1]
        : v2.fadd(v2).fsubtract(v1);
      const v4 = i < controlPointsLength - 2
        ? controlPoints[i + 2]
        : v3.fadd(v3).fsubtract(v2);

      for (let c = 0; c < PathApproximator.CATMULL_DETAIL; c++) {
        output.push(PathApproximator._catmullFindPoint(v1, v2, v3, v4, Math.fround(Math.fround(c) / PathApproximator.CATMULL_DETAIL)));
        output.push(PathApproximator._catmullFindPoint(v1, v2, v3, v4, Math.fround(Math.fround(c + 1) / PathApproximator.CATMULL_DETAIL)));
      }
    }

    return output;
  }
  static approximateCircularArc(controlPoints) {
    const pr = this._circularArcProperties(controlPoints);

    if (!pr.isValid) {
      return this.approximateBezier(controlPoints);
    }

    let amountPoints = 2;

    if (2 * pr.radius > PathApproximator.CIRCULAR_ARC_TOLERANCE) {
      let angle = Math.fround(PathApproximator.CIRCULAR_ARC_TOLERANCE / pr.radius);

      angle = Math.fround(1 - angle);
      angle = Math.fround(2 * Math.fround(Math.acos(angle)));

      const points = Math.ceil(Math.fround(pr.thetaRange / angle));
      const validPoints = !isFinite(points) ? -(2 ** 31) : points;

      amountPoints = Math.max(2, validPoints);
    }

    const output = [];

    for (let i = 0; i < amountPoints; ++i) {
      const fract = i / (amountPoints - 1);
      const theta = pr.thetaStart + pr.direction * fract * pr.thetaRange;
      const vector2 = new Vector2(Math.fround(Math.cos(theta)), Math.fround(Math.sin(theta)));

      output.push(vector2.fscale(pr.radius).fadd(pr.centre));
    }

    return output;
  }
  static _circularArcProperties(controlPoints) {
    const a = controlPoints[0];
    const b = controlPoints[1];
    const c = controlPoints[2];
    const sideLength = Math.fround(Math.fround(b.floatY - a.floatY) * Math.fround(c.floatX - a.floatX) -
            Math.fround(b.floatX - a.floatX) * Math.fround(c.floatY - a.floatY));

    if (Math.abs(sideLength) < Math.fround(0.001)) {
      return new CircularArcProperties();
    }

    const d = Math.fround(2 * Math.fround((Math.fround(a.floatX * b.fsubtract(c).floatY) +
            Math.fround(b.floatX * c.fsubtract(a).floatY) +
            Math.fround(c.floatX * a.fsubtract(b).floatY))));
    const aSq = Math.fround(Math.fround(a.floatX * a.floatX) + Math.fround(a.floatY * a.floatY));
    const bSq = Math.fround(Math.fround(b.floatX * b.floatX) + Math.fround(b.floatY * b.floatY));
    const cSq = Math.fround(Math.fround(c.floatX * c.floatX) + Math.fround(c.floatY * c.floatY));
    const centre = new Vector2(Math.fround(Math.fround(Math.fround(aSq * b.fsubtract(c).floatY) +
            Math.fround(bSq * c.fsubtract(a).floatY)) + Math.fround(cSq * a.fsubtract(b).floatY)), Math.fround(Math.fround(Math.fround(aSq * c.fsubtract(b).floatX) +
            Math.fround(bSq * a.fsubtract(c).floatX)) + Math.fround(cSq * b.fsubtract(a).floatX))).fdivide(d);
    const dA = a.fsubtract(centre);
    const dC = c.fsubtract(centre);
    const radius = dA.flength();
    const thetaStart = Math.atan2(dA.floatY, dA.floatX);
    let thetaEnd = Math.atan2(dC.floatY, dC.floatX);

    while (thetaEnd < thetaStart) {
      thetaEnd += 2 * Math.PI;
    }

    let direction = 1;
    let thetaRange = thetaEnd - thetaStart;
    let orthoAtoC = c.fsubtract(a);

    orthoAtoC = new Vector2(orthoAtoC.floatY, -orthoAtoC.floatX);

    if (orthoAtoC.fdot(b.fsubtract(a)) < 0) {
      direction = -direction;
      thetaRange = 2 * Math.PI - thetaRange;
    }

    return new CircularArcProperties(thetaStart, thetaRange, direction, radius, centre);
  }
  static approximateLinear(controlPoints) {
    return controlPoints.slice();
  }
  static approximateLagrangePolynomial(controlPoints) {
    const NUM_STEPS = 51;
    const output = [];
    const weights = barycentricWeights(controlPoints);
    let minX = controlPoints[0].floatX;
    let maxX = controlPoints[0].floatX;

    for (let i = 1, len = controlPoints.length; i < len; i++) {
      minX = Math.min(minX, controlPoints[i].floatX);
      maxX = Math.max(maxX, controlPoints[i].floatX);
    }

    const dx = maxX - minX;

    for (let i = 0; i < NUM_STEPS; i++) {
      const x = minX + (dx / (NUM_STEPS - 1)) * i;
      const y = Math.fround(barycentricLagrange(controlPoints, weights, x));

      output.push(new Vector2(x, y));
    }

    return output;
  }
  static _bezierIsFlatEnough(controlPoints) {
    let vector2;

    for (let i = 1, len = controlPoints.length; i < len - 1; i++) {
      vector2 = controlPoints[i - 1]
        .fsubtract(controlPoints[i].fscale(2))
        .fadd(controlPoints[i + 1]);

      if (vector2.flength() ** 2 > PathApproximator.BEZIER_TOLERANCE ** 2 * 4) {
        return false;
      }
    }

    return true;
  }
  static _bezierSubdivide(controlPoints, l, r, subdivisionBuffer, count) {
    const midpoints = subdivisionBuffer;

    for (let i = 0; i < count; ++i) {
      midpoints[i] = controlPoints[i];
    }

    for (let i = 0; i < count; ++i) {
      l[i] = midpoints[0];
      r[count - i - 1] = midpoints[count - i - 1];

      for (let j = 0; j < count - i - 1; j++) {
        midpoints[j] = midpoints[j].fadd(midpoints[j + 1]).fdivide(2);
      }
    }
  }
  static _bezierApproximate(controlPoints, output, subdivisionBuffer1, subdivisionBuffer2, count) {
    const l = subdivisionBuffer2;
    const r = subdivisionBuffer1;

    PathApproximator._bezierSubdivide(controlPoints, l, r, subdivisionBuffer1, count);

    for (let i = 0; i < count - 1; ++i) {
      l[count + i] = r[i + 1];
    }

    output.push(controlPoints[0]);

    for (let i = 1; i < count - 1; ++i) {
      const index = 2 * i;
      const p = l[index - 1]
        .fadd(l[index].fscale(2))
        .fadd(l[index + 1])
        .fscale(Math.fround(0.25));

      output.push(p);
    }
  }
  static _catmullFindPoint(vec1, vec2, vec3, vec4, t) {
    const t2 = Math.fround(t * t);
    const t3 = Math.fround(t * t2);
    const coordinates = [];

    for (let i = 0; i <= 1; ++i) {
      const value1 = i === 0 ? vec1.floatX : vec1.floatY;
      const value2 = i === 0 ? vec2.floatX : vec2.floatY;
      const value3 = i === 0 ? vec3.floatX : vec3.floatY;
      const value4 = i === 0 ? vec4.floatX : vec4.floatY;
      const v1 = Math.fround(2 * value2);
      const v2 = Math.fround(value3 - value1);
      const v31 = Math.fround(2 * value1);
      const v32 = Math.fround(5 * value2);
      const v33 = Math.fround(4 * value3);
      const v41 = Math.fround(3 * value2);
      const v42 = Math.fround(3 * value3);
      const v5 = Math.fround(v2 * t);
      const v61 = Math.fround(v31 - v32);
      const v62 = Math.fround(v61 + v33);
      const v63 = Math.fround(v62 - value4);
      const v6 = Math.fround(v63);
      const v71 = Math.fround(v41 - value1);
      const v72 = Math.fround(v71 - v42);
      const v7 = Math.fround(v72 + value4);
      const v8 = Math.fround(v6 * t2);
      const v9 = Math.fround(v7 * t3);
      const v101 = Math.fround(v1 + v5);
      const v102 = Math.fround(v101 + v8);
      const v10 = Math.fround(v102 + v9);

      coordinates.push(Math.fround(Math.fround(0.5) * v10));
    }

    return new Vector2(coordinates[0], coordinates[1]);
  }
}

class CircularArcProperties {
  isValid;
  thetaStart;
  thetaRange;
  direction;
  radius;
  centre;
  constructor(thetaStart, thetaRange, direction, radius, centre) {
    this.isValid = !!(thetaStart || thetaRange || direction || radius || centre);
    this.thetaStart = thetaStart || 0;
    this.thetaRange = thetaRange || 0;
    this.direction = direction || 0;
    this.radius = radius ? Math.fround(radius) : 0;
    this.centre = centre || new Vector2(0, 0);
  }
  get thetaEnd() {
    return this.thetaStart + this.thetaRange * this.direction;
  }
}

class PathPoint {
  position;
  type;
  constructor(position, type) {
    this.position = position || new Vector2(0, 0);
    this.type = type || null;
  }
}

class SliderPath {
  _expectedDistance;
  _controlPoints;
  _curveType;
  _calculatedLength = 0;
  _calculatedPath = [];
  _cumulativeLength = [];
  _isCached = false;
  constructor(curveType, controlPoints, expectedDistance) {
    this._curveType = curveType || PathType.Linear;
    this._controlPoints = controlPoints || [];
    this._expectedDistance = expectedDistance || 0;
  }
  get curveType() {
    return this._curveType;
  }
  set curveType(value) {
    this._curveType = value;
    this.invalidate();
  }
  get controlPoints() {
    return this._controlPoints;
  }
  set controlPoints(value) {
    this._controlPoints = value;
    this.invalidate();
  }
  get expectedDistance() {
    return this._expectedDistance;
  }
  set expectedDistance(value) {
    this._expectedDistance = value;
    this.invalidate();
  }
  get distance() {
    this._ensureValid();

    if (this._cumulativeLength.length) {
      return this._cumulativeLength[this._cumulativeLength.length - 1];
    }

    return 0;
  }
  set distance(value) {
    this.expectedDistance = value;
  }
  get calculatedDistance() {
    this._ensureValid();

    return this._calculatedLength;
  }
  get path() {
    this._ensureValid();

    const path = [];

    for (let i = 0; i < this._calculatedPath.length; i++) {
      if (this._cumulativeLength[i] >= this.expectedDistance) {
        break;
      }
      else {
        path.push(this._calculatedPath[i]);
      }
    }

    path.push(this.positionAt(1));

    return path;
  }
  get calculatedPath() {
    this._ensureValid();

    return this._calculatedPath;
  }
  invalidate() {
    this._calculatedLength = 0;
    this._calculatedPath = [];
    this._cumulativeLength = [];
    this._isCached = false;
  }
  calculatePathToProgress(path, p0, p1) {
    this._ensureValid();

    const d0 = this._progressToDistance(p0);
    const d1 = this._progressToDistance(p1);
    let i = 0;

    while (i < this._calculatedPath.length && this._cumulativeLength[i] < d0) {
      ++i;
    }

    path = [this._interpolateVertices(i, d0)];

    while (i < this._calculatedPath.length && this._cumulativeLength[i++] <= d1) {
      path.push(this._calculatedPath[i]);
    }

    path.push(this._interpolateVertices(i, d1));
  }
  progressAt(progress, spans) {
    const p = (progress * spans) % 1;

    return Math.trunc(progress * spans) % 2 ? 1 - p : p;
  }
  positionAt(progress) {
    this._ensureValid();

    const d = this._progressToDistance(progress);

    return this._interpolateVertices(this._indexOfDistance(d), d);
  }
  curvePositionAt(progress, spans) {
    return this.positionAt(this.progressAt(progress, spans));
  }
  clone() {
    const controlPoints = this._controlPoints.map((p) => {
      return new PathPoint(p.position.clone(), p.type);
    });

    return new SliderPath(this._curveType, controlPoints, this._expectedDistance);
  }
  _ensureValid() {
    if (this._isCached) {
      return;
    }

    this._calculatePath();
    this._calculateLength();
    this._isCached = true;
  }
  _calculatePath() {
    this._calculatedPath = [];

    const pathPointsLength = this.controlPoints.length;

    if (pathPointsLength === 0) {
      return;
    }

    const vertices = [];

    for (let i = 0; i < pathPointsLength; i++) {
      vertices[i] = this.controlPoints[i].position;
    }

    let start = 0;

    for (let i = 0; i < pathPointsLength; ++i) {
      if (!this.controlPoints[i].type && i < pathPointsLength - 1) {
        continue;
      }

      const segmentVertices = vertices.slice(start, i + 1);
      const segmentType = this.controlPoints[start].type || PathType.Linear;

      for (const t of this._calculateSubPath(segmentVertices, segmentType)) {
        const last = this._calculatedPath[this._calculatedPath.length - 1];

        if (this._calculatedPath.length === 0 || !last.equals(t)) {
          this._calculatedPath.push(t);
        }
      }

      start = i;
    }
  }
  _calculateSubPath(subControlPoints, type) {
    switch (type) {
      case PathType.Linear:
        return PathApproximator.approximateLinear(subControlPoints);
      case PathType.PerfectCurve: {
        if (subControlPoints.length !== 3) {
          break;
        }

        const subpath = PathApproximator.approximateCircularArc(subControlPoints);

        if (subpath.length === 0) {
          break;
        }

        return subpath;
      }
      case PathType.Catmull:
        return PathApproximator.approximateCatmull(subControlPoints);
    }

    return PathApproximator.approximateBezier(subControlPoints);
  }
  _calculateLength() {
    this._calculatedLength = 0;
    this._cumulativeLength = [0];

    for (let i = 0, l = this._calculatedPath.length - 1; i < l; ++i) {
      const diff = this._calculatedPath[i + 1].fsubtract(this._calculatedPath[i]);

      this._calculatedLength += diff.flength();
      this._cumulativeLength.push(this._calculatedLength);
    }

    if (this.expectedDistance && this._calculatedLength !== this.expectedDistance) {
      const controlPoints = this.controlPoints;
      const lastPoint = controlPoints[controlPoints.length - 1];
      const preLastPoint = controlPoints[controlPoints.length - 2];
      const pointsAreEqual = controlPoints.length >= 2
                && lastPoint.position.equals(preLastPoint.position);

      if (pointsAreEqual && this.expectedDistance > this._calculatedLength) {
        this._cumulativeLength.push(this._calculatedLength);

        return;
      }

      this._cumulativeLength.pop();

      let pathEndIndex = this._calculatedPath.length - 1;

      if (this._calculatedLength > this.expectedDistance) {
        while (this._cumulativeLength.length > 0 &&
                    this._cumulativeLength[this._cumulativeLength.length - 1] >=
                        this.expectedDistance) {
          this._cumulativeLength.pop();
          this._calculatedPath.splice(pathEndIndex--, 1);
        }
      }

      if (pathEndIndex <= 0) {
        this._cumulativeLength.push(0);

        return;
      }

      const direction = this._calculatedPath[pathEndIndex]
        .fsubtract(this._calculatedPath[pathEndIndex - 1])
        .fnormalize();
      const distance = Math.fround(this.expectedDistance -
                this._cumulativeLength[this._cumulativeLength.length - 1]);

      this._calculatedPath[pathEndIndex] = this._calculatedPath[pathEndIndex - 1]
        .fadd(direction.fscale(distance));

      this._cumulativeLength.push(this.expectedDistance);
    }
  }
  _indexOfDistance(d) {
    let i = findNumber(this._cumulativeLength, d);

    if (i < 0) {
      i = ~i;
    }

    return i;
  }
  _progressToDistance(progress) {
    return clamp01(progress) * this.distance;
  }
  _interpolateVertices(i, d) {
    if (this._calculatedPath.length === 0) {
      return new Vector2(0, 0);
    }

    if (i <= 0) {
      return this._calculatedPath[0];
    }

    if (i >= this._calculatedPath.length) {
      return this._calculatedPath[this._calculatedPath.length - 1];
    }

    const p0 = this._calculatedPath[i - 1];
    const p1 = this._calculatedPath[i];
    const d0 = this._cumulativeLength[i - 1];
    const d1 = this._cumulativeLength[i];

    if (Math.abs(d0 - d1) < 0.001) {
      return p0;
    }

    const w = (d - d0) / (d1 - d0);

    return p0.fadd(p1.fsubtract(p0).fscale(w));
  }
}

class HitSample {
  sampleSet = SampleSet[SampleSet.None];
  hitSound = HitSound[HitSound.Normal];
  customIndex = 0;
  suffix = '';
  volume = 100;
  isLayered = false;
  filename = '';
  clone() {
    const cloned = new HitSample();

    cloned.sampleSet = this.sampleSet;
    cloned.hitSound = this.hitSound;
    cloned.customIndex = this.customIndex;
    cloned.suffix = this.suffix;
    cloned.volume = this.volume;
    cloned.isLayered = this.isLayered;
    cloned.filename = this.filename;

    return cloned;
  }
}

class SampleBank {
  filename = '';
  volume = 100;
  normalSet = SampleSet.Normal;
  additionSet = SampleSet.Normal;
  customIndex = 0;
  clone() {
    const cloned = new SampleBank();

    cloned.filename = this.filename;
    cloned.volume = this.volume;
    cloned.normalSet = this.normalSet;
    cloned.additionSet = this.additionSet;
    cloned.customIndex = this.customIndex;

    return cloned;
  }
}

class Beatmap {
  base;
  general = new BeatmapGeneralSection();
  editor = new BeatmapEditorSection();
  difficulty = new BeatmapDifficultySection();
  metadata = new BeatmapMetadataSection();
  colors = new BeatmapColorSection();
  events = new BeatmapEventSection();
  controlPoints = new ControlPointInfo();
  hitObjects = [];
  fileFormat = 14;
  fileUpdateDate = new Date();
  originalMode = 0;
  get mode() {
    return this.originalMode;
  }
  get length() {
    if (!this.hitObjects.length) {
      return 0;
    }

    const first = this.hitObjects[0];
    const last = this.hitObjects[this.hitObjects.length - 1];
    const durationLast = last;
    const startTime = first.startTime;
    const endTime = durationLast.endTime || last.startTime;

    return (endTime - startTime) / this.difficulty.clockRate;
  }
  get totalLength() {
    if (!this.hitObjects.length) {
      return 0;
    }

    const last = this.hitObjects[this.hitObjects.length - 1];
    const durationObject = last;
    const endTime = durationObject.endTime || last.startTime;

    return endTime / this.difficulty.clockRate;
  }
  _getLongestBeatLength(unlimited) {
    const longestBeat = this.controlPoints.timingPoints.reduce((b, t) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;

      return beatLength >= 0 ? Math.max(beatLength, b) : b;
    }, -Infinity);

    return isFinite(longestBeat) ? longestBeat : TimingPoint.DEFAULT_BEAT_LENGTH;
  }
  get bpmMin() {
    return 60000 / this._getLongestBeatLength(false) * this.difficulty.clockRate;
  }
  get bpmMinUnlimited() {
    return 60000 / this._getLongestBeatLength(true) * this.difficulty.clockRate;
  }
  _getShortestBeatLength(unlimited) {
    const shortestBeat = this.controlPoints.timingPoints.reduce((b, t) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;

      return beatLength >= 0 ? Math.min(beatLength, b) : b;
    }, Infinity);

    return isFinite(shortestBeat) ? shortestBeat : TimingPoint.DEFAULT_BEAT_LENGTH;
  }
  get bpmMax() {
    return 60000 / this._getShortestBeatLength(false) * this.difficulty.clockRate;
  }
  get bpmMaxUnlimited() {
    return 60000 / this._getShortestBeatLength(true) * this.difficulty.clockRate;
  }
  _getMostCommonBeatLength(unlimited) {
    if (!this.controlPoints.timingPoints.length) {
      return TimingPoint.DEFAULT_BEAT_LENGTH;
    }

    const timingPoints = this.controlPoints.timingPoints;
    const durationObject = this.hitObjects.at(-1);
    const lastTime = durationObject?.endTime
            ?? durationObject?.startTime
            ?? timingPoints.at(-1)?.startTime
            ?? 0;
    const groups = new Map();

    timingPoints.forEach((t, i) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;
      const nextBeat = RoundHelper.round(beatLength * 1000) / 1000;

      if (!groups.has(nextBeat)) {
        groups.set(nextBeat, 0);
      }

      if (t.startTime > lastTime) {
        return;
      }

      const currentTime = i === 0 ? 0 : t.startTime;
      const nextTime = i === timingPoints.length - 1
        ? lastTime : timingPoints[i + 1].startTime;
      const duration = groups.get(nextBeat) ?? 0;

      groups.set(nextBeat, duration + (nextTime - currentTime));
    });

    if (groups.size === 0) {
      return this.bpmMax;
    }

    return [...groups.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  get bpm() {
    return 60000 / this._getMostCommonBeatLength(false) * this.difficulty.clockRate;
  }
  get bpmUnlimited() {
    return 60000 / this._getMostCommonBeatLength(true) * this.difficulty.clockRate;
  }
  get totalBreakTime() {
    return (this.events.breaks || []).reduce((d, e) => d + e.duration, 0);
  }
  get hittable() {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }
  get slidable() {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Slider ? 1 : 0);
    }, 0);
  }
  get spinnable() {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Spinner ? 1 : 0);
    }, 0);
  }
  get holdable() {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Hold ? 1 : 0);
    }, 0);
  }
  clone() {
    const Beatmap = this.constructor;
    const cloned = new Beatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colors = this.colors.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone());
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}

let EffectType;

(function(EffectType) {
  EffectType[EffectType['None'] = 0] = 'None';
  EffectType[EffectType['Kiai'] = 1] = 'Kiai';
  EffectType[EffectType['OmitFirstBarLine'] = 8] = 'OmitFirstBarLine';
})(EffectType || (EffectType = {}));

class BeatmapBreakEvent {
  startTime;
  endTime;
  constructor(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }
  get duration() {
    return this.endTime - this.startTime;
  }
  get hasEffect() {
    return this.duration >= 650;
  }
  contains(time) {
    return this.startTime <= time && time <= this.endTime;
  }
}

let ModBitwise;

(function(ModBitwise) {
  ModBitwise[ModBitwise['None'] = 0] = 'None';
  ModBitwise[ModBitwise['NoFail'] = 1] = 'NoFail';
  ModBitwise[ModBitwise['Easy'] = 2] = 'Easy';
  ModBitwise[ModBitwise['TouchDevice'] = 4] = 'TouchDevice';
  ModBitwise[ModBitwise['Hidden'] = 8] = 'Hidden';
  ModBitwise[ModBitwise['HardRock'] = 16] = 'HardRock';
  ModBitwise[ModBitwise['SuddenDeath'] = 32] = 'SuddenDeath';
  ModBitwise[ModBitwise['DoubleTime'] = 64] = 'DoubleTime';
  ModBitwise[ModBitwise['Relax'] = 128] = 'Relax';
  ModBitwise[ModBitwise['HalfTime'] = 256] = 'HalfTime';
  ModBitwise[ModBitwise['Nightcore'] = 512] = 'Nightcore';
  ModBitwise[ModBitwise['Flashlight'] = 1024] = 'Flashlight';
  ModBitwise[ModBitwise['Autoplay'] = 2048] = 'Autoplay';
  ModBitwise[ModBitwise['SpunOut'] = 4096] = 'SpunOut';
  ModBitwise[ModBitwise['Relax2'] = 8192] = 'Relax2';
  ModBitwise[ModBitwise['Perfect'] = 16384] = 'Perfect';
  ModBitwise[ModBitwise['Key4'] = 32768] = 'Key4';
  ModBitwise[ModBitwise['Key5'] = 65536] = 'Key5';
  ModBitwise[ModBitwise['Key6'] = 131072] = 'Key6';
  ModBitwise[ModBitwise['Key7'] = 262144] = 'Key7';
  ModBitwise[ModBitwise['Key8'] = 524288] = 'Key8';
  ModBitwise[ModBitwise['FadeIn'] = 1048576] = 'FadeIn';
  ModBitwise[ModBitwise['Random'] = 2097152] = 'Random';
  ModBitwise[ModBitwise['Cinema'] = 4194304] = 'Cinema';
  ModBitwise[ModBitwise['Target'] = 8388608] = 'Target';
  ModBitwise[ModBitwise['Key9'] = 16777216] = 'Key9';
  ModBitwise[ModBitwise['KeyCoop'] = 33554432] = 'KeyCoop';
  ModBitwise[ModBitwise['Key1'] = 67108864] = 'Key1';
  ModBitwise[ModBitwise['Key3'] = 134217728] = 'Key3';
  ModBitwise[ModBitwise['Key2'] = 268435456] = 'Key2';
  ModBitwise[ModBitwise['ScoreV2'] = 536870912] = 'ScoreV2';
  ModBitwise[ModBitwise['Mirror'] = 1073741824] = 'Mirror';
  ModBitwise[ModBitwise['KeyMod'] = 487555072] = 'KeyMod';
  ModBitwise[ModBitwise['DifficultyDecrease'] = 258] = 'DifficultyDecrease';
  ModBitwise[ModBitwise['DifficultyIncrease'] = 1616] = 'DifficultyIncrease';
})(ModBitwise || (ModBitwise = {}));

let ModType;

(function(ModType) {
  ModType[ModType['DifficultyReduction'] = 0] = 'DifficultyReduction';
  ModType[ModType['DifficultyIncrease'] = 1] = 'DifficultyIncrease';
  ModType[ModType['Conversion'] = 2] = 'Conversion';
  ModType[ModType['Automation'] = 3] = 'Automation';
  ModType[ModType['Fun'] = 4] = 'Fun';
  ModType[ModType['System'] = 5] = 'System';
})(ModType || (ModType = {}));

let ReplayButtonState;

(function(ReplayButtonState) {
  ReplayButtonState[ReplayButtonState['None'] = 0] = 'None';
  ReplayButtonState[ReplayButtonState['Left1'] = 1] = 'Left1';
  ReplayButtonState[ReplayButtonState['Right1'] = 2] = 'Right1';
  ReplayButtonState[ReplayButtonState['Left2'] = 4] = 'Left2';
  ReplayButtonState[ReplayButtonState['Right2'] = 8] = 'Right2';
  ReplayButtonState[ReplayButtonState['Smoke'] = 16] = 'Smoke';
})(ReplayButtonState || (ReplayButtonState = {}));

let ScoreRank;

(function(ScoreRank) {
  ScoreRank[ScoreRank['F'] = -1] = 'F';
  ScoreRank[ScoreRank['D'] = 0] = 'D';
  ScoreRank[ScoreRank['C'] = 1] = 'C';
  ScoreRank[ScoreRank['B'] = 2] = 'B';
  ScoreRank[ScoreRank['A'] = 3] = 'A';
  ScoreRank[ScoreRank['S'] = 4] = 'S';
  ScoreRank[ScoreRank['SH'] = 5] = 'SH';
  ScoreRank[ScoreRank['X'] = 6] = 'X';
  ScoreRank[ScoreRank['XH'] = 7] = 'XH';
})(ScoreRank || (ScoreRank = {}));

let CountryCode;

(function(CountryCode) {
  CountryCode[CountryCode['Unknown'] = 0] = 'Unknown';
  CountryCode[CountryCode['BD'] = 1] = 'BD';
  CountryCode[CountryCode['BE'] = 2] = 'BE';
  CountryCode[CountryCode['BF'] = 3] = 'BF';
  CountryCode[CountryCode['BG'] = 4] = 'BG';
  CountryCode[CountryCode['BA'] = 5] = 'BA';
  CountryCode[CountryCode['BB'] = 6] = 'BB';
  CountryCode[CountryCode['WF'] = 7] = 'WF';
  CountryCode[CountryCode['BL'] = 8] = 'BL';
  CountryCode[CountryCode['BM'] = 9] = 'BM';
  CountryCode[CountryCode['BN'] = 10] = 'BN';
  CountryCode[CountryCode['BO'] = 11] = 'BO';
  CountryCode[CountryCode['BH'] = 12] = 'BH';
  CountryCode[CountryCode['BI'] = 13] = 'BI';
  CountryCode[CountryCode['BJ'] = 14] = 'BJ';
  CountryCode[CountryCode['BT'] = 15] = 'BT';
  CountryCode[CountryCode['JM'] = 16] = 'JM';
  CountryCode[CountryCode['BV'] = 17] = 'BV';
  CountryCode[CountryCode['BW'] = 18] = 'BW';
  CountryCode[CountryCode['WS'] = 19] = 'WS';
  CountryCode[CountryCode['BQ'] = 20] = 'BQ';
  CountryCode[CountryCode['BR'] = 21] = 'BR';
  CountryCode[CountryCode['BS'] = 22] = 'BS';
  CountryCode[CountryCode['JE'] = 23] = 'JE';
  CountryCode[CountryCode['BY'] = 24] = 'BY';
  CountryCode[CountryCode['BZ'] = 25] = 'BZ';
  CountryCode[CountryCode['RU'] = 26] = 'RU';
  CountryCode[CountryCode['RW'] = 27] = 'RW';
  CountryCode[CountryCode['RS'] = 28] = 'RS';
  CountryCode[CountryCode['TL'] = 29] = 'TL';
  CountryCode[CountryCode['RE'] = 30] = 'RE';
  CountryCode[CountryCode['TM'] = 31] = 'TM';
  CountryCode[CountryCode['TJ'] = 32] = 'TJ';
  CountryCode[CountryCode['RO'] = 33] = 'RO';
  CountryCode[CountryCode['TK'] = 34] = 'TK';
  CountryCode[CountryCode['GW'] = 35] = 'GW';
  CountryCode[CountryCode['GU'] = 36] = 'GU';
  CountryCode[CountryCode['GT'] = 37] = 'GT';
  CountryCode[CountryCode['GS'] = 38] = 'GS';
  CountryCode[CountryCode['GR'] = 39] = 'GR';
  CountryCode[CountryCode['GQ'] = 40] = 'GQ';
  CountryCode[CountryCode['GP'] = 41] = 'GP';
  CountryCode[CountryCode['JP'] = 42] = 'JP';
  CountryCode[CountryCode['GY'] = 43] = 'GY';
  CountryCode[CountryCode['GG'] = 44] = 'GG';
  CountryCode[CountryCode['GF'] = 45] = 'GF';
  CountryCode[CountryCode['GE'] = 46] = 'GE';
  CountryCode[CountryCode['GD'] = 47] = 'GD';
  CountryCode[CountryCode['GB'] = 48] = 'GB';
  CountryCode[CountryCode['GA'] = 49] = 'GA';
  CountryCode[CountryCode['SV'] = 50] = 'SV';
  CountryCode[CountryCode['GN'] = 51] = 'GN';
  CountryCode[CountryCode['GM'] = 52] = 'GM';
  CountryCode[CountryCode['GL'] = 53] = 'GL';
  CountryCode[CountryCode['GI'] = 54] = 'GI';
  CountryCode[CountryCode['GH'] = 55] = 'GH';
  CountryCode[CountryCode['OM'] = 56] = 'OM';
  CountryCode[CountryCode['TN'] = 57] = 'TN';
  CountryCode[CountryCode['JO'] = 58] = 'JO';
  CountryCode[CountryCode['HR'] = 59] = 'HR';
  CountryCode[CountryCode['HT'] = 60] = 'HT';
  CountryCode[CountryCode['HU'] = 61] = 'HU';
  CountryCode[CountryCode['HK'] = 62] = 'HK';
  CountryCode[CountryCode['HN'] = 63] = 'HN';
  CountryCode[CountryCode['HM'] = 64] = 'HM';
  CountryCode[CountryCode['VE'] = 65] = 'VE';
  CountryCode[CountryCode['PR'] = 66] = 'PR';
  CountryCode[CountryCode['PS'] = 67] = 'PS';
  CountryCode[CountryCode['PW'] = 68] = 'PW';
  CountryCode[CountryCode['PT'] = 69] = 'PT';
  CountryCode[CountryCode['SJ'] = 70] = 'SJ';
  CountryCode[CountryCode['PY'] = 71] = 'PY';
  CountryCode[CountryCode['IQ'] = 72] = 'IQ';
  CountryCode[CountryCode['PA'] = 73] = 'PA';
  CountryCode[CountryCode['PF'] = 74] = 'PF';
  CountryCode[CountryCode['PG'] = 75] = 'PG';
  CountryCode[CountryCode['PE'] = 76] = 'PE';
  CountryCode[CountryCode['PK'] = 77] = 'PK';
  CountryCode[CountryCode['PH'] = 78] = 'PH';
  CountryCode[CountryCode['PN'] = 79] = 'PN';
  CountryCode[CountryCode['PL'] = 80] = 'PL';
  CountryCode[CountryCode['PM'] = 81] = 'PM';
  CountryCode[CountryCode['ZM'] = 82] = 'ZM';
  CountryCode[CountryCode['EH'] = 83] = 'EH';
  CountryCode[CountryCode['EE'] = 84] = 'EE';
  CountryCode[CountryCode['EG'] = 85] = 'EG';
  CountryCode[CountryCode['ZA'] = 86] = 'ZA';
  CountryCode[CountryCode['EC'] = 87] = 'EC';
  CountryCode[CountryCode['IT'] = 88] = 'IT';
  CountryCode[CountryCode['VN'] = 89] = 'VN';
  CountryCode[CountryCode['SB'] = 90] = 'SB';
  CountryCode[CountryCode['ET'] = 91] = 'ET';
  CountryCode[CountryCode['SO'] = 92] = 'SO';
  CountryCode[CountryCode['ZW'] = 93] = 'ZW';
  CountryCode[CountryCode['SA'] = 94] = 'SA';
  CountryCode[CountryCode['ES'] = 95] = 'ES';
  CountryCode[CountryCode['ER'] = 96] = 'ER';
  CountryCode[CountryCode['ME'] = 97] = 'ME';
  CountryCode[CountryCode['MD'] = 98] = 'MD';
  CountryCode[CountryCode['MG'] = 99] = 'MG';
  CountryCode[CountryCode['MF'] = 100] = 'MF';
  CountryCode[CountryCode['MA'] = 101] = 'MA';
  CountryCode[CountryCode['MC'] = 102] = 'MC';
  CountryCode[CountryCode['UZ'] = 103] = 'UZ';
  CountryCode[CountryCode['MM'] = 104] = 'MM';
  CountryCode[CountryCode['ML'] = 105] = 'ML';
  CountryCode[CountryCode['MO'] = 106] = 'MO';
  CountryCode[CountryCode['MN'] = 107] = 'MN';
  CountryCode[CountryCode['MH'] = 108] = 'MH';
  CountryCode[CountryCode['MK'] = 109] = 'MK';
  CountryCode[CountryCode['MU'] = 110] = 'MU';
  CountryCode[CountryCode['MT'] = 111] = 'MT';
  CountryCode[CountryCode['MW'] = 112] = 'MW';
  CountryCode[CountryCode['MV'] = 113] = 'MV';
  CountryCode[CountryCode['MQ'] = 114] = 'MQ';
  CountryCode[CountryCode['MP'] = 115] = 'MP';
  CountryCode[CountryCode['MS'] = 116] = 'MS';
  CountryCode[CountryCode['MR'] = 117] = 'MR';
  CountryCode[CountryCode['IM'] = 118] = 'IM';
  CountryCode[CountryCode['UG'] = 119] = 'UG';
  CountryCode[CountryCode['TZ'] = 120] = 'TZ';
  CountryCode[CountryCode['MY'] = 121] = 'MY';
  CountryCode[CountryCode['MX'] = 122] = 'MX';
  CountryCode[CountryCode['IL'] = 123] = 'IL';
  CountryCode[CountryCode['FR'] = 124] = 'FR';
  CountryCode[CountryCode['IO'] = 125] = 'IO';
  CountryCode[CountryCode['SH'] = 126] = 'SH';
  CountryCode[CountryCode['FI'] = 127] = 'FI';
  CountryCode[CountryCode['FJ'] = 128] = 'FJ';
  CountryCode[CountryCode['FK'] = 129] = 'FK';
  CountryCode[CountryCode['FM'] = 130] = 'FM';
  CountryCode[CountryCode['FO'] = 131] = 'FO';
  CountryCode[CountryCode['NI'] = 132] = 'NI';
  CountryCode[CountryCode['NL'] = 133] = 'NL';
  CountryCode[CountryCode['NO'] = 134] = 'NO';
  CountryCode[CountryCode['NA'] = 135] = 'NA';
  CountryCode[CountryCode['VU'] = 136] = 'VU';
  CountryCode[CountryCode['NC'] = 137] = 'NC';
  CountryCode[CountryCode['NE'] = 138] = 'NE';
  CountryCode[CountryCode['NF'] = 139] = 'NF';
  CountryCode[CountryCode['NG'] = 140] = 'NG';
  CountryCode[CountryCode['NZ'] = 141] = 'NZ';
  CountryCode[CountryCode['NP'] = 142] = 'NP';
  CountryCode[CountryCode['NR'] = 143] = 'NR';
  CountryCode[CountryCode['NU'] = 144] = 'NU';
  CountryCode[CountryCode['CK'] = 145] = 'CK';
  CountryCode[CountryCode['XK'] = 146] = 'XK';
  CountryCode[CountryCode['CI'] = 147] = 'CI';
  CountryCode[CountryCode['CH'] = 148] = 'CH';
  CountryCode[CountryCode['CO'] = 149] = 'CO';
  CountryCode[CountryCode['CN'] = 150] = 'CN';
  CountryCode[CountryCode['CM'] = 151] = 'CM';
  CountryCode[CountryCode['CL'] = 152] = 'CL';
  CountryCode[CountryCode['CC'] = 153] = 'CC';
  CountryCode[CountryCode['CA'] = 154] = 'CA';
  CountryCode[CountryCode['CG'] = 155] = 'CG';
  CountryCode[CountryCode['CF'] = 156] = 'CF';
  CountryCode[CountryCode['CD'] = 157] = 'CD';
  CountryCode[CountryCode['CZ'] = 158] = 'CZ';
  CountryCode[CountryCode['CY'] = 159] = 'CY';
  CountryCode[CountryCode['CX'] = 160] = 'CX';
  CountryCode[CountryCode['CR'] = 161] = 'CR';
  CountryCode[CountryCode['CW'] = 162] = 'CW';
  CountryCode[CountryCode['CV'] = 163] = 'CV';
  CountryCode[CountryCode['CU'] = 164] = 'CU';
  CountryCode[CountryCode['SZ'] = 165] = 'SZ';
  CountryCode[CountryCode['SY'] = 166] = 'SY';
  CountryCode[CountryCode['SX'] = 167] = 'SX';
  CountryCode[CountryCode['KG'] = 168] = 'KG';
  CountryCode[CountryCode['KE'] = 169] = 'KE';
  CountryCode[CountryCode['SS'] = 170] = 'SS';
  CountryCode[CountryCode['SR'] = 171] = 'SR';
  CountryCode[CountryCode['KI'] = 172] = 'KI';
  CountryCode[CountryCode['KH'] = 173] = 'KH';
  CountryCode[CountryCode['KN'] = 174] = 'KN';
  CountryCode[CountryCode['KM'] = 175] = 'KM';
  CountryCode[CountryCode['ST'] = 176] = 'ST';
  CountryCode[CountryCode['SK'] = 177] = 'SK';
  CountryCode[CountryCode['KR'] = 178] = 'KR';
  CountryCode[CountryCode['SI'] = 179] = 'SI';
  CountryCode[CountryCode['KP'] = 180] = 'KP';
  CountryCode[CountryCode['KW'] = 181] = 'KW';
  CountryCode[CountryCode['SN'] = 182] = 'SN';
  CountryCode[CountryCode['SM'] = 183] = 'SM';
  CountryCode[CountryCode['SL'] = 184] = 'SL';
  CountryCode[CountryCode['SC'] = 185] = 'SC';
  CountryCode[CountryCode['KZ'] = 186] = 'KZ';
  CountryCode[CountryCode['KY'] = 187] = 'KY';
  CountryCode[CountryCode['SG'] = 188] = 'SG';
  CountryCode[CountryCode['SE'] = 189] = 'SE';
  CountryCode[CountryCode['SD'] = 190] = 'SD';
  CountryCode[CountryCode['DO'] = 191] = 'DO';
  CountryCode[CountryCode['DM'] = 192] = 'DM';
  CountryCode[CountryCode['DJ'] = 193] = 'DJ';
  CountryCode[CountryCode['DK'] = 194] = 'DK';
  CountryCode[CountryCode['VG'] = 195] = 'VG';
  CountryCode[CountryCode['DE'] = 196] = 'DE';
  CountryCode[CountryCode['YE'] = 197] = 'YE';
  CountryCode[CountryCode['DZ'] = 198] = 'DZ';
  CountryCode[CountryCode['US'] = 199] = 'US';
  CountryCode[CountryCode['UY'] = 200] = 'UY';
  CountryCode[CountryCode['YT'] = 201] = 'YT';
  CountryCode[CountryCode['UM'] = 202] = 'UM';
  CountryCode[CountryCode['LB'] = 203] = 'LB';
  CountryCode[CountryCode['LC'] = 204] = 'LC';
  CountryCode[CountryCode['LA'] = 205] = 'LA';
  CountryCode[CountryCode['TV'] = 206] = 'TV';
  CountryCode[CountryCode['TW'] = 207] = 'TW';
  CountryCode[CountryCode['TT'] = 208] = 'TT';
  CountryCode[CountryCode['TR'] = 209] = 'TR';
  CountryCode[CountryCode['LK'] = 210] = 'LK';
  CountryCode[CountryCode['LI'] = 211] = 'LI';
  CountryCode[CountryCode['LV'] = 212] = 'LV';
  CountryCode[CountryCode['TO'] = 213] = 'TO';
  CountryCode[CountryCode['LT'] = 214] = 'LT';
  CountryCode[CountryCode['LU'] = 215] = 'LU';
  CountryCode[CountryCode['LR'] = 216] = 'LR';
  CountryCode[CountryCode['LS'] = 217] = 'LS';
  CountryCode[CountryCode['TH'] = 218] = 'TH';
  CountryCode[CountryCode['TF'] = 219] = 'TF';
  CountryCode[CountryCode['TG'] = 220] = 'TG';
  CountryCode[CountryCode['TD'] = 221] = 'TD';
  CountryCode[CountryCode['TC'] = 222] = 'TC';
  CountryCode[CountryCode['LY'] = 223] = 'LY';
  CountryCode[CountryCode['VA'] = 224] = 'VA';
  CountryCode[CountryCode['VC'] = 225] = 'VC';
  CountryCode[CountryCode['AE'] = 226] = 'AE';
  CountryCode[CountryCode['AD'] = 227] = 'AD';
  CountryCode[CountryCode['AG'] = 228] = 'AG';
  CountryCode[CountryCode['AF'] = 229] = 'AF';
  CountryCode[CountryCode['AI'] = 230] = 'AI';
  CountryCode[CountryCode['VI'] = 231] = 'VI';
  CountryCode[CountryCode['IS'] = 232] = 'IS';
  CountryCode[CountryCode['IR'] = 233] = 'IR';
  CountryCode[CountryCode['AM'] = 234] = 'AM';
  CountryCode[CountryCode['AL'] = 235] = 'AL';
  CountryCode[CountryCode['AO'] = 236] = 'AO';
  CountryCode[CountryCode['AQ'] = 237] = 'AQ';
  CountryCode[CountryCode['AS'] = 238] = 'AS';
  CountryCode[CountryCode['AR'] = 239] = 'AR';
  CountryCode[CountryCode['AU'] = 240] = 'AU';
  CountryCode[CountryCode['AT'] = 241] = 'AT';
  CountryCode[CountryCode['AW'] = 242] = 'AW';
  CountryCode[CountryCode['IN'] = 243] = 'IN';
  CountryCode[CountryCode['AX'] = 244] = 'AX';
  CountryCode[CountryCode['AZ'] = 245] = 'AZ';
  CountryCode[CountryCode['IE'] = 246] = 'IE';
  CountryCode[CountryCode['ID'] = 247] = 'ID';
  CountryCode[CountryCode['UA'] = 248] = 'UA';
  CountryCode[CountryCode['QA'] = 249] = 'QA';
  CountryCode[CountryCode['MZ'] = 250] = 'MZ';
})(CountryCode || (CountryCode = {}));

/// © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
/// See LICENSE for more details.

var LZMA = (function () {
    
    var /** cs */
        action_compress   = 1,
        /** ce */
        /** ds */
        action_decompress = 2,
        /** de */
        action_progress   = 3,
        wait = typeof setImmediate == "function" ? setImmediate : setTimeout,
        __4294967296 = 4294967296,
        N1_longLit = [4294967295, -__4294967296],
        /** cs */
        MIN_VALUE = [0, -9223372036854775808],
        /** ce */
        P0_longLit = [0, 0],
        P1_longLit = [1, 0];
    
    function update_progress(percent, cbn) {
        postMessage({
            action: action_progress,
            cbn: cbn,
            result: percent
        });
    }
    
    function initDim(len) {
        ///NOTE: This is MUCH faster than "new Array(len)" in newer versions of v8 (starting with Node.js 0.11.15, which uses v8 3.28.73).
        var a = [];
        a[len - 1] = undefined;
        return a;
    }
    
    function add(a, b) {
        return create(a[0] + b[0], a[1] + b[1]);
    }
    
    /** cs */
    function and(a, b) {
        return makeFromBits(~~Math.max(Math.min(a[1] / __4294967296, 2147483647), -2147483648) & ~~Math.max(Math.min(b[1] / __4294967296, 2147483647), -2147483648), lowBits_0(a) & lowBits_0(b));
    }
    /** ce */
    
    function compare(a, b) {
        var nega, negb;
        if (a[0] == b[0] && a[1] == b[1]) {
            return 0;
        }
        nega = a[1] < 0;
        negb = b[1] < 0;
        if (nega && !negb) {
            return -1;
        }
        if (!nega && negb) {
            return 1;
        }
        if (sub(a, b)[1] < 0) {
            return -1;
        }
        return 1;
    }
    
    function create(valueLow, valueHigh) {
        var diffHigh, diffLow;
        valueHigh %= 1.8446744073709552E19;
        valueLow %= 1.8446744073709552E19;
        diffHigh = valueHigh % __4294967296;
        diffLow = Math.floor(valueLow / __4294967296) * __4294967296;
        valueHigh = valueHigh - diffHigh + diffLow;
        valueLow = valueLow - diffLow + diffHigh;
        while (valueLow < 0) {
            valueLow += __4294967296;
            valueHigh -= __4294967296;
        }
        while (valueLow > 4294967295) {
            valueLow -= __4294967296;
            valueHigh += __4294967296;
        }
        valueHigh = valueHigh % 1.8446744073709552E19;
        while (valueHigh > 9223372032559808512) {
            valueHigh -= 1.8446744073709552E19;
        }
        while (valueHigh < -9223372036854775808) {
            valueHigh += 1.8446744073709552E19;
        }
        return [valueLow, valueHigh];
    }
    
    /** cs */
    function eq(a, b) {
        return a[0] == b[0] && a[1] == b[1];
    }
    /** ce */
    function fromInt(value) {
        if (value >= 0) {
            return [value, 0];
        } else {
            return [value + __4294967296, -__4294967296];
        }
    }
    
    function lowBits_0(a) {
        if (a[0] >= 2147483648) {
            return ~~Math.max(Math.min(a[0] - __4294967296, 2147483647), -2147483648);
        } else {
            return ~~Math.max(Math.min(a[0], 2147483647), -2147483648);
        }
    }
    /** cs */
    function makeFromBits(highBits, lowBits) {
        var high, low;
        high = highBits * __4294967296;
        low = lowBits;
        if (lowBits < 0) {
            low += __4294967296;
        }
        return [low, high];
    }
    
    function pwrAsDouble(n) {
        if (n <= 30) {
            return 1 << n;
        } else {
            return pwrAsDouble(30) * pwrAsDouble(n - 30);
        }
    }
    
    function shl(a, n) {
        var diff, newHigh, newLow, twoToN;
        n &= 63;
        if (eq(a, MIN_VALUE)) {
            if (!n) {
                return a;
            }
            return P0_longLit;
        }
        if (a[1] < 0) {
            throw new Error("Neg");
        }
        twoToN = pwrAsDouble(n);
        newHigh = a[1] * twoToN % 1.8446744073709552E19;
        newLow = a[0] * twoToN;
        diff = newLow - newLow % __4294967296;
        newHigh += diff;
        newLow -= diff;
        if (newHigh >= 9223372036854775807) {
            newHigh -= 1.8446744073709552E19;
        }
        return [newLow, newHigh];
    }
    
    function shr(a, n) {
        var shiftFact;
        n &= 63;
        shiftFact = pwrAsDouble(n);
        return create(Math.floor(a[0] / shiftFact), a[1] / shiftFact);
    }
    
    function shru(a, n) {
        var sr;
        n &= 63;
        sr = shr(a, n);
        if (a[1] < 0) {
            sr = add(sr, shl([2, 0], 63 - n));
        }
        return sr;
    }
    
    /** ce */
    
    function sub(a, b) {
        return create(a[0] - b[0], a[1] - b[1]);
    }
    
    function $ByteArrayInputStream(this$static, buf) {
        this$static.buf = buf;
        this$static.pos = 0;
        this$static.count = buf.length;
        return this$static;
    }
    
    /** ds */
    function $read(this$static) {
        if (this$static.pos >= this$static.count)
            return -1;
        return this$static.buf[this$static.pos++] & 255;
    }
    /** de */
    /** cs */
    function $read_0(this$static, buf, off, len) {
        if (this$static.pos >= this$static.count)
            return -1;
        len = Math.min(len, this$static.count - this$static.pos);
        arraycopy(this$static.buf, this$static.pos, buf, off, len);
        this$static.pos += len;
        return len;
    }
    /** ce */
    
    function $ByteArrayOutputStream(this$static) {
        this$static.buf = initDim(32);
        this$static.count = 0;
        return this$static;
    }
    
    function $toByteArray(this$static) {
        var data = this$static.buf;
        data.length = this$static.count;
        return data;
    }
    
    /** cs */
    function $write(this$static, b) {
        this$static.buf[this$static.count++] = b << 24 >> 24;
    }
    /** ce */
    
    function $write_0(this$static, buf, off, len) {
        arraycopy(buf, off, this$static.buf, this$static.count, len);
        this$static.count += len;
    }
    
    /** cs */
    function $getChars(this$static, srcBegin, srcEnd, dst, dstBegin) {
        var srcIdx;
        for (srcIdx = srcBegin; srcIdx < srcEnd; ++srcIdx) {
            dst[dstBegin++] = this$static.charCodeAt(srcIdx);
        }
    }
    /** ce */
    
    function arraycopy(src, srcOfs, dest, destOfs, len) {
        for (var i = 0; i < len; ++i) {
            dest[destOfs + i] = src[srcOfs + i];
        }
    }
    
    /** cs */
    function $configure(this$static, encoder) {
        $SetDictionarySize_0(encoder, 1 << this$static.s);
        encoder._numFastBytes = this$static.f;
        $SetMatchFinder(encoder, this$static.m);
        
        /// lc is always 3
        /// lp is always 0
        /// pb is always 2
        encoder._numLiteralPosStateBits = 0;
        encoder._numLiteralContextBits = 3;
        encoder._posStateBits = 2;
        ///this$static._posStateMask = (1 << pb) - 1;
        encoder._posStateMask = 3;
    }
    
    function $init(this$static, input, output, length_0, mode) {
        var encoder, i;
        if (compare(length_0, N1_longLit) < 0)
            throw new Error("invalid length " + length_0);
        this$static.length_0 = length_0;
        encoder = $Encoder({});
        $configure(mode, encoder);
        encoder._writeEndMark = typeof LZMA.disableEndMark == "undefined";
        $WriteCoderProperties(encoder, output);
        for (i = 0; i < 64; i += 8)
            $write(output, lowBits_0(shr(length_0, i)) & 255);
        this$static.chunker = (encoder._needReleaseMFStream = 0 , (encoder._inStream = input , encoder._finished = 0 , $Create_2(encoder) , encoder._rangeEncoder.Stream = output , $Init_4(encoder) , $FillDistancesPrices(encoder) , $FillAlignPrices(encoder) , encoder._lenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._lenEncoder, 1 << encoder._posStateBits) , encoder._repMatchLenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._repMatchLenEncoder, 1 << encoder._posStateBits) , encoder.nowPos64 = P0_longLit , undefined) , $Chunker_0({}, encoder));
    }
    
    function $LZMAByteArrayCompressor(this$static, data, mode) {
        this$static.output = $ByteArrayOutputStream({});
        $init(this$static, $ByteArrayInputStream({}, data), this$static.output, fromInt(data.length), mode);
        return this$static;
    }
    /** ce */
    
    /** ds */
    function $init_0(this$static, input, output) {
        var decoder,
            hex_length = "",
            i,
            properties = [],
            r,
            tmp_length;
        
        for (i = 0; i < 5; ++i) {
            r = $read(input);
            if (r == -1)
                throw new Error("truncated input");
            properties[i] = r << 24 >> 24;
        }
        
        decoder = $Decoder({});
        if (!$SetDecoderProperties(decoder, properties)) {
            throw new Error("corrupted input");
        }
        for (i = 0; i < 64; i += 8) {
            r = $read(input);
            if (r == -1)
                throw new Error("truncated input");
            r = r.toString(16);
            if (r.length == 1) r = "0" + r;
            hex_length = r + "" + hex_length;
        }
        
        /// Was the length set in the header (if it was compressed from a stream, the length is all f"s).
        if (/^0+$|^f+$/i.test(hex_length)) {
            /// The length is unknown, so set to -1.
            this$static.length_0 = N1_longLit;
        } else {
            ///NOTE: If there is a problem with the decoder because of the length, you can always set the length to -1 (N1_longLit) which means unknown.
            tmp_length = parseInt(hex_length, 16);
            /// If the length is too long to handle, just set it to unknown.
            if (tmp_length > 4294967295) {
                this$static.length_0 = N1_longLit;
            } else {
                this$static.length_0 = fromInt(tmp_length);
            }
        }
        
        this$static.chunker = $CodeInChunks(decoder, input, output, this$static.length_0);
    }
    
    function $LZMAByteArrayDecompressor(this$static, data) {
        this$static.output = $ByteArrayOutputStream({});
        $init_0(this$static, $ByteArrayInputStream({}, data), this$static.output);
        return this$static;
    }
    /** de */
    /** cs */
    function $Create_4(this$static, keepSizeBefore, keepSizeAfter, keepSizeReserv) {
        var blockSize;
        this$static._keepSizeBefore = keepSizeBefore;
        this$static._keepSizeAfter = keepSizeAfter;
        blockSize = keepSizeBefore + keepSizeAfter + keepSizeReserv;
        if (this$static._bufferBase == null || this$static._blockSize != blockSize) {
            this$static._bufferBase = null;
            this$static._blockSize = blockSize;
            this$static._bufferBase = initDim(this$static._blockSize);
        }
        this$static._pointerToLastSafePosition = this$static._blockSize - keepSizeAfter;
    }
    
    function $GetIndexByte(this$static, index) {
        return this$static._bufferBase[this$static._bufferOffset + this$static._pos + index];
    }
    
    function $GetMatchLen(this$static, index, distance, limit) {
        var i, pby;
        if (this$static._streamEndWasReached) {
            if (this$static._pos + index + limit > this$static._streamPos) {
                limit = this$static._streamPos - (this$static._pos + index);
            }
        }
        ++distance;
        pby = this$static._bufferOffset + this$static._pos + index;
        for (i = 0; i < limit && this$static._bufferBase[pby + i] == this$static._bufferBase[pby + i - distance]; ++i) {
        }
        return i;
    }
    
    function $GetNumAvailableBytes(this$static) {
        return this$static._streamPos - this$static._pos;
    }
    
    function $MoveBlock(this$static) {
        var i, numBytes, offset;
        offset = this$static._bufferOffset + this$static._pos - this$static._keepSizeBefore;
        if (offset > 0) {
            --offset;
        }
        numBytes = this$static._bufferOffset + this$static._streamPos - offset;
        for (i = 0; i < numBytes; ++i) {
            this$static._bufferBase[i] = this$static._bufferBase[offset + i];
        }
        this$static._bufferOffset -= offset;
    }
    
    function $MovePos_1(this$static) {
        var pointerToPostion;
        ++this$static._pos;
        if (this$static._pos > this$static._posLimit) {
            pointerToPostion = this$static._bufferOffset + this$static._pos;
            if (pointerToPostion > this$static._pointerToLastSafePosition) {
                $MoveBlock(this$static);
            }
            $ReadBlock(this$static);
        }
    }
    
    function $ReadBlock(this$static) {
        var numReadBytes, pointerToPostion, size;
        if (this$static._streamEndWasReached)
            return;
        while (1) {
            size = -this$static._bufferOffset + this$static._blockSize - this$static._streamPos;
            if (!size)
                return;
            numReadBytes = $read_0(this$static._stream, this$static._bufferBase, this$static._bufferOffset + this$static._streamPos, size);
            if (numReadBytes == -1) {
                this$static._posLimit = this$static._streamPos;
                pointerToPostion = this$static._bufferOffset + this$static._posLimit;
                if (pointerToPostion > this$static._pointerToLastSafePosition) {
                    this$static._posLimit = this$static._pointerToLastSafePosition - this$static._bufferOffset;
                }
                this$static._streamEndWasReached = 1;
                return;
            }
            this$static._streamPos += numReadBytes;
            if (this$static._streamPos >= this$static._pos + this$static._keepSizeAfter) {
                this$static._posLimit = this$static._streamPos - this$static._keepSizeAfter;
            }
        }
    }
    
    function $ReduceOffsets(this$static, subValue) {
        this$static._bufferOffset += subValue;
        this$static._posLimit -= subValue;
        this$static._pos -= subValue;
        this$static._streamPos -= subValue;
    }
    
    var CrcTable = (function () {
        var i, j, r, CrcTable = [];
        for (i = 0; i < 256; ++i) {
            r = i;
            for (j = 0; j < 8; ++j)
            if ((r & 1) != 0) {
                r = r >>> 1 ^ -306674912;
            } else {
                r >>>= 1;
            }
            CrcTable[i] = r;
        }
        return CrcTable;
    }());
    
    function $Create_3(this$static, historySize, keepAddBufferBefore, matchMaxLen, keepAddBufferAfter) {
        var cyclicBufferSize, hs, windowReservSize;
        if (historySize < 1073741567) {
            this$static._cutValue = 16 + (matchMaxLen >> 1);
            windowReservSize = ~~((historySize + keepAddBufferBefore + matchMaxLen + keepAddBufferAfter) / 2) + 256;
            $Create_4(this$static, historySize + keepAddBufferBefore, matchMaxLen + keepAddBufferAfter, windowReservSize);
            this$static._matchMaxLen = matchMaxLen;
            cyclicBufferSize = historySize + 1;
            if (this$static._cyclicBufferSize != cyclicBufferSize) {
                this$static._son = initDim((this$static._cyclicBufferSize = cyclicBufferSize) * 2);
            }
    
            hs = 65536;
            if (this$static.HASH_ARRAY) {
                hs = historySize - 1;
                hs |= hs >> 1;
                hs |= hs >> 2;
                hs |= hs >> 4;
                hs |= hs >> 8;
                hs >>= 1;
                hs |= 65535;
                if (hs > 16777216)
                hs >>= 1;
                this$static._hashMask = hs;
                ++hs;
                hs += this$static.kFixHashSize;
            }
            
            if (hs != this$static._hashSizeSum) {
                this$static._hash = initDim(this$static._hashSizeSum = hs);
            }
        }
    }
    
    function $GetMatches(this$static, distances) {
        var count, cur, curMatch, curMatch2, curMatch3, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, maxLen, offset, pby1, ptr0, ptr1, temp;
        if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
            lenLimit = this$static._matchMaxLen;
        } else {
            lenLimit = this$static._streamPos - this$static._pos;
            if (lenLimit < this$static.kMinMatchCheck) {
                $MovePos_0(this$static);
                return 0;
            }
        }
        offset = 0;
        matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
        cur = this$static._bufferOffset + this$static._pos;
        maxLen = 1;
        hash2Value = 0;
        hash3Value = 0;
        if (this$static.HASH_ARRAY) {
            temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
            hash2Value = temp & 1023;
            temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
            hash3Value = temp & 65535;
            hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
        } else {
            hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
        }

        curMatch = this$static._hash[this$static.kFixHashSize + hashValue] || 0;
        if (this$static.HASH_ARRAY) {
            curMatch2 = this$static._hash[hash2Value] || 0;
            curMatch3 = this$static._hash[1024 + hash3Value] || 0;
            this$static._hash[hash2Value] = this$static._pos;
            this$static._hash[1024 + hash3Value] = this$static._pos;
            if (curMatch2 > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch2] == this$static._bufferBase[cur]) {
                    distances[offset++] = maxLen = 2;
                    distances[offset++] = this$static._pos - curMatch2 - 1;
                }
            }
            if (curMatch3 > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch3] == this$static._bufferBase[cur]) {
                    if (curMatch3 == curMatch2) {
                        offset -= 2;
                    }
                    distances[offset++] = maxLen = 3;
                    distances[offset++] = this$static._pos - curMatch3 - 1;
                    curMatch2 = curMatch3;
                }
            }
            if (offset != 0 && curMatch2 == curMatch) {
                offset -= 2;
                maxLen = 1;
            }
        }
        this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
        ptr0 = (this$static._cyclicBufferPos << 1) + 1;
        ptr1 = this$static._cyclicBufferPos << 1;
        len0 = len1 = this$static.kNumHashDirectBytes;
        if (this$static.kNumHashDirectBytes != 0) {
            if (curMatch > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch + this$static.kNumHashDirectBytes] != this$static._bufferBase[cur + this$static.kNumHashDirectBytes]) {
                    distances[offset++] = maxLen = this$static.kNumHashDirectBytes;
                    distances[offset++] = this$static._pos - curMatch - 1;
                }
            }
        }
        count = this$static._cutValue;
        while (1) {
            if (curMatch <= matchMinPos || count-- == 0) {
                this$static._son[ptr0] = this$static._son[ptr1] = 0;
                break;
            }
            delta = this$static._pos - curMatch;
            cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
            pby1 = this$static._bufferOffset + curMatch;
            len = len0 < len1?len0:len1;
            if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
                while (++len != lenLimit) {
                    if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
                        break;
                    }
                }
                if (maxLen < len) {
                    distances[offset++] = maxLen = len;
                    distances[offset++] = delta - 1;
                    if (len == lenLimit) {
                    this$static._son[ptr1] = this$static._son[cyclicPos];
                    this$static._son[ptr0] = this$static._son[cyclicPos + 1];
                    break;
                    }
                }
            }
            if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
                this$static._son[ptr1] = curMatch;
                ptr1 = cyclicPos + 1;
                curMatch = this$static._son[ptr1];
                len1 = len;
            } else {
                this$static._son[ptr0] = curMatch;
                ptr0 = cyclicPos;
                curMatch = this$static._son[ptr0];
                len0 = len;
            }
        }
        $MovePos_0(this$static);
        return offset;
    }
    
    function $Init_5(this$static) {
        this$static._bufferOffset = 0;
        this$static._pos = 0;
        this$static._streamPos = 0;
        this$static._streamEndWasReached = 0;
        $ReadBlock(this$static);
        this$static._cyclicBufferPos = 0;
        $ReduceOffsets(this$static, -1);
    }
    
    function $MovePos_0(this$static) {
        var subValue;
        if (++this$static._cyclicBufferPos >= this$static._cyclicBufferSize) {
            this$static._cyclicBufferPos = 0;
        }
        $MovePos_1(this$static);
        if (this$static._pos == 1073741823) {
            subValue = this$static._pos - this$static._cyclicBufferSize;
            $NormalizeLinks(this$static._son, this$static._cyclicBufferSize * 2, subValue);
            $NormalizeLinks(this$static._hash, this$static._hashSizeSum, subValue);
            $ReduceOffsets(this$static, subValue);
        }
    }
    
    ///NOTE: This is only called after reading one whole gigabyte.
    function $NormalizeLinks(items, numItems, subValue) {
        var i, value;
        for (i = 0; i < numItems; ++i) {
            value = items[i] || 0;
            if (value <= subValue) {
                value = 0;
            } else {
                value -= subValue;
            }
            items[i] = value;
        }
    }
    
    function $SetType(this$static, numHashBytes) {
        this$static.HASH_ARRAY = numHashBytes > 2;
        if (this$static.HASH_ARRAY) {
            this$static.kNumHashDirectBytes = 0;
            this$static.kMinMatchCheck = 4;
            this$static.kFixHashSize = 66560;
        } else {
            this$static.kNumHashDirectBytes = 2;
            this$static.kMinMatchCheck = 3;
            this$static.kFixHashSize = 0;
        }
    }
    
    function $Skip(this$static, num) {
        var count, cur, curMatch, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, pby1, ptr0, ptr1, temp;
        do {
            if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
                lenLimit = this$static._matchMaxLen;
            } else {
                lenLimit = this$static._streamPos - this$static._pos;
                if (lenLimit < this$static.kMinMatchCheck) {
                    $MovePos_0(this$static);
                    continue;
                }
            }
            matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
            cur = this$static._bufferOffset + this$static._pos;
            if (this$static.HASH_ARRAY) {
                temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
                hash2Value = temp & 1023;
                this$static._hash[hash2Value] = this$static._pos;
                temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
                hash3Value = temp & 65535;
                this$static._hash[1024 + hash3Value] = this$static._pos;
                hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
            } else {
                hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
            }
            curMatch = this$static._hash[this$static.kFixHashSize + hashValue];
            this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
            ptr0 = (this$static._cyclicBufferPos << 1) + 1;
            ptr1 = this$static._cyclicBufferPos << 1;
            len0 = len1 = this$static.kNumHashDirectBytes;
            count = this$static._cutValue;
            while (1) {
                if (curMatch <= matchMinPos || count-- == 0) {
                    this$static._son[ptr0] = this$static._son[ptr1] = 0;
                    break;
                }
                delta = this$static._pos - curMatch;
                cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
                pby1 = this$static._bufferOffset + curMatch;
                len = len0 < len1?len0:len1;
                if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
                    while (++len != lenLimit) {
                        if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
                            break;
                        }
                    }
                    if (len == lenLimit) {
                        this$static._son[ptr1] = this$static._son[cyclicPos];
                        this$static._son[ptr0] = this$static._son[cyclicPos + 1];
                        break;
                    }
                }
                if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
                    this$static._son[ptr1] = curMatch;
                    ptr1 = cyclicPos + 1;
                    curMatch = this$static._son[ptr1];
                    len1 = len;
                } else {
                    this$static._son[ptr0] = curMatch;
                    ptr0 = cyclicPos;
                    curMatch = this$static._son[ptr0];
                    len0 = len;
                }
            }
            $MovePos_0(this$static);
        }
        while (--num != 0);
    }
    
    /** ce */
    /** ds */
    function $CopyBlock(this$static, distance, len) {
        var pos = this$static._pos - distance - 1;
        if (pos < 0) {
            pos += this$static._windowSize;
        }
        for (; len != 0; --len) {
            if (pos >= this$static._windowSize) {
                pos = 0;
            }
            this$static._buffer[this$static._pos++] = this$static._buffer[pos++];
            if (this$static._pos >= this$static._windowSize) {
                $Flush_0(this$static);
            }
        }
    }
    
    function $Create_5(this$static, windowSize) {
        if (this$static._buffer == null || this$static._windowSize != windowSize) {
            this$static._buffer = initDim(windowSize);
        }
        this$static._windowSize = windowSize;
        this$static._pos = 0;
        this$static._streamPos = 0;
    }
    
    function $Flush_0(this$static) {
        var size = this$static._pos - this$static._streamPos;
        if (!size) {
            return;
        }
        $write_0(this$static._stream, this$static._buffer, this$static._streamPos, size);
        if (this$static._pos >= this$static._windowSize) {
            this$static._pos = 0;
        }
        this$static._streamPos = this$static._pos;
    }
    
    function $GetByte(this$static, distance) {
        var pos = this$static._pos - distance - 1;
        if (pos < 0) {
            pos += this$static._windowSize;
        }
        return this$static._buffer[pos];
    }
    
    function $PutByte(this$static, b) {
        this$static._buffer[this$static._pos++] = b;
        if (this$static._pos >= this$static._windowSize) {
            $Flush_0(this$static);
        }
    }
    
    function $ReleaseStream(this$static) {
        $Flush_0(this$static);
        this$static._stream = null;
    }
    /** de */
    
    function GetLenToPosState(len) {
        len -= 2;
        if (len < 4) {
            return len;
        }
        return 3;
    }
    
    function StateUpdateChar(index) {
        if (index < 4) {
            return 0;
        }
        if (index < 10) {
            return index - 3;
        }
        return index - 6;
    }
    
    /** cs */
    function $Chunker_0(this$static, encoder) {
        this$static.encoder = encoder;
        this$static.decoder = null;
        this$static.alive = 1;
        return this$static;
    }
    /** ce */
    /** ds */
    function $Chunker(this$static, decoder) {
        this$static.decoder = decoder;
        this$static.encoder = null;
        this$static.alive = 1;
        return this$static;
    }
    /** de */
    
    function $processChunk(this$static) {
        if (!this$static.alive) {
            throw new Error("bad state");
        }
        
        if (this$static.encoder) {
            /// do:throw new Error("No encoding");
            /** cs */
            $processEncoderChunk(this$static);
            /** ce */
        } else {
            /// co:throw new Error("No decoding");
            /** ds */
            $processDecoderChunk(this$static);
            /** de */
        }
        return this$static.alive;
    }
    
    /** ds */
    function $processDecoderChunk(this$static) {
        var result = $CodeOneChunk(this$static.decoder);
        if (result == -1) {
            throw new Error("corrupted input");
        }
        this$static.inBytesProcessed = N1_longLit;
        this$static.outBytesProcessed = this$static.decoder.nowPos64;
        if (result || compare(this$static.decoder.outSize, P0_longLit) >= 0 && compare(this$static.decoder.nowPos64, this$static.decoder.outSize) >= 0) {
            $Flush_0(this$static.decoder.m_OutWindow);
            $ReleaseStream(this$static.decoder.m_OutWindow);
            this$static.decoder.m_RangeDecoder.Stream = null;
            this$static.alive = 0;
        }
    }
    /** de */
    /** cs */
    function $processEncoderChunk(this$static) {
        $CodeOneBlock(this$static.encoder, this$static.encoder.processedInSize, this$static.encoder.processedOutSize, this$static.encoder.finished);
        this$static.inBytesProcessed = this$static.encoder.processedInSize[0];
        if (this$static.encoder.finished[0]) {
            $ReleaseStreams(this$static.encoder);
            this$static.alive = 0;
        }
    }
    /** ce */
    
    /** ds */
    function $CodeInChunks(this$static, inStream, outStream, outSize) {
        this$static.m_RangeDecoder.Stream = inStream;
        $ReleaseStream(this$static.m_OutWindow);
        this$static.m_OutWindow._stream = outStream;
        $Init_1(this$static);
        this$static.state = 0;
        this$static.rep0 = 0;
        this$static.rep1 = 0;
        this$static.rep2 = 0;
        this$static.rep3 = 0;
        this$static.outSize = outSize;
        this$static.nowPos64 = P0_longLit;
        this$static.prevByte = 0;
        return $Chunker({}, this$static);
    }
    
    function $CodeOneChunk(this$static) {
        var decoder2, distance, len, numDirectBits, posSlot, posState;
        posState = lowBits_0(this$static.nowPos64) & this$static.m_PosStateMask;
        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsMatchDecoders, (this$static.state << 4) + posState)) {
            decoder2 = $GetDecoder(this$static.m_LiteralDecoder, lowBits_0(this$static.nowPos64), this$static.prevByte);
            if (this$static.state < 7) {
                this$static.prevByte = $DecodeNormal(decoder2, this$static.m_RangeDecoder);
            } else {
                this$static.prevByte = $DecodeWithMatchByte(decoder2, this$static.m_RangeDecoder, $GetByte(this$static.m_OutWindow, this$static.rep0));
            }
            $PutByte(this$static.m_OutWindow, this$static.prevByte);
            this$static.state = StateUpdateChar(this$static.state);
            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
        } else {
            if ($DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepDecoders, this$static.state)) {
                len = 0;
                if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG0Decoders, this$static.state)) {
                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRep0LongDecoders, (this$static.state << 4) + posState)) {
                        this$static.state = this$static.state < 7?9:11;
                        len = 1;
                    }
                } else {
                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG1Decoders, this$static.state)) {
                        distance = this$static.rep1;
                    } else {
                        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG2Decoders, this$static.state)) {
                            distance = this$static.rep2;
                        } else {
                            distance = this$static.rep3;
                            this$static.rep3 = this$static.rep2;
                        }
                        this$static.rep2 = this$static.rep1;
                    }
                    this$static.rep1 = this$static.rep0;
                    this$static.rep0 = distance;
                }
                if (!len) {
                    len = $Decode(this$static.m_RepLenDecoder, this$static.m_RangeDecoder, posState) + 2;
                    this$static.state = this$static.state < 7?8:11;
                }
            } else {
                this$static.rep3 = this$static.rep2;
                this$static.rep2 = this$static.rep1;
                this$static.rep1 = this$static.rep0;
                len = 2 + $Decode(this$static.m_LenDecoder, this$static.m_RangeDecoder, posState);
                this$static.state = this$static.state < 7?7:10;
                posSlot = $Decode_0(this$static.m_PosSlotDecoder[GetLenToPosState(len)], this$static.m_RangeDecoder);
                if (posSlot >= 4) {
                    numDirectBits = (posSlot >> 1) - 1;
                    this$static.rep0 = (2 | posSlot & 1) << numDirectBits;
                    if (posSlot < 14) {
                        this$static.rep0 += ReverseDecode(this$static.m_PosDecoders, this$static.rep0 - posSlot - 1, this$static.m_RangeDecoder, numDirectBits);
                    } else {
                        this$static.rep0 += $DecodeDirectBits(this$static.m_RangeDecoder, numDirectBits - 4) << 4;
                        this$static.rep0 += $ReverseDecode(this$static.m_PosAlignDecoder, this$static.m_RangeDecoder);
                        if (this$static.rep0 < 0) {
                            if (this$static.rep0 == -1) {
                                return 1;
                            }
                            return -1;
                        }
                    }
                } else 
                    this$static.rep0 = posSlot;
            }
            if (compare(fromInt(this$static.rep0), this$static.nowPos64) >= 0 || this$static.rep0 >= this$static.m_DictionarySizeCheck) {
                return -1;
            }
            $CopyBlock(this$static.m_OutWindow, this$static.rep0, len);
            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
            this$static.prevByte = $GetByte(this$static.m_OutWindow, 0);
        }
        return 0;
    }
    
    function $Decoder(this$static) {
        this$static.m_OutWindow = {};
        this$static.m_RangeDecoder = {};
        this$static.m_IsMatchDecoders = initDim(192);
        this$static.m_IsRepDecoders = initDim(12);
        this$static.m_IsRepG0Decoders = initDim(12);
        this$static.m_IsRepG1Decoders = initDim(12);
        this$static.m_IsRepG2Decoders = initDim(12);
        this$static.m_IsRep0LongDecoders = initDim(192);
        this$static.m_PosSlotDecoder = initDim(4);
        this$static.m_PosDecoders = initDim(114);
        this$static.m_PosAlignDecoder = $BitTreeDecoder({}, 4);
        this$static.m_LenDecoder = $Decoder$LenDecoder({});
        this$static.m_RepLenDecoder = $Decoder$LenDecoder({});
        this$static.m_LiteralDecoder = {};
        for (var i = 0; i < 4; ++i) {
            this$static.m_PosSlotDecoder[i] = $BitTreeDecoder({}, 6);
        }
        return this$static;
    }
    
    function $Init_1(this$static) {
        this$static.m_OutWindow._streamPos = 0;
        this$static.m_OutWindow._pos = 0;
        InitBitModels(this$static.m_IsMatchDecoders);
        InitBitModels(this$static.m_IsRep0LongDecoders);
        InitBitModels(this$static.m_IsRepDecoders);
        InitBitModels(this$static.m_IsRepG0Decoders);
        InitBitModels(this$static.m_IsRepG1Decoders);
        InitBitModels(this$static.m_IsRepG2Decoders);
        InitBitModels(this$static.m_PosDecoders);
        $Init_0(this$static.m_LiteralDecoder);
        for (var i = 0; i < 4; ++i) {
            InitBitModels(this$static.m_PosSlotDecoder[i].Models);
        }
        $Init(this$static.m_LenDecoder);
        $Init(this$static.m_RepLenDecoder);
        InitBitModels(this$static.m_PosAlignDecoder.Models);
        $Init_8(this$static.m_RangeDecoder);
    }
    
    function $SetDecoderProperties(this$static, properties) {
        var dictionarySize, i, lc, lp, pb, remainder, val;
        if (properties.length < 5)
            return 0;
        val = properties[0] & 255;
        lc = val % 9;
        remainder = ~~(val / 9);
        lp = remainder % 5;
        pb = ~~(remainder / 5);
        dictionarySize = 0;
        for (i = 0; i < 4; ++i) {
            dictionarySize += (properties[1 + i] & 255) << i * 8;
        }
        ///NOTE: If the input is bad, it might call for an insanely large dictionary size, which would crash the script.
        if (dictionarySize > 99999999 || !$SetLcLpPb(this$static, lc, lp, pb)) {
            return 0;
        }
        return $SetDictionarySize(this$static, dictionarySize);
    }
    
    function $SetDictionarySize(this$static, dictionarySize) {
        if (dictionarySize < 0) {
            return 0;
        }
        if (this$static.m_DictionarySize != dictionarySize) {
            this$static.m_DictionarySize = dictionarySize;
            this$static.m_DictionarySizeCheck = Math.max(this$static.m_DictionarySize, 1);
            $Create_5(this$static.m_OutWindow, Math.max(this$static.m_DictionarySizeCheck, 4096));
        }
        return 1;
    }
    
    function $SetLcLpPb(this$static, lc, lp, pb) {
        if (lc > 8 || lp > 4 || pb > 4) {
            return 0;
        }
        $Create_0(this$static.m_LiteralDecoder, lp, lc);
        var numPosStates = 1 << pb;
        $Create(this$static.m_LenDecoder, numPosStates);
        $Create(this$static.m_RepLenDecoder, numPosStates);
        this$static.m_PosStateMask = numPosStates - 1;
        return 1;
    }
    
    function $Create(this$static, numPosStates) {
        for (; this$static.m_NumPosStates < numPosStates; ++this$static.m_NumPosStates) {
            this$static.m_LowCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
            this$static.m_MidCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
        }
    }
    
    function $Decode(this$static, rangeDecoder, posState) {
        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 0)) {
            return $Decode_0(this$static.m_LowCoder[posState], rangeDecoder);
        }
        var symbol = 8;
        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 1)) {
            symbol += $Decode_0(this$static.m_MidCoder[posState], rangeDecoder);
        } else {
            symbol += 8 + $Decode_0(this$static.m_HighCoder, rangeDecoder);
        }
        return symbol;
    }
    
    function $Decoder$LenDecoder(this$static) {
        this$static.m_Choice = initDim(2);
        this$static.m_LowCoder = initDim(16);
        this$static.m_MidCoder = initDim(16);
        this$static.m_HighCoder = $BitTreeDecoder({}, 8);
        this$static.m_NumPosStates = 0;
        return this$static;
    }
    
    function $Init(this$static) {
        InitBitModels(this$static.m_Choice);
        for (var posState = 0; posState < this$static.m_NumPosStates; ++posState) {
            InitBitModels(this$static.m_LowCoder[posState].Models);
            InitBitModels(this$static.m_MidCoder[posState].Models);
        }
        InitBitModels(this$static.m_HighCoder.Models);
    }
    
    
    function $Create_0(this$static, numPosBits, numPrevBits) {
        var i, numStates;
        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits)
            return;
        this$static.m_NumPosBits = numPosBits;
        this$static.m_PosMask = (1 << numPosBits) - 1;
        this$static.m_NumPrevBits = numPrevBits;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        this$static.m_Coders = initDim(numStates);
        for (i = 0; i < numStates; ++i)
            this$static.m_Coders[i] = $Decoder$LiteralDecoder$Decoder2({});
    }
    
    function $GetDecoder(this$static, pos, prevByte) {
        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
    }
    
    function $Init_0(this$static) {
        var i, numStates;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        for (i = 0; i < numStates; ++i) {
            InitBitModels(this$static.m_Coders[i].m_Decoders);
        }
    }
    
    
    function $DecodeNormal(this$static, rangeDecoder) {
        var symbol = 1;
        do {
            symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
        } while (symbol < 256);
        return symbol << 24 >> 24;
    }
    
    function $DecodeWithMatchByte(this$static, rangeDecoder, matchByte) {
        var bit, matchBit, symbol = 1;
        do {
            matchBit = matchByte >> 7 & 1;
            matchByte <<= 1;
            bit = $DecodeBit(rangeDecoder, this$static.m_Decoders, (1 + matchBit << 8) + symbol);
            symbol = symbol << 1 | bit;
            if (matchBit != bit) {
                while (symbol < 256) {
                    symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
                }
            break;
            }
        } while (symbol < 256);
        return symbol << 24 >> 24;
    }
    
    function $Decoder$LiteralDecoder$Decoder2(this$static) {
        this$static.m_Decoders = initDim(768);
        return this$static;
    }
    
    /** de */
    /** cs */
    var g_FastPos = (function () {
        var j, k, slotFast, c = 2, g_FastPos = [0, 1];
        for (slotFast = 2; slotFast < 22; ++slotFast) {
            k = 1 << (slotFast >> 1) - 1;
            for (j = 0; j < k; ++j , ++c)
                g_FastPos[c] = slotFast << 24 >> 24;
        }
        return g_FastPos;
    }());
    
    function $Backward(this$static, cur) {
        var backCur, backMem, posMem, posPrev;
        this$static._optimumEndIndex = cur;
        posMem = this$static._optimum[cur].PosPrev;
        backMem = this$static._optimum[cur].BackPrev;
        do {
            if (this$static._optimum[cur].Prev1IsChar) {
                $MakeAsChar(this$static._optimum[posMem]);
                this$static._optimum[posMem].PosPrev = posMem - 1;
                if (this$static._optimum[cur].Prev2) {
                    this$static._optimum[posMem - 1].Prev1IsChar = 0;
                    this$static._optimum[posMem - 1].PosPrev = this$static._optimum[cur].PosPrev2;
                    this$static._optimum[posMem - 1].BackPrev = this$static._optimum[cur].BackPrev2;
                }
            }
            posPrev = posMem;
            backCur = backMem;
            backMem = this$static._optimum[posPrev].BackPrev;
            posMem = this$static._optimum[posPrev].PosPrev;
            this$static._optimum[posPrev].BackPrev = backCur;
            this$static._optimum[posPrev].PosPrev = cur;
            cur = posPrev;
        } while (cur > 0);
        this$static.backRes = this$static._optimum[0].BackPrev;
        this$static._optimumCurrentIndex = this$static._optimum[0].PosPrev;
        return this$static._optimumCurrentIndex;
    }
    
    function $BaseInit(this$static) {
        this$static._state = 0;
        this$static._previousByte = 0;
        for (var i = 0; i < 4; ++i) {
            this$static._repDistances[i] = 0;
        }
    }
    
    function $CodeOneBlock(this$static, inSize, outSize, finished) {
        var baseVal, complexState, curByte, distance, footerBits, i, len, lenToPosState, matchByte, pos, posReduced, posSlot, posState, progressPosValuePrev, subCoder;
        inSize[0] = P0_longLit;
        outSize[0] = P0_longLit;
        finished[0] = 1;
        if (this$static._inStream) {
            this$static._matchFinder._stream = this$static._inStream;
            $Init_5(this$static._matchFinder);
            this$static._needReleaseMFStream = 1;
            this$static._inStream = null;
        }
        if (this$static._finished) {
            return;
        }
        this$static._finished = 1;
        progressPosValuePrev = this$static.nowPos64;
        if (eq(this$static.nowPos64, P0_longLit)) {
            if (!$GetNumAvailableBytes(this$static._matchFinder)) {
                $Flush(this$static, lowBits_0(this$static.nowPos64));
                return;
            }
            $ReadMatchDistances(this$static);
            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
            $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 0);
            this$static._state = StateUpdateChar(this$static._state);
            curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
            $Encode_1($GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte), this$static._rangeEncoder, curByte);
            this$static._previousByte = curByte;
            --this$static._additionalOffset;
            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
        }
        if (!$GetNumAvailableBytes(this$static._matchFinder)) {
            $Flush(this$static, lowBits_0(this$static.nowPos64));
            return;
        }
        while (1) {
            len = $GetOptimum(this$static, lowBits_0(this$static.nowPos64));
            pos = this$static.backRes;
            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
            complexState = (this$static._state << 4) + posState;
            if (len == 1 && pos == -1) {
                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 0);
                curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
                subCoder = $GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte);
                if (this$static._state < 7) {
                    $Encode_1(subCoder, this$static._rangeEncoder, curByte);
                } else {
                    matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - this$static._additionalOffset);
                    $EncodeMatched(subCoder, this$static._rangeEncoder, matchByte, curByte);
                }
                this$static._previousByte = curByte;
                this$static._state = StateUpdateChar(this$static._state);
            } else {
                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 1);
                if (pos < 4) {
                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 1);
                    if (!pos) {
                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 0);
                        if (len == 1) {
                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 0);
                        } else {
                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 1);
                        }
                    } else {
                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 1);
                        if (pos == 1) {
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 0);
                        } else {
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 1);
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG2, this$static._state, pos - 2);
                        }
                    }
                    if (len == 1) {
                        this$static._state = this$static._state < 7?9:11;
                    } else {
                        $Encode_0(this$static._repMatchLenEncoder, this$static._rangeEncoder, len - 2, posState);
                        this$static._state = this$static._state < 7?8:11;
                    }
                    distance = this$static._repDistances[pos];
                    if (pos != 0) {
                        for (i = pos; i >= 1; --i) {
                            this$static._repDistances[i] = this$static._repDistances[i - 1];
                        }
                        this$static._repDistances[0] = distance;
                    }
                } else {
                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
                    this$static._state = this$static._state < 7?7:10;
                    $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, len - 2, posState);
                    pos -= 4;
                    posSlot = GetPosSlot(pos);
                    lenToPosState = GetLenToPosState(len);
                    $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, posSlot);
                    if (posSlot >= 4) {
                        footerBits = (posSlot >> 1) - 1;
                        baseVal = (2 | posSlot & 1) << footerBits;
                        posReduced = pos - baseVal;
                        if (posSlot < 14) {
                            ReverseEncode(this$static._posEncoders, baseVal - posSlot - 1, this$static._rangeEncoder, footerBits, posReduced);
                        } else {
                            $EncodeDirectBits(this$static._rangeEncoder, posReduced >> 4, footerBits - 4);
                            $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, posReduced & 15);
                            ++this$static._alignPriceCount;
                        }
                    }
                    distance = pos;
                    for (i = 3; i >= 1; --i) {
                        this$static._repDistances[i] = this$static._repDistances[i - 1];
                    }
                    this$static._repDistances[0] = distance;
                    ++this$static._matchPriceCount;
                }
                this$static._previousByte = $GetIndexByte(this$static._matchFinder, len - 1 - this$static._additionalOffset);
            }
            this$static._additionalOffset -= len;
            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
            if (!this$static._additionalOffset) {
                if (this$static._matchPriceCount >= 128) {
                    $FillDistancesPrices(this$static);
                }
                if (this$static._alignPriceCount >= 16) {
                    $FillAlignPrices(this$static);
                }
                inSize[0] = this$static.nowPos64;
                outSize[0] = $GetProcessedSizeAdd(this$static._rangeEncoder);
                if (!$GetNumAvailableBytes(this$static._matchFinder)) {
                    $Flush(this$static, lowBits_0(this$static.nowPos64));
                    return;
                }
                if (compare(sub(this$static.nowPos64, progressPosValuePrev), [4096, 0]) >= 0) {
                    this$static._finished = 0;
                    finished[0] = 0;
                    return;
                }
            }
        }
    }
    
    function $Create_2(this$static) {
        var bt, numHashBytes;
        if (!this$static._matchFinder) {
            bt = {};
            numHashBytes = 4;
            if (!this$static._matchFinderType) {
                numHashBytes = 2;
            }
            $SetType(bt, numHashBytes);
            this$static._matchFinder = bt;
        }
        $Create_1(this$static._literalEncoder, this$static._numLiteralPosStateBits, this$static._numLiteralContextBits);
        if (this$static._dictionarySize == this$static._dictionarySizePrev && this$static._numFastBytesPrev == this$static._numFastBytes) {
            return;
        }
        $Create_3(this$static._matchFinder, this$static._dictionarySize, 4096, this$static._numFastBytes, 274);
        this$static._dictionarySizePrev = this$static._dictionarySize;
        this$static._numFastBytesPrev = this$static._numFastBytes;
    }
    
    function $Encoder(this$static) {
        var i;
        this$static._repDistances = initDim(4);
        this$static._optimum = [];
        this$static._rangeEncoder = {};
        this$static._isMatch = initDim(192);
        this$static._isRep = initDim(12);
        this$static._isRepG0 = initDim(12);
        this$static._isRepG1 = initDim(12);
        this$static._isRepG2 = initDim(12);
        this$static._isRep0Long = initDim(192);
        this$static._posSlotEncoder = [];
        this$static._posEncoders = initDim(114);
        this$static._posAlignEncoder = $BitTreeEncoder({}, 4);
        this$static._lenEncoder = $Encoder$LenPriceTableEncoder({});
        this$static._repMatchLenEncoder = $Encoder$LenPriceTableEncoder({});
        this$static._literalEncoder = {};
        this$static._matchDistances = [];
        this$static._posSlotPrices = [];
        this$static._distancesPrices = [];
        this$static._alignPrices = initDim(16);
        this$static.reps = initDim(4);
        this$static.repLens = initDim(4);
        this$static.processedInSize = [P0_longLit];
        this$static.processedOutSize = [P0_longLit];
        this$static.finished = [0];
        this$static.properties = initDim(5);
        this$static.tempPrices = initDim(128);
        this$static._longestMatchLength = 0;
        this$static._matchFinderType = 1;
        this$static._numDistancePairs = 0;
        this$static._numFastBytesPrev = -1;
        this$static.backRes = 0;
        for (i = 0; i < 4096; ++i) {
            this$static._optimum[i] = {};
        }
        for (i = 0; i < 4; ++i) {
            this$static._posSlotEncoder[i] = $BitTreeEncoder({}, 6);
        }
        return this$static;
    }
    
    function $FillAlignPrices(this$static) {
        for (var i = 0; i < 16; ++i) {
            this$static._alignPrices[i] = $ReverseGetPrice(this$static._posAlignEncoder, i);
        }
        this$static._alignPriceCount = 0;
    }
    
    function $FillDistancesPrices(this$static) {
        var baseVal, encoder, footerBits, i, lenToPosState, posSlot, st, st2;
        for (i = 4; i < 128; ++i) {
            posSlot = GetPosSlot(i);
            footerBits = (posSlot >> 1) - 1;
            baseVal = (2 | posSlot & 1) << footerBits;
            this$static.tempPrices[i] = ReverseGetPrice(this$static._posEncoders, baseVal - posSlot - 1, footerBits, i - baseVal);
        }
        for (lenToPosState = 0; lenToPosState < 4; ++lenToPosState) {
            encoder = this$static._posSlotEncoder[lenToPosState];
            st = lenToPosState << 6;
            for (posSlot = 0; posSlot < this$static._distTableSize; ++posSlot) {
                this$static._posSlotPrices[st + posSlot] = $GetPrice_1(encoder, posSlot);
            }
            for (posSlot = 14; posSlot < this$static._distTableSize; ++posSlot) {
                this$static._posSlotPrices[st + posSlot] += (posSlot >> 1) - 1 - 4 << 6;
            }
            st2 = lenToPosState * 128;
            for (i = 0; i < 4; ++i) {
                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + i];
            }
            for (; i < 128; ++i) {
                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + GetPosSlot(i)] + this$static.tempPrices[i];
            }
        }
        this$static._matchPriceCount = 0;
    }
    
    function $Flush(this$static, nowPos) {
        $ReleaseMFStream(this$static);
        $WriteEndMarker(this$static, nowPos & this$static._posStateMask);
        for (var i = 0; i < 5; ++i) {
            $ShiftLow(this$static._rangeEncoder);
        }
    }
    
    function $GetOptimum(this$static, position) {
        var cur, curAnd1Price, curAndLenCharPrice, curAndLenPrice, curBack, curPrice, currentByte, distance, i, len, lenEnd, lenMain, lenRes, lenTest, lenTest2, lenTestTemp, matchByte, matchPrice, newLen, nextIsChar, nextMatchPrice, nextOptimum, nextRepMatchPrice, normalMatchPrice, numAvailableBytes, numAvailableBytesFull, numDistancePairs, offs, offset, opt, optimum, pos, posPrev, posState, posStateNext, price_4, repIndex, repLen, repMatchPrice, repMaxIndex, shortRepPrice, startLen, state, state2, t, price, price_0, price_1, price_2, price_3;
        if (this$static._optimumEndIndex != this$static._optimumCurrentIndex) {
            lenRes = this$static._optimum[this$static._optimumCurrentIndex].PosPrev - this$static._optimumCurrentIndex;
            this$static.backRes = this$static._optimum[this$static._optimumCurrentIndex].BackPrev;
            this$static._optimumCurrentIndex = this$static._optimum[this$static._optimumCurrentIndex].PosPrev;
            return lenRes;
        }
        this$static._optimumCurrentIndex = this$static._optimumEndIndex = 0;
        if (this$static._longestMatchWasFound) {
            lenMain = this$static._longestMatchLength;
            this$static._longestMatchWasFound = 0;
        } else {
            lenMain = $ReadMatchDistances(this$static);
        }
        numDistancePairs = this$static._numDistancePairs;
        numAvailableBytes = $GetNumAvailableBytes(this$static._matchFinder) + 1;
        if (numAvailableBytes < 2) {
            this$static.backRes = -1;
            return 1;
        }
        if (numAvailableBytes > 273) {
            numAvailableBytes = 273;
        }
        repMaxIndex = 0;
        for (i = 0; i < 4; ++i) {
            this$static.reps[i] = this$static._repDistances[i];
            this$static.repLens[i] = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[i], 273);
            if (this$static.repLens[i] > this$static.repLens[repMaxIndex]) {
                repMaxIndex = i;
            }
        }
        if (this$static.repLens[repMaxIndex] >= this$static._numFastBytes) {
            this$static.backRes = repMaxIndex;
            lenRes = this$static.repLens[repMaxIndex];
            $MovePos(this$static, lenRes - 1);
            return lenRes;
        }
        if (lenMain >= this$static._numFastBytes) {
            this$static.backRes = this$static._matchDistances[numDistancePairs - 1] + 4;
            $MovePos(this$static, lenMain - 1);
            return lenMain;
        }
        currentByte = $GetIndexByte(this$static._matchFinder, -1);
        matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - 1);
        if (lenMain < 2 && currentByte != matchByte && this$static.repLens[repMaxIndex] < 2) {
            this$static.backRes = -1;
            return 1;
        }
        this$static._optimum[0].State = this$static._state;
        posState = position & this$static._posStateMask;
        this$static._optimum[1].Price = ProbPrices[this$static._isMatch[(this$static._state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, this$static._previousByte), this$static._state >= 7, matchByte, currentByte);
        $MakeAsChar(this$static._optimum[1]);
        matchPrice = ProbPrices[2048 - this$static._isMatch[(this$static._state << 4) + posState] >>> 2];
        repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[this$static._state] >>> 2];
        if (matchByte == currentByte) {
            shortRepPrice = repMatchPrice + $GetRepLen1Price(this$static, this$static._state, posState);
            if (shortRepPrice < this$static._optimum[1].Price) {
                this$static._optimum[1].Price = shortRepPrice;
                $MakeAsShortRep(this$static._optimum[1]);
            }
        }
        lenEnd = lenMain >= this$static.repLens[repMaxIndex]?lenMain:this$static.repLens[repMaxIndex];
        if (lenEnd < 2) {
            this$static.backRes = this$static._optimum[1].BackPrev;
            return 1;
        }
        this$static._optimum[1].PosPrev = 0;
        this$static._optimum[0].Backs0 = this$static.reps[0];
        this$static._optimum[0].Backs1 = this$static.reps[1];
        this$static._optimum[0].Backs2 = this$static.reps[2];
        this$static._optimum[0].Backs3 = this$static.reps[3];
        len = lenEnd;
        do {
            this$static._optimum[len--].Price = 268435455;
        } while (len >= 2);
        for (i = 0; i < 4; ++i) {
            repLen = this$static.repLens[i];
            if (repLen < 2) {
                continue;
            }
            price_4 = repMatchPrice + $GetPureRepPrice(this$static, i, this$static._state, posState);
            do {
                curAndLenPrice = price_4 + $GetPrice(this$static._repMatchLenEncoder, repLen - 2, posState);
                optimum = this$static._optimum[repLen];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = 0;
                    optimum.BackPrev = i;
                    optimum.Prev1IsChar = 0;
                }
            } while (--repLen >= 2);
        }
        normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[this$static._state] >>> 2];
        len = this$static.repLens[0] >= 2?this$static.repLens[0] + 1:2;
        if (len <= lenMain) {
            offs = 0;
            while (len > this$static._matchDistances[offs]) {
                offs += 2;
            }
            for (;; ++len) {
                distance = this$static._matchDistances[offs + 1];
                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, distance, len, posState);
                optimum = this$static._optimum[len];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = 0;
                    optimum.BackPrev = distance + 4;
                    optimum.Prev1IsChar = 0;
                }
                if (len == this$static._matchDistances[offs]) {
                    offs += 2;
                    if (offs == numDistancePairs) {
                        break;
                    }
                }
            }
        }
        cur = 0;
        while (1) {
            ++cur;
            if (cur == lenEnd) {
                return $Backward(this$static, cur);
            }
            newLen = $ReadMatchDistances(this$static);
            numDistancePairs = this$static._numDistancePairs;
            if (newLen >= this$static._numFastBytes) {
                this$static._longestMatchLength = newLen;
                this$static._longestMatchWasFound = 1;
                return $Backward(this$static, cur);
            }
            ++position;
            posPrev = this$static._optimum[cur].PosPrev;
            if (this$static._optimum[cur].Prev1IsChar) {
                --posPrev;
                if (this$static._optimum[cur].Prev2) {
                    state = this$static._optimum[this$static._optimum[cur].PosPrev2].State;
                    if (this$static._optimum[cur].BackPrev2 < 4) {
                        state = (state < 7) ? 8 : 11;
                    } else {
                        state = (state < 7) ? 7 : 10;
                    }
                } else {
                    state = this$static._optimum[posPrev].State;
                }
                state = StateUpdateChar(state);
            } else {
                state = this$static._optimum[posPrev].State;
            }
            if (posPrev == cur - 1) {
                if (!this$static._optimum[cur].BackPrev) {
                    state = state < 7?9:11;
                } else {
                    state = StateUpdateChar(state);
                }
            } else {
                if (this$static._optimum[cur].Prev1IsChar && this$static._optimum[cur].Prev2) {
                    posPrev = this$static._optimum[cur].PosPrev2;
                    pos = this$static._optimum[cur].BackPrev2;
                    state = state < 7?8:11;
                } else {
                    pos = this$static._optimum[cur].BackPrev;
                    if (pos < 4) {
                        state = state < 7?8:11;
                    } else {
                        state = state < 7?7:10;
                    }
                }
                opt = this$static._optimum[posPrev];
                if (pos < 4) {
                    if (!pos) {
                        this$static.reps[0] = opt.Backs0;
                        this$static.reps[1] = opt.Backs1;
                        this$static.reps[2] = opt.Backs2;
                        this$static.reps[3] = opt.Backs3;
                    } else if (pos == 1) {
                        this$static.reps[0] = opt.Backs1;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs2;
                        this$static.reps[3] = opt.Backs3;
                    } else if (pos == 2) {
                        this$static.reps[0] = opt.Backs2;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs1;
                        this$static.reps[3] = opt.Backs3;
                    } else {
                        this$static.reps[0] = opt.Backs3;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs1;
                        this$static.reps[3] = opt.Backs2;
                    }
                } else {
                    this$static.reps[0] = pos - 4;
                    this$static.reps[1] = opt.Backs0;
                    this$static.reps[2] = opt.Backs1;
                    this$static.reps[3] = opt.Backs2;
                }
            }
            this$static._optimum[cur].State = state;
            this$static._optimum[cur].Backs0 = this$static.reps[0];
            this$static._optimum[cur].Backs1 = this$static.reps[1];
            this$static._optimum[cur].Backs2 = this$static.reps[2];
            this$static._optimum[cur].Backs3 = this$static.reps[3];
            curPrice = this$static._optimum[cur].Price;
            currentByte = $GetIndexByte(this$static._matchFinder, -1);
            matchByte = $GetIndexByte(this$static._matchFinder, -this$static.reps[0] - 1 - 1);
            posState = position & this$static._posStateMask;
            curAnd1Price = curPrice + ProbPrices[this$static._isMatch[(state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, $GetIndexByte(this$static._matchFinder, -2)), state >= 7, matchByte, currentByte);
            nextOptimum = this$static._optimum[cur + 1];
            nextIsChar = 0;
            if (curAnd1Price < nextOptimum.Price) {
                nextOptimum.Price = curAnd1Price;
                nextOptimum.PosPrev = cur;
                nextOptimum.BackPrev = -1;
                nextOptimum.Prev1IsChar = 0;
                nextIsChar = 1;
            }
            matchPrice = curPrice + ProbPrices[2048 - this$static._isMatch[(state << 4) + posState] >>> 2];
            repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[state] >>> 2];
            if (matchByte == currentByte && !(nextOptimum.PosPrev < cur && !nextOptimum.BackPrev)) {
                shortRepPrice = repMatchPrice + (ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2]);
                if (shortRepPrice <= nextOptimum.Price) {
                    nextOptimum.Price = shortRepPrice;
                    nextOptimum.PosPrev = cur;
                    nextOptimum.BackPrev = 0;
                    nextOptimum.Prev1IsChar = 0;
                    nextIsChar = 1;
                }
            }
            numAvailableBytesFull = $GetNumAvailableBytes(this$static._matchFinder) + 1;
            numAvailableBytesFull = 4095 - cur < numAvailableBytesFull?4095 - cur:numAvailableBytesFull;
            numAvailableBytes = numAvailableBytesFull;
            if (numAvailableBytes < 2) {
                continue;
            }
            if (numAvailableBytes > this$static._numFastBytes) {
                numAvailableBytes = this$static._numFastBytes;
            }
            if (!nextIsChar && matchByte != currentByte) {
                t = Math.min(numAvailableBytesFull - 1, this$static._numFastBytes);
                lenTest2 = $GetMatchLen(this$static._matchFinder, 0, this$static.reps[0], t);
                if (lenTest2 >= 2) {
                    state2 = StateUpdateChar(state);
                    posStateNext = position + 1 & this$static._posStateMask;
                    nextRepMatchPrice = curAnd1Price + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                    offset = cur + 1 + lenTest2;
                    while (lenEnd < offset) {
                        this$static._optimum[++lenEnd].Price = 268435455;
                    }
                    curAndLenPrice = nextRepMatchPrice + (price = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                    optimum = this$static._optimum[offset];
                    if (curAndLenPrice < optimum.Price) {
                        optimum.Price = curAndLenPrice;
                        optimum.PosPrev = cur + 1;
                        optimum.BackPrev = 0;
                        optimum.Prev1IsChar = 1;
                        optimum.Prev2 = 0;
                    }
                }
            }
            startLen = 2;
            for (repIndex = 0; repIndex < 4; ++repIndex) {
                lenTest = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[repIndex], numAvailableBytes);
                if (lenTest < 2) {
                    continue;
                }
                lenTestTemp = lenTest;
                do {
                    while (lenEnd < cur + lenTest) {
                        this$static._optimum[++lenEnd].Price = 268435455;
                    }
                    curAndLenPrice = repMatchPrice + (price_0 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_0 + $GetPureRepPrice(this$static, repIndex, state, posState));
                    optimum = this$static._optimum[cur + lenTest];
                    if (curAndLenPrice < optimum.Price) {
                        optimum.Price = curAndLenPrice;
                        optimum.PosPrev = cur;
                        optimum.BackPrev = repIndex;
                        optimum.Prev1IsChar = 0;
                    }
                } while (--lenTest >= 2);
                lenTest = lenTestTemp;
                if (!repIndex) {
                    startLen = lenTest + 1;
                }
                if (lenTest < numAvailableBytesFull) {
                    t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
                    lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, this$static.reps[repIndex], t);
                    if (lenTest2 >= 2) {
                        state2 = state < 7?8:11;
                        posStateNext = position + lenTest & this$static._posStateMask;
                        curAndLenCharPrice = repMatchPrice + (price_1 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_1 + $GetPureRepPrice(this$static, repIndex, state, posState)) + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - 1 - (this$static.reps[repIndex] + 1)), $GetIndexByte(this$static._matchFinder, lenTest - 1));
                        state2 = StateUpdateChar(state2);
                        posStateNext = position + lenTest + 1 & this$static._posStateMask;
                        nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
                        nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                        offset = lenTest + 1 + lenTest2;
                        while (lenEnd < cur + offset) {
                            this$static._optimum[++lenEnd].Price = 268435455;
                        }
                        curAndLenPrice = nextRepMatchPrice + (price_2 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_2 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                        optimum = this$static._optimum[cur + offset];
                        if (curAndLenPrice < optimum.Price) {
                            optimum.Price = curAndLenPrice;
                            optimum.PosPrev = cur + lenTest + 1;
                            optimum.BackPrev = 0;
                            optimum.Prev1IsChar = 1;
                            optimum.Prev2 = 1;
                            optimum.PosPrev2 = cur;
                            optimum.BackPrev2 = repIndex;
                        }
                    }
                }
            }
            if (newLen > numAvailableBytes) {
                newLen = numAvailableBytes;
                for (numDistancePairs = 0; newLen > this$static._matchDistances[numDistancePairs]; numDistancePairs += 2) {}
                this$static._matchDistances[numDistancePairs] = newLen;
                numDistancePairs += 2;
            }
            if (newLen >= startLen) {
            normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[state] >>> 2];
            while (lenEnd < cur + newLen) {
                this$static._optimum[++lenEnd].Price = 268435455;
            }
            offs = 0;
            while (startLen > this$static._matchDistances[offs]) {
                offs += 2;
            }
            for (lenTest = startLen;; ++lenTest) {
                curBack = this$static._matchDistances[offs + 1];
                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, curBack, lenTest, posState);
                optimum = this$static._optimum[cur + lenTest];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = cur;
                    optimum.BackPrev = curBack + 4;
                    optimum.Prev1IsChar = 0;
                }
                if (lenTest == this$static._matchDistances[offs]) {
                    if (lenTest < numAvailableBytesFull) {
                        t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
                        lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, curBack, t);
                        if (lenTest2 >= 2) {
                            state2 = state < 7?7:10;
                            posStateNext = position + lenTest & this$static._posStateMask;
                            curAndLenCharPrice = curAndLenPrice + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - (curBack + 1) - 1), $GetIndexByte(this$static._matchFinder, lenTest - 1));
                            state2 = StateUpdateChar(state2);
                            posStateNext = position + lenTest + 1 & this$static._posStateMask;
                            nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
                            nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                            offset = lenTest + 1 + lenTest2;
                            while (lenEnd < cur + offset) {
                                this$static._optimum[++lenEnd].Price = 268435455;
                            }
                            curAndLenPrice = nextRepMatchPrice + (price_3 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_3 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                            optimum = this$static._optimum[cur + offset];
                            if (curAndLenPrice < optimum.Price) {
                                optimum.Price = curAndLenPrice;
                                optimum.PosPrev = cur + lenTest + 1;
                                optimum.BackPrev = 0;
                                optimum.Prev1IsChar = 1;
                                optimum.Prev2 = 1;
                                optimum.PosPrev2 = cur;
                                optimum.BackPrev2 = curBack + 4;
                            }
                        }
                    }
                    offs += 2;
                    if (offs == numDistancePairs)
                        break;
                    }
                }
            }
        }
    }
    
    function $GetPosLenPrice(this$static, pos, len, posState) {
        var price, lenToPosState = GetLenToPosState(len);
        if (pos < 128) {
            price = this$static._distancesPrices[lenToPosState * 128 + pos];
        } else {
            price = this$static._posSlotPrices[(lenToPosState << 6) + GetPosSlot2(pos)] + this$static._alignPrices[pos & 15];
        }
        return price + $GetPrice(this$static._lenEncoder, len - 2, posState);
    }
    
    function $GetPureRepPrice(this$static, repIndex, state, posState) {
        var price;
        if (!repIndex) {
            price = ProbPrices[this$static._isRepG0[state] >>> 2];
            price += ProbPrices[2048 - this$static._isRep0Long[(state << 4) + posState] >>> 2];
        } else {
            price = ProbPrices[2048 - this$static._isRepG0[state] >>> 2];
            if (repIndex == 1) {
                price += ProbPrices[this$static._isRepG1[state] >>> 2];
            } else {
                price += ProbPrices[2048 - this$static._isRepG1[state] >>> 2];
                price += GetPrice(this$static._isRepG2[state], repIndex - 2);
            }
        }
        return price;
    }
    
    function $GetRepLen1Price(this$static, state, posState) {
        return ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2];
    }
    
    function $Init_4(this$static) {
        $BaseInit(this$static);
        $Init_9(this$static._rangeEncoder);
        InitBitModels(this$static._isMatch);
        InitBitModels(this$static._isRep0Long);
        InitBitModels(this$static._isRep);
        InitBitModels(this$static._isRepG0);
        InitBitModels(this$static._isRepG1);
        InitBitModels(this$static._isRepG2);
        InitBitModels(this$static._posEncoders);
        $Init_3(this$static._literalEncoder);
        for (var i = 0; i < 4; ++i) {
            InitBitModels(this$static._posSlotEncoder[i].Models);
        }
        $Init_2(this$static._lenEncoder, 1 << this$static._posStateBits);
        $Init_2(this$static._repMatchLenEncoder, 1 << this$static._posStateBits);
        InitBitModels(this$static._posAlignEncoder.Models);
        this$static._longestMatchWasFound = 0;
        this$static._optimumEndIndex = 0;
        this$static._optimumCurrentIndex = 0;
        this$static._additionalOffset = 0;
    }
    
    function $MovePos(this$static, num) {
        if (num > 0) {
            $Skip(this$static._matchFinder, num);
            this$static._additionalOffset += num;
        }
    }
    
    function $ReadMatchDistances(this$static) {
        var lenRes = 0;
        this$static._numDistancePairs = $GetMatches(this$static._matchFinder, this$static._matchDistances);
        if (this$static._numDistancePairs > 0) {
            lenRes = this$static._matchDistances[this$static._numDistancePairs - 2];
            if (lenRes == this$static._numFastBytes)
            lenRes += $GetMatchLen(this$static._matchFinder, lenRes - 1, this$static._matchDistances[this$static._numDistancePairs - 1], 273 - lenRes);
        }
        ++this$static._additionalOffset;
        return lenRes;
    }
    
    function $ReleaseMFStream(this$static) {
        if (this$static._matchFinder && this$static._needReleaseMFStream) {
            this$static._matchFinder._stream = null;
            this$static._needReleaseMFStream = 0;
        }
    }
    
    function $ReleaseStreams(this$static) {
        $ReleaseMFStream(this$static);
        this$static._rangeEncoder.Stream = null;
    }
    
    function $SetDictionarySize_0(this$static, dictionarySize) {
        this$static._dictionarySize = dictionarySize;
        for (var dicLogSize = 0; dictionarySize > 1 << dicLogSize; ++dicLogSize) {}
        this$static._distTableSize = dicLogSize * 2;
    }
    
    function $SetMatchFinder(this$static, matchFinderIndex) {
        var matchFinderIndexPrev = this$static._matchFinderType;
        this$static._matchFinderType = matchFinderIndex;
        if (this$static._matchFinder && matchFinderIndexPrev != this$static._matchFinderType) {
            this$static._dictionarySizePrev = -1;
            this$static._matchFinder = null;
        }
    }
    
    function $WriteCoderProperties(this$static, outStream) {
        this$static.properties[0] = (this$static._posStateBits * 5 + this$static._numLiteralPosStateBits) * 9 + this$static._numLiteralContextBits << 24 >> 24;
        for (var i = 0; i < 4; ++i) {
            this$static.properties[1 + i] = this$static._dictionarySize >> 8 * i << 24 >> 24;
        }
        $write_0(outStream, this$static.properties, 0, 5);
    }
    
    function $WriteEndMarker(this$static, posState) {
        if (!this$static._writeEndMark) {
            return;
        }
        $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 1);
        $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
        this$static._state = this$static._state < 7?7:10;
        $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, 0, posState);
        var lenToPosState = GetLenToPosState(2);
        $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, 63);
        $EncodeDirectBits(this$static._rangeEncoder, 67108863, 26);
        $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, 15);
    }
    
    function GetPosSlot(pos) {
        if (pos < 2048) {
            return g_FastPos[pos];
        }
        if (pos < 2097152) {
            return g_FastPos[pos >> 10] + 20;
        }
        return g_FastPos[pos >> 20] + 40;
    }
    
    function GetPosSlot2(pos) {
        if (pos < 131072) {
            return g_FastPos[pos >> 6] + 12;
        }
        if (pos < 134217728) {
            return g_FastPos[pos >> 16] + 32;
        }
        return g_FastPos[pos >> 26] + 52;
    }
    
    function $Encode(this$static, rangeEncoder, symbol, posState) {
        if (symbol < 8) {
            $Encode_3(rangeEncoder, this$static._choice, 0, 0);
            $Encode_2(this$static._lowCoder[posState], rangeEncoder, symbol);
        } else {
            symbol -= 8;
            $Encode_3(rangeEncoder, this$static._choice, 0, 1);
            if (symbol < 8) {
                $Encode_3(rangeEncoder, this$static._choice, 1, 0);
                $Encode_2(this$static._midCoder[posState], rangeEncoder, symbol);
            } else {
                $Encode_3(rangeEncoder, this$static._choice, 1, 1);
                $Encode_2(this$static._highCoder, rangeEncoder, symbol - 8);
            }
        }
    }
    
    function $Encoder$LenEncoder(this$static) {
        this$static._choice = initDim(2);
        this$static._lowCoder = initDim(16);
        this$static._midCoder = initDim(16);
        this$static._highCoder = $BitTreeEncoder({}, 8);
        for (var posState = 0; posState < 16; ++posState) {
            this$static._lowCoder[posState] = $BitTreeEncoder({}, 3);
            this$static._midCoder[posState] = $BitTreeEncoder({}, 3);
        }
        return this$static;
    }
    
    function $Init_2(this$static, numPosStates) {
        InitBitModels(this$static._choice);
        for (var posState = 0; posState < numPosStates; ++posState) {
            InitBitModels(this$static._lowCoder[posState].Models);
            InitBitModels(this$static._midCoder[posState].Models);
        }
        InitBitModels(this$static._highCoder.Models);
    }
    
    function $SetPrices(this$static, posState, numSymbols, prices, st) {
        var a0, a1, b0, b1, i;
        a0 = ProbPrices[this$static._choice[0] >>> 2];
        a1 = ProbPrices[2048 - this$static._choice[0] >>> 2];
        b0 = a1 + ProbPrices[this$static._choice[1] >>> 2];
        b1 = a1 + ProbPrices[2048 - this$static._choice[1] >>> 2];
        i = 0;
        for (i = 0; i < 8; ++i) {
            if (i >= numSymbols)
            return;
            prices[st + i] = a0 + $GetPrice_1(this$static._lowCoder[posState], i);
        }
        for (; i < 16; ++i) {
            if (i >= numSymbols)
            return;
            prices[st + i] = b0 + $GetPrice_1(this$static._midCoder[posState], i - 8);
        }
        for (; i < numSymbols; ++i) {
            prices[st + i] = b1 + $GetPrice_1(this$static._highCoder, i - 8 - 8);
        }
    }
    
    function $Encode_0(this$static, rangeEncoder, symbol, posState) {
        $Encode(this$static, rangeEncoder, symbol, posState);
        if (--this$static._counters[posState] == 0) {
            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
            this$static._counters[posState] = this$static._tableSize;
        }
    }
    
    function $Encoder$LenPriceTableEncoder(this$static) {
        $Encoder$LenEncoder(this$static);
        this$static._prices = [];
        this$static._counters = [];
        return this$static;
    }
    
    function $GetPrice(this$static, symbol, posState) {
        return this$static._prices[posState * 272 + symbol];
    }
    
    function $UpdateTables(this$static, numPosStates) {
        for (var posState = 0; posState < numPosStates; ++posState) {
            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
            this$static._counters[posState] = this$static._tableSize;
        }
    }
    
    function $Create_1(this$static, numPosBits, numPrevBits) {
        var i, numStates;
        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits) {
            return;
        }
        this$static.m_NumPosBits = numPosBits;
        this$static.m_PosMask = (1 << numPosBits) - 1;
        this$static.m_NumPrevBits = numPrevBits;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        this$static.m_Coders = initDim(numStates);
        for (i = 0; i < numStates; ++i) {
            this$static.m_Coders[i] = $Encoder$LiteralEncoder$Encoder2({});
        }
    }
    
    function $GetSubCoder(this$static, pos, prevByte) {
        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
    }
    
    function $Init_3(this$static) {
        var i, numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        for (i = 0; i < numStates; ++i) {
            InitBitModels(this$static.m_Coders[i].m_Encoders);
        }
    }
    
    function $Encode_1(this$static, rangeEncoder, symbol) {
        var bit, i, context = 1;
        for (i = 7; i >= 0; --i) {
            bit = symbol >> i & 1;
            $Encode_3(rangeEncoder, this$static.m_Encoders, context, bit);
            context = context << 1 | bit;
        }
    }
    
    function $EncodeMatched(this$static, rangeEncoder, matchByte, symbol) {
        var bit, i, matchBit, state, same = 1, context = 1;
        for (i = 7; i >= 0; --i) {
            bit = symbol >> i & 1;
            state = context;
            if (same) {
                matchBit = matchByte >> i & 1;
                state += 1 + matchBit << 8;
                same = matchBit == bit;
            }
            $Encode_3(rangeEncoder, this$static.m_Encoders, state, bit);
            context = context << 1 | bit;
        }
    }
    
    function $Encoder$LiteralEncoder$Encoder2(this$static) {
        this$static.m_Encoders = initDim(768);
        return this$static;
    }
    
    function $GetPrice_0(this$static, matchMode, matchByte, symbol) {
        var bit, context = 1, i = 7, matchBit, price = 0;
        if (matchMode) {
            for (; i >= 0; --i) {
                matchBit = matchByte >> i & 1;
                bit = symbol >> i & 1;
                price += GetPrice(this$static.m_Encoders[(1 + matchBit << 8) + context], bit);
                context = context << 1 | bit;
                if (matchBit != bit) {
                    --i;
                    break;
                }
            }
        }
        for (; i >= 0; --i) {
            bit = symbol >> i & 1;
            price += GetPrice(this$static.m_Encoders[context], bit);
            context = context << 1 | bit;
        }
        return price;
    }
    
    function $MakeAsChar(this$static) {
        this$static.BackPrev = -1;
        this$static.Prev1IsChar = 0;
    }
    
    function $MakeAsShortRep(this$static) {
        this$static.BackPrev = 0;
        this$static.Prev1IsChar = 0;
    }
    /** ce */
    /** ds */
    function $BitTreeDecoder(this$static, numBitLevels) {
        this$static.NumBitLevels = numBitLevels;
        this$static.Models = initDim(1 << numBitLevels);
        return this$static;
    }
    
    function $Decode_0(this$static, rangeDecoder) {
        var bitIndex, m = 1;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0; --bitIndex) {
            m = (m << 1) + $DecodeBit(rangeDecoder, this$static.Models, m);
        }
        return m - (1 << this$static.NumBitLevels);
    }
    
    function $ReverseDecode(this$static, rangeDecoder) {
        var bit, bitIndex, m = 1, symbol = 0;
        for (bitIndex = 0; bitIndex < this$static.NumBitLevels; ++bitIndex) {
            bit = $DecodeBit(rangeDecoder, this$static.Models, m);
            m <<= 1;
            m += bit;
            symbol |= bit << bitIndex;
        }
        return symbol;
    }
    
    function ReverseDecode(Models, startIndex, rangeDecoder, NumBitLevels) {
        var bit, bitIndex, m = 1, symbol = 0;
        for (bitIndex = 0; bitIndex < NumBitLevels; ++bitIndex) {
            bit = $DecodeBit(rangeDecoder, Models, startIndex + m);
            m <<= 1;
            m += bit;
            symbol |= bit << bitIndex;
        }
        return symbol;
    }
    /** de */
    /** cs */
    function $BitTreeEncoder(this$static, numBitLevels) {
        this$static.NumBitLevels = numBitLevels;
        this$static.Models = initDim(1 << numBitLevels);
        return this$static;
    }
    
    function $Encode_2(this$static, rangeEncoder, symbol) {
        var bit, bitIndex, m = 1;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
            --bitIndex;
            bit = symbol >>> bitIndex & 1;
            $Encode_3(rangeEncoder, this$static.Models, m, bit);
            m = m << 1 | bit;
        }
    }
    
    function $GetPrice_1(this$static, symbol) {
        var bit, bitIndex, m = 1, price = 0;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
            --bitIndex;
            bit = symbol >>> bitIndex & 1;
            price += GetPrice(this$static.Models[m], bit);
            m = (m << 1) + bit;
        }
        return price;
    }
    
    function $ReverseEncode(this$static, rangeEncoder, symbol) {
        var bit, i, m = 1;
        for (i = 0; i < this$static.NumBitLevels; ++i) {
            bit = symbol & 1;
            $Encode_3(rangeEncoder, this$static.Models, m, bit);
            m = m << 1 | bit;
            symbol >>= 1;
        }
    }
    
    function $ReverseGetPrice(this$static, symbol) {
        var bit, i, m = 1, price = 0;
        for (i = this$static.NumBitLevels; i != 0; --i) {
            bit = symbol & 1;
            symbol >>>= 1;
            price += GetPrice(this$static.Models[m], bit);
            m = m << 1 | bit;
        }
        return price;
    }
    
    function ReverseEncode(Models, startIndex, rangeEncoder, NumBitLevels, symbol) {
        var bit, i, m = 1;
        for (i = 0; i < NumBitLevels; ++i) {
            bit = symbol & 1;
            $Encode_3(rangeEncoder, Models, startIndex + m, bit);
            m = m << 1 | bit;
            symbol >>= 1;
        }
    }
    
    function ReverseGetPrice(Models, startIndex, NumBitLevels, symbol) {
        var bit, i, m = 1, price = 0;
        for (i = NumBitLevels; i != 0; --i) {
            bit = symbol & 1;
            symbol >>>= 1;
            price += ProbPrices[((Models[startIndex + m] - bit ^ -bit) & 2047) >>> 2];
            m = m << 1 | bit;
        }
        return price;
    }
    /** ce */
    /** ds */
    function $DecodeBit(this$static, probs, index) {
        var newBound, prob = probs[index];
        newBound = (this$static.Range >>> 11) * prob;
        if ((this$static.Code ^ -2147483648) < (newBound ^ -2147483648)) {
            this$static.Range = newBound;
            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
            return 0;
        } else {
            this$static.Range -= newBound;
            this$static.Code -= newBound;
            probs[index] = prob - (prob >>> 5) << 16 >> 16;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
            return 1;
        }
    }
    
    function $DecodeDirectBits(this$static, numTotalBits) {
        var i, t, result = 0;
        for (i = numTotalBits; i != 0; --i) {
            this$static.Range >>>= 1;
            t = this$static.Code - this$static.Range >>> 31;
            this$static.Code -= this$static.Range & t - 1;
            result = result << 1 | 1 - t;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
        }
        return result;
    }
    
    function $Init_8(this$static) {
        this$static.Code = 0;
        this$static.Range = -1;
        for (var i = 0; i < 5; ++i) {
            this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
        }
    }
    /** de */
    
    function InitBitModels(probs) {
        for (var i = probs.length - 1; i >= 0; --i) {
            probs[i] = 1024;
        }
    }
    /** cs */
    var ProbPrices = (function () {
        var end, i, j, start, ProbPrices = [];
        for (i = 8; i >= 0; --i) {
            start = 1 << 9 - i - 1;
            end = 1 << 9 - i;
            for (j = start; j < end; ++j) {
                ProbPrices[j] = (i << 6) + (end - j << 6 >>> 9 - i - 1);
            }
        }
        return ProbPrices;
    }());
    
    function $Encode_3(this$static, probs, index, symbol) {
        var newBound, prob = probs[index];
        newBound = (this$static.Range >>> 11) * prob;
        if (!symbol) {
            this$static.Range = newBound;
            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
        } else {
            this$static.Low = add(this$static.Low, and(fromInt(newBound), [4294967295, 0]));
            this$static.Range -= newBound;
            probs[index] = prob - (prob >>> 5) << 16 >> 16;
        }
        if (!(this$static.Range & -16777216)) {
            this$static.Range <<= 8;
            $ShiftLow(this$static);
        }
    }
    
    function $EncodeDirectBits(this$static, v, numTotalBits) {
        for (var i = numTotalBits - 1; i >= 0; --i) {
            this$static.Range >>>= 1;
            if ((v >>> i & 1) == 1) {
                this$static.Low = add(this$static.Low, fromInt(this$static.Range));
            }
            if (!(this$static.Range & -16777216)) {
                this$static.Range <<= 8;
                $ShiftLow(this$static);
            }
        }
    }
    
    function $GetProcessedSizeAdd(this$static) {
        return add(add(fromInt(this$static._cacheSize), this$static._position), [4, 0]);
    }
    
    function $Init_9(this$static) {
        this$static._position = P0_longLit;
        this$static.Low = P0_longLit;
        this$static.Range = -1;
        this$static._cacheSize = 1;
        this$static._cache = 0;
    }
    
    function $ShiftLow(this$static) {
        var temp, LowHi = lowBits_0(shru(this$static.Low, 32));
        if (LowHi != 0 || compare(this$static.Low, [4278190080, 0]) < 0) {
            this$static._position = add(this$static._position, fromInt(this$static._cacheSize));
            temp = this$static._cache;
            do {
                $write(this$static.Stream, temp + LowHi);
                temp = 255;
            } while (--this$static._cacheSize != 0);
            this$static._cache = lowBits_0(this$static.Low) >>> 24;
        }
        ++this$static._cacheSize;
        this$static.Low = shl(and(this$static.Low, [16777215, 0]), 8);
    }
    
    function GetPrice(Prob, symbol) {
        return ProbPrices[((Prob - symbol ^ -symbol) & 2047) >>> 2];
    }
    
    /** ce */
    /** ds */
    function decode(utf) {
        var i = 0, j = 0, x, y, z, l = utf.length, buf = [], charCodes = [];
        for (; i < l; ++i, ++j) {
            x = utf[i] & 255;
            if (!(x & 128)) {
                if (!x) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = x;
            } else if ((x & 224) == 192) {
                if (i + 1 >= l) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                y = utf[++i] & 255;
                if ((y & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = ((x & 31) << 6) | (y & 63);
            } else if ((x & 240) == 224) {
                if (i + 2 >= l) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                y = utf[++i] & 255;
                if ((y & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                z = utf[++i] & 255;
                if ((z & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = ((x & 15) << 12) | ((y & 63) << 6) | (z & 63);
            } else {
                /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                return utf;
            }
            if (j == 16383) {
                buf.push(String.fromCharCode.apply(String, charCodes));
                j = -1;
            }
        }
        if (j > 0) {
            charCodes.length = j;
            buf.push(String.fromCharCode.apply(String, charCodes));
        }
        return buf.join("");
    }
    /** de */
    /** cs */
    function encode(s) {
        var ch, chars = [], data, elen = 0, i, l = s.length;
        /// Be able to handle binary arrays and buffers.
        if (typeof s == "object") {
            return s;
        } else {
            $getChars(s, 0, l, chars, 0);
        }
        /// Add extra spaces in the array to break up the unicode symbols.
        for (i = 0; i < l; ++i) {
            ch = chars[i];
            if (ch >= 1 && ch <= 127) {
                ++elen;
            } else if (!ch || ch >= 128 && ch <= 2047) {
                elen += 2;
            } else {
                elen += 3;
            }
        }
        data = [];
        elen = 0;
        for (i = 0; i < l; ++i) {
            ch = chars[i];
            if (ch >= 1 && ch <= 127) {
                data[elen++] = ch << 24 >> 24;
            } else if (!ch || ch >= 128 && ch <= 2047) {
                data[elen++] = (192 | ch >> 6 & 31) << 24 >> 24;
                data[elen++] = (128 | ch & 63) << 24 >> 24;
            } else {
                data[elen++] = (224 | ch >> 12 & 15) << 24 >> 24;
                data[elen++] = (128 | ch >> 6 & 63) << 24 >> 24;
                data[elen++] = (128 | ch & 63) << 24 >> 24;
            }
        }
        return data;
    }
    /** ce */
    
    function toDouble(a) {
        return a[1] + a[0];
    }
    
    /** cs */
    function compress(str, mode, on_finish, on_progress) {
        var this$static = {},
            percent,
            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";
        
        if (typeof on_finish != "function") {
            cbn = on_finish;
            on_finish = on_progress = 0;
        }
        
        on_progress = on_progress || function(percent) {
            if (typeof cbn == "undefined")
                return;
            
            return update_progress(percent, cbn);
        };
        
        on_finish = on_finish || function(res, err) {
            if (typeof cbn == "undefined")
                return;
            
            return postMessage({
                action: action_compress,
                cbn: cbn,
                result: res,
                error: err
            });
        };

        if (sync) {
            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));
            while ($processChunk(this$static.c.chunker));
            return $toByteArray(this$static.c.output);
        }
        
        try {
            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));
            
            on_progress(0);
        } catch (err) {
            return on_finish(null, err);
        }
        
        function do_action() {
            try {
                var res, start = (new Date()).getTime();
                
                while ($processChunk(this$static.c.chunker)) {
                    percent = toDouble(this$static.c.chunker.inBytesProcessed) / toDouble(this$static.c.length_0);
                    /// If about 200 miliseconds have passed, update the progress.
                    if ((new Date()).getTime() - start > 200) {
                        on_progress(percent);
                        
                        wait(do_action, 0);
                        return 0;
                    }
                }
                
                on_progress(1);
                
                res = $toByteArray(this$static.c.output);
                
                /// delay so we don’t catch errors from the on_finish handler
                wait(on_finish.bind(null, res), 0);
            } catch (err) {
                on_finish(null, err);
            }
        }
        
        ///NOTE: We need to wait to make sure it is always async.
        wait(do_action, 0);
    }
    /** ce */
    /** ds */
    function decompress(byte_arr, on_finish, on_progress) {
        var this$static = {},
            percent,
            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
            has_progress,
            len,
            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";

        if (typeof on_finish != "function") {
            cbn = on_finish;
            on_finish = on_progress = 0;
        }
        
        on_progress = on_progress || function(percent) {
            if (typeof cbn == "undefined")
                return;
            
            return update_progress(has_progress ? percent : -1, cbn);
        };
        
        on_finish = on_finish || function(res, err) {
            if (typeof cbn == "undefined")
                return;
            
            return postMessage({
                action: action_decompress,
                cbn: cbn,
                result: res,
                error: err
            });
        };

        if (sync) {
            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
            while ($processChunk(this$static.d.chunker));
            return decode($toByteArray(this$static.d.output));
        }
        
        try {
            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
            
            len = toDouble(this$static.d.length_0);
            
            ///NOTE: If the data was created via a stream, it will not have a length value, and therefore we can't calculate the progress.
            has_progress = len > -1;
            
            on_progress(0);
        } catch (err) {
            return on_finish(null, err);
        }
        
        function do_action() {
            try {
                var res, i = 0, start = (new Date()).getTime();
                while ($processChunk(this$static.d.chunker)) {
                    if (++i % 1000 == 0 && (new Date()).getTime() - start > 200) {
                        if (has_progress) {
                            percent = toDouble(this$static.d.chunker.decoder.nowPos64) / len;
                            /// If about 200 miliseconds have passed, update the progress.
                            on_progress(percent);
                        }
                        
                        ///NOTE: This allows other code to run, like the browser to update.
                        wait(do_action, 0);
                        return 0;
                    }
                }
                
                on_progress(1);
                
                res = decode($toByteArray(this$static.d.output));
                
                /// delay so we don’t catch errors from the on_finish handler
                wait(on_finish.bind(null, res), 0);
            } catch (err) {
                on_finish(null, err);
            }
        }
        
        ///NOTE: We need to wait to make sure it is always async.
        wait(do_action, 0);
    }
    /** de */
    /** cs */
    var get_mode_obj = (function () {
        /// s is dictionarySize
        /// f is fb
        /// m is matchFinder
        ///NOTE: Because some values are always the same, they have been removed.
        /// lc is always 3
        /// lp is always 0
        /// pb is always 2
        var modes = [
            {s: 16, f:  64, m: 0},
            {s: 20, f:  64, m: 0},
            {s: 19, f:  64, m: 1},
            {s: 20, f:  64, m: 1},
            {s: 21, f: 128, m: 1},
            {s: 22, f: 128, m: 1},
            {s: 23, f: 128, m: 1},
            {s: 24, f: 255, m: 1},
            {s: 25, f: 255, m: 1}
        ];
        
        return function (mode) {
            return modes[mode - 1] || modes[6];
        };
    }());
    /** ce */
        
    return {
        /** xs */
        compress:   compress,
        decompress: decompress,
        /** xe */
        /// co:compress:   compress
        /// do:decompress: decompress
    };
}());

class Parsing {
  static MAX_COORDINATE_VALUE = 131072;
  static MAX_PARSE_VALUE = 2147483647;
  static parseInt(input, parseLimit = this.MAX_PARSE_VALUE, allowNaN = false) {
    return this._getValue(parseInt(input), parseLimit, allowNaN);
  }
  static parseFloat(input, parseLimit = this.MAX_PARSE_VALUE, allowNaN = false) {
    return this._getValue(parseFloat(input), parseLimit, allowNaN);
  }
  static parseEnum(enumObj, input) {
    const value = input.trim();
    const rawValue = parseInt(value);

    if (rawValue in enumObj) {
      return rawValue;
    }

    if (value in enumObj) {
      return enumObj[value];
    }

    throw new Error('Unknown enum value!');
  }
  static parseByte(input) {
    const value = parseInt(input);

    if (value < 0) {
      throw new Error('Value must be greater than 0!');
    }

    if (value > 255) {
      throw new Error('Value must be less than 255!');
    }

    return this._getValue(value);
  }
  static _getValue(value, parseLimit = this.MAX_PARSE_VALUE, allowNaN = false) {
    if (value < -parseLimit) {
      throw new Error('Value is too low!');
    }

    if (value > parseLimit) {
      throw new Error('Value is too high!');
    }

    if (!allowNaN && Number.isNaN(value)) {
      throw new Error('Not a number');
    }

    return value;
  }
}

class BeatmapColorDecoder {
  static handleLine(line, output) {
    const [key, ...values] = line.split(':');
    const rgba = values
      .join(':')
      .trim()
      .split(',')
      .map((c) => Parsing.parseByte(c));

    if (rgba.length !== 3 && rgba.length !== 4) {
      throw new Error(`Color specified in incorrect format (should be R,G,B or R,G,B,A): ${rgba.join(',')}`);
    }

    const color = new Color4(rgba[0], rgba[1], rgba[2], rgba[3]);

    this.addColor(color, output, key.trim());
  }
  static addColor(color, output, key) {
    if (key === 'SliderTrackOverride') {
      output.colors.sliderTrackColor = color;

      return;
    }

    if (key === 'SliderBorder') {
      output.colors.sliderBorderColor = color;

      return;
    }

    if (key.startsWith('Combo')) {
      output.colors.comboColors.push(color);
    }
  }
}

class BeatmapDifficultyDecoder {
  static handleLine(line, beatmap) {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
      case 'CircleSize':
        beatmap.difficulty.circleSize = Parsing.parseFloat(value);
        break;
      case 'HPDrainRate':
        beatmap.difficulty.drainRate = Parsing.parseFloat(value);
        break;
      case 'OverallDifficulty':
        beatmap.difficulty.overallDifficulty = Parsing.parseFloat(value);
        break;
      case 'ApproachRate':
        beatmap.difficulty.approachRate = Parsing.parseFloat(value);
        break;
      case 'SliderMultiplier':
        beatmap.difficulty.sliderMultiplier = Parsing.parseFloat(value);
        break;
      case 'SliderTickRate':
        beatmap.difficulty.sliderTickRate = Parsing.parseFloat(value);
    }
  }
}

class BeatmapEditorDecoder {
  static handleLine(line, beatmap) {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
      case 'Bookmarks':
        beatmap.editor.bookmarks = value.split(',').map((v) => +v);
        break;
      case 'DistanceSpacing':
        beatmap.editor.distanceSpacing = Math.max(0, Parsing.parseFloat(value));
        break;
      case 'BeatDivisor':
        beatmap.editor.beatDivisor = Parsing.parseInt(value);
        break;
      case 'GridSize':
        beatmap.editor.gridSize = Parsing.parseInt(value);
        break;
      case 'TimelineZoom':
        beatmap.editor.timelineZoom = Math.max(0, Parsing.parseFloat(value));
    }
  }
}

class StoryboardEventDecoder {
  static handleLine(line, storyboard) {
    const depth = this._getDepth(line);

    if (depth > 0) {
      line = line.substring(depth);
    }

    if (depth < 2 && this._storyboardSprite) {
      this._timelineGroup = this._storyboardSprite.timelineGroup;
    }

    switch (depth) {
      case 0: return this._handleElement(line, storyboard);
      case 1: return this._handleCompoundOrCommand(line);
      case 2: return this._handleCommand(line);
    }
  }
  static _handleElement(line, storyboard) {
    const data = line.split(',');
    const eventType = this.parseEventType(data[0]);

    if (this._storyboardSprite?.hasCommands) {
      this._storyboardSprite.updateCommands();
      this._storyboardSprite.adjustTimesToCommands();
      this._storyboardSprite.resetValuesToCommands();
    }

    switch (eventType) {
      case EventType.Video: {
        const layer = storyboard.getLayerByType(LayerType.Video);
        const offset = Parsing.parseInt(data[1]);
        const path = data[2].replace(/"/g, '');

        layer.elements.push(new StoryboardVideo(path, offset));

        return;
      }
      case EventType.Sprite: {
        const layer = storyboard.getLayerByType(this.parseLayerType(data[1]));
        const origin = this.parseOrigin(data[2]);
        const anchor = this.convertOrigin(origin);
        const path = data[3].replace(/"/g, '');
        const x = Parsing.parseFloat(data[4], Parsing.MAX_COORDINATE_VALUE);
        const y = Parsing.parseFloat(data[5], Parsing.MAX_COORDINATE_VALUE);

        this._storyboardSprite = new StoryboardSprite(path, origin, anchor, new Vector2(x, y));
        layer.elements.push(this._storyboardSprite);

        return;
      }
      case EventType.Animation: {
        const layer = storyboard.getLayerByType(this.parseLayerType(data[1]));
        const origin = this.parseOrigin(data[2]);
        const anchor = this.convertOrigin(origin);
        const path = data[3].replace(/"/g, '');
        const x = Parsing.parseFloat(data[4], Parsing.MAX_COORDINATE_VALUE);
        const y = Parsing.parseFloat(data[5], Parsing.MAX_COORDINATE_VALUE);
        const frameCount = Parsing.parseInt(data[6]);
        let frameDelay = Parsing.parseFloat(data[7]);

        if (storyboard.fileFormat < 6) {
          frameDelay = Math.round(0.015 * frameDelay) * 1.186 * (1000 / 60);
        }

        const loopType = this.parseLoopType(data[8]);

        this._storyboardSprite = new StoryboardAnimation(path, origin, anchor, new Vector2(x, y), frameCount, frameDelay, loopType);
        layer.elements.push(this._storyboardSprite);

        return;
      }
      case EventType.Sample: {
        const time = Parsing.parseFloat(data[1]);
        const layer = storyboard.getLayerByType(this.parseLayerType(data[2]));
        const path = data[3].replace(/"/g, '');
        const volume = data.length > 4 ? Parsing.parseInt(data[4]) : 100;
        const sample = new StoryboardSample(path, time, volume);

        layer.elements.push(sample);
      }
    }
  }
  static _handleCompoundOrCommand(line) {
    const data = line.split(',');
    const compoundType = data[0];

    switch (compoundType) {
      case CompoundType.Trigger: {
        this._timelineGroup = this._storyboardSprite?.addTrigger(data[1], data.length > 2 ? Parsing.parseFloat(data[2]) : -Infinity, data.length > 3 ? Parsing.parseFloat(data[3]) : Infinity, data.length > 4 ? Parsing.parseInt(data[4]) : 0);

        return;
      }
      case CompoundType.Loop: {
        this._timelineGroup = this._storyboardSprite?.addLoop(Parsing.parseFloat(data[1]), Math.max(0, Parsing.parseInt(data[2]) - 1));

        return;
      }

      default: this._handleCommand(line);
    }
  }
  static _handleCommand(line) {
    const data = line.split(',');
    const type = data[0];
    const easing = Parsing.parseInt(data[1]);
    const startTime = Parsing.parseInt(data[2]);
    const endTime = Parsing.parseInt(data[3] || data[2]);

    switch (type) {
      case CommandType.Fade: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.alpha.add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }
      case CommandType.Scale: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.scale.add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }
      case CommandType.VectorScale: {
        const startX = Parsing.parseFloat(data[4]);
        const startY = Parsing.parseFloat(data[5]);
        const endX = data.length > 6 ? Parsing.parseFloat(data[6]) : startX;
        const endY = data.length > 7 ? Parsing.parseFloat(data[7]) : startY;

        this._timelineGroup?.vectorScale.add(type, easing, startTime, endTime, new Vector2(startX, startY), new Vector2(endX, endY));

        return;
      }
      case CommandType.Rotation: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.rotation.add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }
      case CommandType.Movement: {
        const startX = Parsing.parseFloat(data[4]);
        const startY = Parsing.parseFloat(data[5]);
        const endX = data.length > 6 ? Parsing.parseFloat(data[6]) : startX;
        const endY = data.length > 7 ? Parsing.parseFloat(data[7]) : startY;

        this._timelineGroup?.x
          .add(CommandType.MovementX, easing, startTime, endTime, startX, endX);

        this._timelineGroup?.y
          .add(CommandType.MovementY, easing, startTime, endTime, startY, endY);

        return;
      }
      case CommandType.MovementX: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.x
          .add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }
      case CommandType.MovementY: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.y
          .add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }
      case CommandType.Color: {
        const startRed = Parsing.parseFloat(data[4]);
        const startGreen = Parsing.parseFloat(data[5]);
        const startBlue = Parsing.parseFloat(data[6]);
        const endRed = data.length > 7 ? Parsing.parseFloat(data[7]) : startRed;
        const endGreen = data.length > 8 ? Parsing.parseFloat(data[8]) : startGreen;
        const endBlue = data.length > 9 ? Parsing.parseFloat(data[9]) : startBlue;

        this._timelineGroup?.color.add(type, easing, startTime, endTime, new Color4(startRed, startGreen, startBlue, 1), new Color4(endRed, endGreen, endBlue, 1));

        return;
      }
      case CommandType.Parameter: {
        return this._handleParameterCommand(data);
      }
    }

    throw new Error(`Unknown command type: ${type}`);
  }
  static _handleParameterCommand(data) {
    const type = CommandType.Parameter;
    const easing = Parsing.parseInt(data[1]);
    const startTime = Parsing.parseInt(data[2]);
    const endTime = Parsing.parseInt(data[3] || data[2]);
    const parameter = data[4];

    switch (parameter) {
      case ParameterType.BlendingMode: {
        const startValue = BlendingParameters.Additive;
        const endValue = startTime === endTime
          ? BlendingParameters.Additive
          : BlendingParameters.Inherit;

        this._timelineGroup?.blendingParameters
          .add(type, easing, startTime, endTime, startValue, endValue, parameter);

        return;
      }
      case ParameterType.HorizontalFlip:
        this._timelineGroup?.flipH
          .add(type, easing, startTime, endTime, true, startTime === endTime, parameter);

        return;
      case ParameterType.VerticalFlip: {
        this._timelineGroup?.flipV
          .add(type, easing, startTime, endTime, true, startTime === endTime, parameter);

        return;
      }
    }

    throw new Error(`Unknown parameter type: ${parameter}`);
  }
  static parseEventType(input) {
    if (input.startsWith(' ') || input.startsWith('_')) {
      return EventType.StoryboardCommand;
    }

    try {
      return Parsing.parseEnum(EventType, input);
    }
    catch {
      throw new Error(`Unknown event type: ${input}`);
    }
  }
  static parseLayerType(input) {
    try {
      return Parsing.parseEnum(LayerType, input);
    }
    catch {
      throw new Error(`Unknown layer type: ${input}`);
    }
  }
  static parseOrigin(input) {
    try {
      return Parsing.parseEnum(Origins, input);
    }
    catch {
      return Origins.TopLeft;
    }
  }
  static convertOrigin(origin) {
    switch (origin) {
      case Origins.TopLeft: return Anchor.TopLeft;
      case Origins.TopCentre: return Anchor.TopCentre;
      case Origins.TopRight: return Anchor.TopRight;
      case Origins.CentreLeft: return Anchor.CentreLeft;
      case Origins.Centre: return Anchor.Centre;
      case Origins.CentreRight: return Anchor.CentreRight;
      case Origins.BottomLeft: return Anchor.BottomLeft;
      case Origins.BottomCentre: return Anchor.BottomCentre;
      case Origins.BottomRight: return Anchor.BottomRight;
    }

    return Anchor.TopLeft;
  }
  static parseLoopType(input) {
    try {
      return Parsing.parseEnum(LoopType, input);
    }
    catch {
      return LoopType.LoopForever;
    }
  }
  static _getDepth(line) {
    let depth = 0;

    for (const char of line) {
      if (char !== ' ' && char !== '_') {
        break;
      }

      ++depth;
    }

    return depth;
  }
}

class BeatmapEventDecoder {
  static handleLine(line, beatmap, sbLines, offset) {
    const data = line.split(',').map((v, i) => i ? v.trim() : v);
    const eventType = StoryboardEventDecoder.parseEventType(data[0]);

    switch (eventType) {
      case EventType.Background:
        beatmap.events.backgroundPath = data[2].replace(/"/g, '');
        break;
      case EventType.Break: {
        const start = Parsing.parseFloat(data[1]) + offset;
        const end = Math.max(start, Parsing.parseFloat(data[2]) + offset);
        const breakEvent = new BeatmapBreakEvent(start, end);

        if (!beatmap.events.breaks) {
          beatmap.events.breaks = [];
        }

        beatmap.events.breaks.push(breakEvent);
        break;
      }
      case EventType.Video:
      case EventType.Sample:
      case EventType.Sprite:
      case EventType.Animation:
      case EventType.StoryboardCommand:
        if (sbLines) {
          sbLines.push(line);
        }
    }
  }
}

class BeatmapGeneralDecoder {
  static handleLine(line, beatmap, offset) {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
      case 'AudioFilename':
        beatmap.general.audioFilename = value;
        break;
      case 'AudioHash':
        beatmap.general.audioHash = value;
        break;
      case 'OverlayPosition':
        beatmap.general.overlayPosition = value;
        break;
      case 'SkinPreference':
        beatmap.general.skinPreference = value;
        break;
      case 'AudioLeadIn':
        beatmap.general.audioLeadIn = Parsing.parseInt(value);
        break;
      case 'PreviewTime':
        beatmap.general.previewTime = Parsing.parseInt(value) + offset;
        break;
      case 'Countdown':
        beatmap.general.countdown = Parsing.parseInt(value);
        break;
      case 'StackLeniency':
        beatmap.general.stackLeniency = Parsing.parseFloat(value);
        break;
      case 'Mode':
        beatmap.originalMode = Parsing.parseInt(value);
        break;
      case 'CountdownOffset':
        beatmap.general.countdownOffset = Parsing.parseInt(value);
        break;
      case 'SampleSet':
        beatmap.general.sampleSet = SampleSet[value];
        break;
      case 'LetterboxInBreaks':
        beatmap.general.letterboxInBreaks = value === '1';
        break;
      case 'StoryFireInFront':
        beatmap.general.storyFireInFront = value === '1';
        break;
      case 'UseSkinSprites':
        beatmap.general.useSkinSprites = value === '1';
        break;
      case 'AlwaysShowPlayfield':
        beatmap.general.alwaysShowPlayfield = value === '1';
        break;
      case 'EpilepsyWarning':
        beatmap.general.epilepsyWarning = value === '1';
        break;
      case 'SpecialStyle':
        beatmap.general.specialStyle = value === '1';
        break;
      case 'WidescreenStoryboard':
        beatmap.general.widescreenStoryboard = value === '1';
        break;
      case 'SamplesMatchPlaybackRate':
        beatmap.general.samplesMatchPlaybackRate = value === '1';
    }
  }
}

class HittableObject extends HitObject {
  isNewCombo = false;
  comboOffset = 0;
  clone() {
    const cloned = super.clone();

    cloned.isNewCombo = this.isNewCombo;
    cloned.comboOffset = this.comboOffset;

    return cloned;
  }
}

class HoldableObject extends HitObject {
  endTime = 0;
  nodeSamples = [];
  get duration() {
    return this.endTime - this.startTime;
  }
  clone() {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.nestedHitObjects = this.nestedHitObjects.map((h) => h.clone());
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));

    return cloned;
  }
}

class SlidableObject extends HitObject {
  static BASE_SCORING_DISTANCE = 100;
  get duration() {
    return this.spans * this.spanDuration;
  }
  get endTime() {
    return this.startTime + this.duration;
  }
  get spans() {
    return this.repeats + 1;
  }
  set spans(value) {
    this.repeats = value - 1;
  }
  get spanDuration() {
    return this.distance / this.velocity;
  }
  get distance() {
    return this.path.distance;
  }
  set distance(value) {
    this.path.distance = value;
  }
  repeats = 0;
  velocity = 1;
  path = new SliderPath();
  legacyLastTickOffset = 36;
  nodeSamples = [];
  isNewCombo = false;
  comboOffset = 0;
  applyDefaultsToSelf(controlPoints, difficulty) {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);
    const scoringDistance = SlidableObject.BASE_SCORING_DISTANCE
            * difficulty.sliderMultiplier * difficultyPoint.sliderVelocity;

    this.velocity = scoringDistance / timingPoint.beatLength;
  }
  clone() {
    const cloned = super.clone();

    cloned.legacyLastTickOffset = this.legacyLastTickOffset;
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();
    cloned.isNewCombo = this.isNewCombo;
    cloned.comboOffset = this.comboOffset;

    return cloned;
  }
}

class SpinnableObject extends HitObject {
  endTime = 0;
  isNewCombo = false;
  comboOffset = 0;
  get duration() {
    return this.endTime - this.startTime;
  }
  clone() {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.isNewCombo = this.isNewCombo;
    cloned.comboOffset = this.comboOffset;

    return cloned;
  }
}

let FileFormat;

(function(FileFormat) {
  FileFormat['Beatmap'] = '.osu';
  FileFormat['Storyboard'] = '.osb';
  FileFormat['Replay'] = '.osr';
})(FileFormat || (FileFormat = {}));

let LineType;

(function(LineType) {
  LineType[LineType['FileFormat'] = 0] = 'FileFormat';
  LineType[LineType['Section'] = 1] = 'Section';
  LineType[LineType['Empty'] = 2] = 'Empty';
  LineType[LineType['Data'] = 3] = 'Data';
  LineType[LineType['Break'] = 4] = 'Break';
})(LineType || (LineType = {}));

let Section;

(function(Section) {
  Section['General'] = 'General';
  Section['Editor'] = 'Editor';
  Section['Metadata'] = 'Metadata';
  Section['Difficulty'] = 'Difficulty';
  Section['Events'] = 'Events';
  Section['TimingPoints'] = 'TimingPoints';
  Section['Colours'] = 'Colours';
  Section['HitObjects'] = 'HitObjects';
  Section['Variables'] = 'Variables';
  Section['Fonts'] = 'Fonts';
  Section['CatchTheBeat'] = 'CatchTheBeat';
  Section['Mania'] = 'Mania';
})(Section || (Section = {}));

const browserFSOperation = function() {
  throw new Error('Filesystem operations are not available in a browser environment');
};

class BeatmapColorEncoder {
  static encodeColors(beatmap) {
    const colors = beatmap.colors;

    if (Object.keys(colors).length === 1 && !colors.comboColors.length) {
      return '';
    }

    const encoded = ['[Colours]'];

    colors.comboColors.forEach((color, i) => {
      encoded.push(`Combo${i + 1}:${color}`);
    });

    if (colors.sliderTrackColor) {
      encoded.push(`SliderTrackOverride:${colors.sliderTrackColor}`);
    }

    if (colors.sliderBorderColor) {
      encoded.push(`SliderBorder:${colors.sliderBorderColor}`);
    }

    return encoded.join('\n');
  }
}

class BeatmapDifficultyEncoder {
  static encodeDifficultySection(beatmap) {
    const encoded = ['[Difficulty]'];
    const difficulty = beatmap.difficulty;

    encoded.push(`HPDrainRate:${difficulty.drainRate}`);
    encoded.push(`CircleSize:${difficulty.circleSize}`);
    encoded.push(`OverallDifficulty:${difficulty.overallDifficulty}`);
    encoded.push(`ApproachRate:${difficulty.approachRate}`);
    encoded.push(`SliderMultiplier:${difficulty.sliderMultiplier}`);
    encoded.push(`SliderTickRate:${difficulty.sliderTickRate}`);

    return encoded.join('\n');
  }
}

class BeatmapEditorEncoder {
  static encodeEditorSection(beatmap) {
    const encoded = ['[Editor]'];
    const editor = beatmap.editor;

    encoded.push(`Bookmarks:${editor.bookmarks.join(',')}`);
    encoded.push(`DistanceSpacing:${editor.distanceSpacing}`);
    encoded.push(`BeatDivisor:${editor.beatDivisor}`);
    encoded.push(`GridSize:${editor.gridSize}`);
    encoded.push(`TimelineZoom:${editor.timelineZoom}`);

    return encoded.join('\n');
  }
}

class StoryboardEventEncoder {
  static encodeEventSection(storyboard) {
    const encoded = [];

    encoded.push('[Events]');
    encoded.push('//Background and Video events');
    encoded.push(this.encodeVideos(storyboard));
    encoded.push(this.encodeStoryboard(storyboard));

    return encoded.join('\n');
  }
  static encodeVideos(storyboard) {
    const encoded = [];
    const video = storyboard.getLayerByType(LayerType.Video);

    if (video.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(video));
    }

    return encoded.join('\n');
  }
  static encodeStoryboard(storyboard) {
    const encoded = [];

    encoded.push('//Storyboard Layer 0 (Background)');

    const background = storyboard.getLayerByType(LayerType.Background);

    if (background.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(background));
    }

    encoded.push('//Storyboard Layer 1 (Fail)');

    const fail = storyboard.getLayerByType(LayerType.Fail);

    if (fail.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(fail));
    }

    encoded.push('//Storyboard Layer 2 (Pass)');

    const pass = storyboard.getLayerByType(LayerType.Pass);

    if (pass.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(pass));
    }

    encoded.push('//Storyboard Layer 3 (Foreground)');

    const foreground = storyboard.getLayerByType(LayerType.Foreground);

    if (foreground.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(foreground));
    }

    encoded.push('//Storyboard Layer 4 (Overlay)');

    const overlay = storyboard.getLayerByType(LayerType.Overlay);

    if (overlay.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(overlay));
    }

    return encoded.join('\n');
  }
  static encodeStoryboardLayer(layer) {
    const encoded = [];

    layer.elements.forEach((element) => {
      encoded.push(this.encodeStoryboardElement(element, layer.name));

      const elementWithCommands = element;

      elementWithCommands?.loops?.forEach((loop) => {
        if (loop.commands.length > 0) {
          encoded.push(this.encodeCompound(loop));
          encoded.push(this.encodeTimelineGroup(loop, 2));
        }
      });

      if (elementWithCommands?.timelineGroup?.commands.length > 0) {
        encoded.push(this.encodeTimelineGroup(elementWithCommands.timelineGroup));
      }

      elementWithCommands?.triggers?.forEach((trigger) => {
        if (trigger.commands.length > 0) {
          encoded.push(this.encodeCompound(trigger));
          encoded.push(this.encodeTimelineGroup(trigger, 2));
        }
      });
    });

    return encoded.join('\n');
  }
  static encodeStoryboardElement(element, layer) {
    if (element instanceof StoryboardAnimation) {
      return [
        'Animation',
        layer,
        Origins[element.origin],
        `"${element.filePath}"`,
        element.startPosition,
        element.frameCount,
        element.frameDelay,
        element.loopType,
      ].join(',');
    }

    if (element instanceof StoryboardSprite) {
      return [
        'Sprite',
        layer,
        Origins[element.origin],
        `"${element.filePath}"`,
        element.startPosition,
      ].join(',');
    }

    if (element instanceof StoryboardSample) {
      return [
        'Sample',
        element.startTime,
        layer,
        `"${element.filePath}"`,
        element.volume,
      ].join(',');
    }

    if (element instanceof StoryboardVideo) {
      return [
        'Video',
        element.startTime,
        element.filePath,
        '0,0',
      ].join(',');
    }

    return '';
  }
  static encodeCompound(compound, depth = 1) {
    const indentation = ''.padStart(depth, ' ');

    if (compound instanceof CommandLoop) {
      return indentation + [
        compound.type,
        compound.loopStartTime,
        compound.totalIterations,
      ].join(',');
    }

    if (compound instanceof CommandTrigger) {
      return indentation + [
        compound.type,
        compound.triggerName,
        compound.triggerStartTime,
        compound.triggerEndTime,
        compound.groupNumber,
      ].join(',');
    }

    return '';
  }
  static encodeTimelineGroup(timelineGroup, depth = 1) {
    const indentation = ''.padStart(depth, ' ');
    const encoded = [];
    const commands = timelineGroup.commands;
    let shouldSkip = false;

    for (let i = 0; i < commands.length; ++i) {
      if (shouldSkip) {
        shouldSkip = false;
        continue;
      }

      if (i < commands.length - 1) {
        const current = commands[i];
        const next = commands[i + 1];
        const currentMoveX = current.type === CommandType.MovementX;
        const nextMoveY = next.type === CommandType.MovementY;
        const sameEasing = current.easing === next.easing;
        const sameStartTime = current.startTime === next.startTime;
        const sameEndTime = current.endTime === next.endTime;
        const sameCommand = sameEasing && sameStartTime && sameEndTime;

        if (currentMoveX && nextMoveY && sameCommand) {
          encoded.push(indentation + this.encodeMoveCommand(current, next));
          shouldSkip = true;
          continue;
        }
      }

      encoded.push(indentation + this.encodeCommand(commands[i]));
    }

    return encoded.join('\n');
  }
  static encodeMoveCommand(moveX, moveY) {
    const encoded = [
      CommandType.Movement,
      moveX.easing,
      moveX.startTime,
      moveX.startTime !== moveX.endTime ? moveX.endTime : '',
      moveX.startValue,
      moveY.startValue,
    ];
    const equalX = moveX.startValue === moveX.endValue;
    const equalY = moveY.startValue === moveY.endValue;

    if (!equalX || !equalY) {
      encoded.push(`${moveX.endValue},${moveY.endValue}`);
    }

    return encoded.join(',');
  }
  static encodeCommand(command) {
    const encoded = [
      command.type,
      command.easing,
      command.startTime,
      command.startTime !== command.endTime ? command.endTime : '',
      this._encodeCommandParams(command),
    ];

    return encoded.join(',');
  }
  static _encodeCommandParams(command) {
    if (command.type === CommandType.Parameter) {
      return command.parameter;
    }

    if (command.type === CommandType.Color) {
      const toRGB = (c) => `${c.red},${c.green},${c.blue}`;
      const colorCommand = command;
      const start = colorCommand.startValue;
      const end = colorCommand.endValue;

      return this._areValuesEqual(command)
        ? toRGB(start) : toRGB(start) + ',' + toRGB(end);
    }

    return this._areValuesEqual(command)
      ? `${command.startValue}`
      : `${command.startValue},${command.endValue}`;
  }
  static _areValuesEqual(command) {
    if (command.type === CommandType.VectorScale) {
      const vectorCommand = command;

      return vectorCommand.startValue.equals(vectorCommand.endValue);
    }

    if (command.type === CommandType.Color) {
      const colorCommand = command;

      return colorCommand.startValue.equals(colorCommand.endValue);
    }

    return command.startValue === command.endValue;
  }
}

class BeatmapEventEncoder {
  static encodeEventSection(beatmap) {
    const encoded = [];
    const events = beatmap.events;

    encoded.push('[Events]');
    encoded.push('//Background and Video events');

    if (events.backgroundPath) {
      encoded.push(`0,0,"${events.backgroundPath}",0,0`);
    }

    if (events.storyboard) {
      encoded.push(StoryboardEventEncoder.encodeVideos(events.storyboard));
    }

    encoded.push('//Break Periods');

    if (events.breaks && events.breaks.length > 0) {
      events.breaks.forEach((b) => {
        encoded.push(`${EventType[EventType.Break]},${b.startTime},${b.endTime}`);
      });
    }

    if (events.storyboard) {
      encoded.push(StoryboardEventEncoder.encodeStoryboard(events.storyboard));
    }

    return encoded.join('\n');
  }
}

class BeatmapGeneralEncoder {
  static encodeGeneralSection(beatmap) {
    const encoded = ['[General]'];
    const general = beatmap.general;

    encoded.push(`AudioFilename:${general.audioFilename}`);
    encoded.push(`AudioLeadIn:${general.audioLeadIn}`);

    if (general.audioHash) {
      encoded.push(`AudioHash:${general.audioHash}`);
    }

    encoded.push(`PreviewTime:${general.previewTime}`);
    encoded.push(`Countdown:${general.countdown}`);
    encoded.push(`SampleSet:${SampleSet[general.sampleSet]}`);
    encoded.push(`StackLeniency:${general.stackLeniency}`);
    encoded.push(`Mode:${beatmap.mode}`);
    encoded.push(`LetterboxInBreaks:${+general.letterboxInBreaks}`);

    if (general.storyFireInFront) {
      encoded.push(`StoryFireInFront:${+general.storyFireInFront}`);
    }

    encoded.push(`UseSkinSprites:${+general.useSkinSprites}`);

    if (general.alwaysShowPlayfield) {
      encoded.push(`AlwaysShowPlayfield:${+general.alwaysShowPlayfield}`);
    }

    encoded.push(`OverlayPosition:${general.overlayPosition}`);
    encoded.push(`SkinPreference:${general.skinPreference}`);
    encoded.push(`EpilepsyWarning:${+general.epilepsyWarning}`);
    encoded.push(`CountdownOffset:${general.countdownOffset}`);
    encoded.push(`SpecialStyle:${+general.specialStyle}`);
    encoded.push(`WidescreenStoryboard:${+general.widescreenStoryboard}`);
    encoded.push(`SamplesMatchPlaybackRate:${+general.samplesMatchPlaybackRate}`);

    return encoded.join('\n');
  }
}

class BeatmapHitObjectEncoder {
  static encodeHitObjects(beatmap) {
    const encoded = ['[HitObjects]'];

    beatmap.difficulty;

    const hitObjects = beatmap.hitObjects;

    hitObjects.forEach((hitObject) => {
      const general = [];
      const positionObj = hitObject;
      const position = positionObj.startPosition;
      const startPosition = new Vector2(position ? position.x : 256, position ? position.y : 192);

      general.push(startPosition.toString());
      general.push(hitObject.startTime.toString());
      general.push(hitObject.hitType.toString());
      general.push(hitObject.hitSound.toString());

      const extras = [];

      if (hitObject.hitType & HitType.Slider) {
        const slider = hitObject;

        extras.push(this.encodePathData(slider, startPosition));
      }
      else if (hitObject.hitType & HitType.Spinner) {
        const spinner = hitObject;

        extras.push(this.encodeEndTimeData(spinner));
      }
      else if (hitObject.hitType & HitType.Hold) {
        const hold = hitObject;

        extras.push(this.encodeEndTimeData(hold));
      }

      const set = [];
      const normal = hitObject.samples.find((s) => {
        return s.hitSound === HitSound[HitSound.Normal];
      });
      const addition = hitObject.samples.find((s) => {
        return s.hitSound !== HitSound[HitSound.Normal];
      });
      let normalSet = SampleSet.None;
      let additionSet = SampleSet.None;

      if (normal) {
        normalSet = SampleSet[normal.sampleSet];
      }

      if (addition) {
        additionSet = SampleSet[addition.sampleSet];
      }

      set[0] = normalSet.toString();
      set[1] = additionSet.toString();
      set[2] = hitObject.samples[0].customIndex.toString();
      set[3] = hitObject.samples[0].volume.toString();
      set[4] = hitObject.samples[0].filename;
      extras.push(set.join(':'));

      const generalLine = general.join(',');
      const extrasLine = hitObject.hitType & HitType.Hold
        ? extras.join(':')
        : extras.join(',');

      encoded.push([generalLine, extrasLine].join(','));
    });

    return encoded.join('\n');
  }
  static encodePathData(slider, offset) {
    const path = [];
    let lastType;

    slider.path.controlPoints.forEach((point, i) => {
      if (point.type !== null) {
        let needsExplicitSegment = point.type !== lastType
                    || point.type === PathType.PerfectCurve;

        if (i > 1) {
          const p1 = offset.add(slider.path.controlPoints[i - 1].position);
          const p2 = offset.add(slider.path.controlPoints[i - 2].position);

          if (~~p1.x === ~~p2.x && ~~p1.y === ~~p2.y) {
            needsExplicitSegment = true;
          }
        }

        if (needsExplicitSegment) {
          path.push(slider.path.curveType);
          lastType = point.type;
        }
        else {
          path.push(`${offset.x + point.position.x}:${offset.y + point.position.y}`);
        }
      }

      if (i !== 0) {
        path.push(`${offset.x + point.position.x}:${offset.y + point.position.y}`);
      }
    });

    const data = [];

    data.push(path.join('|'));
    data.push((slider.repeats + 1).toString());
    data.push(slider.distance.toString());

    const adds = [];
    const sets = [];

    slider.nodeSamples.forEach((node, nodeIndex) => {
      adds[nodeIndex] = HitSound.None;
      sets[nodeIndex] = [SampleSet.None, SampleSet.None];
      node.forEach((sample, sampleIndex) => {
        if (sampleIndex === 0) {
          sets[nodeIndex][0] = SampleSet[sample.sampleSet];
        }
        else {
          adds[nodeIndex] |= HitSound[sample.hitSound];
          sets[nodeIndex][1] = SampleSet[sample.sampleSet];
        }
      });
    });

    data.push(adds.join('|'));
    data.push(sets.map((set) => set.join(':')).join('|'));

    return data.join(',');
  }
  static encodeEndTimeData(hitObject) {
    return hitObject.endTime.toString();
  }
}

class BeatmapMetadataEncoder {
  static encodeMetadataSection(beatmap) {
    const encoded = ['[Metadata]'];
    const metadata = beatmap.metadata;

    encoded.push(`Title:${metadata.title}`);
    encoded.push(`TitleUnicode:${metadata.titleUnicode}`);
    encoded.push(`Artist:${metadata.artist}`);
    encoded.push(`ArtistUnicode:${metadata.artistUnicode}`);
    encoded.push(`Creator:${metadata.creator}`);
    encoded.push(`Version:${metadata.version}`);
    encoded.push(`Source:${metadata.source}`);
    encoded.push(`Tags:${metadata.tags.join(' ')}`);
    encoded.push(`BeatmapID:${metadata.beatmapId}`);
    encoded.push(`BeatmapSetID:${metadata.beatmapSetId}`);

    return encoded.join('\n');
  }
}

class BeatmapTimingPointEncoder {
  static lastDifficultyPoint = null;
  static lastEffectPoint = null;
  static lastSamplePoint = null;
  static encodeControlPoints(beatmap) {
    const encoded = ['[TimingPoints]'];

    beatmap.controlPoints.groups.forEach((group) => {
      const points = group.controlPoints;
      const timing = points.find((c) => c.beatLength);

      if (timing) {
        encoded.push(this.encodeGroup(group, true));
      }

      encoded.push(this.encodeGroup(group));
    });

    return encoded.join('\n');
  }
  static encodeGroup(group, useTiming = false) {
    const { difficultyPoint, effectPoint, samplePoint, timingPoint } = this.updateActualPoints(group);
    const startTime = group.startTime;
    let beatLength = -100;

    if (difficultyPoint !== null) {
      beatLength /= difficultyPoint.sliderVelocity;
    }

    let sampleSet = SampleSet.None;
    let customIndex = 0;
    let volume = 100;

    if (samplePoint !== null) {
      sampleSet = SampleSet[samplePoint.sampleSet];
      customIndex = samplePoint.customIndex;
      volume = samplePoint.volume;
    }

    let effects = EffectType.None;

    if (effectPoint !== null) {
      const kiai = effectPoint.kiai
        ? EffectType.Kiai
        : EffectType.None;
      const omitFirstBarLine = effectPoint.omitFirstBarLine
        ? EffectType.OmitFirstBarLine
        : EffectType.None;

      effects |= kiai | omitFirstBarLine;
    }

    let timeSignature = TimeSignature.SimpleQuadruple;
    let uninherited = 0;

    if (useTiming && timingPoint !== null) {
      beatLength = timingPoint.beatLength;
      timeSignature = timingPoint.timeSignature;
      uninherited = 1;
    }

    return [
      startTime,
      beatLength,
      timeSignature,
      sampleSet,
      customIndex,
      volume,
      uninherited,
      effects,
    ].join(',');
  }
  static updateActualPoints(group) {
    let timingPoint = null;

    group.controlPoints.forEach((point) => {
      if (point.pointType === ControlPointType.DifficultyPoint
                && !point.isRedundant(this.lastDifficultyPoint)) {
        this.lastDifficultyPoint = point;
      }

      if (point.pointType === ControlPointType.EffectPoint
                && !point.isRedundant(this.lastEffectPoint)) {
        this.lastEffectPoint = point;
      }

      if (point.pointType === ControlPointType.SamplePoint
                && !point.isRedundant(this.lastSamplePoint)) {
        this.lastSamplePoint = point;
      }

      if (point.pointType === ControlPointType.TimingPoint) {
        timingPoint = point;
      }
    });

    return {
      timingPoint,
      difficultyPoint: this.lastDifficultyPoint,
      effectPoint: this.lastEffectPoint,
      samplePoint: this.lastSamplePoint,
    };
  }
}

const textDecoder = new TextDecoder();

function stringifyBuffer(data) {
  if (typeof data === 'string') {
    return data;
  }

  return textDecoder.decode(data);
}

class BeatmapEncoder {
  static FIRST_LAZER_VERSION = 128;
  async encodeToPath(path, beatmap) {
    if (!path.endsWith(FileFormat.Beatmap)) {
      path += FileFormat.Beatmap;
    }

    try {
      await browserFSOperation(browserFSOperation(path), { recursive: true });
      await browserFSOperation(path, await this.encodeToString(beatmap));
    }
    catch (err) {
      const reason = err.message || err;
      throw new Error(`Failed to encode a beatmap: ${reason}`);
    }
  }
  encodeToString(beatmap) {
    if (!beatmap?.fileFormat) {
      return '';
    }

    const fileFormat = beatmap.fileFormat ?? BeatmapEncoder.FIRST_LAZER_VERSION;
    const encoded = [
      `osu file format v${fileFormat}`,
      BeatmapGeneralEncoder.encodeGeneralSection(beatmap),
      BeatmapEditorEncoder.encodeEditorSection(beatmap),
      BeatmapMetadataEncoder.encodeMetadataSection(beatmap),
      BeatmapDifficultyEncoder.encodeDifficultySection(beatmap),
      BeatmapEventEncoder.encodeEventSection(beatmap),
      BeatmapTimingPointEncoder.encodeControlPoints(beatmap),
      BeatmapColorEncoder.encodeColors(beatmap),
      BeatmapHitObjectEncoder.encodeHitObjects(beatmap),
    ];

    return encoded.join('\n\n') + '\n';
  }
}

class BeatmapHitObjectDecoder {
  static _forceNewCombo = false;
  static _extraComboOffset = 0;
  static handleLine(line, beatmap, offset) {
    const data = line.split(',').map((v) => v.trim());
    const hitType = Parsing.parseInt(data[3]);
    const hitObject = this.createHitObject(hitType);

    hitObject.startX = Parsing.parseInt(data[0], Parsing.MAX_COORDINATE_VALUE);
    hitObject.startY = Parsing.parseInt(data[1], Parsing.MAX_COORDINATE_VALUE);
    hitObject.startTime = Parsing.parseFloat(data[2]) + offset;
    hitObject.hitType = hitType;
    hitObject.hitSound = Parsing.parseInt(data[4]);

    const bankInfo = new SampleBank();

    this.addExtras(data.slice(5), hitObject, bankInfo, offset, beatmap.fileFormat);
    this.addComboOffset(hitObject, beatmap);

    if (hitObject.samples.length === 0) {
      hitObject.samples = this.convertSoundType(hitObject.hitSound, bankInfo);
    }

    beatmap.hitObjects.push(hitObject);
  }
  static addComboOffset(hitObject, beatmap) {
    const isStandard = beatmap.originalMode === 0;
    const isCatch = beatmap.originalMode === 2;

    if (!isStandard && !isCatch) {
      return;
    }

    const comboObject = hitObject;
    const comboOffset = Math.trunc((hitObject.hitType & HitType.ComboOffset) >> 4);
    const newCombo = !!(hitObject.hitType & HitType.NewCombo);

    if ((hitObject.hitType & HitType.Normal) || (hitObject.hitType & HitType.Slider)) {
      comboObject.isNewCombo = newCombo || this._forceNewCombo;
      comboObject.comboOffset = comboOffset + this._extraComboOffset;
      this._forceNewCombo = false;
      this._extraComboOffset = 0;
    }

    if (hitObject.hitType & HitType.Spinner) {
      this._forceNewCombo = beatmap.fileFormat <= 8 || newCombo || false;
      this._extraComboOffset += comboOffset;
    }
  }
  static addExtras(data, hitObject, bankInfo, offset, fileFormat) {
    if ((hitObject.hitType & HitType.Normal) && data.length > 0) {
      this.readCustomSampleBanks(data[0], bankInfo);
    }

    if (hitObject.hitType & HitType.Slider) {
      return this.addSliderExtras(data, hitObject, bankInfo, fileFormat);
    }

    if (hitObject.hitType & HitType.Spinner) {
      return this.addSpinnerExtras(data, hitObject, bankInfo, offset);
    }

    if (hitObject.hitType & HitType.Hold) {
      return this.addHoldExtras(data, hitObject, bankInfo, offset);
    }
  }
  static addSliderExtras(extras, slider, bankInfo, fileFormat) {
    const pathString = extras[0];
    const offset = slider.startPosition;
    const repeats = Parsing.parseInt(extras[1]);

    if (slider.repeats > 9000) {
      throw new Error('Repeat count is way too high');
    }

    slider.repeats = Math.max(0, repeats - 1);
    slider.path.controlPoints = this.convertPathString(pathString, offset, fileFormat);
    slider.path.curveType = slider.path.controlPoints[0].type;

    if (extras.length > 2) {
      const length = Parsing.parseFloat(extras[2], Parsing.MAX_COORDINATE_VALUE);

      slider.path.expectedDistance = Math.max(0, length);
    }

    if (extras.length > 5) {
      this.readCustomSampleBanks(extras[5], bankInfo);
    }

    slider.samples = this.convertSoundType(slider.hitSound, bankInfo);
    slider.nodeSamples = this.getSliderNodeSamples(extras, slider, bankInfo);
  }
  static addSpinnerExtras(extras, spinner, bankInfo, offset) {
    spinner.endTime = Parsing.parseInt(extras[0]) + offset;

    if (extras.length > 1) {
      this.readCustomSampleBanks(extras[1], bankInfo);
    }
  }
  static addHoldExtras(extras, hold, bankInfo, offset) {
    hold.endTime = hold.startTime;

    if (extras.length > 0 && extras[0]) {
      const ss = extras[0].split(':');

      hold.endTime = Math.max(hold.endTime, Parsing.parseFloat(ss[0])) + offset;
      this.readCustomSampleBanks(ss.slice(1).join(':'), bankInfo);
    }
  }
  static getSliderNodeSamples(extras, slider, bankInfo) {
    const nodes = slider.repeats + 2;
    const nodeBankInfos = [];

    for (let i = 0; i < nodes; ++i) {
      nodeBankInfos.push(bankInfo.clone());
    }

    if (extras.length > 4 && extras[4].length > 0) {
      const sets = extras[4].split('|');

      for (let i = 0; i < nodes; ++i) {
        if (i >= sets.length) {
          break;
        }

        this.readCustomSampleBanks(sets[i], nodeBankInfos[i]);
      }
    }

    const nodeSoundTypes = [];

    for (let i = 0; i < nodes; ++i) {
      nodeSoundTypes.push(slider.hitSound);
    }

    if (extras.length > 3 && extras[3].length > 0) {
      const adds = extras[3].split('|');

      for (let i = 0; i < nodes; ++i) {
        if (i >= adds.length) {
          break;
        }

        nodeSoundTypes[i] = parseInt(adds[i]) || HitSound.None;
      }
    }

    const nodeSamples = [];

    for (let i = 0; i < nodes; i++) {
      nodeSamples.push(this.convertSoundType(nodeSoundTypes[i], nodeBankInfos[i]));
    }

    return nodeSamples;
  }
  static convertPathString(pathString, offset, fileFormat) {
    const pathSplit = pathString.split('|').map((p) => p.trim());
    const controlPoints = [];
    let startIndex = 0;
    let endIndex = 0;
    let isFirst = true;

    while (++endIndex < pathSplit.length) {
      if (pathSplit[endIndex].length > 1) {
        continue;
      }

      const points = pathSplit.slice(startIndex, endIndex);
      const endPoint = endIndex < pathSplit.length - 1 ? pathSplit[endIndex + 1] : null;
      const convertedPoints = this.convertPoints(points, endPoint, isFirst, offset, fileFormat);

      for (const point of convertedPoints) {
        controlPoints.push(...point);
      }

      startIndex = endIndex;
      isFirst = false;
    }

    if (endIndex > startIndex) {
      const points = pathSplit.slice(startIndex, endIndex);
      const convertedPoints = this.convertPoints(points, null, isFirst, offset, fileFormat);

      for (const point of convertedPoints) {
        controlPoints.push(...point);
      }
    }

    return controlPoints;
  }
  static *convertPoints(points, endPoint, isFirst, offset, fileFormat) {
    const readOffset = isFirst ? 1 : 0;
    const endPointLength = endPoint !== null ? 1 : 0;
    const vertices = [];

    if (readOffset === 1) {
      vertices[0] = new PathPoint();
    }

    for (let i = 1; i < points.length; ++i) {
      vertices[readOffset + i - 1] = readPoint(points[i], offset);
    }

    if (endPoint !== null) {
      vertices[vertices.length - 1] = readPoint(endPoint, offset);
    }

    let type = this.convertPathType(points[0]);

    if (type === PathType.PerfectCurve) {
      if (vertices.length !== 3) {
        type = PathType.Bezier;
      }
      else if (isLinear(vertices)) {
        type = PathType.Linear;
      }
    }

    vertices[0].type = type;

    let startIndex = 0;
    let endIndex = 0;

    while (++endIndex < vertices.length - endPointLength) {
      if (!vertices[endIndex].position.equals(vertices[endIndex - 1].position)) {
        continue;
      }

      const isStableBeatmap = fileFormat < BeatmapEncoder.FIRST_LAZER_VERSION;

      if (type === PathType.Catmull && endIndex > 1 && isStableBeatmap) {
        continue;
      }

      if (endIndex === vertices.length - endPointLength - 1) {
        continue;
      }

      vertices[endIndex - 1].type = type;
      yield vertices.slice(startIndex, endIndex);
      startIndex = endIndex + 1;
    }

    if (endIndex > startIndex) {
      yield vertices.slice(startIndex, endIndex);
    }

    function readPoint(point, offset) {
      const coords = point.split(':').map((v) => {
        return Math.trunc(Parsing.parseFloat(v, Parsing.MAX_COORDINATE_VALUE));
      });
      const pos = new Vector2(coords[0], coords[1]).fsubtract(offset);

      return new PathPoint(pos);
    }

    function isLinear(p) {
      const yx = (p[1].position.y - p[0].position.y) * (p[2].position.x - p[0].position.x);
      const xy = (p[1].position.x - p[0].position.x) * (p[2].position.y - p[0].position.y);
      const acceptableDifference = 0.001;

      return Math.abs(yx - xy) < acceptableDifference;
    }
  }
  static convertPathType(type) {
    switch (type) {
      default:
      case 'C':
        return PathType.Catmull;
      case 'B':
        return PathType.Bezier;
      case 'L':
        return PathType.Linear;
      case 'P':
        return PathType.PerfectCurve;
    }
  }
  static readCustomSampleBanks(hitSample, bankInfo) {
    if (!hitSample) {
      return;
    }

    const split = hitSample.split(':');

    bankInfo.normalSet = Parsing.parseInt(split[0]);
    bankInfo.additionSet = Parsing.parseInt(split[1]);

    if (bankInfo.additionSet === SampleSet.None) {
      bankInfo.additionSet = bankInfo.normalSet;
    }

    if (split.length > 2) {
      bankInfo.customIndex = Parsing.parseInt(split[2]);
    }

    if (split.length > 3) {
      bankInfo.volume = Math.max(0, Parsing.parseInt(split[3]));
    }

    bankInfo.filename = split.length > 4 ? split[4] : '';
  }
  static convertSoundType(type, bankInfo) {
    if (bankInfo.filename) {
      const sample = new HitSample();

      sample.filename = bankInfo.filename;
      sample.volume = bankInfo.volume;

      return [sample];
    }

    const soundTypes = [new HitSample()];

    soundTypes[0].hitSound = HitSound[HitSound.Normal];
    soundTypes[0].sampleSet = SampleSet[bankInfo.normalSet];
    soundTypes[0].isLayered = type !== HitSound.None && !(type & HitSound.Normal);

    if (type & HitSound.Finish) {
      const sample = new HitSample();

      sample.hitSound = HitSound[HitSound.Finish];
      soundTypes.push(sample);
    }

    if (type & HitSound.Whistle) {
      const sample = new HitSample();

      sample.hitSound = HitSound[HitSound.Whistle];
      soundTypes.push(sample);
    }

    if (type & HitSound.Clap) {
      const sample = new HitSample();

      sample.hitSound = HitSound[HitSound.Clap];
      soundTypes.push(sample);
    }

    soundTypes.forEach((sound, i) => {
      sound.sampleSet = i !== 0
        ? SampleSet[bankInfo.additionSet]
        : SampleSet[bankInfo.normalSet];

      sound.volume = bankInfo.volume;
      sound.customIndex = 0;

      if (bankInfo.customIndex >= 2) {
        sound.customIndex = bankInfo.customIndex;
      }
    });

    return soundTypes;
  }
  static createHitObject(hitType) {
    if (hitType & HitType.Normal) {
      return new HittableObject();
    }

    if (hitType & HitType.Slider) {
      return new SlidableObject();
    }

    if (hitType & HitType.Spinner) {
      return new SpinnableObject();
    }

    if (hitType & HitType.Hold) {
      return new HoldableObject();
    }

    throw new Error(`Unknown hit object type: ${hitType}!`);
  }
}

class BeatmapMetadataDecoder {
  static handleLine(line, beatmap) {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
      case 'Title':
        beatmap.metadata.title = value;
        break;
      case 'TitleUnicode':
        beatmap.metadata.titleUnicode = value;
        break;
      case 'Artist':
        beatmap.metadata.artist = value;
        break;
      case 'ArtistUnicode':
        beatmap.metadata.artistUnicode = value;
        break;
      case 'Creator':
        beatmap.metadata.creator = value;
        break;
      case 'Version':
        beatmap.metadata.version = value;
        break;
      case 'Source':
        beatmap.metadata.source = value;
        break;
      case 'Tags':
        beatmap.metadata.tags = value.split(' ');
        break;
      case 'BeatmapID':
        beatmap.metadata.beatmapId = Parsing.parseInt(value);
        break;
      case 'BeatmapSetID':
        beatmap.metadata.beatmapSetId = Parsing.parseInt(value);
    }
  }
}

class BeatmapTimingPointDecoder {
  static pendingTime = 0;
  static pendingTypes = [];
  static pendingPoints = [];
  static controlPoints;
  static handleLine(line, beatmap, offset) {
    this.controlPoints = beatmap.controlPoints;

    const data = line.split(',');
    let timeSignature = TimeSignature.SimpleQuadruple;
    let sampleSet = SampleSet[SampleSet.None];
    let customIndex = 0;
    let volume = 100;
    let timingChange = true;
    let effects = EffectType.None;

    if (data.length > 2) {
      switch (data.length) {
        default:
        case 8: effects = Parsing.parseInt(data[7]);
        case 7: timingChange = data[6] === '1';
        case 6: volume = Parsing.parseInt(data[5]);
        case 5: customIndex = Parsing.parseInt(data[4]);
        case 4: sampleSet = SampleSet[Parsing.parseInt(data[3])];
        case 3: timeSignature = Parsing.parseInt(data[2]);
      }
    }

    if (timeSignature < 1) {
      throw new Error('The numerator of a time signature must be positive.');
    }

    const startTime = Parsing.parseFloat(data[0]) + offset;
    const beatLength = Parsing.parseFloat(data[1], Parsing.MAX_PARSE_VALUE, true);
    let bpmMultiplier = 1;
    let speedMultiplier = 1;

    if (beatLength < 0) {
      speedMultiplier = 100 / -beatLength;
      bpmMultiplier = Math.min(Math.fround(-beatLength), 10000);
      bpmMultiplier = Math.max(10, bpmMultiplier) / 100;
    }

    if (timingChange && Number.isNaN(beatLength)) {
      throw new Error('Beat length cannot be NaN in a timing control point');
    }

    if (timingChange) {
      const timingPoint = new TimingPoint();

      timingPoint.beatLength = beatLength;
      timingPoint.timeSignature = timeSignature;
      this.addControlPoint(timingPoint, startTime, true);
    }

    const difficultyPoint = new DifficultyPoint();

    difficultyPoint.bpmMultiplier = bpmMultiplier;
    difficultyPoint.sliderVelocity = speedMultiplier;
    difficultyPoint.generateTicks = !Number.isNaN(beatLength);
    difficultyPoint.isLegacy = true;
    this.addControlPoint(difficultyPoint, startTime, timingChange);

    const effectPoint = new EffectPoint();

    effectPoint.kiai = (effects & EffectType.Kiai) > 0;
    effectPoint.omitFirstBarLine = (effects & EffectType.OmitFirstBarLine) > 0;

    if (beatmap.originalMode === 1 || beatmap.originalMode === 3) {
      effectPoint.scrollSpeed = speedMultiplier;
    }

    this.addControlPoint(effectPoint, startTime, timingChange);

    const samplePoint = new SamplePoint();

    samplePoint.sampleSet = sampleSet;
    samplePoint.customIndex = customIndex;
    samplePoint.volume = volume;
    this.addControlPoint(samplePoint, startTime, timingChange);
  }
  static addControlPoint(point, time, timingChange) {
    if (time !== this.pendingTime) {
      this.flushPendingPoints();
    }

    timingChange
      ? this.pendingPoints.unshift(point)
      : this.pendingPoints.push(point);

    this.pendingTime = time;
  }
  static flushPendingPoints() {
    const pendingTime = this.pendingTime;
    const pendingPoints = this.pendingPoints;
    const controlPoints = this.controlPoints;
    const pendingTypes = this.pendingTypes;
    let i = pendingPoints.length;

    while (--i >= 0) {
      if (pendingTypes.includes(pendingPoints[i].pointType)) {
        continue;
      }

      pendingTypes.push(pendingPoints[i].pointType);
      controlPoints.add(pendingPoints[i], pendingTime);
    }

    this.pendingPoints = [];
    this.pendingTypes = [];
  }
}

class StoryboardGeneralDecoder {
  static handleLine(line, storyboard) {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'UseSkinSprites':
        storyboard.useSkinSprites = value === '1';
    }
  }
}

class StoryboardVariableDecoder {
  static handleLine(line, variables) {
    if (!line.startsWith('$')) {
      return;
    }

    const pair = line.split('=');

    if (pair.length === 2) {
      variables.set(pair[0], pair[1].trimEnd());
    }
  }
  static decodeVariables(line, variables) {
    if (!line.includes('$') || !variables.size) {
      return line;
    }

    variables.forEach((value, key) => {
      line = line.replace(key, value);
    });

    return line;
  }
}

class Decoder {
  async _getFileBuffer(path) {
    try {
      await browserFSOperation(path);
    }
    catch {
      throw new Error('File doesn\'t exist!');
    }

    try {
      return await browserFSOperation(path);
    }
    catch {
      throw new Error('File can\'t be read!');
    }
  }
  async _getFileUpdateDate(path) {
    try {
      return (await browserFSOperation(path)).mtime;
    }
    catch {
      throw new Error('Failed to get last file update date!');
    }
  }
}

class SectionMap extends Map {
  currentSection = null;
  get(section) {
    return super.get(section) ?? false;
  }
  set(section, state = true) {
    return super.set(section, state);
  }
  reset() {
    this.forEach((_, key, map) => {
      map.set(key, true);
    });

    this.currentSection = null;

    return this;
  }
  get hasEnabledSections() {
    for (const state of this.values()) {
      if (state) {
        return true;
      }
    }

    return false;
  }
  get isSectionEnabled() {
    return this.currentSection ? this.get(this.currentSection) : false;
  }
}

class SectionDecoder extends Decoder {
  _lines = null;
  _foundFirstNonEmptyLine = false;
  _sectionMap = new SectionMap();
  _getLines(data) {
    let lines = null;

    if (data.constructor === Array) {
      lines = data;
    }

    if (!lines || !lines.length) {
      throw new Error('Data not found!');
    }

    return lines;
  }
  _parseLine(line, output) {
    if (!this._foundFirstNonEmptyLine && line.includes('osu file format v')) {
      const fileFormatLine = line.trim();

      try {
        if (fileFormatLine.startsWith('osu file format v')) {
          output.fileFormat = Parsing.parseInt(fileFormatLine.split('v')[1]);
        }

        return LineType.FileFormat;
      }
      catch {
        throw new Error('Wrong file format version!');
      }
    }

    if (!this._foundFirstNonEmptyLine && !this._isEmptyLine(line)) {
      this._foundFirstNonEmptyLine = true;
    }

    if (this._shouldSkipLine(line)) {
      return LineType.Empty;
    }

    line = this._preprocessLine(line);

    if (line.startsWith('[') && line.endsWith(']')) {
      const section = line.slice(1, -1);

      if (this._sectionMap.currentSection) {
        this._sectionMap.set(this._sectionMap.currentSection, false);
        this._sectionMap.currentSection = null;
      }

      if (!this._sectionMap.hasEnabledSections) {
        return LineType.Break;
      }

      if (section in Section) {
        this._sectionMap.currentSection = section;
      }

      return LineType.Section;
    }

    if (!this._sectionMap.isSectionEnabled) {
      return LineType.Empty;
    }

    try {
      this._parseSectionData(line, output);

      return LineType.Data;
    }
    catch {
      return LineType.Empty;
    }
  }
  _parseSectionData(line, output) {
    const outputWithColors = output;

    if (this._sectionMap.currentSection !== Section.Colours) {
      return;
    }

    if (!outputWithColors?.colors) {
      return;
    }

    BeatmapColorDecoder.handleLine(line, outputWithColors);
  }
  _preprocessLine(line) {
    if (this._sectionMap.currentSection !== Section.Metadata) {
      line = this._stripComments(line);
    }

    return line.trimEnd();
  }
  _shouldSkipLine(line) {
    return this._isEmptyLine(line) || line.startsWith('//');
  }
  _isEmptyLine(line) {
    return typeof line !== 'string' || !line;
  }
  _stripComments(line) {
    const index = line.indexOf('//');

    return index > 0 ? line.substring(0, index) : line;
  }
  _reset() {
    this._sectionMap.reset();
    this._lines = null;
    this._foundFirstNonEmptyLine = false;
  }
  _setEnabledSections(options) {
    this._sectionMap.set(Section.Colours, options?.parseColours);
  }
}

class StoryboardDecoder extends SectionDecoder {
  _variables = new Map();
  async decodeFromPath(firstPath, secondPath) {
    if (!firstPath.endsWith(FileFormat.Beatmap) && !firstPath.endsWith(FileFormat.Storyboard)) {
      throw new Error(`Wrong format of the first file! Only ${FileFormat.Beatmap} and ${FileFormat.Storyboard} files are supported!`);
    }

    if (typeof secondPath === 'string') {
      if (!secondPath.endsWith(FileFormat.Storyboard)) {
        throw new Error(`Wrong format of the second file! Only ${FileFormat.Storyboard} files are supported as a second argument!`);
      }
    }

    try {
      const firstData = await this._getFileBuffer(firstPath);
      const secondData = typeof secondPath === 'string'
        ? await this._getFileBuffer(firstPath)
        : undefined;

      return this.decodeFromBuffer(firstData, secondData);
    }
    catch (err) {
      const reason = err.message || err;
      throw new Error(`Failed to decode a storyboard: '${reason}'`);
    }
  }
  decodeFromBuffer(firstBuffer, secondBuffer) {
    const firstString = stringifyBuffer(firstBuffer);
    const secondString = secondBuffer ? stringifyBuffer(secondBuffer) : undefined;

    return this.decodeFromString(firstString, secondString);
  }
  decodeFromString(firstString, secondString) {
    if (typeof firstString !== 'string') {
      firstString = String(firstString);
    }

    if (typeof secondString !== 'string' && typeof secondString !== 'undefined') {
      secondString = String(secondString);
    }

    const firstData = firstString.split(/\r?\n/);
    const secondData = secondString?.split(/\r?\n/);

    return this.decodeFromLines(firstData, secondData);
  }
  decodeFromLines(firstData, secondData) {
    const storyboard = new Storyboard();

    this._reset();
    this._setEnabledSections();
    this._lines = [
      ...this._getLines(firstData),
      ...(secondData ? this._getLines(secondData) : []),
    ];

    for (let i = 0; i < this._lines.length; ++i) {
      const type = this._parseLine(this._lines[i], storyboard);

      if (type === LineType.Break) {
        break;
      }
    }

    storyboard.variables = this._variables;

    return storyboard;
  }
  _parseSectionData(line, storyboard) {
    switch (this._sectionMap.currentSection) {
      case Section.General:
        return StoryboardGeneralDecoder.handleLine(line, storyboard);
      case Section.Events:
        return StoryboardEventDecoder.handleLine(line, storyboard);
      case Section.Variables:
        return StoryboardVariableDecoder.handleLine(line, this._variables);
    }

    super._parseSectionData(line, storyboard);
  }
  _setEnabledSections() {
    super._setEnabledSections();
    this._sectionMap.set(Section.General);
    this._sectionMap.set(Section.Variables);
    this._sectionMap.set(Section.Events);
  }
  _preprocessLine(line) {
    line = StoryboardVariableDecoder.decodeVariables(line, this._variables);

    return super._preprocessLine(line);
  }
  _reset() {
    super._reset();
    this._sectionMap.currentSection = Section.Events;
  }
}

class BeatmapDecoder extends SectionDecoder {
  static EARLY_VERSION_TIMING_OFFSET = 24;
  _offset = 0;
  _sbLines = null;
  async decodeFromPath(path, options) {
    if (!path.endsWith(FileFormat.Beatmap)) {
      throw new Error(`Wrong file format! Only ${FileFormat.Beatmap} files are supported!`);
    }

    try {
      const data = await this._getFileBuffer(path);
      const beatmap = this.decodeFromBuffer(data, options);

      beatmap.fileUpdateDate = await this._getFileUpdateDate(path);

      return beatmap;
    }
    catch (err) {
      const reason = err.message || err;
      throw new Error(`Failed to decode a beatmap: ${reason}`);
    }
  }
  decodeFromBuffer(data, options) {
    return this.decodeFromString(stringifyBuffer(data), options);
  }
  decodeFromString(str, options) {
    str = typeof str !== 'string' ? String(str) : str;

    return this.decodeFromLines(str.split(/\r?\n/), options);
  }
  decodeFromLines(data, options) {
    const beatmap = new Beatmap();

    this._reset();
    this._lines = this._getLines(data);
    this._setEnabledSections(typeof options !== 'boolean' ? options : {});
    this._sbLines = this._shouldParseStoryboard(options) ? [] : null;

    for (let i = 0; i < this._lines.length; ++i) {
      const type = this._parseLine(this._lines[i], beatmap);

      if (type === LineType.Break) {
        break;
      }
    }

    BeatmapTimingPointDecoder.flushPendingPoints();

    for (let i = 0; i < beatmap.hitObjects.length; ++i) {
      beatmap.hitObjects[i].applyDefaults(beatmap.controlPoints, beatmap.difficulty);
    }

    beatmap.hitObjects.sort((a, b) => a.startTime - b.startTime);

    if (this._sbLines && this._sbLines.length) {
      const storyboardDecoder = new StoryboardDecoder();

      beatmap.events.storyboard = storyboardDecoder.decodeFromLines(this._sbLines);
      beatmap.events.storyboard.useSkinSprites = beatmap.general.useSkinSprites;
      beatmap.events.storyboard.colors = beatmap.colors;
      beatmap.events.storyboard.fileFormat = beatmap.fileFormat;
    }

    return beatmap;
  }
  _parseSectionData(line, beatmap) {
    switch (this._sectionMap.currentSection) {
      case Section.General:
        return BeatmapGeneralDecoder.handleLine(line, beatmap, this._offset);
      case Section.Editor:
        return BeatmapEditorDecoder.handleLine(line, beatmap);
      case Section.Metadata:
        return BeatmapMetadataDecoder.handleLine(line, beatmap);
      case Section.Difficulty:
        return BeatmapDifficultyDecoder.handleLine(line, beatmap);
      case Section.Events:
        return BeatmapEventDecoder.handleLine(line, beatmap, this._sbLines, this._offset);
      case Section.TimingPoints:
        return BeatmapTimingPointDecoder.handleLine(line, beatmap, this._offset);
      case Section.HitObjects:
        return BeatmapHitObjectDecoder.handleLine(line, beatmap, this._offset);
    }

    super._parseSectionData(line, beatmap);
  }
  _setEnabledSections(options) {
    super._setEnabledSections(options);
    this._sectionMap.set(Section.General, options?.parseGeneral);
    this._sectionMap.set(Section.Editor, options?.parseEditor);
    this._sectionMap.set(Section.Metadata, options?.parseMetadata);
    this._sectionMap.set(Section.Difficulty, options?.parseDifficulty);
    this._sectionMap.set(Section.Events, options?.parseEvents);
    this._sectionMap.set(Section.TimingPoints, options?.parseTimingPoints);
    this._sectionMap.set(Section.HitObjects, options?.parseHitObjects);
  }
  _shouldParseStoryboard(options) {
    const parsingOptions = options;
    const storyboardFlag = parsingOptions?.parseStoryboard ?? options;
    const parseSb = typeof storyboardFlag === 'boolean' ? storyboardFlag : true;
    const parseEvents = parsingOptions?.parseEvents ?? true;

    return parseEvents && parseSb;
  }
}

const osuMap = await fetch("/beatmap");

const hits = await new BeatmapDecoder()
	.decodeFromString(osuMap)
	.hitObjects.sort((left, right) => left - right);

function closestHit() {
	const closestHits = hits.sort(
		(left, right) =>
			Math.abs(left.startTime - time()) -
			Math.abs(right.startTime - time())
	);

	return closestHits[0];
}

function nextHits$1() {
	return hits.filter((hit) => hit.startTime > time());
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	nextHits$1().forEach((hit) => {
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

function startDisplaying() {
	requestAnimationFrame(refresh);
}

function startSong() {
	audio.play();
}

const noteRating = document.querySelector('h1');

document.querySelector('.start-song').addEventListener('click', startSong);
document.querySelector('.event').addEventListener('click', () => {
	console.log(time());
	console.log(nextHits());
});

document.addEventListener('keydown', function (event) {
	if (event.key == 'z') {
		const hit = closestHit();
		const offset = hit.startTime - time();
		const rating = hit.hitWindows.resultFor(offset);
		noteRating.innerText = rating;

		console.log(offset);
	}
});

startDisplaying();
