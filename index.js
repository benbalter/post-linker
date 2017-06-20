module.exports = (robot) => {
  robot.on('pull_request.closed', async (event, context) => {
    var files = await context.github.pullRequests.getFiles(context.issue({}));
    var site  = await context.github.repos.getPages(context.issue({}));

    var comment = ""
    for (var i in files.data)  {
      matches = files.data[i].filename.match(/_posts\/(\d{4})-(\d{2})-(\d{2})-(.*?)\./);
      if (!matches) { continue; }
      var url = site.data.html_url + matches.slice(1,5).join("/") + "/";
      var title = matches[4].replace("-", " ")
      title = title.charAt(0).toUpperCase() + title.slice(1);
      comment = comment + ":ship:'d! [Read the live version of '" + title + "'](" + url + ").\n";
    }

    if (comment == "") { 
      return
    } else { 
      return context.github.issues.createComment(context.issue({body: comment}));
    }
  });
};
