---
date: 2021-6-12
tags:
  - VisualStudio
summary: Visual Studio is a great development environment. I have known all its versions (starting from Visual Studio 97 with Visual Basic - that's where it all began, how time flies...) and I believe ...
permalink: /en/blog/5-best-free-extensions-visual-studio
---

# The 5 Best Free Extensions for Visual Studio

<social-share class="social-share--header" />

[Español](/blog/5-mejores-extensiones-gratuitas-visual-studio/) | English

[Visual Studio](https://visualstudio.microsoft.com/vs/) is a great development environment. I have known all its versions (starting from Visual Studio 97 with Visual Basic - that's where it all began, how time flies...) and I believe that Microsoft has done a great job in adapting the tool to the business and technological context of each moment in order to make our work as developers easier (although sometimes forcing us with their decisions). I have seen how our architectures, runtime environments, languages, interconnections, and needs have evolved along with Visual Studio, and I believe that is the key to its success, just like what is happening with Visual Studio Code, which has managed to adapt to our current needs (by the way, if you're interested, I also recommend [The 15 Best Visual Studio Code Extensions for Web Development](/en/blog/15-best-extensions-visual-studio-code-web-development/)).

In Visual Studio, we can find almost everything for our day-to-day work, but I didn't want to miss the opportunity to mention some free extensions that I use and that you can complement with all the others available in its [Marketplace](https://marketplace.visualstudio.com/).

## 1. Bundler & Minifier (Mads Kristensen)

With this extension, we add support for bundling and minifying JavaScript, CSS, and HTML files in any of our projects. It allows us to automate parts of the routine tasks related to our builds, which will help improve the performance of our project during deployments.

[Bundler & Minifier (Mads Kristensen)](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.BundlerMinifier)

## 2. GitFlow for Visual Studio 2019 (Jakob Ehn)

If you manage your Git branches using the [gitflow](https://nvie.com/posts/a-successful-git-branching-model/) workflow, this extension is a good solution to streamline your processes within Visual Studio.

[GitFlow for Visual Studio 2019 (Jakob Ehn)](https://marketplace.visualstudio.com/items?itemName=vs-publisher-57624.GitFlowforVisualStudio2019) or [GitFlow for Visual Studio - all versions](https://marketplace.visualstudio.com/publishers/vs-publisher-57624)

## 3. Markdown Editor (Mads Kristensen)

With this Markdown editor, it will be much easier to work with your documents, and you'll also have a preview feature.

[Markdown Editor (Mads Kristensen)](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.MarkdownEditor)

## 4. NPM Task Runner (Mads Kristensen)

If our projects include the _package.json_ file for npm, with this extension, we can execute or schedule (before or after the solution execution) the scripts defined in it from the Visual Studio Task Runner Explorer.

[NPM Task Runner (Mads Kristensen)](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner)

## 5. Productivity Power Tools 2017/2019 (Microsoft DevLabs)

This extension bundles a set of very interesting extensions proposed by Microsoft to enhance our productivity in Visual Studio.

Among all the extensions it includes, the one I consider most important and essential is the [Solution Error Visualizer (Microsoft DevLabs)](https://marketplace.visualstudio.com/items?itemName=VisualStudioPlatformTeam.SolutionErrorVisualizer). With it, we will see files with errors or warnings highlighted in the Solution Explorer.

[Productivity Power Tools 2017/2019 (Microsoft DevLabs)](https://marketplace.visualstudio.com/items?itemName=VisualStudioPlatformTeam.ProductivityPowerPack2017)

## 5+1. SlowCheetah (Microsoft)

This extension allows us to transform our _*.config_ files (_log4net.config_, _app.config_, or any other) just like we do with _Web.config_. With this extension, we have two new options in the contextual menu for these files in the Solution Explorer. One option allows us to add transformers to the selected main file, and the other allows us to preview each transformation individually. This functionality is useful when our version of Visual Studio doesn't have this option by default.

> Don't worry if your Visual Studio gets temporarily unresponsive when you use the option to add transformers to your _.config_ file, as it may take some time to process.

**IMPORTANT:** The extension only enables us to manage the transformation files. In order for the transformations to be applied during the build process, it is necessary to also install the NuGet package [Microsoft.VisualStudio.SlowCheetah](https://www.nuget.org/packages/Microsoft.VisualStudio.SlowCheetah/) in our project.

[SlowCheetah (Microsoft)](https://marketplace.visualstudio.com/items?itemName=vscps.SlowCheetah-XMLTransforms)

---
<social-share class="social-share--footer" />
