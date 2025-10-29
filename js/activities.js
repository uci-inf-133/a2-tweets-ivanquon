function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //Activity Frequency
  const counts = tweet_array.reduce((count, tweet) => {
    count[tweet.activityType] = (count[tweet.activityType] || 0) + 1;
    return count;
  }, {});

  //Sort Activity Frequency
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  //Distance By Activity
  const distances = tweet_array.reduce((count, tweet) => {
    if (tweet.distance > 0) {
      count[tweet.activityType] = (count[tweet.activityType] || 0) + tweet.distance;
    }
    return count;
  }, {});

  const days = tweet_array.reduce(
    (day, tweet) => {
      if (tweet.time.getDay() > 0 && tweet.time.getDay() < 6) {
        day["weekday"] = [(day["weekday"][0] || 0) + 1, (day["weekday"][1] || 0) + tweet.distance];
      } else if (tweet.time.getDay() === 0 || tweet.time.getDay() === 6) {
        day["weekend"] = [(day["weekend"][0] || 0) + 1, (day["weekend"][1] || 0) + tweet.distance];
      } else {
        throw Error;
      }
      return day;
    },
    { weekday: [0, 0], weekend: [0, 0] }
  );

  console.log(Object.entries(counts).map((array) => ({ activity: [array[0]], count: array[1] })));

  document.getElementById("numberActivities").innerText = sortedCounts.length;
  document.getElementById("firstMost").innerText = sortedCounts[0][0];
  document.getElementById("secondMost").innerText = sortedCounts[1][0];
  document.getElementById("thirdMost").innerText = sortedCounts[2][0];

  //Of the three most common activities calculate the average max/min distance done per activity
  document.getElementById("longestActivityType").innerText = sortedCounts
    .slice(0, 3)
    .map((count) => {
      return count[0];
    })
    .reduce((prev, cur) => {
      return distances[prev] / counts[prev] > distances[cur] / counts[cur] ? prev : cur;
    });
  document.getElementById("shortestActivityType").innerText = sortedCounts
    .slice(0, 3)
    .map((count) => {
      return count[0];
    })
    .reduce((prev, cur) => {
      return distances[prev] / counts[prev] < distances[cur] / counts[cur] ? prev : cur;
    });

  document.getElementById("weekdayOrWeekendLonger").innerText =
    days["weekday"][1] / days["weekday"][0] > days["weekend"][1] / days["weekend"][0] ? "weekdays" : "weekends";

  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: Object.entries(counts).map((array) => ({
        activity: [array[0]],
        count: array[1],
      })),
    },
    mark: "point",
    encoding: {
      x: { field: "activity", sort: "-y", axis: { labelAngle: -45, grid: "true" } },
      y: { field: "count", type: "quantitative" },
    },
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

  distance_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: tweet_array.reduce((arr, tweet) => {
        if (["run", "bike", "walk"].includes(tweet.activityType)) {
          arr.push({
            day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][tweet.time.getDay()],
            distance: tweet.distance,
            activity: tweet.activityType,
          });
        }
        return arr;
      }, []),
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        axis: { labelAngle: 0, grid: "true" },
        type: "ordinal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
      y: { field: "distance", type: "quantitative" },
      color: { field: "activity" },
    },
  };
  vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });

  distance_aggregated_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: tweet_array.reduce((arr, tweet) => {
        if (["run", "bike", "walk"].includes(tweet.activityType)) {
          arr.push({
            day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][tweet.time.getDay()],
            distance: tweet.distance,
            activity: tweet.activityType,
          });
        }
        return arr;
      }, []),
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        axis: { labelAngle: 0, grid: "true" },
        type: "ordinal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
      y: { field: "distance", type: "quantitative", aggregate: "mean" },
      color: { field: "activity" },
    },
  };
  vegaEmbed("#distanceVisAggregated", distance_aggregated_vis_spec, { actions: false });

  document.getElementById("distanceVis").style.display = "block";
  document.getElementById("distanceVisAggregated").style.display = "none";

  document.getElementById("aggregate").addEventListener("click", () => {
    [
      document.getElementById("distanceVis").style.display,
      document.getElementById("distanceVisAggregated").style.display,
    ] = [
      document.getElementById("distanceVisAggregated").style.display,
      document.getElementById("distanceVis").style.display,
    ];

    document.getElementById("aggregate").innerText =
      document.getElementById("aggregate").innerText === "Show means" ? "Show all activities" : "Show means";
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
