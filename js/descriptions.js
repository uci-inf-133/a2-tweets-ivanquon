function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  written_tweets = tweet_array.filter((tweet) => tweet.written);

  //Initial load or reloads
  document.getElementById("searchText").innerText = document.getElementById("textFilter").value.toLowerCase();
  document.getElementById("searchCount").innerText = written_tweets.filter((tweet) =>
    tweet.writtenText.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
  ).length;
  document.getElementById("tweetTable").innerHTML = written_tweets
    .filter((tweet) =>
      tweet.writtenText.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
    )
    .map((tweet, index) => tweet.getHTMLTableRow(index + 1))
    .join("");
}

function addEventHandlerForSearch() {
  document.getElementById("textFilter").addEventListener("input", () => {
    document.getElementById("searchText").innerText = document.getElementById("textFilter").value.toLowerCase();
    if (!document.getElementById("textFilter").value.toLowerCase()) {
      document.getElementById("searchCount").innerText = 0;
      document.getElementById("tweetTable").innerHTML = "";
    } else {
      document.getElementById("searchCount").innerText = written_tweets.filter((tweet) =>
        tweet.writtenText.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
      ).length;

      document.getElementById("tweetTable").innerHTML = written_tweets
        .filter((tweet) =>
          tweet.writtenText.toLowerCase().includes(document.getElementById("textFilter").value.toLowerCase())
        )
        .map((tweet, index) => tweet.getHTMLTableRow(index + 1))
        .join("");
    }
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
});
