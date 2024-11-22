<script setup lang="ts">
import type {
  DistanceUnit,
  ResultItem,
  TimeUnit,
  VelocityUnit,
} from "@/types/types.ts";

const props = defineProps<{
  label: string;
  resultItems:
    | ResultItem<DistanceUnit>[]
    | ResultItem<TimeUnit>[]
    | ResultItem<VelocityUnit>[];
}>();
</script>

<template>
  <article class="results-card">
    <header>{{ label }}</header>

    <div
      v-for="(resultRow, index) in resultItems"
      :key="index"
      class="result-row"
      :class="{ 'user-defined': resultRow.userDefined }"
    >
      <div>
        {{ resultRow.quantity }}
      </div>

      <div v-if="resultRow.unitLabel">
        {{ resultRow.unitLabel }}
      </div>
      <div v-else>
        {{ resultRow.unit }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.results-card {
  border: 1px solid var(--color-border-card);
  border-radius: 0.5rem;
  min-width: 15rem;
  width: min-content;
  height: min-content;

  & > header {
    font-weight: bold;
    text-align: center;
    text-transform: capitalize;
    border-block-end: 1px solid var(--color-border-card);
  }

  & > .result-row {
    display: flex;
    gap: 0.9rem;
    white-space: nowrap;

    & > div {
      flex: 1;

      &:first-child {
        text-align: end;
        font-family: var(--font-family-monospace);
      }
    }
  }

  & > .user-defined {
    font-weight: bold;
  }
}
</style>
