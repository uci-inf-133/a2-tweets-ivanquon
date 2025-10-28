class Tweet {
  private text: string;
  time: Date;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    if (this.text.includes("#RKLive")) {
      return "live_event";
    } else if (this.text.includes("#FitnessAlerts")) {
      return "achievement";
    } else if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
      return "completed_event";
    } else {
      return "miscellaneous";
    }
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    return this.text.indexOf(" - ") !== -1;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    return this.text.split("-")[1].split("https://")[0];
  }

  /*
  Found Forms:
  Just completed a {Distance} {Unit} {Activity} - ... 
  Just completed a {Distance} {Unit} {Activity} with ...
  Just posted a {Distance} {Unit} {Activity} ...
  Just posted a {Activity} in {Time} ...
  Just posted an {Activity} in {Time} ...

  - " with" or " - " usually marks end of activity
  km and mi can appear at the end of urls
  */
  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }
    if (this.text.split("https://")[0].search(/(?:mi|km)\b/) !== -1) {
      //Follows a Unit Pattern
      return this.text
        .split(/(?:mi|km)\b/)[1]
        .split(/(?:\bwith\b|-)/)[0]
        .trim();
    } else {
      //Follows a Time Pattern
      return this.text
        .split(/\b(?:a|an)\b/)[1]
        .split(/\bin\b/)[0]
        .trim();
    }
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    if (this.text.split("https://")[0].search(/(?:mi|km)\b/) !== -1) {
      return Number(
        this.text
          .split(/(?:mi|km)\b/)[0]
          .split(/\b(?:a|an)\b/)[1]
          .trim()
      );
    } else {
      return 0;
    }
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    return "<tr></tr>";
  }
}
