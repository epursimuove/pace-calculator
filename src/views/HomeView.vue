<script setup lang="ts">
import InputForm from "@/components/InputForm.vue";
import ResultsBoard from "@/components/ResultsBoard.vue";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import {
  definedAndLargerThanZero,
  dummySplitTimes,
  isPaceUnit,
  isSpeedUnit,
} from "@/util";
import SplitTimesBoard from "@/components/SplitTimesBoard.vue";
import type {
  UserInput,
  Results,
  SplitTimeItem,
  Time,
  Distance,
  Velocity,
} from "@/types/types.ts";
import { calculateResults, calculateSplitTimes } from "@/calculator.ts";

const userInput: Ref<UserInput> = ref({
  // distance: { quantity: 1, unit: "km", defined: false },
  distance: { unit: "km", defined: false },
  // splitDistance: null,
  time: { defined: false },
  velocity: { unit: "/km", defined: false },
  // velocity: {quantityPaceMinutes: 4, unit: "/km"},
  // velocity: {quantitySpeed: 1, unit: "m/s", defined: false},
});

const results: ComputedRef<Results | null> = computed(() => {
  if (
    validForm.value &&
    (userInput.value.distance.defined ||
      userInput.value.time.defined ||
      userInput.value.velocity.defined)
  ) {
    return calculateResults(userInput.value);
  } else {
    return null;
  }
});

const splitTimes: ComputedRef<SplitTimeItem[] | null> = computed(() => {
  if (validForm.value && results.value) {
    return calculateSplitTimes(userInput.value, results.value);
  } else {
    return null;
  }
});

const validForm: ComputedRef<boolean> = computed(() => {
  const { distance, splitDistance, time, velocity } = userInput.value;

  const { quantity: distanceQuantity, unit: distanceUnit }: Distance = distance;
  const { totalSeconds, hours, minutes, seconds }: Time = time;
  const {
    quantityPaceMinutes,
    quantityPaceSeconds,
    quantitySpeed,
    unit: velocityUnit,
  }: Velocity = velocity;

  const distanceDefined: boolean = definedAndLargerThanZero(distanceQuantity);

  const timeDefined: boolean =
    definedAndLargerThanZero(totalSeconds) ||
    definedAndLargerThanZero(hours) ||
    definedAndLargerThanZero(minutes) ||
    definedAndLargerThanZero(seconds);

  const paceDefined: boolean =
    isPaceUnit(velocityUnit) &&
    (definedAndLargerThanZero(quantityPaceMinutes) ||
      definedAndLargerThanZero(quantityPaceSeconds));

  const speedDefined: boolean =
    isSpeedUnit(velocityUnit) && definedAndLargerThanZero(quantitySpeed);

  const velocityDefined: boolean = paceDefined || speedDefined;

  // Save the values for easy access in calculation function.
  userInput.value.distance.defined = distanceDefined;
  userInput.value.time.defined = timeDefined;
  userInput.value.velocity.defined = velocityDefined;

  return !(distanceDefined && timeDefined && velocityDefined);
});
</script>

<template>
  <main>
    <InputForm
      v-model="userInput"
      @changeDistanceQuantity="
        (distanceQuantity: number) =>
          console.log(`Received distance quantity: ${distanceQuantity}`)
      "
    />

    <p v-if="!validForm" class="error-message">
      At most two of distance, time and pace can be defined!
    </p>

    <ResultsBoard v-if="results" :results="results" />

    <SplitTimesBoard v-if="splitTimes" :splitTimes="splitTimes" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
