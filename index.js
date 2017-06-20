module.exports = robot => {
  robot.on('pull_request.closed', async (event, context) => {
    const files = await context.github.pullRequests.getFiles(context.issue({}));
    const site = await context.github.repos.getPages(context.issue({}));

    let comment = '';
    for (const file in files.data) {
      if (files.data[file]) {
        const matches = files.data[file].filename.match(/_posts\/(\d{4})-(\d{2})-(\d{2})-(.*?)\./);

        if (!matches) {
          continue;
        }

        const url = site.data.html_url + matches.slice(1, 5).join('/') + '/';
        let title = matches[4].replace('-', ' ');
        title = title.charAt(0).toUpperCase() + title.slice(1);

        comment = comment + ':ship:\'d! [Read the live version of \'' + title + '\'](' + url + ').\n';
      }

      if (comment === '') {
        return;
      }

      return context.github.issues.createComment(context.issue({body: comment}));
    }
  });
};
