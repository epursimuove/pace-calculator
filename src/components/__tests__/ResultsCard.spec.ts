import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ResultsCard from "@/components/ResultsCard.vue";

describe("ResultsCard", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ResultsCard, {
      props: {
        label: "My label",
        resultItems: [
          { quantity: "123", unit: "ft", unitLabel: "Feet" },
          { quantity: "246", unit: "nmi" },
        ],
      },
    });
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain(`class="results-card"`);
  });

  it("contains label", () => {
    expect(wrapper.text()).toContain("My label");
  });

  it("contains list", () => {
    expect(wrapper.text()).toContain("123");
    expect(wrapper.text()).toContain("Feet");
    expect(wrapper.text()).toContain("246");
    expect(wrapper.text()).toContain("nmi");
  });
});
