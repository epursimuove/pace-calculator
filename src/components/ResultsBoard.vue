<script setup lang="ts">
import ResultsCard from "@/components/ResultsCard.vue";
import type { Results } from "@/types/types.ts";
import { computed, type ComputedRef } from "vue";

const props = defineProps<{
  results: Results;
}>();

type ResultsCardLists = Omit<
  Results,
  "distanceInMeters" | "totalTimeInSeconds" | "speedInMetersPerSecond"
>;

const resultsCardLists: ComputedRef<ResultsCardLists> = computed(
  () => props.results,
);
</script>

<template>
  <fieldset class="results-board board">
    <legend>Results</legend>

    <div class="results-card-wrapper">
      <template
        v-for="(resultsCard, name, index) in resultsCardLists"
        :key="index"
      >
        <ResultsCard
          v-if="resultsCard && resultsCard.length > 0"
          :label="name"
          :result-items="resultsCard"
        />
      </template>
    </div>
  </fieldset>
</template>

<style scoped>
.results-board {
  & > .results-card-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
