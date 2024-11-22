import type {
  Definition,
  Distance,
  DistanceUnit,
  PaceUnit,
  Results,
  SpeedUnit,
  SplitTimeItem,
  Time,
  Velocity,
  VelocityUnit,
} from "@/types/types.ts";

export const distanceDefinitions: Definition<DistanceUnit>[] = [
  { unit: "in", label: "inches", factor: 0.0254 },
  { unit: "ft", label: "feet", factor: 0.3048 },
  { unit: "yd", label: "yards", factor: 0.9144 },
  { unit: "m", label: "meters", factor: 1 },
  {
    unit: "100mSplit",
    label: "100 m splits",
    splitTimeLabel: "100m",
    factor: 100,
  },
  { unit: "200mLap", label: "200 m laps", splitTimeLabel: "200m", factor: 200 },
  { unit: "400mLap", label: "400 m laps", splitTimeLabel: "400m", factor: 400 },
  {
    unit: "500mSplit",
    label: "500 m splits",
    splitTimeLabel: "500m",
    factor: 500,
  },
  { unit: "km", label: "kilometers", factor: 1000 },
  { unit: "mi", label: "miles", factor: 1609.344 },
  { unit: "nmi", label: "nautical miles", factor: 1852 },
];

export const paceDefinitions: Definition<PaceUnit>[] = [
  { unit: "/m", factor: 1 },
  { unit: "/100m", factor: 100 },
  { unit: "/200m", factor: 200 },
  { unit: "/400m", factor: 400 },
  { unit: "/500m", factor: 500 },
  { unit: "/km", factor: 1000 },
  { unit: "/mi", factor: 1609.344 },
  { unit: "/nmi", factor: 1852 },
];

export const speedDefinitions: Definition<SpeedUnit>[] = [
  { unit: "ft/s", factor: 1 / 0.3048 },
  { unit: "m/s", factor: 1 },
  { unit: "km/h", factor: 3600 / 1000 },
  { unit: "mph", factor: 3600 / 1609.344 },
  { unit: "knots", factor: 3600 / 1852 },
];

export const velocityDefinitions: Definition<VelocityUnit>[] = [
  ...paceDefinitions,
  ...speedDefinitions,
];

export const distanceUnits: DistanceUnit[] = distanceDefinitions.map(
  (definition: Definition<DistanceUnit>) => definition.unit,
);

const timePerDistancePaces: VelocityUnit[] = paceDefinitions.map(
  (definition: Definition<VelocityUnit>) => definition.unit,
);

const distancePerTimeSpeeds: VelocityUnit[] = speedDefinitions.map(
  (definition: Definition<VelocityUnit>) => definition.unit,
);

export const isPaceUnit = (velocityUnit: VelocityUnit): boolean =>
  timePerDistancePaces.includes(velocityUnit);

export const isSpeedUnit = (velocityUnit: VelocityUnit): boolean =>
  distancePerTimeSpeeds.includes(velocityUnit);

export const findMatchingDefinition = <T>(
  definitions: Definition<T>[],
  unit: T,
): Definition<T> => {
  const matchingDefinition: Definition<T> | undefined = definitions.find(
    (definition: Definition<T>) => definition.unit === unit,
  );

  if (!matchingDefinition) {
    throw handleIllegalStateAndCreateError(
      `Could not find matching definition for unit "${unit}"`,
      { definitions, unit },
    );
  }
  return matchingDefinition;
};

export const definedAndLargerThanZero = (n: number | undefined): boolean =>
  n !== undefined && n > 0;

const padWithZero = (n: number): string => {
  return n < 10 ? `0${n}` : `${n}`;
};

export const prettifySeconds = (totalSeconds: number): string => {
  const roundedTotalSeconds = Math.round(totalSeconds);

  const hours: number = Math.floor(roundedTotalSeconds / 3600);
  const minutes: number = Math.floor((roundedTotalSeconds - 3600 * hours) / 60);
  const seconds: number = roundedTotalSeconds - 3600 * hours - 60 * minutes;

  return hours > 0
    ? `${hours}:${padWithZero(minutes)}:${padWithZero(seconds)}`
    : `${minutes}:${padWithZero(seconds)}`;
};

export const prettifySecondsToMinutes = (totalSeconds: number): string => {
  // const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = totalSeconds / 60;
  // const seconds: number = totalSeconds - 3600 * hours - 60 * minutes;

  return `${minutes.toFixed(2)}`;
};

export const atLeastDigits = (n: number, minNumberOfDigits: 3 | 4): string => {
  if (minNumberOfDigits === 4) {
    if (n >= 1000) {
      return `${Math.round(n)}`;
    } else if (n >= 100) {
      return n.toFixed(1);
    } else if (n >= 10) {
      return n.toFixed(2);
    } else {
      return n.toFixed(3);
    }
  } else if (minNumberOfDigits === 3) {
    if (n >= 100) {
      return `${Math.round(n)}`;
    } else if (n >= 10) {
      return n.toFixed(1);
    } else {
      return n.toFixed(2);
    }
  }

  return "?¿?";
};

export const atMostDecimals = (
  n: number,
  maxNumberOfDecimals: 1 | 2,
): string => {
  if (Number.isInteger(n)) {
    return `${n}`;
  } else if (maxNumberOfDecimals === 1) {
    return n.toFixed(1);
  } else if (maxNumberOfDecimals === 2) {
    if (Number.isInteger(n * 10)) {
      return n.toFixed(1);
    } else {
      return n.toFixed(2);
    }
  }

  return "?¿?";
};

export const getDistanceInMeters = (distance: Distance): number => {
  const matchingDistanceDefinition: Definition<DistanceUnit> =
    findMatchingDefinition<DistanceUnit>(distanceDefinitions, distance.unit);

  const distanceInMeters =
    distance.quantity! * matchingDistanceDefinition.factor;

  return distanceInMeters;
};

export const getTotalTimeInSeconds = (time: Time): number => {
  const { hours, minutes, seconds }: Time = time;

  const totalTimeInSeconds =
    (hours ? 3600 * hours : 0) +
    (minutes ? 60 * minutes : 0) +
    (seconds ? seconds : 0);

  return totalTimeInSeconds;
};

export const getSpeedInMetersPerSecond = (velocity: Velocity): number => {
  const matchingVelocityDefinition: Definition<VelocityUnit> =
    findMatchingDefinition<VelocityUnit>(velocityDefinitions, velocity.unit);

  let speedInMetersPerSecond: number;
  if (isPaceUnit(velocity.unit)) {
    const totalSecondsForPace: number =
      (velocity.quantityPaceMinutes ? velocity.quantityPaceMinutes * 60 : 0) +
      (velocity.quantityPaceSeconds ? velocity.quantityPaceSeconds : 0);

    speedInMetersPerSecond =
      matchingVelocityDefinition.factor / totalSecondsForPace;
  } else if (
    isSpeedUnit(velocity.unit) &&
    velocity.quantitySpeed !== undefined
  ) {
    speedInMetersPerSecond =
      velocity.quantitySpeed / matchingVelocityDefinition.factor;
  } else {
    throw handleIllegalStateAndCreateError(`How did we end up here?!?"`);
  }

  return speedInMetersPerSecond;
};

export const calculateDistanceInMeters = (
  totalTimeInSeconds: number,
  speedInMetersPerSecond: number,
): number => {
  return totalTimeInSeconds * speedInMetersPerSecond;
};

export const calculateTotalTimeInSeconds = (
  distanceInMeters: number,
  speedInMetersPerSecond: number,
): number => {
  return distanceInMeters / speedInMetersPerSecond;
};

export const calculateSpeedInMetersPerSecond = (
  distanceInMeters: number,
  totalTimeInSeconds: number,
): number => {
  return distanceInMeters / totalTimeInSeconds;
};

export const handleIllegalStateAndCreateError = (
  message: string,
  details?: Record<string, unknown>,
): Error => {
  console.error(`Illegal state! ${message}`, details);
  return new Error(`Illegal state: ${message}`);
};

export const getFirstAndLastItems = <T>(
  array: T[],
): { first: T; length: number; last: T } => {
  const { 0: first, length, [length - 1]: last } = array;

  return { first, length, last };
};

// export const dummyResult: Results = {
//   distance: [
//     {quantity: "55", unit: "in"},
//     {quantity: "0.543", unit: "m", userDefined: true},
//     {quantity: "123", unit: "km"},
//     {quantity: "19583", unit: "nmi"},
//   ],
//   time: [
//     {quantity: "3:53:19"},
//     {quantity: "230.32", unit: "min"},
//     {quantity: "8765", unit: "s"},
//   ],
//   pace: [
//     {quantity: "12345", unit: "ft/s"},
//     {quantity: "99.34", unit: "m/s"},
//     {quantity: "42.195", unit: "/km", userDefined: true},
//     {quantity: "0.9", unit: "/nmi"},
//     {quantity: "10932", unit: "km/h"},
//     {quantity: "543", unit: "/200m"},
//     {quantity: "9", unit: "/400m"},
//     {quantity: "0.322", unit: "mph"},
//   ],
// };
//
const dummySecondsPerDistance = Math.floor(Math.random() * 500);
export const dummySplitTimes: SplitTimeItem[] = Array.from(
  Array(42).keys(),
).map((value: number, index: number): SplitTimeItem => {
  return {
    distance: { quantity: index + 1, unit: "km", defined: false },
    time: { seconds: dummySecondsPerDistance * (index + 1), defined: false },
  };
});
