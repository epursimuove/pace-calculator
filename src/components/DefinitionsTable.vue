<script setup lang="ts">
import { distanceDefinitions, isPaceUnit } from "@/util.ts";
import type {
  Definition,
  DistanceUnit,
  PaceUnit,
  SpeedUnit,
  VelocityUnit,
} from "@/types/types.ts";

const props = defineProps<{
  definitions:
    | Definition<DistanceUnit>[]
    | Definition<PaceUnit>[]
    | Definition<SpeedUnit>[];
  type: "distance" | "pace" | "speed";
}>();
</script>

<template>
  <div class="table-wrapper">
    <table class="definitions-table">
      <caption>
        All the
        {{
          props.type
        }}
        definitions
      </caption>
      <thead>
        <tr>
          <th></th>
          <th>Unit</th>
          <th>Factor</th>
          <th>Label</th>
          <th v-if="type === 'distance'">Split time label</th>
          <!--      <th v-if="type === 'velocity'">-->
          <!--        Type-->
          <!--      </th>-->
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(definition, index) in props.definitions"
          :key="definition.unit"
          :class="{ 'si-unit': definition.factor === 1 }"
        >
          <td class="meta number">
            {{ index + 1 }}
          </td>
          <td>
            {{ definition.unit }}
          </td>
          <td class="number">
            {{ definition.factor.toFixed(4) }}
          </td>
          <td>
            {{ definition.label }}
          </td>
          <td v-if="type === 'distance'">
            {{ definition.splitTimeLabel }}
          </td>
          <!--      <td v-if="type === 'velocity'">-->
          <!--        {{isPaceUnit(definition.unit) ? "Pace" : "Speed" }}-->
          <!--      </td>-->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  max-width: 95vw;
  overflow-x: auto;
}

.si-unit {
  font-weight: bold;
}
</style>
