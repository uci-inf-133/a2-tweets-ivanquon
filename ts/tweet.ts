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
    } else if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
      return "completed_event";
    } else {
      return "miscellaneous";
    }
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    return (
      this.text.indexOf(" - ") !== -1 ||
      this.text.indexOf("#Runkeeper") === -1 ||
      this.text.indexOf("https://") === -1 ||
      this.source === "miscellaneous"
    );
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    const cleaned = //Written text is anything before https://, #Runkeeper is auto placed after the url so any leftover ones are user written
      (this.text.match(/https:\/\//g)?.length || 0) > 1
        ? this.text.slice(0, this.text.lastIndexOf("https://"))
        : this.text.split("https://")[0];
    if (cleaned.indexOf(" - ") !== -1) {
      return cleaned.split("-")[1];
    } else {
      return cleaned;
    }
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
        .trim()
        .toLowerCase();
    } else {
      //Follows a Time Pattern
      return this.text
        .split(/\b(?:a|an)\b/)[1]
        .split(/\bin\b/)[0]
        .trim()
        .toLowerCase();
    }
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    if (this.text.split("https://")[0].search(/(?:mi|km)\b/) !== -1) {
      const dist = Number(
        this.text
          .split(/(?:mi|km)\b/)[0]
          .split(/\b(?:a|an)\b/)[1]
          .trim()
      );
      if (this.text.match(/(?:mi|km)\b/)![0] === "km") {
        return dist / 1.609;
      }
      return dist;
    } else {
      return 0;
    }
  }

  getHTMLTableRow(rowNumber: number): string {
    const embedded = this.text.split(/(https?:\/\/[^\s]+)/).reduce((str, section) => {
      if (section.match(/(https?:\/\/[^\s]+)/)) {
        str += `<a href=${section}>${section}</a>`;
      } else {
        str += section;
      }
      return str;
    }, "");
    return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${embedded}</td></tr>`;
  }
}
