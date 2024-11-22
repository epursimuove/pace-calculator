<script setup lang="ts">
import { atLeastDigits, atMostDecimals, prettifySeconds } from "../util";
import { computed, type ComputedRef } from "vue";
import type { SplitTimeItem } from "@/types/types.ts";

const props = defineProps<{
  splitTimes: SplitTimeItem[];
}>();

const groupSize = 10;

const numberOfSplits: ComputedRef<number> = computed(
  () => props.splitTimes.length,
);

const slicedSplitTimes: ComputedRef<SplitTimeItem[][]> = computed(() => {
  const numberOfGroups: number = Math.ceil(numberOfSplits.value / groupSize);

  const sliced: SplitTimeItem[][] = [];

  for (let i = 0; i < numberOfGroups; i++) {
    const startIndex = i * groupSize;
    const endIndex = startIndex + groupSize;
    sliced.push(props.splitTimes.slice(startIndex, endIndex));
  }

  return sliced;
});

const everyFifth = (index: number) => (index + 1) % 5 === 0;

const lastSplitItem = (index: number, groupIndex: number) =>
  groupIndex * 10 + index + 1 === props.splitTimes.length;

const emphasizeSplit = (
  index: number,
  groupIndex: number,
  listLength: number,
) => {
  return everyFifth(index) || lastSplitItem(index, groupIndex);
};
</script>

<template>
  <fieldset class="split-times-board board">
    <legend>{{ splitTimes.length }} Split times</legend>

    <article class="split-times-wrapper">
      <div
        v-for="(splitTimeItemsGroup, groupIndex) in slicedSplitTimes"
        :key="groupIndex"
        class="at-most-ten-splits"
      >
        <template
          v-for="(splitTimeItem, index) in splitTimeItemsGroup"
          :key="index"
          class="split-time-row"
        >
          <div
            class="split-distance"
            :class="{
              emphasize: emphasizeSplit(index, groupIndex, splitTimes.length),
            }"
          >
            <template v-if="splitTimeItem.distance.quantity">
              {{ atMostDecimals(splitTimeItem.distance.quantity, 2) }}
              {{ splitTimeItem.distance.label }}
            </template>
          </div>
          <div
            class="split-time"
            :class="{
              emphasize: emphasizeSplit(index, groupIndex, splitTimes.length),
            }"
          >
            {{ prettifySeconds(splitTimeItem.time.totalSeconds!) }}
          </div>
        </template>
      </div>
    </article>
  </fieldset>
</template>

<style scoped>
.split-times-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4rem;

  white-space: nowrap;
  font-family: var(--font-family-monospace);

  & > .at-most-ten-splits {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem 1.5rem;
    height: min-content;

    & > div {
      text-align: end;

      &.emphasize {
        font-weight: bold;
      }
    }
  }

  & > .split-time-row {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;

    & > div {
      text-align: end;
    }
  }
}
</style>
