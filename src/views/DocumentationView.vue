<script setup lang="ts">
import {
  distanceDefinitions,
  paceDefinitions,
  speedDefinitions,
} from "@/util.ts";
import DefinitionsTable from "@/components/DefinitionsTable.vue";
import type { Results, SplitTimeItem, UserInput } from "@/types/types.ts";
import { calculateResults, calculateSplitTimes } from "@/calculator.ts";
import ResultsBoard from "@/components/ResultsBoard.vue";
import SplitTimesBoard from "@/components/SplitTimesBoard.vue";
import InputForm from "@/components/InputForm.vue";
import { ref, type Ref } from "vue";

const userInputExampleForInputForm: Ref<UserInput> = ref({
  distance: { unit: "km", defined: false },
  time: { defined: false },
  velocity: { unit: "ft/s", defined: false },
});

const resultsExampleWithDistance: Results | null = calculateResults({
  distance: { quantity: 10, unit: "mi", defined: true },
  time: { defined: false },
  velocity: { unit: "m/s", defined: false },
});

const resultsExampleWithTime: Results | null = calculateResults({
  distance: { unit: "km", defined: false },
  time: { hours: 1, minutes: 30, defined: true },
  velocity: { unit: "m/s", defined: false },
});

const resultsExampleWithVelocity: Results | null = calculateResults({
  distance: { unit: "km", defined: false },
  time: { defined: false },
  velocity: { quantitySpeed: 60, unit: "mph", defined: true },
});

const resultsExampleCalculatingTime: Results | null = calculateResults({
  distance: { quantity: 10000, unit: "m", defined: true },
  time: { defined: false },
  velocity: { quantityPaceMinutes: 3, unit: "/km", defined: true },
});

const userInputExample: UserInput = {
  distance: { quantity: 42.195, unit: "km", defined: true },
  splitDistance: "km",
  time: { hours: 4, defined: true },
  velocity: { unit: "ft/s", defined: false },
};

const resultsExample: Results | null = calculateResults(userInputExample);

const splitTimesExample: SplitTimeItem[] | null = calculateSplitTimes(
  userInputExample,
  resultsExample!,
);
</script>

<template>
  <main class="documentation">
    <header>Documentation</header>

    <p>
      With this really easy-to-use tool, especially designed for runners, you
      can (for example)
    </p>

    <ul>
      <li>calculate your own pace in different units</li>
      <li>make conversions between distances in different units</li>
      <li>make conversions between paces in different units</li>
      <li>calculate target split times in many ways</li>
    </ul>

    <p>
      The <em>NNM Pace Calculator</em> can be used in many different ways and
      here I list some of the functionality that I have found useful. You will
      probably find many other ways to use the calculator. Try it, you'll love
      it!
    </p>

    <p class="note">
      You will probably understand how to use the calculator without reading the
      documentation, but the documentation is here when you want to dig deeper.
    </p>

    <h1>Features and functionality</h1>

    <ul>
      <li>
        You can use it as a <em>distance converter</em>. Define a
        <em>distance</em> in one specific unit. Then the
        <em>distance can be converted to other units</em>.
      </li>

      <li>
        You can use it as a <em>pace converter</em>. Define a <em>pace</em> in
        one specific unit. Then the
        <em>pace can be converted to other units</em>.
      </li>

      <li>
        You can use it as a <em>pace calculator</em>. Define the
        <em>distance</em> in one specific unit and the <em>time</em>. Then the
        <em>pace</em> in several different units can be calculated. The
        <em>distance is also converted to the other units</em>.
      </li>

      <li>
        You can use it as a <em>time calculator</em>. Define a <em>pace</em> in
        one specific unit and the <em>distance</em>. Then the <em>time</em> can
        be calculated. The
        <em>pace and distance are also converted to the other units</em>.
      </li>

      <li>
        You can use it as a <em>distance calculator</em>. Define a
        <em>pace</em> in one specific unit and the <em>time</em>. Then the
        <em>distance</em> can be calculated. The
        <em>pace is also converted to the other units</em>.
      </li>

      <li>
        You can get a table with <em>split times</em> for different distances by
        defining a value in the <em>split distance</em> drop-down.
        <br />
        For example, suppose you plan to run 15 km with a target pace of 3:50
        /km. Then you fill in the <em>pace</em> (3:50 per km) and 15 kilometers
        in the <em>distance</em> field. You also define kilometers in the
        <em>split distance</em> drop-down.
        <br />
        You will see a board with the target split times for each kilometer. You
        also see the calculated target goal time, which is 57:30 in this
        example.
      </li>
    </ul>

    <h1>User interface</h1>

    <p>
      The user interface for the calculator contains three main parts that you
      can fill in: distance, time and pace. There are at most nine input fields
      that you can fill in (but of course you can't use all fields at the same
      time).
    </p>

    <h2>Valid input values</h2>

    <p>Use only <em>positive</em> numbers in the input fields.</p>

    <ul>
      <li><em>Distance</em> - positive decimal number.</li>

      <li>
        <em>Time</em> - hours, minutes and seconds. Positive integers. You can
        define the time in <code>hh:mm:ss</code>, <code>mm:ss</code> or in
        <code>s</code>. For example, you can define 2 minutes as
        <code>00:02:00</code>, <code>2 min</code> or as <code>120 s</code> and
        you can define 120 minutes as <code>02:00:00</code>,
        <code>120 min</code> or <code>7200 s</code>.
      </li>

      <li>
        <em>Pace</em> - when using &quot;distance per time&quot; you can fill in
        a positive decimal number. When using &quot;time per distance&quot; you
        can fill in minutes and seconds, which should be positive integers.
      </li>
    </ul>

    <h2>Results</h2>

    <p>
      When you have defined some input values, your results will show up. The
      results are shown in three cards (distance, time and pace), and depending
      on what input values you have defined either one or all of these columns
      are displayed. The distance and pace columns contain several rows showing
      you the results in several different units.
    </p>

    <p class="note">
      The minutes in the time result is shown as decimal numbers. For example,
      75 seconds is shown as <code>1.25</code> minutes (not
      <code>1:15</code> minutes).
    </p>

    <h2>Split times</h2>

    <p>
      If you have defined a value for <em>split distance</em> you will also see
      a table for the <em>split times</em>.
    </p>

    <p>
      An example is the best way to describe the <em>split times</em> table.
      Suppose you want to run a marathon in 4 hours and you want to know your
      target times for certain split distances. It is easy! Just define the
      <em>distance</em> as 42195 meters, the <em>time</em> as 4 hours and the
      <em>split distance</em> as kilometers. You will get target split times for
      each kilometer. If you prefer to see the target split times in miles
      (instead of kilometers), just change the <em>split distance</em> to miles.
    </p>

    <h1>Units</h1>

    <h2>Distance</h2>

    <p>The distances are compared to the SI-unit <em>m</em>.</p>

    <DefinitionsTable :definitions="distanceDefinitions" type="distance" />

    <h2>Velocity</h2>

    <p>
      Velocity is divided into <em>pace</em> units and <em>speed</em> units. The
      pace units are <em>time per distance</em> and the speed units are
      <em>distance per time</em>.
    </p>

    <p>
      The velocities are compared to the SI-unit <em>m/s</em>. Speeds are
      related to <em>m/s</em> and paces to the inverted <em>s/m</em>.
    </p>

    <h3>Pace</h3>

    <DefinitionsTable :definitions="paceDefinitions" type="pace" />

    <h3>Speed</h3>

    <DefinitionsTable :definitions="speedDefinitions" type="speed" />

    <p class="note">
      The factors are used a bit different in the calculations/conversions for
      pace and speed units.
    </p>

    <h2>Different length systems</h2>

    <p>
      The metric length system that is used nowadays is built around the number
      10. For those of you using inches, feet, yards and so on, it is not that
      &quot;easy&quot;, so here is a reminder:
    </p>

    <ul>
      <li>1 foot equals 12 inches.</li>
      <li>1 yard equals 3 feet (or 36 inches).</li>
      <li>1 mile equals 1760 yards (or 5280 feet or 15840 inches).</li>
    </ul>

    <h1>Mathematics</h1>

    <p>
      The really simple mathematical formula that is used for most of the
      calculations is of course
    </p>

    <pre>
      d = v * t
    </pre>

    <p>
      where <var>d</var> (unit <em>m</em>) is the <em>distance</em>,
      <var>v</var> (unit <em>m/s</em>) is the <em>speed/pace</em> and
      <var>t</var> (unit <em>s</em>) is the <em>time</em>.
    </p>

    <h1>Remarks</h1>

    <p>
      If the calculator is not working correctly or as you expect, you may find
      the reasons in the following remarks:
    </p>

    <ul>
      <li>
        The decimal point to use is the <em>dot</em> character &quot;.&quot; and
        not the <em>comma</em> character &quot;,&quot;. For example, the
        floating point number 12.5 is valid, but 12,5 is invalid.
      </li>

      <li>
        The input parameters defined by you for the calculation/conversion are
        marked in
        <strong>bold</strong> in the results board.
      </li>

      <li>
        If the input parameters contain errors, the errors are shown in
        <span class="error-message">red</span> below the pace calculator.
      </li>

      <li>
        If there are blank result rows or if they just show zeroes, the reason
        can be that the result values are to small (for example, time values
        less than a second may not be shown).
      </li>

      <li>
        The distance value used by the <em>400 m laps</em> (and
        <em>200 m laps</em>) is the number of laps, i.e. you can think of the
        unit as being 400 meters. For example, if you define 2.5
        <em>400 m laps</em>, this is equivalent to defining the distance as 1000
        meters.
        <br />
        It is the same with the <em>100 m splits</em> (and
        <em>500 m splits</em>).
      </li>

      <li>
        In the <em>hh:mm:ss</em> fields you can define the hours, minutes and
        seconds. In the <em>mm:ss</em> fields you can define the minutes and
        seconds.
      </li>

      <li>
        In the <em>distance</em> and <em>speed</em> input fields you can define
        a floating point number.
      </li>

      <li>
        There is a subtle difference between the different pace/speed units that
        are used. If
        <code>d</code> denotes <em>distance</em>, <code>t</code> denotes
        <em>time</em> and <code>v</code> denotes <em>speed</em>, the famous
        formula says <code>d = v * t</code>. The speed is
        <code>v = d / t</code>, i.e. distance divided by time (1). If you invert
        this you get <code>v' = t / d</code> instead, i.e. time divided by
        distance (2). So, the paces/speeds can be divided into these two
        categories:

        <ul>
          <li>
            (1) <em>distance per time</em>: meters per second, kilometers per
            hour, miles per hour, nautical miles per hour (knots), etc. Those
            are often referred to as <em>speed</em>.
          </li>

          <li>
            (2) <em>time per distance</em>: minutes per km, minutes per mile,
            minutes per 400m, minutes per 100m, etc. Those are often referred to
            as <em>pace</em>.
          </li>
        </ul>

        The speeds in category (1) are compared to <code>m/s</code> and the
        paces in category (2) are instead compared to <code>s/m</code>.
      </li>

      <li>
        You can't define a <em>distance</em>, a <em>time</em> and a
        <em>pace</em> at the same time, since then nothing can be calculated. At
        most two of these can be defined for each calculation.
      </li>
    </ul>

    <h1>Examples</h1>

    <p>
      Examples of what the different sections can look like. The layout is
      responsive.
    </p>

    <h2>The Input form</h2>

    <InputForm v-model="userInputExampleForInputForm" />

    <p class="note">
      You can interact with the input form above, but the changes will
      <em>not</em> update any results, since nothing is connected to the form.
    </p>

    <h2>The Results board</h2>

    <h3>Distance conversions</h3>

    <p>Converting 10 miles to other distances.</p>

    <ResultsBoard
      v-if="resultsExampleWithDistance"
      :results="resultsExampleWithDistance"
    />

    <h3>Time conversions</h3>

    <ResultsBoard
      v-if="resultsExampleWithTime"
      :results="resultsExampleWithTime"
    />

    <h3>Velocity conversions</h3>

    <p>Converting 60 miles per hour to other paces and speeds.</p>

    <ResultsBoard
      v-if="resultsExampleWithVelocity"
      :results="resultsExampleWithVelocity"
    />

    <h3>Calculating time from distance and pace and converting everything</h3>

    <p>Running 10000 meters with a pace of 3 minutes per kilometer.</p>

    <ResultsBoard
      v-if="resultsExampleCalculatingTime"
      :results="resultsExampleCalculatingTime"
    />

    <h2>Split times board</h2>

    <p>Split times per kilometer for running a marathon in 4 hours.</p>

    <SplitTimesBoard v-if="splitTimesExample" :splitTimes="splitTimesExample" />

    <h1>References at Wikipedia</h1>

    <ul>
      <li>
        <a href="https://en.wikipedia.org/wiki/Half_marathon"
          >&frac12;-marathon</a
        >
        - 21097.5 meters
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/10000_metres">10000 meters</a>
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Athletics_(track_and_field)"
          >Athletics</a
        >
        - among other things the reason for the 400m and 200m laps
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Foot_(length)">Foot [ft]</a> -
        equals 0.3048 m
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Imperial_units"
          >Imperial units</a
        >
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Inch">Inch [in]</a> - equals
        0.0254 m
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Indoor_rower">Indoor rowing</a> -
        among other things the reason for the 500m splits
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Kmh"
          >Kilometers per hour [km/h]</a
        >
        - approximately 0.28 m/s
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Knots">Knots [k] or [nmi/h]</a> -
        approximately 0.51 m/s
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Marathon">Marathon</a> - 42195
        meters
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Meter">Meter [m]</a> - SI-unit of
        length
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Metre_per_second"
          >Meters per second [m/s]</a
        >
        - SI-unit for speed and velocity
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Metric_system">Metric system</a>
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Mile">Mile [mi]</a> - equals
        1609.344 m
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Mph"
          >Miles per hour [mph] or [mi/h]</a
        >
        - approximately 0.45 m/s
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Nautical_mile"
          >Nautical mile [nmi]</a
        >
        - equals 1852 m
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)"
          >Orders of magnitude (length)</a
        >
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Orders_of_magnitude_(speed)"
          >Orders of magnitude (speed)</a
        >
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Pace_(speed)">Pace</a>
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Speed">Speed</a>
      </li>
      <li>
        <a href="https://en.wikipedia.org/wiki/Yard">Yard [yd]</a> - equals
        0.9144 m
      </li>
    </ul>

    <h1>Questions?</h1>

    <p>
      If you think you encountered an error for the calculator or if you have
      any further questions, don't hesitate to contact me.
    </p>
  </main>
</template>
