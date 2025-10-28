function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
  //It works correctly, your task is to update the text of the other tags in the HTML file!

  //Dates
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("firstDate").innerText = tweet_array
    .sort((t1, t2) => t1.time - t2.time)
    .at(0)
    .time.toLocaleDateString("en-US", options);
  document.getElementById("lastDate").innerText = tweet_array
    .sort((t1, t2) => t1.time - t2.time)
    .at(-1)
    .time.toLocaleDateString("en-US", options);

  //Counts
  document.getElementById("numberTweets").innerText = tweet_array.length;
  [...document.getElementsByClassName("completedEvents")].forEach((element) => {
    element.innerText = tweet_array.filter((tweet) => tweet.source === "completed_event").length;
  });
  [...document.getElementsByClassName("liveEvents")].forEach((element) => {
    element.innerText = tweet_array.filter((tweet) => tweet.source === "live_event").length;
  });
  [...document.getElementsByClassName("achievements")].forEach((element) => {
    element.innerText = tweet_array.filter((tweet) => tweet.source === "achievement").length;
  });
  [...document.getElementsByClassName("miscellaneous")].forEach((element) => {
    element.innerText = tweet_array.filter((tweet) => tweet.source === "miscellaneous").length;
  });
  [...document.getElementsByClassName("written")].forEach((element) => {
    element.innerText = tweet_array.filter((tweet) => tweet.written).length;
  });

  //Percentages
  [...document.getElementsByClassName("completedEventsPct")].forEach((element) => {
    element.innerText =
      math.format(
        (tweet_array.filter((tweet) => tweet.source === "completed_event").length / tweet_array.length) * 100,
        { precision: 2, notation: "fixed" }
      ) + "%";
  });
  [...document.getElementsByClassName("liveEventsPct")].forEach((element) => {
    element.innerText =
      math.format((tweet_array.filter((tweet) => tweet.source === "live_event").length / tweet_array.length) * 100, {
        precision: 2,
        notation: "fixed",
      }) + "%";
  });
  [...document.getElementsByClassName("achievementsPct")].forEach((element) => {
    element.innerText =
      math.format((tweet_array.filter((tweet) => tweet.source === "achievement").length / tweet_array.length) * 100, {
        precision: 2,
        notation: "fixed",
      }) + "%";
  });
  [...document.getElementsByClassName("miscellaneousPct")].forEach((element) => {
    element.innerText =
      math.format((tweet_array.filter((tweet) => tweet.source === "miscellaneous").length / tweet_array.length) * 100, {
        precision: 2,
        notation: "fixed",
      }) + "%";
  });
  [...document.getElementsByClassName("writtenPct")].forEach((element) => {
    element.innerText =
      math.format(
        (tweet_array.filter((tweet) => tweet.written).length /
          tweet_array.filter((tweet) => tweet.source === "completed_event").length) *
          100,
        { precision: 2, notation: "fixed" }
      ) + "%";
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
