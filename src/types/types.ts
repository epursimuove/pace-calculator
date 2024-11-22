export interface Definition<T> {
  unit: T;
  label?: string;
  factor: number;
  splitTimeLabel?: string;
}

export type DistanceUnit =
  | "in"
  | "ft"
  | "yd"
  | "m"
  | "100mSplit"
  | "200mLap"
  | "400mLap"
  | "500mSplit"
  | "km"
  | "mi"
  | "nmi";

export type PaceUnit =
  | "/m"
  | "/100m"
  | "/200m"
  | "/400m"
  | "/500m"
  | "/km"
  | "/mi"
  | "/nmi";

export type SpeedUnit = "ft/s" | "m/s" | "km/h" | "mph" | "knots";

export type VelocityUnit = PaceUnit | SpeedUnit;

export type TimeUnit = "min" | "s";

export type Distance = {
  quantity?: number;
  unit: DistanceUnit;
  label?: string;
  defined: boolean;
};

// type Pace = {
//   quantity: number;
//   unit: PaceUnit;
// };
//
// type Speed = {
//   quantity: number;
//   unit: SpeedUnit;
// };

export type Velocity = {
  quantityPaceMinutes?: number;
  quantityPaceSeconds?: number;
  quantitySpeed?: number;
  unit: PaceUnit | SpeedUnit;
  defined: boolean;
};

export type Time = {
  totalSeconds?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  defined: boolean;
};

export type UserInput = {
  distance: Distance;
  splitDistance?: DistanceUnit;
  time: Time;
  // pace: Pace | Speed;
  velocity: Velocity;
};

export type ResultItem<T> = {
  quantity: string;
  unit?: T;
  unitLabel?: string;
  userDefined?: boolean;
};

export type Results = {
  distance?: ResultItem<DistanceUnit>[];
  time?: ResultItem<TimeUnit>[];
  pace?: ResultItem<VelocityUnit>[];
  distanceInMeters?: number;
  totalTimeInSeconds?: number;
  speedInMetersPerSecond?: number;
};

export type ResultsHelper = {
  distanceInMeters?: number;
  totalTimeInSeconds?: number;
  speedInMetersPerSecond?: number;
  distances?: ResultItem<DistanceUnit>[];
  times?: ResultItem<TimeUnit>[];
  paces?: ResultItem<VelocityUnit>[];
  speeds?: ResultItem<VelocityUnit>[];
};

export type SplitTimeItem = {
  distance: Distance;
  time: Time;
};
