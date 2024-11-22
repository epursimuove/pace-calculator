import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import SplitTimesBoard from "@/components/SplitTimesBoard.vue";

describe("SplitTimesBoard", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(SplitTimesBoard, {
      props: {
        splitTimes: [
          {
            distance: { quantity: 1, unit: "km", label: "km", defined: false },
            time: { totalSeconds: 45, defined: false },
          },
          {
            distance: { quantity: 2, unit: "km", label: "km", defined: false },
            time: { totalSeconds: 90, defined: false },
          },
          {
            distance: { quantity: 3, unit: "km", label: "km", defined: false },
            time: { totalSeconds: 135, defined: false },
          },
        ],
      },
    });
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain(`class="split-times-board board"`);
  });

  it("contains legend", () => {
    expect(wrapper.text()).toContain("3 Split times");
  });

  it("contains split items", () => {
    expect(wrapper.text()).toContain("1 km");
    expect(wrapper.text()).toContain("0:45");
    expect(wrapper.text()).toContain("2 km");
    expect(wrapper.text()).toContain("1:30");
    expect(wrapper.text()).toContain("3 km");
    expect(wrapper.text()).toContain("2:15");
  });
});
