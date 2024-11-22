import { describe, it, expect } from "vitest";
import {
  atLeastDigits,
  atMostDecimals,
  calculateDistanceInMeters,
  calculateSpeedInMetersPerSecond,
  calculateTotalTimeInSeconds,
  definedAndLargerThanZero,
  findMatchingDefinition,
  getDistanceInMeters,
  getFirstAndLastItems,
  getSpeedInMetersPerSecond,
  getTotalTimeInSeconds,
  handleIllegalStateAndCreateError,
  isPaceUnit,
  isSpeedUnit,
  prettifySeconds,
  prettifySecondsToMinutes,
} from "@/util.ts";
import type { Definition, VelocityUnit } from "@/types/types.ts";

describe("util.ts", () => {
  describe("isPaceUnit", () => {
    it("for paces", () => {
      expect(isPaceUnit("/km")).toBe(true);
      expect(isPaceUnit("/mi")).toBe(true);
      expect(isPaceUnit("/100m")).toBe(true);
    });

    it("for speeds", () => {
      expect(isPaceUnit("km/h")).toBe(false);
      expect(isPaceUnit("mph")).toBe(false);
      expect(isPaceUnit("m/s")).toBe(false);
    });
  });

  describe("isSpeedUnit", () => {
    it("for paces", () => {
      expect(isSpeedUnit("/km")).toBe(false);
      expect(isSpeedUnit("/mi")).toBe(false);
      expect(isSpeedUnit("/100m")).toBe(false);
    });

    it("for speeds", () => {
      expect(isSpeedUnit("km/h")).toBe(true);
      expect(isSpeedUnit("mph")).toBe(true);
      expect(isSpeedUnit("m/s")).toBe(true);
    });
  });

  describe("findMatchingDefinition", () => {
    it("works correctly", () => {
      const definitions: Definition<VelocityUnit>[] = [
        { unit: "/100m", factor: 1 },
        { unit: "/200m", factor: 2 },
        { unit: "km/h", factor: 3 },
        { unit: "ft/s", factor: 4 },
        { unit: "knots", factor: 5 },
      ];

      expect(findMatchingDefinition(definitions, "/100m").factor).toBe(1);
      expect(findMatchingDefinition(definitions, "ft/s").factor).toBe(4);
      expect(findMatchingDefinition(definitions, "knots").factor).toBe(5);
      expect(
        () => findMatchingDefinition(definitions, "m/s").factor,
      ).toThrowError(Error);
    });
  });

  describe("definedAndLargerThanZero", () => {
    it("works correctly", () => {
      expect(definedAndLargerThanZero(undefined)).toBe(false);
      expect(definedAndLargerThanZero(0)).toBe(false);
      expect(definedAndLargerThanZero(0.1)).toBe(true);
      expect(definedAndLargerThanZero(1)).toBe(true);
      expect(definedAndLargerThanZero(-1)).toBe(false);
    });
  });

  describe("prettifySeconds", () => {
    it("works correctly", () => {
      expect(prettifySeconds(0)).toBe("0:00");
      expect(prettifySeconds(59)).toBe("0:59");
      expect(prettifySeconds(59.1)).toBe("0:59");
      expect(prettifySeconds(59.999)).toBe("1:00");
      expect(prettifySeconds(60)).toBe("1:00");
      expect(prettifySeconds(90)).toBe("1:30");
      expect(prettifySeconds(305)).toBe("5:05");
      expect(prettifySeconds(3600)).toBe("1:00:00");
      expect(prettifySeconds(24 * 60 * 60)).toBe("24:00:00");
    });
  });

  describe("prettifySecondsToMinutes", () => {
    it("works correctly", () => {
      expect(prettifySecondsToMinutes(0)).toBe("0.00");
      expect(prettifySecondsToMinutes(45)).toBe("0.75");
      expect(prettifySecondsToMinutes(59.1)).toBe("0.98");
      expect(prettifySecondsToMinutes(59.999)).toBe("1.00");
      expect(prettifySecondsToMinutes(60)).toBe("1.00");
      expect(prettifySecondsToMinutes(90)).toBe("1.50");
      expect(prettifySecondsToMinutes(310)).toBe("5.17");
      expect(prettifySecondsToMinutes(312)).toBe("5.20");
      expect(prettifySecondsToMinutes(3600)).toBe("60.00");
      expect(prettifySecondsToMinutes(24 * 60 * 60)).toBe("1440.00");
    });
  });

  describe("atLeastDigits", () => {
    it("works correctly for 3 digits", () => {
      expect(atLeastDigits(0, 3)).toBe("0.00");
      expect(atLeastDigits(0.98765, 3)).toBe("0.99");
      expect(atLeastDigits(1, 3)).toBe("1.00");
      expect(atLeastDigits(1.234, 3)).toBe("1.23");
      expect(atLeastDigits(99, 3)).toBe("99.0");
      expect(atLeastDigits(999, 3)).toBe("999");
      expect(atLeastDigits(1000, 3)).toBe("1000");
    });

    it("works correctly for 4 digits", () => {
      expect(atLeastDigits(0, 4)).toBe("0.000");
      expect(atLeastDigits(0.98765, 4)).toBe("0.988");
      expect(atLeastDigits(1, 4)).toBe("1.000");
      expect(atLeastDigits(1.234, 4)).toBe("1.234");
      expect(atLeastDigits(1.2345, 4)).toBe("1.234");
      expect(atLeastDigits(99, 4)).toBe("99.00");
      expect(atLeastDigits(999, 4)).toBe("999.0");
      expect(atLeastDigits(1000, 4)).toBe("1000");
      expect(atLeastDigits(10000, 4)).toBe("10000");
    });
  });

  describe("atMostDecimals", () => {
    it("works correctly for 1 digits", () => {
      expect(atMostDecimals(0, 1)).toBe("0");
      expect(atMostDecimals(0.98765, 1)).toBe("1.0");
      expect(atMostDecimals(1, 1)).toBe("1");
      expect(atMostDecimals(1.234, 1)).toBe("1.2");
      expect(atMostDecimals(1.2345, 1)).toBe("1.2");
      expect(atMostDecimals(1.67, 1)).toBe("1.7");
      expect(atMostDecimals(1.9, 1)).toBe("1.9");
      expect(atMostDecimals(99, 1)).toBe("99");
      expect(atMostDecimals(999, 1)).toBe("999");
      expect(atMostDecimals(1000, 1)).toBe("1000");
      expect(atMostDecimals(10000, 1)).toBe("10000");
    });

    it("works correctly for 2 digits", () => {
      expect(atMostDecimals(0, 2)).toBe("0");
      expect(atMostDecimals(0.98765, 2)).toBe("0.99");
      expect(atMostDecimals(1, 2)).toBe("1");
      expect(atMostDecimals(1.234, 2)).toBe("1.23");
      expect(atMostDecimals(1.9, 2)).toBe("1.9");
      expect(atMostDecimals(99, 2)).toBe("99");
      expect(atMostDecimals(999, 2)).toBe("999");
      expect(atMostDecimals(1000, 2)).toBe("1000");
    });
  });

  describe("getDistanceInMeters", () => {
    it("works correctly", () => {
      expect(
        getDistanceInMeters({ quantity: 3, unit: "200mLap", defined: false }),
      ).toBe(600);
      expect(
        getDistanceInMeters({ quantity: 4, unit: "500mSplit", defined: false }),
      ).toBe(2000);
      expect(
        getDistanceInMeters({ quantity: 50, unit: "m", defined: false }),
      ).toBe(50);
      expect(
        getDistanceInMeters({ quantity: 1.5, unit: "km", defined: false }),
      ).toBe(1500);
      expect(
        getDistanceInMeters({ quantity: 1, unit: "mi", defined: false }),
      ).toBe(1609.344);
    });
  });

  describe("getTotalTimeInSeconds", () => {
    it("works correctly", () => {
      expect(getTotalTimeInSeconds({ seconds: 10, defined: false })).toBe(10);
      expect(getTotalTimeInSeconds({ seconds: 59, defined: false })).toBe(59);
      expect(getTotalTimeInSeconds({ minutes: 1, defined: false })).toBe(60);
      expect(getTotalTimeInSeconds({ minutes: 2, defined: false })).toBe(120);
      expect(getTotalTimeInSeconds({ hours: 2, defined: false })).toBe(7200);
      expect(
        getTotalTimeInSeconds({
          hours: 1,
          minutes: 1,
          seconds: 1,
          defined: false,
        }),
      ).toBe(3661);
    });
  });

  describe("getSpeedInMetersPerSecond", () => {
    it("works correctly for paces", () => {
      expect(
        getSpeedInMetersPerSecond({
          quantityPaceSeconds: 1000,
          unit: "/km",
          defined: false,
        }),
      ).toBe(1);
      expect(
        getSpeedInMetersPerSecond({
          quantityPaceSeconds: 2000,
          unit: "/km",
          defined: false,
        }),
      ).toBe(0.5);
      expect(
        getSpeedInMetersPerSecond({
          quantityPaceSeconds: 40,
          unit: "/100m",
          defined: false,
        }),
      ).toBe(2.5);
      expect(
        getSpeedInMetersPerSecond({
          quantityPaceMinutes: 1,
          unit: "/200m",
          defined: false,
        }),
      ).toBeCloseTo(3.33);
    });

    it("works correctly for speeds", () => {
      expect(
        getSpeedInMetersPerSecond({
          quantitySpeed: 10,
          unit: "m/s",
          defined: false,
        }),
      ).toBe(10);
      expect(
        getSpeedInMetersPerSecond({
          quantitySpeed: 36,
          unit: "km/h",
          defined: false,
        }),
      ).toBe(10);
      expect(
        getSpeedInMetersPerSecond({
          quantitySpeed: 10,
          unit: "knots",
          defined: false,
        }),
      ).toBeCloseTo(5.14);
      expect(
        getSpeedInMetersPerSecond({
          quantitySpeed: 10,
          unit: "ft/s",
          defined: false,
        }),
      ).toBeCloseTo(3.048);
    });
  });

  describe("calculateDistanceInMeters", () => {
    it("works correctly", () => {
      expect(calculateDistanceInMeters(10, 10)).toBe(100);
      expect(calculateDistanceInMeters(50, 50)).toBe(2500);
      expect(calculateDistanceInMeters(20, 4)).toBe(80);
    });
  });

  describe("calculateTotalTimeInSeconds", () => {
    it("works correctly", () => {
      expect(calculateTotalTimeInSeconds(10, 10)).toBe(1);
      expect(calculateTotalTimeInSeconds(50, 50)).toBe(1);
      expect(calculateTotalTimeInSeconds(20, 4)).toBe(5);
    });
  });

  describe("calculateSpeedInMetersPerSecond", () => {
    it("works correctly", () => {
      expect(calculateSpeedInMetersPerSecond(10, 10)).toBe(1);
      expect(calculateSpeedInMetersPerSecond(50, 50)).toBe(1);
      expect(calculateSpeedInMetersPerSecond(20, 4)).toBe(5);
      expect(calculateSpeedInMetersPerSecond(1000, 50)).toBe(20);
    });
  });

  describe("handleIllegalStateAndCreateError", () => {
    it("works correctly", () => {
      expect(handleIllegalStateAndCreateError("Test", { foo: 123 })).toEqual(
        new Error("Illegal state: Test"),
      );
      expect(handleIllegalStateAndCreateError("Test")).toEqual(
        new Error("Illegal state: Test"),
      );
    });
  });

  describe("getFirstAndLastItems", () => {
    it("when many elements", () => {
      const { first, length, last } = getFirstAndLastItems<string>([
        "one",
        "two",
        "three",
        "four",
      ]);

      expect(first).toBe("one");
      expect(last).toBe("four");
      expect(length).toBe(4);
    });

    it("when one element", () => {
      const { first, length, last } = getFirstAndLastItems<string>([
        "the one and only",
      ]);

      expect(first).toBe("the one and only");
      expect(last).toBe("the one and only");
      expect(length).toBe(1);
    });

    it("when empty", () => {
      const { first, length, last } = getFirstAndLastItems<string>([]);

      expect(first).toBeUndefined;
      expect(last).toBeUndefined;
      expect(length).toBe(0);
    });
  });
});
