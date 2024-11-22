import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ResultsBoard from "@/components/ResultsBoard.vue";

describe("ResultsBoard", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ResultsBoard, {
      props: {
        results: {
          distance: [
            { quantity: "123", unit: "ft", unitLabel: "Feet" },
            { quantity: "246", unit: "nmi" },
          ],
          time: [
            { quantity: "987", unit: "min" },
            { quantity: "543", unit: "s" },
          ],
          pace: [
            { quantity: "4.5", unit: "m/s" },
            { quantity: "9.12", unit: "knots", unitLabel: "Nautical miles" },
          ],
          distanceInMeters: 999,
          totalTimeInSeconds: 555,
          speedInMetersPerSecond: 777,
        },
      },
    });
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain(`class="results-board board"`);
  });

  it("contains legend", () => {
    expect(wrapper.text()).toContain("Results");
  });

  it("contains labels", () => {
    expect(wrapper.text()).toContain("distance");
    expect(wrapper.text()).toContain("time");
    expect(wrapper.text()).toContain("pace");
  });

  it("contains lists", () => {
    expect(wrapper.text()).toContain("123");
    expect(wrapper.text()).toContain("Feet");
    expect(wrapper.text()).toContain("246");
    expect(wrapper.text()).toContain("nmi");

    expect(wrapper.text()).toContain("987");
    expect(wrapper.text()).toContain("min");
    expect(wrapper.text()).toContain("543");
    expect(wrapper.text()).toContain("s");

    expect(wrapper.text()).toContain("4.5");
    expect(wrapper.text()).toContain("m/s");
    expect(wrapper.text()).toContain("9.12");
    expect(wrapper.text()).toContain("Nautical miles");
  });
});
