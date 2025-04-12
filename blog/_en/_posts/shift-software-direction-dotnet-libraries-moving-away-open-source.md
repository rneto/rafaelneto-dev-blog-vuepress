---
date: 2025-4-11
tags:
  - dotNET
summary: In recent years, we have witnessed a phenomenon that cannot leave us indifferent and, for some, might even be concerning for the software development ecosystem, particularly in the .NET and C# space...
permalink: /en/blog/:slug
---

# The Shift in Software Direction: .NET Libraries Moving Away from Open Source

<social-share class="social-share--header" />

[Español](/blog/cambio-rumbo-software-librerias-dotnet-abandonan-open-source/) | English

In recent years, we have witnessed a phenomenon that cannot leave us indifferent and, for some, might even be concerning for the software development ecosystem, particularly in the .NET and C# space. I am referring to tools and libraries that have long been fundamental pieces of the open-source movement but have started transitioning to commercial models, forcing us to reevaluate our strategies for the future. For instance, consider the shift of IdentityServer years ago and, more recently, MediatR and AutoMapper—two essential tools for implementing the CQRS pattern in .NET and object mapping—which have now joined the list, according to the [latest news](https://github.com/AutoMapper/AutoMapper/discussions/4536).

#### IdentityServer: The Pioneer of Change

IdentityServer, a key library for implementing authentication and authorization based on standards like OpenID Connect and OAuth 2.0, was one of the most notable cases in this shift. For years, it was an open-source project that allowed developers to build secure systems without additional costs. However, in 2021, with the release of IdentityServer 5 (under the name Duende Software), they announced that new versions would move to a commercial licensing model. Fortunately, the community has continued maintaining version 4 (which remains free).

The reason behind this change was clear: the need to fund the continuous development and support of the project. Maintaining a project of this magnitude requires significant time, effort, and resources, which, despite community contributions, is not always enough.

Personally, I believe it would have been the right time for Microsoft to get involved in creating its own authentication and authorization solution integrated into ASP.NET Core. Instead, they promoted solutions like Azure AD (Entra ID) and continued focusing ASP.NET Core Identity on very basic authentication, which does not cover advanced standards like OpenID Connect and OAuth 2.0.

Out of this need, the community once again stepped up to fill the gap with libraries like OpenIddict as a viable alternative. This is one of the aspects I love most about software development: if you need it, you can create it.

#### MediatR and AutoMapper: The Most Recent Impact

Now, in 2025, two iconic projects in the .NET ecosystem have followed a similar path: MediatR and AutoMapper. MediatR is an implementation of the Mediator pattern used to simplify communication between components in C# applications. On the other hand, AutoMapper is a tool for mapping objects in a simple and efficient way. Both have been fundamental resources in our projects for years—the former when applying a CQRS architecture in .NET and the latter for simplifying object mapping tasks between layers.

The transition of MediatR and AutoMapper to a commercial model does not mean they will no longer be accessible. Previous versions will remain available under open-source licenses. However, new features, updates, and official support will require a subscription. As with IdentityServer, this change responds to the need to fund their continuous development.

It is understandable that the time dedicated to these libraries altruistically has led to this change, especially as more commercial products benefit from their maintenance and the growing list of new features.

#### Other Cases on the Radar

Although IdentityServer, MediatR, and AutoMapper are the most notable cases due to their impact, they are not the only ones. In recent months, other popular libraries in the .NET ecosystem have sought funding models, such as:

- **FluentAssertions**: A tool for writing more readable assertions in .NET unit tests, known for its fluent API, recently introduced a commercial model for certain advanced features or premium support, while maintaining a free base version for non-commercial projects.

- **ImageSharp**: An image processing library that has evolved into a hybrid model where, in some contexts, a commercial license is required, while the core remains open source depending on its use.

- **OpenIddict**: A library that provides a flexible solution for implementing your own authentication and authorization stack based on OAuth 2.0 and OpenID Connect standards in .NET applications. Although it remains open source, it only offers official support to its sponsors based on their financial contributions.

I believe these cases clearly reflect a trend where open source, as we knew it, is evolving into a hybrid model where free access coexists with other options that make the maintenance and evolution of the project economically viable.

#### Factors Driving the Shift to Commercial Models

I think there are several factors that explain this:

1. **Economic Sustainability**: The community maintaining open-source projects often works for free or relies on sporadic donations. As libraries grow in usage and complexity, it becomes increasingly difficult to maintain them without stable income.

2. **Widespread Enterprise Use**: Many of these tools are used by companies of all kinds, including those that generate significant revenue thanks to these developments. It is logical for creators to seek financial contributions from these large organizations.

3. **Competition and Expectations**: The fast-paced evolution of the software development world demands increasingly frequent updates, compatibility with new .NET versions, and technical support. This requires many resources that the traditional open-source model cannot always guarantee.

#### Impact on the .NET Community

This trend raises several important considerations for the .NET and C# development community:

1. **Cost and Opportunity Assessment**: For those of us who use these libraries, the change presents challenges and opportunities. On one hand, the additional cost could become an obstacle. On the other hand, the commercial model should guarantee more robust development and dedicated support, which would benefit those who can afford it. It is time to evaluate costs when planning new projects or updating existing ones.

2. **Search for Alternatives**: It is very likely that we will see an increase in the search for and development of alternative open-source solutions to replace these new commercial models.

3. **Contribution to Existing Projects**: Let us not forget the importance and responsibility we developers have to support and contribute to open-source projects. I believe these transitions will spark a necessary debate on how we can sustainably support open-source creators. We must actively support them, whether by contributing code, documentation, support, or donations to these types of projects.

4. **Clarity in Licensing**: It is essential to understand the implications of the dependencies we use in our developments and their licenses to avoid legal issues in the future. However, there should also be more transparency in licensing models, as they can sometimes be confusing.

#### Where Are We Heading?

The future of .NET development seems to be heading toward a balance between free and commercial models. This reminds us that software development is a constantly evolving effort. The community could respond in various ways: maintaining forks of older versions, developing new open-source alternatives, or more actively integrating these hybrid models into our projects. What is certain is that the debate on how to fund the code we use every day for free is very much alive.

As developers (and the companies we work for), we must reflect. Are we willing to bear the costs of the tools that save us so much work? Should we get more involved in open-source projects to make them viable over time? There is no single answer, but the change is real and already here. As developers, we must stay informed, carefully evaluate our options, and continue contributing to a brilliant .NET community.

---
<social-share class="social-share--footer" />
