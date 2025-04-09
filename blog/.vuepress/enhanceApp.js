/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  // ...apply enhancements to the app
  if (typeof window !== "undefined") {
    const waitForAllTwitterButtons = () => {
      const buttons = document.querySelectorAll(
        '.social-share-btn[data-link="#share-twitter"]'
      );
      if (buttons.length > 0) {
        buttons.forEach((btn) => {
          btn.title = "Share on X";
        });
      } else {
        requestAnimationFrame(waitForAllTwitterButtons);
      }
    };

    waitForAllTwitterButtons();
  }
};
