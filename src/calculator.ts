import type {
  UserInput,
  Definition,
  Distance,
  DistanceUnit,
  PaceUnit,
  ResultItem,
  Results,
  SpeedUnit,
  SplitTimeItem,
  Time,
  TimeUnit,
  Velocity,
  VelocityUnit,
  ResultsHelper,
} from "@/types/types.ts";
import {
  atLeastDigits,
  prettifySeconds,
  prettifySecondsToMinutes,
  isPaceUnit,
  isSpeedUnit,
  distanceDefinitions,
  paceDefinitions,
  findMatchingDefinition,
  speedDefinitions,
  getDistanceInMeters,
  getTotalTimeInSeconds,
  calculateSpeedInMetersPerSecond,
  getSpeedInMetersPerSecond,
  calculateTotalTimeInSeconds,
  calculateDistanceInMeters,
  distanceUnits,
  handleIllegalStateAndCreateError,
} from "@/util.ts";

const convertDistances = (
  distanceInMeters: number,
  // definedDistanceUnit: DistanceUnit,
  distance: Distance,
  // distanceDefined: boolean,
): ResultItem<DistanceUnit>[] => {
  console.info(`Converting distances`);

  return distanceDefinitions.map((definition: Definition<DistanceUnit>) => {
    const distanceQuantity: number = distanceInMeters / definition.factor;

    return {
      quantity: `${atLeastDigits(distanceQuantity, 4)}`,
      unit: definition.unit,
      unitLabel: definition.label,
      userDefined: distance.defined && definition.unit === distance.unit,
    };
  });
};

export const convertToAllDistances = (
  distance: Distance,
  resultsHelper: ResultsHelper,
): void => {
  console.info(`Distance => Convert distance`);

  resultsHelper.distanceInMeters = getDistanceInMeters(distance);

  resultsHelper.distances = convertDistances(
    resultsHelper.distanceInMeters,
    distance,
  );
};

const convertPaces = (
  speedInMetersPerSecond: number,
  // velocityDefined: boolean,
  // definedVelocityUnit: VelocityUnit,
  velocity: Velocity,
): ResultItem<PaceUnit>[] => {
  console.info(`Converting paces`);

  return paceDefinitions.map((definition: Definition<PaceUnit>) => {
    const pace: number = definition.factor / speedInMetersPerSecond;

    return {
      quantity: `${prettifySeconds(pace)}`,
      unit: definition.unit,
      userDefined: velocity.defined && definition.unit === velocity.unit,
    };
  });
};

const convertSpeeds = (
  speedInMetersPerSecond: number,
  // velocityUnit: VelocityUnit,
  velocity: Velocity,
): ResultItem<SpeedUnit>[] => {
  console.info(`Converting speeds`);

  return speedDefinitions.map((definition: Definition<SpeedUnit>) => {
    const speed: number = speedInMetersPerSecond * definition.factor;

    return {
      quantity: `${atLeastDigits(speed, 3)}`,
      unit: definition.unit,
      userDefined: velocity.defined && definition.unit === velocity.unit,
    };
  });
};

export const convertToAllVelocities = (
  velocity: Velocity,
  resultsHelper: ResultsHelper,
): void => {
  console.info(`Pace => Convert pace`);

  resultsHelper.speedInMetersPerSecond = getSpeedInMetersPerSecond(velocity);

  resultsHelper.paces = convertPaces(
    resultsHelper.speedInMetersPerSecond,
    velocity,
  );
  resultsHelper.speeds = convertSpeeds(
    resultsHelper.speedInMetersPerSecond,
    velocity,
  );
};

const convertTimes = (
  totalTimeInSeconds: number,
  time: Time,
): ResultItem<TimeUnit>[] => {
  console.info(`Converting times`);

  return [
    {
      quantity: prettifySeconds(totalTimeInSeconds),
      userDefined: time.defined,
    },
    { quantity: prettifySecondsToMinutes(totalTimeInSeconds), unit: "min" },
    { quantity: `${totalTimeInSeconds.toFixed(0)}`, unit: "s" },
  ];
};

export const convertToAllTimes = (
  time: Time,
  resultsHelper: ResultsHelper,
): void => {
  console.info(`Time => Convert time`);

  resultsHelper.totalTimeInSeconds = getTotalTimeInSeconds(time);

  resultsHelper.times = convertTimes(resultsHelper.totalTimeInSeconds, time);
};

const convertEverything = (
  resultsHelper: ResultsHelper,
  distance: Distance,
  velocity: Velocity,
  time: Time,
) => {
  if (resultsHelper.distanceInMeters !== undefined) {
    resultsHelper.distances = convertDistances(
      resultsHelper.distanceInMeters,
      distance,
    );
  }

  if (resultsHelper.totalTimeInSeconds !== undefined) {
    resultsHelper.times = convertTimes(resultsHelper.totalTimeInSeconds, time);
  }

  if (resultsHelper.speedInMetersPerSecond !== undefined) {
    resultsHelper.paces = convertPaces(
      resultsHelper.speedInMetersPerSecond,
      velocity,
    );
    resultsHelper.speeds = convertSpeeds(
      resultsHelper.speedInMetersPerSecond,
      velocity,
    );
  }
};
export const calculateDistanceAndConvertEverything = (
  userInput: UserInput,
  resultsHelper: ResultsHelper,
): void => {
  console.info(
    `Time + Pace => Calculate Distance, and then convert everything`,
  );

  const { distance, splitDistance, time, velocity }: UserInput = userInput;

  resultsHelper.totalTimeInSeconds = getTotalTimeInSeconds(time);
  resultsHelper.speedInMetersPerSecond = getSpeedInMetersPerSecond(velocity);

  resultsHelper.distanceInMeters = calculateDistanceInMeters(
    resultsHelper.totalTimeInSeconds,
    resultsHelper.speedInMetersPerSecond,
  );

  convertEverything(resultsHelper, distance, velocity, time);
};

export const calculatePaceAndConvertEverything = (
  userInput: UserInput,
  resultsHelper: ResultsHelper,
): void => {
  console.info(
    `Distance + Time => Calculate Pace, and then convert everything`,
  );

  const { distance, splitDistance, time, velocity }: UserInput = userInput;

  resultsHelper.distanceInMeters = getDistanceInMeters(distance);
  resultsHelper.totalTimeInSeconds = getTotalTimeInSeconds(time);

  resultsHelper.speedInMetersPerSecond = calculateSpeedInMetersPerSecond(
    resultsHelper.distanceInMeters,
    resultsHelper.totalTimeInSeconds,
  );

  convertEverything(resultsHelper, distance, velocity, time);
};

export const calculateTimeAndConvertEverything = (
  userInput: UserInput,
  resultsHelper: ResultsHelper,
): void => {
  console.info(
    `Distance + Pace => Calculate Time, and then convert everything`,
  );

  const { distance, splitDistance, time, velocity }: UserInput = userInput;

  resultsHelper.distanceInMeters = getDistanceInMeters(distance);
  resultsHelper.speedInMetersPerSecond = getSpeedInMetersPerSecond(velocity);

  resultsHelper.totalTimeInSeconds = calculateTotalTimeInSeconds(
    resultsHelper.distanceInMeters,
    resultsHelper.speedInMetersPerSecond,
  );

  convertEverything(resultsHelper, distance, velocity, time);
};

export const calculateResults = (userInput: UserInput): Results | null => {
  console.info("Calculating results");

  // STEPS
  // Distance + time + pace => ERROR, do nothing.
  // Distance + time        => calculate pace, convert all.
  // Distance + pace        => calculate time, convert all.
  // Time + pace            => calculate distance, convert all.
  // Distance               => convert distance.
  // Time                   => convert time.
  // Pace                   => convert pace.

  const { distance, splitDistance, time, velocity }: UserInput = userInput;

  const { unit: velocityUnit }: Velocity = velocity;

  const distanceDefined: boolean = distance.defined;

  const timeDefined: boolean = time.defined;

  const velocityDefined: boolean = velocity.defined;
  const paceDefined: boolean = velocityDefined && isPaceUnit(velocityUnit);
  const speedDefined: boolean = velocityDefined && isSpeedUnit(velocityUnit);

  const resultsHelper: ResultsHelper = {};

  if (distanceDefined && timeDefined && velocityDefined) {
    throw handleIllegalStateAndCreateError(`Too many things defined`);
  } else if (distanceDefined && timeDefined) {
    calculatePaceAndConvertEverything(userInput, resultsHelper);
  } else if (distanceDefined && velocityDefined) {
    calculateTimeAndConvertEverything(userInput, resultsHelper);
  } else if (timeDefined && velocityDefined) {
    calculateDistanceAndConvertEverything(userInput, resultsHelper);
  } else if (distanceDefined) {
    convertToAllDistances(distance, resultsHelper);
  } else if (timeDefined) {
    convertToAllTimes(time, resultsHelper);
  } else if (velocityDefined) {
    convertToAllVelocities(velocity, resultsHelper);
  }

  const results: Results | null =
    distanceDefined || timeDefined || velocityDefined
      ? createResults(resultsHelper)
      : null;

  return results;
};

const createResults = (resultsHelper: ResultsHelper): Results => {
  let velocities: ResultItem<VelocityUnit>[] | undefined;
  if (resultsHelper.paces && resultsHelper.speeds) {
    velocities = [...resultsHelper.paces, ...resultsHelper.speeds];
  }

  const results: Results = {
    distance: resultsHelper.distances,
    time: resultsHelper.times,
    pace: velocities,
    distanceInMeters: resultsHelper.distanceInMeters,
    totalTimeInSeconds: resultsHelper.totalTimeInSeconds,
    speedInMetersPerSecond: resultsHelper.speedInMetersPerSecond,
  };

  return results;
};

export const calculateSplitTimes = (
  userInput: UserInput,
  results: Results,
): SplitTimeItem[] | null => {
  console.info("Calculating split times");

  if (
    userInput.splitDistance !== undefined &&
    distanceUnits.includes(userInput.splitDistance)
  ) {
    console.info(`Split times for "${userInput.splitDistance}"`);

    // STEPS
    // - Convert to distance quantity in split distance unit.
    // - Round up to get number of splits.
    //   - For example, 42.195 km => 43 splits for km.
    //   - For example, 10 mi => 10 splits for mi.
    // - Loop from 1 to number of splits and create a SplitTimeItem object for each loop.
    // - The last split item is equal to the finish time.
    //   - Put the total finish time and correct total distance.

    if (
      results.distanceInMeters !== undefined &&
      results.totalTimeInSeconds !== undefined
    ) {
      const matchingDistanceDefinition: Definition<DistanceUnit> =
        findMatchingDefinition<DistanceUnit>(
          distanceDefinitions,
          userInput.splitDistance,
        );

      const distanceQuantity: number =
        results.distanceInMeters / matchingDistanceDefinition.factor;

      const paceInSecondsPerDistanceForSplitDistanceUnit: number =
        results.totalTimeInSeconds / distanceQuantity;

      const numberOfSplits: number = Math.ceil(distanceQuantity);

      const splitTimes: SplitTimeItem[] = [];

      for (
        let splitDistance: number = 1;
        splitDistance <= numberOfSplits;
        splitDistance++
      ) {
        const isLastSplit: boolean = splitDistance === numberOfSplits;

        const splitTimeItem: SplitTimeItem = {
          distance: {
            quantity: isLastSplit ? distanceQuantity : splitDistance,
            unit: userInput.splitDistance,
            label:
              matchingDistanceDefinition.splitTimeLabel ||
              userInput.splitDistance,
            defined: false,
          },
          time: {
            totalSeconds: isLastSplit
              ? results.totalTimeInSeconds
              : paceInSecondsPerDistanceForSplitDistanceUnit * splitDistance,
            defined: false,
          },
        };

        splitTimes.push(splitTimeItem);
      }

      return splitTimes;
    }
  }

  return null;
};
