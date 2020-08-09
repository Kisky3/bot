var CHANNEL = "YOUR_CHANNEL_NAME";

function doPost(e) {
  try {
    recievePayload(e.postData.getDataAsString());
  } catch (ex) {
    notifyToSlack(CHANNEL, ex);
  }
}

function recievePayload(json) {
  var payload = JSON.parse(json);

  if (payload.action === "opened") {
    notifyToSlack(CHANNEL, review_request(payload))
  }

  if (payload.action === "submitted") {
    notifyToSlack(CHANNEL, approve(payload))
  }
}

function approve (payload) {
  var message = "";
  var reviwers = "";
  payload.pull_request.requested_reviewers.forEach( i => {
    reviwers += i.login + "さん、"
  })

  // PR Approvedされた時：
    if (payload.review.state === "approved") {
      message =  convert_user(payload.pull_request.user.login) + "さん、\n下記のPR :lgtm2: をもらいました！ \n" 
      + "問題なければマージしてね \n\n"
      + "--------------------------------------------------\n "
      + "■PR TITLE: \n"
      + payload.pull_request.title + "\n\n"
      + "■PR URL: \n"
      + "\n" + payload.pull_request.html_url + "\n\n"
      + "--------------------------------------------------\n "
    } else {
      return;
    }

  return message;

}

function review_request(payload) {
  var message = "";
  var reviwers = "";

  payload.pull_request.requested_reviewers.forEach( i => {
    reviwers += convert_user(i.login) + "さん  "
  })

  // PR新規作成された時：
    if (payload.pull_request.state === "open" && reviwers !== "") {
      message = reviwers + payload.pull_request.user.login + "からのPR依頼がきました！ \n" 
      + "手が空いてる時に、下記のPRのレビューをお願い致します〜 \n\n"
      + "--------------------------------------------------\n "
      + "■PR TITLE: \n"
      + payload.pull_request.title + "\n\n"
      + "■PR URL: \n"
      + "\n" + payload.pull_request.html_url + "\n\n"
      + "--------------------------------------------------\n "
    } else {
      return
      //message = payload.pull_request.user.login + "下記のPRにReviewerを指定してください \n" + payload.pull_request.title + "\n" + payload.pull_request.html_url;
    }

  return message;

}

function convert_user(name) {
  switch(name) {
      case "GITHUB_USER_NAME":
        return "SLACK_USER_ID"
        break;
      default:
        break;
  }
}

function notifyToSlack(channel, message) {
  var prop = PropertiesService.getScriptProperties().getProperties();
  var slackApp = SlackApp.create('YOUR_SLACK_TOKEN:xoxp-xxxxxx');
  slackApp.chatPostMessage(channel, message, {　
    username: "PR_娘",
    icon_emoji: ":musume:"
  });
}