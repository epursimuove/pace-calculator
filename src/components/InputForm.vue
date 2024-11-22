<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  onMounted,
  type Ref,
  useTemplateRef,
} from "vue";
import {
  distanceDefinitions,
  isPaceUnit,
  paceDefinitions,
  speedDefinitions,
} from "@/util";
import type { UserInput } from "@/types/types.ts";
import {
  type RouteLocationNormalizedLoadedGeneric,
  useRoute,
} from "vue-router";

const userInput: Ref<UserInput> = defineModel<UserInput>({ required: true });

const paceIsTimePerDistance: ComputedRef<boolean> = computed(() =>
  isPaceUnit(userInput.value.velocity.unit),
);

const route: RouteLocationNormalizedLoadedGeneric = useRoute();

const distanceQuantityInputElement: Ref<HTMLInputElement | null> =
  useTemplateRef("distance-quantity");

onMounted(() => {
  if (route.name === "calculator") {
    distanceQuantityInputElement.value?.focus();
  }
});
</script>

<template>
  <fieldset class="input-form-board board">
    <legend>NNM Pace Calculator</legend>

    <form class="input-form">
      <div class="distance-configuration">
        <label for="distance-quantity">Distance</label>
        <div>
          <input
            id="distance-quantity"
            name="distance-quantity"
            ref="distance-quantity"
            v-model="userInput.distance.quantity"
            type="number"
            min="0"
            max="999999"
          />

          <select name="distance-unit" v-model="userInput.distance.unit">
            <option
              v-for="definition in distanceDefinitions"
              :key="definition.unit"
              :value="definition.unit"
            >
              {{ definition.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="split-distance-configuration">
        <label for="split-distance-unit">Split distance</label>
        <div>
          <select
            id="split-distance-unit"
            name="split-distance-unit"
            v-model="userInput.splitDistance"
          >
            <option value=""></option>

            <option
              v-for="definition in distanceDefinitions"
              :key="definition.unit"
              :value="definition.unit"
            >
              {{ definition.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="time-configuration">
        <label for="hour-quantity">Time <small>hh:mm:ss</small></label>
        <div>
          <input
            id="hour-quantity"
            name="hour-quantity"
            type="number"
            min="0"
            max="9999"
            v-model="userInput.time.hours"
          />
          :
          <input
            name="minute-quantity"
            type="number"
            min="0"
            max="9999"
            v-model="userInput.time.minutes"
          />
          :
          <input
            name="second-quantity"
            type="number"
            min="0"
            max="9999"
            v-model="userInput.time.seconds"
          />
        </div>
      </div>

      <div class="pace-configuration">
        <label v-if="paceIsTimePerDistance" for="pace-minute-quantity">
          Pace <small>mm:ss</small>
        </label>
        <label v-else for="speed-quantity"> Speed </label>

        <div>
          <template v-if="paceIsTimePerDistance">
            <input
              id="pace-minute-quantity"
              name="pace-minute-quantity"
              type="number"
              min="0"
              max="9999"
              v-model="userInput.velocity.quantityPaceMinutes"
            />
            :
            <input
              name="pace-second-quantity"
              type="number"
              min="0"
              max="9999"
              v-model="userInput.velocity.quantityPaceSeconds"
            />
          </template>

          <template v-else>
            <input
              id="speed-quantity"
              name="speed-quantity"
              type="number"
              min="0"
              max="9999"
              v-model="userInput.velocity.quantitySpeed"
            />
          </template>

          <select name="pace-unit" v-model="userInput.velocity.unit">
            <optgroup label="Pace: time / distance">
              <option
                v-for="definition in paceDefinitions"
                :key="definition.unit"
                :value="definition.unit"
              >
                {{ definition.unit }}
              </option>
            </optgroup>

            <optgroup label="Speed: distance / time">
              <option
                v-for="definition in speedDefinitions"
                :key="definition.unit"
                :value="definition.unit"
              >
                {{ definition.unit }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
    </form>
  </fieldset>
</template>

<style scoped>
.input-form {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-row-gap: 1rem;
  grid-column-gap: 0.2rem;

  padding: 0.1rem;

  & > div {
    display: grid;
    grid-column: span 2;
    grid-template-columns: subgrid;

    & > div {
      display: flex;
      gap: 0.4rem;
    }
  }

  & label {
    white-space: nowrap;

    & > small {
      color: var(--color-footer);
    }
  }
}

input {
  text-align: end;
  font-family: Menlo, Courier, monospace;
  font-weight: bold;
}
</style>
