import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateDistanceAndConvertEverything,
  calculatePaceAndConvertEverything,
  calculateResults,
  calculateSplitTimes,
  calculateTimeAndConvertEverything,
  convertToAllDistances,
  convertToAllTimes,
  convertToAllVelocities,
} from "@/calculator.ts";
import type {
  Distance,
  DistanceUnit,
  ResultItem,
  Results,
  ResultsHelper,
  SplitTimeItem,
  Time,
  TimeUnit,
  UserInput,
  Velocity,
  VelocityUnit,
} from "@/types/types.ts";
import { getFirstAndLastItems, prettifySeconds } from "@/util.ts";

describe("calculator.ts", () => {
  let resultsHelper: ResultsHelper;

  beforeEach(() => {
    resultsHelper = {};
  });

  describe("convertToAllDistances", () => {
    const distance: Distance = {
      quantity: 1,
      unit: "km",
      defined: true,
    };

    it("calculates correct distance in meters", () => {
      convertToAllDistances(distance, resultsHelper);

      expect(resultsHelper.distanceInMeters).toBe(1000);
    });

    it("converts to other distances", () => {
      convertToAllDistances(distance, resultsHelper);

      expect(resultsHelper.distances?.length).toBe(11);
      expect(
        resultsHelper.distances?.find(
          (distance: ResultItem<DistanceUnit>) => distance.unit === "400mLap",
        )?.quantity,
      ).toBe("2.500");
      expect(
        resultsHelper.distances?.find(
          (distance: ResultItem<DistanceUnit>) => distance.unit === "m",
        )?.quantity,
      ).toBe("1000");
      expect(
        resultsHelper.distances?.find(
          (distance: ResultItem<DistanceUnit>) => distance.unit === "mi",
        )?.quantity,
      ).toBe("0.621");
    });

    describe("Marks correct user defined entry", () => {
      it("when a distance is defined by user", () => {
        const distance: Distance = {
          quantity: 1,
          unit: "nmi",
          defined: true,
        };

        convertToAllDistances(distance, resultsHelper);

        const userDefinedDistances: ResultItem<DistanceUnit>[] | undefined =
          resultsHelper.distances?.filter(
            (resultItem: ResultItem<DistanceUnit>) => resultItem.userDefined,
          );

        const { first, length, last } = getFirstAndLastItems(
          userDefinedDistances!,
        );

        expect(length).toBe(1);
        expect(first.unit).toBe("nmi");
      });

      it("when no distance is defined by user", () => {
        const distance: Distance = {
          quantity: 1,
          unit: "nmi",
          defined: false,
        };

        convertToAllDistances(distance, resultsHelper);

        const userDefinedDistances: ResultItem<DistanceUnit>[] | undefined =
          resultsHelper.distances?.filter(
            (resultItem: ResultItem<DistanceUnit>) => resultItem.userDefined,
          );

        const { first, length, last } = getFirstAndLastItems(
          userDefinedDistances!,
        );

        expect(length).toBe(0);
      });
    });
  });

  describe("convertToAllTimes", () => {
    const time: Time = {
      hours: 1,
      defined: true,
    };

    it("calculates correct total time in seconds", () => {
      convertToAllTimes(time, resultsHelper);

      expect(resultsHelper.totalTimeInSeconds).toBe(3600);
    });

    it("converts to other times", () => {
      convertToAllTimes(time, resultsHelper);

      expect(resultsHelper.times?.length).toBe(3);
      expect(
        resultsHelper.times?.find(
          (time: ResultItem<TimeUnit>) => time.unit === "min",
        )?.quantity,
      ).toBe("60.00");
      expect(
        resultsHelper.times?.find(
          (time: ResultItem<TimeUnit>) => time.unit === "s",
        )?.quantity,
      ).toBe("3600");
    });
  });

  describe("convertToAllVelocities", () => {
    const velocity: Velocity = {
      quantitySpeed: 90,
      unit: "km/h",
      defined: true,
    };

    it("calculates correct speed in meters per second", () => {
      convertToAllVelocities(velocity, resultsHelper);

      expect(resultsHelper.speedInMetersPerSecond).toBe(25);
    });

    it("converts to other paces", () => {
      convertToAllVelocities(velocity, resultsHelper);

      expect(resultsHelper.paces?.length).toBe(8);
      expect(
        resultsHelper.paces?.find(
          (velocity: ResultItem<VelocityUnit>) => velocity.unit === "/100m",
        )?.quantity,
      ).toBe("0:04");
      expect(
        resultsHelper.paces?.find(
          (velocity: ResultItem<VelocityUnit>) => velocity.unit === "/km",
        )?.quantity,
      ).toBe("0:40");
    });

    it("converts to other speeds", () => {
      convertToAllVelocities(velocity, resultsHelper);

      expect(resultsHelper.speeds?.length).toBe(5);
      expect(
        resultsHelper.speeds?.find(
          (velocity: ResultItem<VelocityUnit>) => velocity.unit === "m/s",
        )?.quantity,
      ).toBe("25.0");
      expect(
        resultsHelper.speeds?.find(
          (velocity: ResultItem<VelocityUnit>) => velocity.unit === "km/h",
        )?.quantity,
      ).toBe("90.0");
      expect(
        resultsHelper.speeds?.find(
          (velocity: ResultItem<VelocityUnit>) => velocity.unit === "knots",
        )?.quantity,
      ).toBe("48.6");
    });

    describe("Marks correct user defined entry", () => {
      it("when a velocity is defined by user", () => {
        const velocity: Velocity = {
          quantitySpeed: 5,
          unit: "ft/s",
          defined: true,
        };

        convertToAllVelocities(velocity, resultsHelper);

        const userDefinedPaces: ResultItem<VelocityUnit>[] | undefined =
          resultsHelper.paces?.filter(
            (resultItem: ResultItem<VelocityUnit>) => resultItem.userDefined,
          );

        const userDefinedSpeeds: ResultItem<VelocityUnit>[] | undefined =
          resultsHelper.speeds?.filter(
            (resultItem: ResultItem<VelocityUnit>) => resultItem.userDefined,
          );

        const {
          first: firstPace,
          length: lengthPace,
          last: lastPace,
        } = getFirstAndLastItems(userDefinedPaces!);

        const {
          first: firstSpeed,
          length: lengthSpeed,
          last: lastSpeed,
        } = getFirstAndLastItems(userDefinedSpeeds!);

        expect(lengthPace).toBe(0);
        expect(lengthSpeed).toBe(1);
        expect(firstSpeed.unit).toBe("ft/s");
      });

      it("when no velocity is defined by user", () => {
        const velocity: Velocity = {
          quantitySpeed: 5,
          unit: "ft/s",
          defined: false,
        };

        convertToAllVelocities(velocity, resultsHelper);

        const userDefinedPaces: ResultItem<VelocityUnit>[] | undefined =
          resultsHelper.paces?.filter(
            (resultItem: ResultItem<VelocityUnit>) => resultItem.userDefined,
          );

        const userDefinedSpeeds: ResultItem<VelocityUnit>[] | undefined =
          resultsHelper.speeds?.filter(
            (resultItem: ResultItem<VelocityUnit>) => resultItem.userDefined,
          );

        const {
          first: firstPace,
          length: lengthPace,
          last: lastPace,
        } = getFirstAndLastItems(userDefinedPaces!);

        const {
          first: firstSpeed,
          length: lengthSpeed,
          last: lastSpeed,
        } = getFirstAndLastItems(userDefinedSpeeds!);

        expect(lengthPace).toBe(0);
        expect(lengthSpeed).toBe(0);
      });
    });
  });

  describe("Calculate and Convert", () => {
    let resultsHelper: ResultsHelper;

    beforeEach(() => {
      resultsHelper = {};
    });

    describe("calculateDistanceAndConvertEverything", () => {
      const userInput: UserInput = {
        distance: { unit: "km", defined: false },
        time: { hours: 1, defined: true },
        velocity: { quantityPaceMinutes: 10, unit: "/km", defined: true },
      };

      it("calculates distance", () => {
        calculateDistanceAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distanceInMeters).toBe(6000);
        expect(resultsHelper.totalTimeInSeconds).toBe(3600);
        expect(resultsHelper.speedInMetersPerSecond).toBeCloseTo(1.67);
      });

      it("converts everything", () => {
        calculateDistanceAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distances?.length).toBe(11);
        expect(resultsHelper.times?.length).toBe(3);
        expect(resultsHelper.paces?.length).toBe(8);
        expect(resultsHelper.speeds?.length).toBe(5);
      });
    });

    describe("calculatePaceAndConvertEverything", () => {
      const userInput: UserInput = {
        distance: { quantity: 6, unit: "km", defined: true },
        time: { hours: 1, defined: true },
        velocity: { unit: "/km", defined: false },
      };

      it("calculates distance", () => {
        calculatePaceAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distanceInMeters).toBe(6000);
        expect(resultsHelper.totalTimeInSeconds).toBe(3600);
        expect(resultsHelper.speedInMetersPerSecond).toBeCloseTo(1.67);
      });

      it("converts everything", () => {
        calculatePaceAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distances?.length).toBe(11);
        expect(resultsHelper.times?.length).toBe(3);
        expect(resultsHelper.paces?.length).toBe(8);
        expect(resultsHelper.speeds?.length).toBe(5);
      });
    });

    describe("calculateTimeAndConvertEverything", () => {
      const userInput: UserInput = {
        distance: { quantity: 6, unit: "km", defined: true },
        time: { defined: false },
        velocity: { quantityPaceMinutes: 10, unit: "/km", defined: true },
      };

      it("calculates distance", () => {
        calculateTimeAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distanceInMeters).toBe(6000);
        expect(resultsHelper.totalTimeInSeconds).toBe(3600);
        expect(resultsHelper.speedInMetersPerSecond).toBeCloseTo(1.67);
      });

      it("converts everything", () => {
        calculateTimeAndConvertEverything(userInput, resultsHelper);

        expect(resultsHelper.distances?.length).toBe(11);
        expect(resultsHelper.times?.length).toBe(3);
        expect(resultsHelper.paces?.length).toBe(8);
        expect(resultsHelper.speeds?.length).toBe(5);
      });
    });
  });

  describe("Calculate results", () => {
    describe("Handles too many things configured", () => {
      const userInput: UserInput = {
        distance: { quantity: 1, unit: "km", defined: true },
        time: { minutes: 16, seconds: 40, defined: true },
        velocity: { quantityPaceMinutes: 2, unit: "/km", defined: true },
      };

      it("throws error", () => {
        expect(() => calculateResults(userInput)).toThrowError(
          "Illegal state: Too many things defined",
        );
      });
    });

    describe("Distance and time configured", () => {
      const userInput: UserInput = {
        distance: { quantity: 1, unit: "km", defined: true },
        time: { minutes: 16, seconds: 40, defined: true },
        velocity: { unit: "/km", defined: false },
      };

      it("works correctly", () => {
        const results: Results | null = calculateResults(userInput);

        expect(results?.distanceInMeters).toBe(1000);
        expect(results?.totalTimeInSeconds).toBe(1000);
        expect(results?.speedInMetersPerSecond).toBe(1);

        expect(results?.distance?.length).toBe(11);
        expect(results?.time?.length).toBe(3);
        expect(results?.pace?.length).toBe(13);
      });
    });

    describe("Distance and velocity configured", () => {
      const userInput: UserInput = {
        distance: { quantity: 400, unit: "m", defined: true },
        time: { defined: false },
        velocity: { quantityPaceSeconds: 10, unit: "/100m", defined: true },
      };

      it("works correctly", () => {
        const results: Results | null = calculateResults(userInput);

        expect(results?.distanceInMeters).toBe(400);
        expect(results?.totalTimeInSeconds).toBe(40);
        expect(results?.speedInMetersPerSecond).toBe(10);

        expect(results?.distance?.length).toBe(11);
        expect(results?.time?.length).toBe(3);
        expect(results?.pace?.length).toBe(13);
      });
    });

    describe("Time and velocity configured", () => {
      const userInput: UserInput = {
        distance: { unit: "km", defined: false },
        time: { seconds: 30, defined: true },
        velocity: { quantitySpeed: 50, unit: "m/s", defined: true },
      };

      it("works correctly", () => {
        const results: Results | null = calculateResults(userInput);

        expect(results?.distanceInMeters).toBe(1500);
        expect(results?.totalTimeInSeconds).toBe(30);
        expect(results?.speedInMetersPerSecond).toBe(50);

        expect(results?.distance?.length).toBe(11);
        expect(results?.time?.length).toBe(3);
        expect(results?.pace?.length).toBe(13);
      });
    });

    describe("Distance configured", () => {
      const userInput: UserInput = {
        distance: { quantity: 12, unit: "400mLap", defined: true },
        time: { defined: false },
        velocity: { unit: "/km", defined: false },
      };

      it("works correctly", () => {
        const results: Results | null = calculateResults(userInput);

        expect(results?.distanceInMeters).toBe(4800);
        expect(results?.totalTimeInSeconds).toBeUndefined();
        expect(results?.speedInMetersPerSecond).toBeUndefined();

        expect(results?.distance?.length).toBe(11);
        expect(results?.time?.length).toBeUndefined();
        expect(results?.pace?.length).toBeUndefined(); // TODO velocity instead of pace?
      });
    });

    describe("Time configured", () => {
      const userInput: UserInput = {
        distance: { unit: "400mLap", defined: false },
        time: { hours: 1, minutes: 2, seconds: 25, defined: true },
        velocity: { unit: "/km", defined: false },
      };

      it("works correctly", () => {
        const results: Results | null = calculateResults(userInput);

        expect(results?.distanceInMeters).toBeUndefined();
        expect(results?.totalTimeInSeconds).toBe(3745);
        expect(results?.speedInMetersPerSecond).toBeUndefined();

        expect(results?.distance?.length).toBeUndefined();
        expect(results?.time?.length).toBe(3);
        expect(results?.pace?.length).toBeUndefined(); // TODO velocity instead of pace?
      });
    });

    describe("Velocity configured", () => {
      describe("Pace configured", () => {
        const userInput: UserInput = {
          distance: { unit: "400mLap", defined: false },
          time: { defined: false },
          velocity: {
            quantityPaceMinutes: 3,
            quantityPaceSeconds: 20,
            unit: "/km",
            defined: true,
          },
        };

        it("works correctly", () => {
          const results: Results | null = calculateResults(userInput);

          expect(results?.distanceInMeters).toBeUndefined();
          expect(results?.totalTimeInSeconds).toBeUndefined();
          expect(results?.speedInMetersPerSecond).toBe(5);

          expect(results?.distance?.length).toBeUndefined();
          expect(results?.time?.length).toBeUndefined();
          expect(results?.pace?.length).toBe(13);
        });
      });

      describe("Speed configured", () => {
        const userInput: UserInput = {
          distance: { unit: "400mLap", defined: false },
          time: { defined: false },
          velocity: { quantitySpeed: 90, unit: "km/h", defined: true },
        };

        it("works correctly", () => {
          const results: Results | null = calculateResults(userInput);

          expect(results?.distanceInMeters).toBeUndefined();
          expect(results?.totalTimeInSeconds).toBeUndefined();
          expect(results?.speedInMetersPerSecond).toBe(25);

          expect(results?.distance?.length).toBeUndefined();
          expect(results?.time?.length).toBeUndefined();
          expect(results?.pace?.length).toBe(13);
        });
      });
    });
  });

  describe("Calculate split times", () => {
    describe("calculateSplitTimes", () => {
      describe("Marathon", () => {
        it("Kilometer splits", () => {
          const userInput: UserInput = {
            distance: { quantity: 42195, unit: "m", defined: true },
            splitDistance: "km",
            time: { defined: false },
            velocity: { quantityPaceMinutes: 10, unit: "/km", defined: true },
          };

          const results: Results | null = calculateResults(userInput);

          const splitTimes: SplitTimeItem[] | null = calculateSplitTimes(
            userInput,
            results!,
          );

          const { first, length, last } = getFirstAndLastItems<SplitTimeItem>(
            splitTimes!,
          );

          expect(length).toBe(43);

          expect(first.distance.quantity).toBe(1);
          expect(prettifySeconds(first.time.totalSeconds!)).toBe("10:00");

          expect(last.distance.quantity).toBe(42.195);
          expect(prettifySeconds(last.time.totalSeconds!)).toBe("7:01:57");
        });

        describe("Mile splits", () => {
          const userInput: UserInput = {
            distance: { quantity: 42195, unit: "m", defined: true },
            splitDistance: "mi",
            time: { defined: false },
            velocity: { quantityPaceMinutes: 10, unit: "/km", defined: true },
          };

          const results: Results | null = calculateResults(userInput);

          const splitTimes: SplitTimeItem[] | null = calculateSplitTimes(
            userInput,
            results!,
          );

          const { first, length, last } = getFirstAndLastItems<SplitTimeItem>(
            splitTimes!,
          );

          expect(length).toBe(27);

          expect(first.distance.quantity).toBe(1);
          expect(prettifySeconds(first.time.totalSeconds!)).toBe("16:06");

          expect(last.distance.quantity).toBeCloseTo(26.22);
          expect(prettifySeconds(last.time.totalSeconds!)).toBe("7:01:57");
        });
      });

      describe("10 km", () => {
        describe("Kilometer splits", () => {
          const userInput: UserInput = {
            distance: { quantity: 10, unit: "km", defined: true },
            splitDistance: "km",
            time: { defined: false },
            velocity: { quantityPaceMinutes: 4, unit: "/km", defined: true },
          };

          const results: Results | null = calculateResults(userInput);

          const splitTimes: SplitTimeItem[] | null = calculateSplitTimes(
            userInput,
            results!,
          );

          const { first, length, last } = getFirstAndLastItems<SplitTimeItem>(
            splitTimes!,
          );

          expect(length).toBe(10);

          expect(first.distance.quantity).toBe(1);
          expect(prettifySeconds(first.time.totalSeconds!)).toBe("4:00");

          expect(last.distance.quantity).toBe(10);
          expect(prettifySeconds(last.time.totalSeconds!)).toBe("40:00");
        });

        describe("Mile splits", () => {
          const userInput: UserInput = {
            distance: { quantity: 10, unit: "km", defined: true },
            splitDistance: "mi",
            time: { defined: false },
            velocity: { quantityPaceMinutes: 4, unit: "/km", defined: true },
          };

          const results: Results | null = calculateResults(userInput);

          const splitTimes: SplitTimeItem[] | null = calculateSplitTimes(
            userInput,
            results!,
          );

          const { first, length, last } = getFirstAndLastItems<SplitTimeItem>(
            splitTimes!,
          );

          expect(length).toBe(7);

          expect(first.distance.quantity).toBe(1);
          expect(prettifySeconds(first.time.totalSeconds!)).toBe("6:26");

          expect(last.distance.quantity).toBeCloseTo(6.21);
          expect(prettifySeconds(last.time.totalSeconds!)).toBe("40:00");
        });
      });
    });
  });
});
