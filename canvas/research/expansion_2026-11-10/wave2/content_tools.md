# Wave 2, content tools (Adobe Express, Frame.io, Creative Cloud, Workfront Planning): research trail

Checked Nov 10 2026. Research only: nothing in the tool, the catalog or the site was changed, nothing was built and nothing was committed. The data is in `content_tools.json` beside this file. Connections to the Firefly products and Brand Intelligence belong to the other wave 2 helper and are not here.

## Summary

Four products with 31 services, and 17 connections with 33 services (64 services in all). Hours are our own estimates for a mid-market client; Adobe publishes none.

| Product | id | Services | Starting | Optional | Monthly |
|---|---|---|---|---|---|
| Adobe Express (Adobe Express for Enterprise) | `express` | 8 | 6 | 2 | 1 |
| Frame.io (Frame.io Enterprise) | `frameio` | 8 | 5 | 3 | 1 |
| Creative Cloud (Creative Cloud for enterprise) | `creativecloud` | 7 | 5 | 2 | 1 |
| Workfront Planning (Adobe Workfront Planning) | `planning` | 8 | 6 | 2 | 1 |

| Connection | id | Kind | Services | Label |
|---|---|---|---|---|
| Adobe Express + AEM Assets | `express-aemassets` | native | XJ01, XJ02, XJ03 | AEM Assets opens inside Express through Content Advisor, and finished designs save back to AEM Assets |
| Adobe Express + Workfront | `express-workfront` | native | XJ04, XJ05 | Express templates carry a Workfront approval workflow, so remixed designs are approved in Workfront before they are published |
| Adobe Express + Frame.io | `express-frameio` | native | XJ06 | Express designs sent for approval through Workfront are reviewed and approved in the Frame.io viewer |
| Adobe Express + Journey Optimizer | `express-ajo` | native | XJ07 | Edit in Adobe Express in the Email Designer, with the full editor for users who hold an Express Enterprise license |
| Adobe Express + Marketo Engage | `express-marketo` | native | XJ08 | Edit in Adobe Express on images in the Marketo Engage Design Studio |
| Adobe Express + Journey Optimizer B2B Edition | `express-ajob2b` | native | XJ09 | Edit with Adobe Express on images in the Journey Optimizer B2B Edition asset repository |
| Adobe Express + GenStudio for Performance Marketing | `express-gspm` | native | XJ10, XJ11 | Express templates, with their lock settings, appear in GenStudio's Create for paid social and display content |
| Adobe Express + Creative Cloud | `express-creativecloud` | native | XJ12 | Photoshop and Illustrator files placed in Express as linked images that stay in sync, or converted to editable Express files |
| Frame.io + Workfront | `frameio-workfront` | native | XJ13, XJ14, XJ15, XJ16 | Unified review and approval: work is managed in Workfront and reviewed and approved in the Frame.io viewer, on shared Adobe cloud storage |
| Frame.io + AEM Assets | `frameio-aemassets` | native | XJ17, XJ18 | Assets approved in Workfront with Frame.io are pushed with their metadata to AEM Assets; the integration is set up in Workfront |
| Frame.io + Creative Cloud | `frameio-creativecloud` | native | XJ19 | Frame.io tools inside Premiere Pro, switched on for Creative Cloud for enterprise in the Admin Console |
| Creative Cloud + AEM Assets | `creativecloud-aemassets` | native | XJ20, XJ21, XJ22 | Adobe Asset Link panel in Photoshop, Illustrator and InDesign, plus the Experience Manager desktop app for other file types |
| Creative Cloud + Workfront | `creativecloud-workfront` | native | XJ23, XJ24 | Workfront plugin for comments and approvals inside the apps, and Workfront projects in the Projects panel of Photoshop, Illustrator and InDesign |
| Workfront Planning + Workfront | `planning-workfront` | native | XJ25, XJ26, XJ27 | Planning record types connect to Workfront projects, portfolios, programs, companies and groups, and automations create Workfront work from a record |
| Workfront Planning + AEM Assets | `planning-aemassets` | native | XJ28, XJ29 | Planning records connect to AEM Assets images, folders and Content Fragments, and Planning fields can reach asset metadata |
| Workfront Planning + GenStudio for Performance Marketing | `planning-gspm` | native | XJ30, XJ31 | A GenStudio workspace in Planning keeps campaigns, products, personas and activations in step with GenStudio in both directions |
| Workfront Planning + Coworker | `planning-cw` | native | XJ32, XJ33 | Coworker searches, creates and updates Planning records from a prompt, inside Workfront |

No product in this scope is itself under an early or limited label on Adobe's pages. Four lifecycle points sit one level down and are raised under "Lifecycle points" and "Open questions for Adam".

## How this was researched

- Started from this morning's map-level pass (`../genstudio_creative.json`), then read each source page again in full, plus the setup, access and prerequisite pages it links to.
- Sources: experienceleague.adobe.com (Workfront guide, AEM as a Cloud Service guide, Journey Optimizer, Marketo Engage, Journey Optimizer B2B Edition, GenStudio for Performance Marketing, Workfront Fusion, AEM desktop app), helpx.adobe.com (Adobe Express help, the enterprise admin guide, product descriptions) and developer.adobe.com (Frame.io, Adobe Express API).
- Every page was downloaded with `curl -sS -L -m 45`, tags stripped and spacing collapsed, and each quote matched word for word, the way `../verify_quotes.py` and `../wave1/verify_wave1.py` do. A quote that joins passages with an ellipsis must have every part on the page.
- **Quote check: 184 quotes on 61 pages, all found, none unverified.** A made-up quote was run through the same check to confirm it fails.
- Service ids (EP, FR, CC, WP, XJ) were checked by script against `sow/canvas/catalog.json` and every JSON under `sow/canvas/research/`: no line id repeats. The four product ids appear in this morning's map files for the same products, as intended.
- Voice checks run by script on every card field: no "the client", no "clients", no bare "your", no lifecycle labels or dates, no prerequisite that opens with or follows a colon with "confirm", no em dashes.
- **Frame.io's own help site (help.frame.io) is refused by this session's network settings and was not read.** business.adobe.com and www.adobe.com are blocked and were not read. Nothing was done to get around a block.

## Lifecycle points

1. **Unified review and approval (Frame.io + Workfront).** The overview page carries no label and says the Frame.io viewer "is the default viewer for all Workfront review and approval workflows". But the approval template page says: "The content of this article refers to updated document approval functionality that is only available for specific accounts." and the overview says: "Contact your Adobe account representative to confirm whether your current Workfront contract supports unified review and approval." Pages: `workfront/using/review-and-approve-work/document-reviews-and-approvals/manage-asset-review-and-approval/create-approval-template` and `.../document-approvals-overview`. Written up with a statement of work condition; a question for Adam.
2. **Express inside Generate Variations (Express + AEM Sites).** Adobe documents it only on the standalone Generate Variations page, which says "the version described on this page will be deprecated in the future". The page for the recommended version, inside the AEM editors, does not mention Express. Left out; a question for Adam.
3. **Coworker in Planning.** "Coworker must be enabled for your organization before it is available for users in your company." and "Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data." Page: `.../adobe-workfront-planning-general-information/planning-cx-coworker-overview`. Handled the way the tool handles Workfront + Coworker: the condition is a prerequisite with a statement of work line, and no card names a label.
4. **Features under a label, left out:** Run brand check in Express ("a beta feature"), the Adobe Express API ("now in beta"), Frame.io Access Groups ("(beta)"), the AI-powered Planning Designer ("a limited number of customers in a Beta program"), granular requestor permissions on Planning request forms (Preview environment only).

## Product: Adobe Express (`express`)

**Title:** Adobe Express for Enterprise. **What:** Adobe's web and mobile app for making social posts, flyers, videos, documents and presentations from templates. The enterprise plan adds roles set in the Admin Console, shared brands, locked templates and approval workflows. Source: https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html

**Notes:** These lines cover the enterprise plan: roles and Manager Hub, brands, locked templates, approvals, bulk creation, social publishing and training. Template locks, style restrictions and approvals are Teams and Enterprise plan features. Regular members cannot create or edit organization templates or publish to social media until an admin gives them the capability, so EP01 comes first. Run brand check and the Adobe Express API are under a label that Adam's rule excludes, so neither is a service here (see left_out). The advanced review that sends designs to Workfront is the express-workfront connection, not EP04. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An Adobe Express for Enterprise plan, with roles set by a System Admin or Product Admin in the Admin Console. Adobe: "By assigning specific roles and permissions, Enterprise admins can ensure the right level of access for every team member." (https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html)
- Named template managers, because regular members cannot create or edit organization templates. Adobe: "Users with this capability can create and edit custom templates (regular members of the organization cannot)." (https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html)
- At least one brand with colors and fonts before style restrictions are switched on for a template. Adobe: "Create a brand kit with colors and fonts before enabling restrictions." (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/template-control-overview.html)
- For custom fonts in templates: the Custom Fonts offer accepted by an admin in the Admin Console. Adobe: "To use custom fonts in an Express Template, admins must first accept the Custom Fonts qualifying offer in the admin console, which is included as part of the Express license entitlement." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates)
- For template locks, style restrictions and approvals: a Teams or Enterprise plan. Adobe: "This feature is available for Teams and Enterprise plans." (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/template-control.html)

### Tiers

- **Adobe Express for Enterprise:** The plan these lines assume. Admins assign predefined or custom roles in the Admin Console, and the capabilities show in Manager Hub inside Express. Adobe: "In the Admin Console, there are two types of roles admins can assign for Adobe Express:" (https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html)
- **Teams and Enterprise plans:** Template locks, brand style restrictions and review and approval on templates are available on these two plans. Lines EP03 and EP04 need one of them. Adobe: "This feature is available for Teams and Enterprise plans." (https://helpx.adobe.com/express/web/invite-collaborate/set-template-approval.html)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| EP01 | Roles, Manager Hub and home page setup | one-time | 16 | 24 | 40 | yes |  |
| EP02 | Brands with logos, colors, fonts and voice | one-time | 24 | 40 | 72 | yes |  |
| EP03 | Locked templates with brand controls | one-time | 32 | 56 | 96 | yes |  |
| EP04 | Review and approval on templates | one-time | 8 | 16 | 32 | yes |  |
| EP05 | Bulk creation from a spreadsheet | one-time | 16 | 24 | 48 | optional |  |
| EP06 | Social publishing and scheduling setup | one-time | 16 | 24 | 40 | optional |  |
| EP07 | Training for template owners and members | one-time | 16 | 24 | 40 | yes |  |
| EP08 | Monthly template refresh and usage review | monthly | 8 | 12 | 20 | yes |  |

- **EP01 Roles, Manager Hub and home page setup.** Agree with your client who manages the app, templates and social publishing, assign the predefined or custom Express roles in the Admin Console, and set the home banner, featured templates and featured brands in Manager Hub. Evidence: "System Admins should work with their business counterparts to define the level of control required for Adobe Express users." (https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html)
- **EP02 Brands with logos, colors, fonts and voice.** Build your client's brands in Express with logos, colors, fonts, graphics, written guidelines and brand voice, set which elements come first, and share each brand with the right view or edit access. Evidence: "Set up a brand in Adobe Express by naming it, choosing where to save it, and adding logos, colors, fonts, graphics, and guidelines." (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/create-brand.html)
- **EP03 Locked templates with brand controls.** Convert your client's approved designs into shared templates with locked elements, allowed brands for colors and fonts, and set locations for replacement images, organized in projects. Evidence: "Create reusable templates with brand restrictions and share them with team members for faster, more reliable template creation and remixing" (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/template-control.html)
- **EP04 Review and approval on templates.** Add the simple review inside Express to your client's templates, with up to three approvers each, and agree who approves which kind of content. Evidence: "In the Add name or email section, enter up to three approvers who are part of your Teams or Enterprise account." (https://helpx.adobe.com/express/web/invite-collaborate/set-template-approval.html)
- **EP05 Bulk creation from a spreadsheet.** Prepare designs and a CSV file so your client's team creates up to 249 variations in one pass, with each text and image element connected to a spreadsheet column. Evidence: "Learn how to use the Bulk create feature in Adobe Express to quickly create up to 249 variations of a chosen design by easily swapping the text and assets." (https://helpx.adobe.com/express/web/bulk-create-and-automate/bulk-create.html)
- **EP06 Social publishing and scheduling setup.** Give the social publishing capability to the right people, connect your client's social accounts, and set up Content Scheduler to plan, preview, schedule and publish posts. Evidence: "Save time with Content Scheduler in Adobe Express, which lets you plan, preview, schedule, and publish to all your social media channels with one click." (https://helpx.adobe.com/express/web/publish-and-share/schedule-manage-posts/content-scheduler-overview.html)
- **EP07 Training for template owners and members.** Train your client's template managers on brands, locks and sharing, and members on finding and remixing organization templates, including how sharing and search settings decide who sees a template. Evidence: "Organization custom templates in Adobe Express let organizations share branded or reusable templates." (https://helpx.adobe.com/express/web/create-with-templates/org-custom-templates.html)
- **EP08 Monthly template refresh and usage review.** Review how often your client's custom templates are previewed and reused each month, retire the ones nobody uses, and add or update templates and brand elements. Evidence: "View analytics for your custom templates and download as CSV to understand how often they are being discovered and reused by others." (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/custom-templates-analytics.html)

## Product: Frame.io (`frameio`)

**Title:** Frame.io Enterprise. **What:** A cloud workspace where creative teams and their stakeholders organize, review and approve work in progress, video above all, with comments on the frame, version history, secure sharing and watermarking. Source: https://helpx.adobe.com/legal/product-descriptions/frameio.html

**Notes:** Frame.io's own help center (help.frame.io) could not be opened from this session, so every line here rests on Adobe's pages: the product description, the enterprise admin guide, the Workfront guide and the developer page. Feature-level setup steps inside Frame.io (workspaces, shares, watermark templates, custom fields) are named in Adobe's product description but their how-to pages were not read; treat FR02 to FR05 as scoped from the feature list. Admin Console user management and the current API need a Frame.io V4 account. Reviewing and approving from Workfront needs no Frame.io license; these lines are for an organization that buys Frame.io Enterprise. Access Groups carries a label that Adam's rule excludes, so it is not in any line (see left_out). Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- A Frame.io Enterprise plan: Adobe's product description lists Enterprise: Select and Enterprise: Prime. Adobe: "The user License types Frame.io Full User, Enterprise, Enterprise: Select, Enterprise: Prime include the following Features and Storage options:" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)
- A Frame.io V4 account administered in the Adobe Admin Console, for the current API and for Admin Console roles. Adobe: "To use the endpoints described here, you must first have a provisioned Frame.io V4 account administered via the Adobe Admin Console." (https://developer.adobe.com/frameio)
- For an older account: a migration of user management to the Admin Console, which Adobe's Frame.io account team runs. Adobe: "Contact your Frame.io account team and request migration to Adobe Admin Console user management." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/migrate-frameio-user-management.html)
- An Adobe organization that does not use the Global Admin Console, for that migration. Adobe: "Adobe Organization that doesn't use the Global Admin Console" (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/migrate-frameio-user-management.html)
- Storage within the plan's allowance (2TB per user on Select, 3TB per user on Prime). Adobe: "2TB per User up to 375 Users (750TB Max)" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)

### Tiers

- **Frame.io Enterprise: Select:** The base enterprise plan: Admin Console, workspaces and projects, comments, custom metadata, branded and protected shares, static watermarking, 2TB of storage per user. Adobe: "2TB per User up to 375 Users (750TB Max)" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)
- **Frame.io Enterprise: Prime:** Adds Digital Rights Management, forensic watermarking and session-based watermarking, with 3TB of storage per user. FR04 needs it for anything beyond static watermarks. Adobe: "3TB per User up to 334 Users (1PB Max)" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| FR01 | Admin Console users and account roles | one-time | 16 | 24 | 40 | yes |  |
| FR02 | Workspaces, projects and permission design | one-time | 24 | 40 | 72 | yes |  |
| FR03 | Review shares, branding and security settings | one-time | 16 | 32 | 56 | yes |  |
| FR04 | Watermark templates and rights protection | one-time | 16 | 24 | 48 | optional | Needs Frame.io Enterprise: Prime |
| FR05 | Custom metadata fields for assets | one-time | 16 | 24 | 48 | optional |  |
| FR06 | API automation with a service account | one-time | 24 | 40 | 80 | optional |  |
| FR07 | Onboarding and training for editors and reviewers | one-time | 16 | 24 | 40 | yes |  |
| FR08 | Monthly Frame.io administration | monthly | 8 | 12 | 20 | yes |  |

- **FR01 Admin Console users and account roles.** Add your client's users to Frame.io through the Admin Console, decide who is a Content Admin and who is a Member, and document how people are added and removed. Evidence: "Account roles apply across your entire Frame.io organization and determine whether users have administrative access to all public resources or need explicit invitations to access specific content." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/manage-account-roles.html)
- **FR02 Workspaces, projects and permission design.** Design your client's workspaces, projects and restricted folders around teams and campaigns, and set the permissions each group inherits so people see only the work they should. Evidence: "Understanding both account roles and the inheritance model helps you design an access control strategy that balances administrative efficiency with appropriate security boundaries." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/manage-account-roles.html)
- **FR03 Review shares, branding and security settings.** Set up how your client shares work for review: branded share pages and defaults, passphrases, link expiry, download controls and the domains allowed to receive shares. Evidence: "Custom branded shares ... Passphrase-protected shares ... Share link expiration" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)
- **FR04 Watermark templates and rights protection.** Create watermark templates for your client's review shares, and where the plan includes them, switch on session-based or forensic watermarking and Digital Rights Management for sensitive work. Evidence: "Digital Rights Management (DRM) ... Forensic Watermarking ... Session-based Watermarking" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)
- **FR05 Custom metadata fields for assets.** Define the custom metadata fields your client's teams need on assets, such as campaign, status and usage rights, so work can be sorted, filtered and handed on with the same labels. Evidence: "Anchored in an all-new, powerful metadata framework, teams can now use Frame.io to customize any creative workflow centered on media assets." (https://developer.adobe.com/frameio)
- **FR06 API automation with a service account.** Create a server-to-server project in the Adobe Developer Console for your client and build automations on the Frame.io API and webhooks, such as uploads, comments or status changes, without using a user license. Evidence: "By creating a Service Account in the Adobe Developer Console, you establish secure API connections that don't consume user seats in your organization." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/automate-frameio-setup.html)
- **FR07 Onboarding and training for editors and reviewers.** Train your client's editors, producers and reviewers on uploading, commenting, comparing versions and sharing, and invite the first teams into their projects. Evidence: "Your administrator sets up the Frame.io account and invites team members to collaborate effectively." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/frame-io-cc-business.html)
- **FR08 Monthly Frame.io administration.** Add and remove users, adjust account roles and project access, and watch storage use against the plan each month for your client. Evidence: "System admins can modify account roles in the Admin Console or Frame.io's User Management page." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/manage-account-roles.html)

## Product: Creative Cloud (`creativecloud`)

**Title:** Creative Cloud for enterprise. **What:** Adobe's creative apps (Photoshop, Illustrator, InDesign, Premiere Pro and others) with their cloud services, licensed and managed for an organization through the Admin Console. One box for all the apps. Source: https://helpx.adobe.com/legal/product-descriptions/creative-cloud.html

**Notes:** One product for all the apps, as Adam asked. The partner work is not creative production: it is the Admin Console setup, deployment packages, Creative Cloud Libraries and sharing policy, and above all connecting the apps to AEM Assets, Workfront, Frame.io and Express (see the connections). Adobe Asset Link and plugins in packages need Named User Licensing. The older folder sharing between Experience Manager and Creative Cloud is deprecated; Adobe points to Adobe Asset Link and the Experience Manager desktop app. Adobe's Creative Cloud product description names no integrations. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- A Creative Cloud for enterprise plan with users assigned through product profiles in the Admin Console. Adobe: "Product profiles are the primary mechanism for granting these entitlements in enterprise and education organizations." (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-product-profiles/product-profiles.html)
- An Adobe enterprise identity type: Enterprise ID, Federated ID (single sign-on) or Business ID. Adobe: "Enterprise ID, Federated ID (single sign-on), or Business ID." (https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/adobe-asset-link-overview.html)
- Separate deployment packages for each operating system and processor type. Adobe: "Packages cannot be deployed across different operating systems or architecture types." (https://helpx.adobe.com/business/enterprise/deploy-apps-updates/create-packages/create-managed-packages.html)
- Named User Licensing for packages that carry plugins, and no plugins in packages for Windows ARM devices. Adobe: "This is only available for Named User Licensing packages." (https://helpx.adobe.com/business/enterprise/deploy-apps-updates/customize-end-user-experience/including-plugins-package.html)
- A project in business storage before users can create libraries there. Adobe: "You must create a project to allow users to create libraries in business storage." (https://helpx.adobe.com/business/enterprise/manage-storage-assets/manage-storage/libraries-in-business-storage.html)

### Tiers

- **Creative Cloud for enterprise with Named User Licensing:** The licensing model these lines and the Adobe Asset Link connection assume, with Creative Cloud storage and services enabled. Adobe: "Creative Cloud storage and services enabled." (https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/adobe-asset-link-overview.html)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| CC01 | Admin Console product profiles and users | one-time | 24 | 40 | 72 | yes |  |
| CC02 | Deployment packages with apps and plugins | one-time | 24 | 40 | 80 | yes |  |
| CC03 | Creative Cloud Libraries in business storage | one-time | 16 | 32 | 56 | yes |  |
| CC04 | Sharing policy and services by profile | one-time | 8 | 16 | 32 | yes |  |
| CC05 | Custom fonts for the organization | one-time | 8 | 12 | 24 | optional |  |
| CC06 | Training on libraries and connected workflows | one-time | 16 | 24 | 40 | yes |  |
| CC07 | Monthly Creative Cloud administration | monthly | 8 | 12 | 20 | optional |  |

- **CC01 Admin Console product profiles and users.** Set up your client's product profiles by role, department or team, assign users and groups to them, and name the profile admins who manage assignments. Evidence: "Product profiles link products to users. Assigning a user to a profile gives them access to the related Adobe apps and services." (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-product-profiles/product-profiles.html)
- **CC02 Deployment packages with apps and plugins.** Build managed packages for your client's Windows and macOS devices with the chosen apps, versions, update settings and Marketplace plugins, and test them before IT deploys them. Evidence: "Managed packages allow administrators to control which Adobe applications and versions are deployed, when updates are applied, and which configuration settings are included in the deployment." (https://helpx.adobe.com/business/enterprise/deploy-apps-updates/create-packages/create-managed-packages.html)
- **CC03 Creative Cloud Libraries in business storage.** Create projects in your client's business storage and build shared libraries of logos, colors, type styles and graphics in them, so the organization owns the libraries and designers pick up approved elements inside the apps. Evidence: "Creative Cloud Libraries accelerate work by reducing clicks in the creative process, making it easy for designers to use the right assets and for organizations to control the use of assets." (https://helpx.adobe.com/business/enterprise/manage-storage-assets/manage-storage/libraries-in-business-storage.html)
- **CC04 Sharing policy and services by profile.** Agree with your client how company content may be shared outside the organization, set the asset sharing policy in the Admin Console, and switch optional services on or off for each product profile. Evidence: "As a system administrator, you can restrict sharing features within Creative Cloud and Document Cloud to ensure that sensitive content reaches only appropriate external recipients." (https://helpx.adobe.com/business/enterprise/settings/asset-settings/asset-settings-overview.html)
- **CC05 Custom fonts for the organization.** Accept the Custom fonts offer in the Admin Console, upload the fonts your client is licensed to use, and set which users receive them. Evidence: "Add a font once, and Creative Cloud syncs it to your users' devices for use in supported apps." (https://helpx.adobe.com/business/enterprise/manage-services/custom-fonts/upload-manage-custom-fonts.html)
- **CC06 Training on libraries and connected workflows.** Train your client's creative teams on shared libraries, cloud documents and the panels that connect the apps to the rest of their Adobe products. Evidence: "Libraries in projects allow you to easily and quickly share collections of elements with your organization or collaborators." (https://helpx.adobe.com/business/enterprise/manage-storage-assets/manage-storage/libraries-in-business-storage.html)
- **CC07 Monthly Creative Cloud administration.** Update packages for new app versions, adjust product profiles and services, and add or remove users each month for your client. Evidence: "You can enable and disable services at the product profile level, not for individual user accounts." (https://helpx.adobe.com/business/enterprise/manage-services/configure-services/enable-disable-services.html)

## Product: Workfront Planning (`planning`)

**Title:** Adobe Workfront Planning. **What:** The planning layer of Workfront: teams define their own record types such as campaigns, products and regions, connect them to each other and to work in other Adobe applications, and see them as tables, timelines and calendars. Source: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview

**Notes:** Planning is sold with a Workfront or Workflow package or as a standalone product; the standalone product has no Workflow features, so the planning-workfront connection needs both. Which record types can connect across workspaces depends on the Planning package (Select, Prime, Ultimate). Users on Contributor or Light licenses see Planning only when a layout template includes it. The AI-powered Planning Designer and some request form permissions are under labels that Adam's rule excludes, so neither is in a line (see left_out). Reporting uses the Workfront Canvas Dashboard or Workfront Data Connect. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- A Workfront Planning package, bought with a Workfront or Workflow package or as a standalone product. Adobe: "Workfront Planning is either a standalone product, or an additionally purchased capability of Adobe Workfront." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview)
- A Planning license for each user, and a layout template that includes Planning for users on Contributor or Light access. Adobe: "Assign a layout template that includes Planning to users with a Contributor or Light access level." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview)
- A Planning Prime or Ultimate package (with any Workflow package) for record types that connect across workspaces. Adobe: "Any Workflow and a Planning Prime and Ultimate package" (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-access/access-overview)
- A license and an account for each other application whose objects are connected to record types. Adobe: "When connecting Planning record types with object types from other applications you must also have a license and an account for those applications." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)
- No more than 30 connected fields on one record type. Adobe: "You can have up to 30 connected fields for one record type in Workfront Planning." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)

### Tiers

- **Planning Select, Prime and Ultimate:** The three Planning packages. Each includes workspaces, custom records, connections and views; Prime and Ultimate add record types that connect across workspaces. Adobe: "Each Workfront Planning package includes all Planning Core Features, defined as the ability to create workspaces, the ability to create custom records, manage records, connect records, model records, the ability to ingest documents for record creation, and the ability to create and share views." (https://helpx.adobe.com/legal/product-descriptions/adobe-workfront.html)
- **Planning as a standalone product:** Planning without a Workflow package. Users get Planning features and no Workfront Workflow features, so connections to Workfront projects are not part of it. Adobe: "This gives users no access to any Workfront Workflow features and access to Planning features." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| WP01 | Licenses, access levels and layout templates | one-time | 16 | 24 | 40 | yes |  |
| WP02 | Workspaces and record type model | one-time | 40 | 80 | 160 | yes |  |
| WP03 | Records and fields imported from spreadsheets | one-time | 16 | 32 | 64 | yes |  |
| WP04 | Table, timeline and calendar views | one-time | 16 | 32 | 56 | yes |  |
| WP05 | Request forms with approvals | one-time | 16 | 32 | 56 | optional |  |
| WP06 | Planning reports and dashboards | one-time | 24 | 40 | 72 | optional |  |
| WP07 | Rollout plan and training | one-time | 24 | 40 | 72 | yes |  |
| WP08 | Monthly Planning administration | monthly | 12 | 20 | 32 | yes |  |

- **WP01 Licenses, access levels and layout templates.** Assign Planning licenses and permissions to your client's users, add the license types to their access levels, and assign a layout template that shows Planning to Contributor and Light users. Evidence: "Assign users Workfront and Planning licenses and Workfront Planning permissions that would allow them to either view or create objects in Workfront Planning." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview)
- **WP02 Workspaces and record type model.** Model how your client plans work: design the workspaces, the record types (such as campaigns, products, regions and personas), their fields and how they connect, then build them from scratch or from a template. Evidence: "A workspace is a collection of record types used by a team and represents the team's work lifecycle." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/create-workspaces)
- **WP03 Records and fields imported from spreadsheets.** Clean your client's planning spreadsheets and import them as record types, fields and records, then check the connections between the imported records. Evidence: "When you import a record type from a CSV or Excel file, you can also import records and fields." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/create-record-types)
- **WP04 Table, timeline and calendar views.** Build the shared views your client's teams and leaders use, such as a marketing calendar and a campaign timeline, with the filters, groupings and fields each audience needs. Evidence: "You can view records in views of several formats that give you the flexibility to explore and understand information in the way that works best for you." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-views/manage-record-views)
- **WP05 Request forms with approvals.** Create a request form for the record types your client takes requests for, add approval rules by field value, and share the forms with the people who submit them. Evidence: "You can create a request form for each record type, share it with users and they can add new records by completing and submitting the form." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-requests/requests-article-index)
- **WP06 Planning reports and dashboards.** Build reports on your client's Planning records in the Workfront Canvas Dashboard, or prepare the Planning data in Workfront Data Connect for their own reporting tool. Evidence: "You can create reports from Adobe Workfront Planning using the Workfront Canvas Dashboard or Workfront Data Connect which uses Snowflake technology." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-reporting/reporting-in-planning-article-index)
- **WP07 Rollout plan and training.** Plan your client's rollout team by team, teach the Planning terms and how to add, connect and view records, and hand over a short guide for workspace owners. Evidence: "Although Workfront Planning is part of Workfront, it comes with proprietary concepts and terminology." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview)
- **WP08 Monthly Planning administration.** Add record types, fields and views as your client's planning changes, tidy records and connections, and adjust sharing each month. Evidence: "It lets organizations define strategy, manage campaigns, centrally manage marketing metadata, and build data visualizations that connect plans directly to execution." (https://helpx.adobe.com/legal/product-descriptions/adobe-workfront.html)

## Connections with services

### Adobe Express + AEM Assets (`express-aemassets`)

**Kind:** native. **Label:** AEM Assets opens inside Express through Content Advisor, and finished designs save back to AEM Assets.

**How:** AEM Assets opens inside the Express editor through Content Advisor: users browse or search the repositories they are entitled to, place approved assets or Dynamic Media renditions on the canvas, and save new or edited designs back to AEM Assets with a folder and metadata. Source: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express

**Gain:** Approved assets in every design, and designs back in the DAM. People who make content in Express start from your client's approved assets instead of downloads and copies, and what they make returns to AEM Assets with its metadata, so the DAM stays the one place for finished content.

**Availability:** Not stated by Adobe; the page calls the integration native. Adobe: "Adobe Experience Manager (AEM) Assets integrates natively with Adobe Express, allowing you to discover, access, and use assets from AEM Assets directly within the Express interface using Content Advisor."

**Prerequisites:**

- Entitlements to Adobe Express and to at least one AEM Assets as a Cloud Service environment. Adobe: "Entitlements to access Adobe Express and at least one environment within AEM Assets. The environment can be any of the Assets as a Cloud Service repositories."
- Edit or write permission on the AEM repository for anyone who saves designs back. Adobe: "You need edit or write permissions to the AEM repository to save files to AEM Assets."
- An author repository selected in Express, because a delivery repository does not show Content Advisor features. Adobe: "A delivery repository does not display Content Advisor features."
- For smart suggestions: a GenAI Rider signed with Adobe. Adobe: "Accessing Smart Suggestions in Content Advisor requires signing a GenAI Rider."
- For files above the 80MB Express upload limit: Dynamic Media renditions. Adobe: "Dynamic Media helps overcome the 80MB upload file size limitation in Adobe Express (web) by providing optimized renditions of large assets."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ01 | AEM Assets access for Express users | one-time | 8 | 16 | 32 | yes |  |
| XJ02 | Metadata, filters and saved searches for creators | one-time | 16 | 24 | 48 | optional |  |
| XJ03 | Save-back folders and metadata for Express designs | one-time | 8 | 16 | 32 | yes |  |

- **XJ01 AEM Assets access for Express users.** Give your client's Express users access to the right AEM Assets environment and folders, with edit or write permission for those who save designs back, and test browsing, placing and saving. Evidence: "Entitlements to access Adobe Express and at least one environment within AEM Assets. The environment can be any of the Assets as a Cloud Service repositories." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express)
- **XJ02 Metadata, filters and saved searches for creators.** Set up the metadata tabs, filters and saved searches in the Assets view so your client's creators find approved, channel-ready assets from inside Express. Evidence: "Content Advisor uses the same metadata configuration as in Assets View, replicating the list of metadata tabs and content in Assets view asset details page." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express)
- **XJ03 Save-back folders and metadata for Express designs.** Agree where finished Express designs land in AEM Assets and which project or campaign name, keywords and channels they carry, and write the short guide your client's creators follow when they save. Evidence: "After incorporating appropriate modifications in the Express canvas, you can save it in AEM Assets." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express)

**Client voice.** How: Your approved assets in AEM Assets open inside Adobe Express. Your teams search or browse them, place them in a design, and save the finished design back to AEM Assets with its folder and metadata. Gain: Your teams build content from approved assets instead of downloaded copies, and finished designs return to your DAM, so it stays the one place for final content.

### Adobe Express + Workfront (`express-workfront`)

**Kind:** native. **Label:** Express templates carry a Workfront approval workflow, so remixed designs are approved in Workfront before they are published.

**How:** A Workfront administrator creates an approval workflow in Workfront, and a designer attaches it to an Express template. When someone remixes the template, the design must be approved before it can be published: the request goes to a Workfront project and reviewers comment and decide in the Workfront proofing viewer. Source: https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-express

**Gain:** Self-serve content that still gets approved. Your client's wider teams make their own content from branded templates, and nothing is published until the right people have approved it in Workfront, with the comments, decisions and audit trail kept in the project.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Entitlements to Adobe Express and at least one Workfront environment with a Workfront Standard license. Adobe: "You must have entitlements to access Adobe Express and at least one Workfront environment with a Workfront Standard license."
- An approval workflow created in Workfront by a Proof administrator with a Standard license. Adobe: "Before users can add an approval workflow on an Express template, a Proof administrator with a Standard license must create an approval workflow in Workfront."
- An Express Enterprise premium license for the designers who attach the workflow to a template. Adobe: "After an approval workflow template is created in Workfront, designers with an Express Enterprise premium license can assign it to an Express template directly within Adobe Express."
- A Standard Workfront license for people who request approval, and at least a Collaborator license for reviewers. Adobe: "Users must have at least Collaborator Workfront license to review and make a decision."
- Where your client has several Workfront instances: the one the people remixing templates can reach. Adobe: "If you have multiple Workfront instances, make sure you are using the one that remixers have access to."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ04 | Workfront approval workflows for Express designs | one-time | 16 | 24 | 48 | yes |  |
| XJ05 | Express templates mapped to approval workflows | one-time | 8 | 16 | 32 | yes |  |

- **XJ04 Workfront approval workflows for Express designs.** Design the approval stages your client needs for self-serve content (brand, legal, compliance), build them as approval workflow templates in Workfront, and check the license each requester and reviewer needs. Evidence: "Before users can add an approval workflow on an Express template, a Proof administrator with a Standard license must create an approval workflow in Workfront." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-express)
- **XJ05 Express templates mapped to approval workflows.** Attach the right Workfront approval workflow to each of your client's Express templates, choose the Workfront projects requests go to, and run a remix through approval end to end. Evidence: "When requesting approval on a remixed Express template, users can choose a Workfront project to send the proof to." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-express)

**Client voice.** How: We attach your Workfront approval workflows to your Adobe Express templates. When someone makes a design from a template, it goes to a Workfront project for review, and it can be published only after your approvers decide. Gain: Your teams make their own on-brand content, and nothing goes out before the right people approve it, with every comment and decision kept in Workfront.

### Adobe Express + Frame.io (`express-frameio`)

**Kind:** native. **Label:** Express designs sent for approval through Workfront are reviewed and approved in the Frame.io viewer.

**How:** Where Workfront uses unified review and approval, the same Express template approval runs through Workfront and the reviewers comment, mark up and decide in the Frame.io viewer. The connection goes through Workfront, not from Express to Frame.io directly. Source: https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/express-wf-frame

**Gain:** One review tool for designs and video. Your client's reviewers approve Express designs in the same Frame.io viewer they use for video and other creative work, so feedback sits in one place and people learn one tool.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Workfront, with unified review and approval in use: this connection runs through it. Adobe: "Map an Express template to a multi-stage review and approval workflow using unified approval templates in Workfront"
- Entitlements to Adobe Express and at least one Workfront environment with a Workfront Standard license. Adobe: "You must have entitlements to access Adobe Express and at least one Workfront environment with a Workfront Standard license."
- An approval workflow template created in Workfront by a user with a Standard license. Adobe: "Before users can add an approval workflow on an Express template, a user with a Standard license must create an approval workflow template in Workfront."
- At least a Collaborator Workfront license for reviewers; no Frame.io license is needed to use the viewer. Adobe: "No additional Frame.io license is required to use the Frame.io viewer for reviews and approvals."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ06 | Express design reviews in the Frame.io viewer | one-time | 16 | 24 | 48 | yes |  |

- **XJ06 Express design reviews in the Frame.io viewer.** Build unified approval templates in Workfront for your client's Express templates, attach them, and show reviewers how to comment, mark up and decide in the Frame.io viewer. Evidence: "Stakeholders can provide feedback relevant to their area of expertise" (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/express-wf-frame)

**Client voice.** How: Designs your teams make from Adobe Express templates go through your Workfront approval steps, and your reviewers comment and approve in the Frame.io viewer. Gain: Your reviewers use one tool for designs and video, and feedback stays in one place.

### Adobe Express + Journey Optimizer (`express-ajo`)

**Kind:** native. **Label:** Edit in Adobe Express in the Email Designer, with the full editor for users who hold an Express Enterprise license.

**How:** In the Journey Optimizer Email Designer, Edit in Adobe Express opens Express tools on an image: resize, remove background, crop and convert to JPEG or PNG. Users with an Express Enterprise license get the full Express editor. Source: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/express

**Gain:** Image fixes without leaving the email. Your client's marketers adjust an image where they build the email, and with Express Enterprise licenses they get the full editor, so small changes stop going back to the design team.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- An Express Enterprise license for each user who needs the full editor; without one only the quick actions are available. Adobe: "The features detailed in the sections below are accessible to users without an Adobe Express Enterprise license."
- No health data: Adobe says not to use this integration with PHI or other health data, because data leaves Journey Optimizer. Adobe: "By using the Adobe Express integration, data will leave Journey Optimizer. Do not use this integration with PHI or other health data."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ07 | Express editing for Journey Optimizer teams | one-time | 8 | 12 | 24 | yes |  |

- **XJ07 Express editing for Journey Optimizer teams.** Assign Express Enterprise licenses to your client's Journey Optimizer content creators, agree which images may be edited this way given Adobe's health data warning, and show the team the edit and save steps. Evidence: "With an Enterprise license, users have full access to the Adobe Express Web editor, enabling them to adjust asset settings, generate content with Firefly, add text, and apply additional customizations." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/express)

**Client voice.** How: Your marketers open an image in Adobe Express from the Journey Optimizer Email Designer, edit it, and save it back for use in the email. Gain: Small image changes are made where the email is built, without a request to your design team.

### Adobe Express + Marketo Engage (`express-marketo`)

**Kind:** native. **Label:** Edit in Adobe Express on images in the Marketo Engage Design Studio.

**How:** In the Marketo Engage Design Studio, Edit in Adobe Express opens Express editing tools on a PNG or JPEG image. Users with an Express Enterprise license in the same IMS organization get the full editor; others get the quick actions. Source: https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/edit-images-adobe-express

**Gain:** Image fixes inside Design Studio. Your client's Marketo team updates images where they manage them, and an edited image updates everywhere it is already used, so one change fixes every email that carries it.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- For the full editor: an Express Enterprise license under the same IMS organization as the Marketo Engage subscription. Adobe: "The license purchased must be under the same IMS Org as your Marketo Engage subscription to access all Adobe Express editing capabilities."
- An Express license for each user; users without one get the quick actions only. Adobe: "Users without a license can only access the quick actions in Adobe Express."
- PNG and JPEG images only. Adobe: "Adobe Express only supports PNG and JPEG image file formats at this time."
- Care with images already in use: an edit updates the image in every email and template that uses it. Adobe: "If the image is already referenced in an email or email template, any edits made will update that image everywhere it is currently being used."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ08 | Express editing for Marketo Engage teams | one-time | 8 | 12 | 24 | yes |  |

- **XJ08 Express editing for Marketo Engage teams.** Check that your client's Express Enterprise licenses sit in the same IMS organization as Marketo Engage, assign them to the Design Studio users, and show the team how an edit to a shared image reaches every email that uses it. Evidence: "Adobe Marketo Engage integrates natively with Adobe Express, giving you access to a variety of image editing tools." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/edit-images-adobe-express)

**Client voice.** How: Your Marketo Engage team opens an image in Adobe Express from Design Studio, edits it, and saves it back. Gain: One edit updates the image in every email that uses it, without a request to your design team.

### Adobe Express + Journey Optimizer B2B Edition (`express-ajob2b`)

**Kind:** native. **Label:** Edit with Adobe Express on images in the Journey Optimizer B2B Edition asset repository.

**How:** Images in the Journey Optimizer B2B Edition asset repository open in Adobe Express editing tools from the image details. Quick actions come with every subscription; the full Express editor needs an Express Enterprise license in the same IMS organization. Source: https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/internal-dam/image-edit-adobe-express

**Gain:** Image fixes inside the asset repository. Your client's B2B marketers resize, crop and clean up images where the assets live, and the entitlement for the quick actions is already part of the subscription.

**Availability:** Adobe says the entitlement for the Express editing features comes with all Journey Optimizer B2B Edition subscriptions. Adobe: "Entitlements for Adobe Express editing features are included with all Journey Optimizer B2B Edition subscriptions."

**Prerequisites:**

- For the full editor: an Express Enterprise license under the same IMS organization, assigned to each user. Adobe: "As an individual member of the IMS organization, you need an assigned license in the Adobe Express instance."
- PNG and JPEG images only. Adobe: "The Adobe Express functions support PNG and JPEG image file formats."
- A check of where an image is used before it is edited, since changes affect that content. Adobe: "It is a best practice to select the Used By tab in the image details and review the content where the image is currently used before you proceed to make edits to the image file."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ09 | Express editing for Journey Optimizer B2B teams | one-time | 8 | 12 | 24 | yes |  |

- **XJ09 Express editing for Journey Optimizer B2B teams.** Assign Express Enterprise licenses to your client's B2B content creators who need the full editor, and show the team the quick actions, the Used By check and how to save an edit as a new asset. Evidence: "Adobe Journey Optimizer B2B Edition integrates natively with Adobe Express, and enables you to access a set of Adobe Express image editing tools." (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/internal-dam/image-edit-adobe-express)

**Client voice.** How: Your B2B marketing team opens an image in Adobe Express from the Journey Optimizer B2B Edition asset repository, edits it, and saves it back. Gain: Image changes are made where your assets live, without a request to your design team.

### Adobe Express + GenStudio for Performance Marketing (`express-gspm`)

**Kind:** native. **Label:** Express templates, with their lock settings, appear in GenStudio's Create for paid social and display content.

**How:** Templates designed in Adobe Express appear in GenStudio for Performance Marketing's Create workflow for Meta, Display, LinkedIn and TikTok when they were created by the user or shared to the organization in the same IMS organization. Lock settings set in Express apply in GenStudio, and each page of an Express template generates as a separate size. Source: https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates

**Gain:** Designer-built templates behind generated ads. Your client's designers build and lock the ad templates in Express, and marketers generate on-brand variants from them in GenStudio, in every size at once, without rebuilding templates in code.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Express and GenStudio for Performance Marketing in the same IMS organization. Adobe: "Shared to the user's organization, using the same IMS org in both apps"
- Templates created by the user or shared to the organization from Express. Adobe: "Express templates can be accessed in GenStudio for Performance Marketing when those templates are:"
- A template type of Meta, Display, LinkedIn or TikTok: Express templates show for these only. Adobe: "Express templates are only available for the types:"
- For custom fonts in a template: the Custom Fonts offer accepted in the Admin Console. Adobe: "To use custom fonts in an Express Template, admins must first accept the Custom Fonts qualifying offer in the admin console, which is included as part of the Express license entitlement."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ10 | Express templates prepared for GenStudio | one-time | 16 | 32 | 56 | yes |  |
| XJ11 | Multi-size Express templates | one-time | 8 | 16 | 32 | optional |  |

- **XJ10 Express templates prepared for GenStudio.** Build your client's paid social and display templates in Express with the locks they need, share them to the organization, and check in GenStudio that each one generates with the right fields tagged. Evidence: "GenStudio for Performance Marketing can use templates that have been created and designed in Adobe Express." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates)
- **XJ11 Multi-size Express templates.** Add a page for each ad size to your client's Express templates so GenStudio generates every size in one pass, and adjust the layout of each size. Evidence: "When multiple sized content exists for an asset in Express, variants can be generated for all those sizes in a single generation." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates)

**Client voice.** How: The ad templates your designers build and lock in Adobe Express appear in GenStudio for Performance Marketing, where your marketers generate variants from them. Gain: Your designers control the layout once, and your marketers produce on-brand ads in every size without waiting for new templates.

### Adobe Express + Creative Cloud (`express-creativecloud`)

**Kind:** native. **Label:** Photoshop and Illustrator files placed in Express as linked images that stay in sync, or converted to editable Express files.

**How:** Photoshop and Illustrator files are added to an Express design in two ways: as a linked image that stays connected to the original, so edits made in Photoshop or Illustrator sync to Express, or converted into an editable Express file that is no longer connected. Source: https://helpx.adobe.com/express/web/bring-in-assets-from-other-apps/use-creative-cloud-assets/photoshop-illustrator-overview.html

**Gain:** Designer originals, reused by everyone. Your client's designers keep working in Photoshop and Illustrator, and the wider team reuses that work in Express templates: a linked image updates when the designer changes the original.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Photoshop and Illustrator files saved as cloud files, so they show in Express. Adobe: "Learn how to save your PSD and AI files as cloud files"
- Files within the limits: 500MB for Photoshop, 100MB for Illustrator, RGB color only. Adobe: "Adobe Photoshop: 500MB ... Adobe Illustrator: 100MB ... Not supported: non-RGB profiles (e.g., CMYK)"
- Fonts uploaded to Express as custom fonts, or Express picks the nearest match. Adobe: "Adobe Express will pick the nearest match."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ12 | Photoshop and Illustrator hand-off into Express | one-time | 16 | 24 | 48 | yes |  |

- **XJ12 Photoshop and Illustrator hand-off into Express.** Agree with your client's designers which files become linked images and which are converted, prepare the source files (cloud files, RGB, rasterized where editing is not needed), and build the first Express templates from them. Evidence: "You can add them as a linked image or convert the file to an Adobe Express file." (https://helpx.adobe.com/express/web/bring-in-assets-from-other-apps/use-creative-cloud-assets/photoshop-illustrator-overview.html)

**Client voice.** How: Your designers' Photoshop and Illustrator files are placed in Adobe Express, either linked to the original so changes carry through, or converted into designs your teams can edit. Gain: Your designers keep their own tools, and the rest of your team reuses their work without asking for exports.

### Frame.io + Workfront (`frameio-workfront`)

**Kind:** native. **Label:** Unified review and approval: work is managed in Workfront and reviewed and approved in the Frame.io viewer, on shared Adobe cloud storage.

**How:** Unified review and approval: projects are planned in Workfront and stored on Adobe cloud storage, approvals are started in Workfront, and reviewers comment, mark up and decide in the Frame.io viewer. Permissions are set in Workfront and flow down to Frame.io. With a Frame.io Enterprise license the Workfront projects also appear in Frame.io, in a workspace called Workfront Linked Projects, and people upload in either product. Source: https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-approvals-overview

**Gain:** Work management and creative review in one flow. Your client's project leads run the work in Workfront while creatives and stakeholders review in Frame.io, with no files moved between tools, one set of permissions and one audit trail of every decision.

**Availability:** Adobe says the Frame.io viewer is the default viewer for all Workfront review and approval workflows and is included for all Workfront users. Adobe: "The Frame.io viewer is the default viewer for all Workfront review and approval workflows."

**Prerequisites:**

- Workfront and Frame.io deployed to the same Adobe IMS organization, with each user in only one Workfront instance. Adobe: "Workfront and Frame.io must be deployed to the same Adobe Identity Management System (IMS) organization."
- A Workfront instance on the Adobe Unified Experience and Adobe cloud storage. Adobe: "The Workfront instance must be enabled on the Adobe Unified Experience and Adobe cloud storage."
- A Workfront contract that supports unified review and approval, which Adobe's account representative checks. Adobe: "Contact your Adobe account representative to confirm whether your current Workfront contract supports unified review and approval." Statement of work condition: Adobe confirms that the Workfront contract supports unified review and approval before this service starts.
- Agreement that Workfront Proof goes away for new projects once this is enabled. Adobe: "Workfront Proofing functionality is not available with this integration."
- A Frame.io Enterprise license for uploading straight into Frame.io projects; the viewer alone needs none. Adobe: "No additional Frame.io license is required to use the Frame.io viewer for reviews and approvals."
- Without Frame.io Enterprise: video review requests capped each year at 10% of paid Workfront licenses. Adobe: "There is an annual cap for video proof requests set at 10% of an organization's total paid Workfront user licenses"
- Sharing done in Workfront: users cannot be invited or their permissions changed in Frame.io. Adobe: "This means you cannot invite a user to a project in Frame.io or modify user permissions in Frame.io."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ13 | Unified review and approval rollout | one-time | 24 | 40 | 72 | yes |  |
| XJ14 | Approval templates with stages and paths | one-time | 16 | 32 | 56 | yes |  |
| XJ15 | Workfront-linked projects in Frame.io | one-time | 16 | 24 | 48 | optional |  |
| XJ16 | Workfront Fusion scenarios for Frame.io | one-time | 24 | 40 | 80 | optional | Also needs Workfront Fusion |

- **XJ13 Unified review and approval rollout.** Check your client's Workfront instance, storage and organization setup against Adobe's requirements, plan the move of new projects to Adobe cloud storage and away from Workfront Proof, and run the first approvals in the Frame.io viewer. Evidence: "The Workfront instance must be enabled on the Adobe Unified Experience and Adobe cloud storage." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-approvals-overview)
- **XJ14 Approval templates with stages and paths.** Build your client's reusable approval templates in Workfront, with reviewers and approvers by stage, parallel paths for brand, legal and business sign-off, and due dates, and share them with the teams that use them. Evidence: "You can configure up to 30 parallel paths in a template, with up to 100 stages total." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-reviews-and-approvals/manage-asset-review-and-approval/create-approval-template)
- **XJ15 Workfront-linked projects in Frame.io.** Set up how your client's creative teams work in the Workfront Linked Projects workspace in Frame.io: who uploads where, how folders and names follow Adobe cloud storage rules, and how project sharing is handled from Workfront. Evidence: "If your organization has a Frame.io Enterprise license, projects created in Workfront are also visible in Frame.io, allowing users to interact and upload assets in either product." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/get-started-with-unified-approvals)
- **XJ16 Workfront Fusion scenarios for Frame.io.** Build Workfront Fusion scenarios on the Frame.io modules for steps your client wants automated, such as creating assets or reacting to new comments. Evidence: "The Adobe Workfront Fusion Frame.io modules enable you to monitor, create, update, retrieve, or delete assets and comments in your Frame.io account." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/frame-io-modules-new)

**Client voice.** How: Your teams plan and track work in Workfront and review it in Frame.io. Approvals start in Workfront, your reviewers comment and decide in the Frame.io viewer, and access is managed once, in Workfront. Gain: Your project leads and your creative teams each stay in their own tool, files are not moved between systems, and every approval decision is recorded.

### Frame.io + AEM Assets (`frameio-aemassets`)

**Kind:** native. **Label:** Assets approved in Workfront with Frame.io are pushed with their metadata to AEM Assets; the integration is set up in Workfront.

**How:** On Adobe's pages this connection runs through Workfront: assets that finished review and approval in Workfront with Frame.io are pushed from Workfront, with their metadata, to AEM Assets as a Cloud Service. The integration is set up in Workfront and needs Adobe cloud storage. Frame.io's own help center lists a direct export from Frame.io to AEM Assets, which this session could not read. Source: https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/use-aem-with-frame

**Gain:** Approved work lands in the DAM. When review ends, your client's approved files move into AEM Assets with their project metadata, so the DAM receives finished work without anyone downloading and uploading it again.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Workfront, using Adobe cloud storage: on Adobe's pages this connection is set up there. Adobe: "Your Workfront instance must be using Adobe cloud storage."
- AEM Assets as a Cloud Service, with users added to the product. Adobe: "You must have Experience Manager Assets as a Cloud Service, and you must be added to the product as a user."
- Workfront and AEM Assets under one Organization ID in the Admin Console. Adobe: "You must have Workfront and Adobe Experience Manager Assets associated with an Organization ID in the Adobe Admin Console."
- A Workfront administrator to configure the integration. Adobe: "You must be a Workfront administrator."
- The right repository chosen first time, because it cannot be changed after the configuration is saved. Adobe: "Due to the complexity of the integration, you can't change the repository after you save the initial configuration."
- Metadata mapped one way only, from Workfront to Experience Manager. Adobe: "You can map metadata only in one direction: from Workfront to Experience Manager."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ17 | Approved assets from review to AEM Assets | one-time | 16 | 32 | 56 | yes |  |
| XJ18 | Project metadata carried onto approved assets | one-time | 16 | 24 | 48 | optional |  |

- **XJ17 Approved assets from review to AEM Assets.** Add the Experience Manager integration in your client's Workfront setup, choose the AEM Assets repository, and set how approved files are sent to their folders once review in Frame.io ends. Evidence: "You can use the Experience Manager Assets to manage and store your digital assets that have gone through the review and approval cycle." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/use-aem-with-frame)
- **XJ18 Project metadata carried onto approved assets.** Create the metadata fields in AEM Assets and the custom form fields in Workfront, and map them so your client's approved assets arrive with campaign, product and usage details. Evidence: "You can map Workfront object data to asset media fields in Experience Manager Assets." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/use-aem-with-frame)

**Client voice.** How: When your reviewers approve work in Frame.io through Workfront, the approved files are sent to AEM Assets with their project details. Gain: Finished work reaches your DAM with the right labels, without anyone downloading and uploading it again.

### Frame.io + Creative Cloud (`frameio-creativecloud`)

**Kind:** native. **Label:** Frame.io tools inside Premiere Pro, switched on for Creative Cloud for enterprise in the Admin Console.

**How:** Creative Cloud for enterprise users reach Frame.io tools inside Premiere Pro, in the timeline, and in the Frame.io web and mobile apps. For Creative Cloud for enterprise the Frame.io service is off until an administrator turns it on in the Admin Console. Source: https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/frame-io-cc-business.html

**Gain:** Review comments in the editing timeline. Your client's video editors share cuts and read review comments without leaving Premiere Pro, which shortens the loop from first draft to final delivery.

**Availability:** Adobe says Frame.io is off by default for Creative Cloud for enterprise customers until the administrator activates it. Adobe: "Yes, Frame.io is disabled by default for Creative Cloud enterprise customers."

**Prerequisites:**

- The Frame.io service activated by your client's administrator in the Admin Console. Adobe: "Your administrator activates Frame.io in the Adobe Admin Console."
- Frame.io's network endpoints allowed by your client's IT team. Adobe: "Frame.io for Adobe Creative Cloud is accessible through the following network endpoints:"
- A paid Frame.io plan for more than the included 100GB of storage and five projects. Adobe: "Creative Cloud customers receive a free plan with additional features, including 100GB of Frame.io cloud storage, the ability to work on up to five projects with another user, and Camera to Cloud."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ19 | Frame.io for Premiere Pro editors | one-time | 8 | 16 | 32 | yes |  |

- **XJ19 Frame.io for Premiere Pro editors.** Turn on the Frame.io service for your client's video product profiles, have IT allow the network endpoints, connect editors to the right Frame.io account and projects, and show them review in the Premiere Pro timeline. Evidence: "Editors in Premiere Pro can access Frame.io directly in their timeline, staying connected with collaborators and stakeholders without breaking their flow." (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/frame-io-cc-business.html)

**Client voice.** How: Your video editors share cuts for review and read the comments inside Premiere Pro, connected to your Frame.io account. Gain: Review feedback reaches your editors where they work, which shortens each round of changes.

### Creative Cloud + AEM Assets (`creativecloud-aemassets`)

**Kind:** native. **Label:** Adobe Asset Link panel in Photoshop, Illustrator and InDesign, plus the Experience Manager desktop app for other file types.

**How:** Adobe Asset Link is a panel inside Photoshop, Illustrator and InDesign that lets creatives search, open, check out, edit and save files held in AEM Assets without leaving the app. Entitled users connect to their AEM Assets as a Cloud Service environment automatically. The Experience Manager desktop app does the same from the desktop for any file type and application. Source: https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/adobe-asset-link-overview.html

**Gain:** The DAM inside the design apps. Your client's designers work on the approved files straight from AEM Assets and save new versions back, so there are no local copies to chase and InDesign layouts keep links to the right assets.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Creative Cloud for enterprise or teams with Named User Licensing and Creative Cloud storage and services enabled. Adobe: "Creative Cloud storage and services enabled."
- AEM as a Cloud Service with an Assets license, or Experience Manager 6.4 or 6.5 with the latest service packs. Adobe: "Experience Manager as a Cloud Service with any Assets license (Assets Ultimate, Assets Prime, Assets as a Cloud Service, and Assets Essentials)."
- Asset Link users added to the AEM environment's product profile in the Admin Console, with permissions on the Assets content. Adobe: "Add Asset Link users to your Experience Manager environment product profile using the Admin Console."
- The right form of Asset Link: the UXP plugin for Photoshop 26.11 or newer, the CEP extension for Illustrator and InDesign. Adobe: "For Illustrator and InDesign, continue to use the Asset Link CEP extension."
- Directory Trust where Creative Cloud and Experience Manager sit in different Admin Consoles. Adobe: "If your Creative Cloud subscription is provisioned in a different Adobe Admin Console from Experience Manager, you may need to establish Directory Trust between them."
- For AEM environments that are not Cloud Service: the CEP version of Asset Link in Photoshop too. Adobe: "Continue using the Asset Link CEP version when working with non-Cloud Service Adobe Experience Manager deployments."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ20 | Adobe Asset Link deployment and AEM access | one-time | 16 | 32 | 56 | yes |  |
| XJ21 | Experience Manager desktop app for other file types | one-time | 8 | 16 | 32 | optional |  |
| XJ22 | Working practice for creatives on DAM assets | one-time | 8 | 16 | 32 | optional |  |

- **XJ20 Adobe Asset Link deployment and AEM access.** Add Adobe Asset Link to your client's Creative Cloud deployment packages, add the creative users to the AEM environment's product profile, grant their groups permissions on the Assets folders, and test open, check out and save in each app. Evidence: "To install the Adobe Asset Link panel, include the extension when you build a deployment package in the Adobe Admin Console." (https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/deploy-adobe-asset-link-panel.html)
- **XJ21 Experience Manager desktop app for other file types.** Install and configure the Experience Manager desktop app for your client's users who work in other applications, with automatic upload turned off where work in progress should not create versions. Evidence: "For simplifying access to assets from desktop for any generic file format or application: use Experience Manager desktop app" (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/aem-cc-integration-best-practices)
- **XJ22 Working practice for creatives on DAM assets.** Write and teach the working practice for your client's creatives: when to check out, where work in progress lives, when to save back to AEM Assets, and how to relink InDesign layouts to DAM assets. Evidence: "Adobe Asset Link provides the best user experience, including clean handling of the Work-in-progress on assets checked out from Experience Manager" (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/aem-cc-integration-best-practices)

**Client voice.** How: Your designers open, edit and save files in AEM Assets from a panel inside Photoshop, Illustrator and InDesign. People who use other applications reach the same assets through a desktop app. Gain: Your creative teams always work on the approved file and save new versions to your DAM, so local copies and broken links stop piling up.

### Creative Cloud + Workfront (`creativecloud-workfront`)

**Kind:** native. **Label:** Workfront plugin for comments and approvals inside the apps, and Workfront projects in the Projects panel of Photoshop, Illustrator and InDesign.

**How:** Two built-in routes. The Workfront plugin puts Workfront comments and approvals inside InDesign, Illustrator, Photoshop, XD, Premiere Pro and After Effects. With Adobe cloud storage, Workfront projects also appear in the Projects panel of Photoshop, Illustrator and InDesign, where designers open, edit and save project documents; saving a document under approval creates a new version and keeps the approval history. Source: https://experienceleague.adobe.com/en/docs/workfront/using/documents/adobe-creative-cloud-projects/adobe-creative-cloud-projects-overview

**Gain:** Assignments and files inside the design apps. Your client's designers see their Workfront work and save files to the project from the app they design in, so status, versions and approvals stay current without a second tool open.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- A Creative Cloud license in addition to a Workfront license for each designer. Adobe: "You must have an Adobe Creative Cloud license in addition to a Workfront license."
- The Creative Cloud app installed before its Workfront plugin; Photoshop and XD have their own installers. Adobe: "You must install the Creative Cloud app you wish to use before installing the Workfront plugin for that app."
- For the Projects panel: a Workfront version that supports Adobe cloud storage, since projects on legacy Workfront storage do not appear. Adobe: "Legacy Workfront storage projects are not supported in the Projects panel."
- For the Projects panel: Workfront and the Creative Cloud apps entitled in the same Adobe IMS organization. Adobe: "Workfront and Photoshop, Illustrator, or InDesign must be entitled in the same Adobe Identity Management System (IMS) organization."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ23 | Workfront plugin in Creative Cloud packages | one-time | 8 | 16 | 32 | yes |  |
| XJ24 | Workfront projects in the Projects panel | one-time | 8 | 16 | 32 | optional |  |

- **XJ23 Workfront plugin in Creative Cloud packages.** Add the Workfront plugin to your client's Creative Cloud deployment packages, or build plugin-only packages, sign the designers in to the right Workfront domain, and show them comments and approvals in the app. Evidence: "If you are an Adobe Admin Console administrator, you can include Adobe Workfront for design and video in Creative Cloud deployment packages." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-integrations/workfront-for-creative-cloud/install-wf-cc/wf-install-cc)
- **XJ24 Workfront projects in the Projects panel.** Check that your client's Workfront projects use Adobe cloud storage, set the document folders designers work from, and teach open, edit and save from the Projects panel, including what saving does to a document under approval. Evidence: "Only projects that use Adobe cloud storage appear in the Projects panel alongside your other Creative Cloud projects." (https://experienceleague.adobe.com/en/docs/workfront/using/documents/adobe-creative-cloud-projects/adobe-creative-cloud-projects-overview)

**Client voice.** How: Your designers see their Workfront assignments, comments and approvals inside their Creative Cloud apps, and open and save project files from a panel in Photoshop, Illustrator and InDesign. Gain: Your designers stay in the app they design in, and your Workfront projects always hold the latest version and its approval history.

### Workfront Planning + Workfront (`planning-workfront`)

**Kind:** native. **Label:** Planning record types connect to Workfront projects, portfolios, programs, companies and groups, and automations create Workfront work from a record.

**How:** Planning record types connect to Workfront projects, portfolios, programs, companies and groups, so a record such as a campaign links to the work that delivers it and shows fields from it. Automations on a record type create Workfront objects from a record and connect them, and Planning records show in a Planning section on the Workfront object. Source: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview

**Gain:** Plans tied to the work that delivers them. Your client's leaders see each campaign with its projects, dates and status in one place, and a planned campaign becomes a Workfront project from a button instead of being typed in again.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- Planning bought together with a Workfront or Workflow package: the standalone product has no Workflow features. Adobe: "This gives users no access to any Workfront Workflow features and access to Planning features."
- Record types connected to Workfront object types first, then individual records and objects. Adobe: "For individual records or objects to be connected to one another, the record types must first be connected to object types."
- Planning record fields are not available on Workfront objects; the link shows in the object's Planning section. Adobe: "Planning records fields are not accessible from Workfront objects."
- Manage permissions on the workspace and record type to create automations. Adobe: "Manage permissions to the workspace and to the record type where you want to create automations."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ25 | Record types connected to Workfront objects | one-time | 16 | 32 | 56 | yes |  |
| XJ26 | Automations that create Workfront work from records | one-time | 16 | 32 | 64 | yes |  |
| XJ27 | Planning connections on Workfront custom forms | one-time | 8 | 16 | 32 | optional |  |

- **XJ25 Record types connected to Workfront objects.** Connect your client's Planning record types to Workfront projects, portfolios, programs, companies and groups with the right one-to-many rules, bring in the lookup fields leaders need, and link the existing records to their work. Evidence: "For individual records or objects to be connected to one another, the record types must first be connected to object types." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)
- **XJ26 Automations that create Workfront work from records.** Configure automations on your client's record types that create a Workfront project, program or portfolio from a record, using the right templates, and connect the new object back to the record. Evidence: "For example, you could create an automation that takes a Workfront Planning campaign and creates a project in Workfront to track that campaign's progress." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/configure-automations-to-create-records)
- **XJ27 Planning connections on Workfront custom forms.** Add Planning connection fields to your client's Workfront custom forms and show project teams where the connected records appear on a project. Evidence: "You can create a Planning connection custom field and attach it to a Workfront object's custom form." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)

**Client voice.** How: Your plans in Workfront Planning, such as campaigns, are linked to the Workfront projects that deliver them. A planned item can create its project automatically, and each plan shows the dates and status of its work. Gain: Your leaders see plans and delivery together, and your teams stop entering the same campaign in two places.

### Workfront Planning + AEM Assets (`planning-aemassets`)

**Kind:** native. **Label:** Planning records connect to AEM Assets images, folders and Content Fragments, and Planning fields can reach asset metadata.

**How:** Planning record types connect to AEM Assets images, folders and Content Fragments, so a campaign or product record shows the content that belongs to it. Planning fields reach an asset's metadata once the Workfront administrator maps them through the integration between Workfront and AEM Assets. Source: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview

**Gain:** Plans linked to their content. Your client's teams open a campaign and see its approved assets and content fragments, and assets carry the campaign details from the plan, which makes them easier to find and reuse.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- An Adobe Experience Manager license, with an account for the users who connect records. Adobe: "An Adobe Experience Manager license"
- For Planning fields on assets: the metadata mapping configured by the Workfront administrator in the Workfront and AEM Assets integration. Adobe: "Planning record fields are accessible from Experience Manager assets when your Workfront administrator configures the metadata mapping through the integration between Workfront and Adobe Experience Manager Assets."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ28 | Record types connected to AEM Assets | one-time | 16 | 24 | 48 | yes |  |
| XJ29 | Planning fields in asset metadata | one-time | 16 | 24 | 48 | optional |  |

- **XJ28 Record types connected to AEM Assets.** Connect your client's Planning record types to AEM Assets images, folders and Content Fragments, and link the first campaigns and products to their content. Evidence: "You can connect the following objects from Adobe Experience Manager Assets:" (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)
- **XJ29 Planning fields in asset metadata.** Map your client's Planning record fields to AEM Assets metadata through the Workfront and AEM Assets integration, so assets carry campaign, product and region from the plan. Evidence: "Planning record fields are accessible from Experience Manager assets when your Workfront administrator configures the metadata mapping through the integration between Workfront and Adobe Experience Manager Assets." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)

**Client voice.** How: Your plans in Workfront Planning are linked to the images, folders and content fragments in AEM Assets that belong to them, and your assets can carry details from the plan. Gain: Your teams see each campaign with its content, and assets are easier to find and reuse because they carry the campaign they were made for.

### Workfront Planning + GenStudio for Performance Marketing (`planning-gspm`)

**Kind:** native. **Label:** A GenStudio workspace in Planning keeps campaigns, products, personas and activations in step with GenStudio in both directions.

**How:** When a company has both products, a GenStudio workspace appears in Workfront Planning. Users manage the campaigns, products, personas, activations, channels and regions GenStudio uses from Planning, changes update in real time in both directions, and Planning record types in any workspace can connect to GenStudio Brands. Source: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/planning-and-genstudio-integration/get-started-with-workfront-planning-and-genstudio-integration

**Gain:** One set of campaigns, products and personas. Your client defines campaigns, products and personas once, in more detail than GenStudio holds by default, and the content generated in GenStudio always refers to the same plan the rest of marketing uses.

**Availability:** Adobe says the GenStudio workspace is available in Workfront Planning when the company has purchased both products. Adobe: "The GenStudio for Performance Marketing workspace is available in Adobe Workfront Planning when your company has purchased both products."

**Prerequisites:**

- Workfront and GenStudio for Performance Marketing enabled in the same organization. Adobe: "Workfront and GenStudio for Performance Marketing must be enabled to the same organization."
- Users of both products in only one Workfront instance within the IMS organization. Adobe: "Users using both Workfront Planning and GenStudio for Performance Marketing must belong to only one Workfront instance within the IMS organization."
- Work done in the Production environment: changes made in Preview do not reach GenStudio. Adobe: "Only changes you make to items in the Production environment synchronize between Workfront Planning and GenStudio."
- The GenStudio System Manager role for anyone who works with Activations. Adobe: "GenSudio System Manager to access Activations"

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ30 | GenStudio workspace setup in Planning | one-time | 16 | 24 | 48 | yes |  |
| XJ31 | GenStudio records and Brands connected to Planning records | one-time | 16 | 32 | 56 | optional |  |

- **XJ30 GenStudio workspace setup in Planning.** Set permissions on the GenStudio workspace in your client's Planning, add the fields their campaigns, products and personas need, and check that a change made in either product shows in the other. Evidence: "This integration allows users in Workfront Planning to manage the Campaigns, Products, Personas, Activations, Channels, and Regions used in GenStudio." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/planning-and-genstudio-integration/get-started-with-workfront-planning-and-genstudio-integration)
- **XJ31 GenStudio records and Brands connected to Planning records.** Connect the GenStudio workspace's record types to your client's own Planning record types, and connect Planning record types to GenStudio Brands, so each plan points to the brand, products and personas its content is generated from. Evidence: "When your organization has an integration between Workfront Planning and Adobe GenStudio, you can connect Planning record types to GenStudio Brands from any record type in any workspace in Workfront Planning." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/planning-and-genstudio-integration/get-started-with-workfront-planning-and-genstudio-integration)

**Client voice.** How: Your campaigns, products and personas are managed in Workfront Planning and stay in step with GenStudio for Performance Marketing, so a change in one shows in the other. Gain: You define each campaign, product and persona once, and the content you generate always matches your plan.

### Workfront Planning + Coworker (`planning-cw`)

**Kind:** native. **Label:** Coworker searches, creates and updates Planning records from a prompt, inside Workfront.

**How:** Coworker works on Planning from a prompt, inside Workfront: it searches, creates, updates, links, duplicates and deletes records, and creates records from an uploaded document, within the user's Planning permissions. It shows the intended actions and asks for confirmation, and changes are tracked in the record's history. Source: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview

**Gain:** Planning records by asking. Your client's planners turn a brief into records, update fields in bulk and find what they need by describing it, with every change confirmed first and logged.

**Availability:** Adobe says Coworker must be enabled for the organization before users can use it, and that it is not available to organizations in health care, finance, or some other industries with sensitive data. Adobe: "Coworker must be enabled for your organization before it is available for users in your company."

**Prerequisites:**

- Coworker enabled for your client's Workfront instance by Adobe, then for the organization by the main Workfront administrator. Adobe: "Coworker must be enabled for your organization before it is available for users in your company." Statement of work condition: Adobe confirms that Coworker is enabled for the Workfront instance before this service starts.
- An organization outside health care, finance and other industries with sensitive data, which Adobe excludes from Coworker. Adobe: "Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data." Statement of work condition: Adobe confirms that Coworker is offered to the organization's industry before this service starts.
- The Coworker panel allowed in each user's access level, where it is disabled by default. Adobe: "It is selected by default."
- The read-only and write MCP tools chosen by the Workfront administrator in System Preferences. Adobe: "Your Workfront administrator must select the Read-only and Write-only MCP tools in the System Preferences area of Setup."
- A review of every proposed action, because actions are permanent and can be irreversible. Adobe: "Actions done by Coworker are permanent and could be irreversible."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XJ32 | Coworker access and tool permissions for Planning | one-time | 8 | 16 | 32 | yes |  |
| XJ33 | Coworker prompts for Planning records | one-time | 16 | 24 | 40 | yes |  |

- **XJ32 Coworker access and tool permissions for Planning.** Have your client's Workfront administrator enable Coworker, choose the read-only and write tools, allow the panel in the right access levels, and check that Coworker acts only within each user's Planning permissions. Evidence: "Your Workfront administrator must select the Read-only and Write-only MCP tools in the System Preferences area of Setup." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview)
- **XJ33 Coworker prompts for Planning records.** Write and test the prompts your client's planners use most, such as creating records from a brief, updating fields and linking records, and teach the team to review each proposed action before accepting it. Evidence: "In the Planning right rail, the Coworker panel operates in the context of the workspace, record type, or record page that you have open." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview)

**Client voice.** How: Your planners ask Coworker, inside Workfront, to find, create, update and link records in Workfront Planning. Coworker shows what it will do and waits for a yes, and every change is logged. Gain: Your team turns a brief into a plan faster and keeps records up to date with less manual entry, with a person approving each change.

## Not connections

- **express-cw.** Advice only. Coworker's prompting guide tells users to make visual changes in the email editor or Adobe Express; no page describes Coworker working in Express or Express as a Coworker connection. Adobe: "Use the email editor or Adobe Express for visual/image modifications." (https://experienceleague.adobe.com/en/docs/coworker/content/coworker-for-teams/prompting-best-practices)
- **express-commerce.** Tutorial only, and the link is AEM Assets. A Commerce as a Cloud Service use case opens a product image from AEM Assets in Express and shows the result on the storefront; there is no Commerce to Express connector. Adobe: "The combination of Adobe Commerce, AEM Assets, and Adobe Express allows you to complete this change in a few steps." (https://experienceleague.adobe.com/en/docs/commerce/cloud-service/use-cases)
- **creativecloud-gspm.** Manual hand-off. GenStudio says templates can be designed in other tools and then adapted for GenStudio; nothing passes between the apps and GenStudio. Express templates are the documented route (express-gspm). Adobe: "Once your design is complete, you can adapt it for use in GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates)
- **frameio-gspm.** Not found on Adobe's documentation. The GenStudio for Performance Marketing guides do not name Frame.io (this morning's crawl of 91 pages: 0 matches). A GenStudio integrations page on business.adobe.com is said by search summaries to mention Frame.io; that host is blocked and was not read. (https://business.adobe.com/products/genstudio-for-performance-marketing/integrations.html)
- **frameio-aemassets (direct export).** Not confirmed. Search results list a Frame.io help article on exporting Frame.io assets straight to AEM Assets, without Workfront. help.frame.io is refused by this session's network settings, so the article was not read. The frameio-aemassets connection in this file is the route through Workfront, which Adobe's Workfront guide documents. (https://help.frame.io/en/articles/15647440-export-frame-io-assets-to-adobe-experience-manager-assets)
- **planning with products other than Workfront, AEM Assets, GenStudio for Performance Marketing and Coworker.** Not documented. Adobe's connected record types page lists object types from Workfront, Experience Manager Assets and GenStudio for Performance Marketing only. This morning's crawl of the 108 Planning pages found no other product named. Adobe: "A record type and the following object types from these applications:" (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview)
- **express, frameio and creativecloud with Brand Visibility, Sites Optimizer, Edge Delivery Services, Brand Concierge, Customer Journey Analytics, Real-Time CDP and Target.** Not documented. This morning's map-level pass searched each product's documentation and found no integration page; nothing new was found in this pass.

## Left out, and why

- **Express image generation from Generate Variations in AEM Sites (the express-aemsites connection).** Adobe documents the hand-off to Express only on the standalone version of Generate Variations, and that page says the version it describes will be deprecated. The page for the version Adobe recommends, inside the AEM editors, does not mention Express. Left out so the tool does not sell a service on a feature Adobe is retiring; a question for Adam. Adobe: "as the version described on this page will be deprecated in the future." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/generate-variations/generate-variations)
- **Run brand check in Adobe Express.** Adobe labels it a beta feature. No line rests on it; EP02 and EP03 use brands and template locks, which carry no label. Adobe: "Run brand check is a beta feature in Adobe Express, now available for testing and feedback." (https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/brand-check.html)
- **Adobe Express API (reads tagged Express documents, generates variations, exports renditions).** Adobe labels it beta and gives access through a request form. It sits in the Firefly Services developer documentation, which is another helper's scope. Adobe: "The Adobe Express API is now in beta" (https://developer.adobe.com/firefly-services/docs/express-api/)
- **Frame.io Access Groups.** Adobe's product description lists the feature with a beta label. FR01 and FR02 use account roles and project permissions only. Adobe: "Access Groups (beta)" (https://helpx.adobe.com/legal/product-descriptions/frameio.html)
- **AI-powered Planning Designer in Workfront Planning.** Adobe keeps it in a Beta program for a limited number of customers. WP02 builds workspaces from scratch or from a template. Adobe: "This feature is currently available only to a limited number of customers in a Beta program." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/create-workspaces)
- **Granular requestor permissions on Planning request forms.** Marked by Adobe as available only in the Preview environment. WP05 covers the request form, its approval rules and sharing, which carry no such mark. Adobe: "The highlighted information on this page refers to functionality not yet generally available." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-requests/requests-article-index)
- **Default saved search in Content Advisor (AEM Assets inside Express).** Adobe says it is not available in Content Advisor. XJ02 covers the saved searches that are. Adobe: "The Default Saved Search feature, available in Assets view, is not available yet in Content Advisor." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express)
- **Folder sharing between Experience Manager and Creative Cloud.** Deprecated. The creativecloud-aemassets connection uses Adobe Asset Link and the Experience Manager desktop app, which Adobe recommends in its place. Adobe: "Experience Manager to Creative Cloud folder sharing is now deprecated and no longer covered below." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/aem-cc-integration-best-practices)
- **AI Reviewers in unified review and approval.** Documented by Adobe as part of unified review and approval, but not costed here: it checks assets against brand guidelines, which belongs with the Brand Intelligence research by the other wave 2 helper, and its licensing was not established in this pass. Adobe: "Utilize AI Reviewers to automate brand compliance reviews" (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-approvals-overview)
- **Frame.io free and teams plans, Camera to Cloud and the mobile apps.** Not partner services. The lines assume Frame.io Enterprise; the free plan that comes with Creative Cloud appears only as a limit in the frameio-creativecloud prerequisites. Adobe: "Admins can add more collaboration and security features, users, and storage by upgrading to a paid plan in the Frame.io app" (https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/frame-io-cc-business.html)
- **Frame.io legacy (V3) accounts.** The current API and Admin Console user management need a V4 account. Work on a legacy account, or its migration, is run by Adobe's Frame.io account team and is a prerequisite, not a partner line. Adobe: "If your account is on legacy version of Frame.io, please refer to our legacy developer documentation" (https://developer.adobe.com/frameio)
- **Content Scheduler plan limits for the enterprise plan.** EP06 sets up social publishing, but Adobe's scheduler page states its post and account limits for the Free and Premium plans only, so the tool states no number for Enterprise. Adobe: "To connect additional accounts, consider upgrading to a Premium plan, which lets you connect up to 3 accounts per social channel." (https://helpx.adobe.com/express/web/publish-and-share/schedule-manage-posts/content-scheduler-overview.html)

## Documented, but not costed

- **Workfront Fusion modules for Adobe Express and for Workfront Planning.** Adobe documents both connectors. Only the Frame.io modules have a service here (XJ16); the others are tools a partner would use inside a custom automation, not a service of their own.
- **Planning REST API and event subscriptions.** Part of every Planning package, with a limit per license. WP06 covers reporting; custom integrations on the API are left to the partner's own service.
- **Workfront Proof route for Express approvals.** XJ04 and XJ05 cover it. Where Workfront uses unified review and approval, the same work is XJ06 and the review happens in the Frame.io viewer: a statement of work needs one or the other, not both.
- **Connecting AEM Assets to a Creative Cloud entitlement in another IMS organization.** Adobe's AEM Assets overview names it ("Experience Manager Assets connects to a Creative Cloud entitlement provisioned in a different Identity Management System (IMS) organization."). It is a prerequisite check inside XJ01 and XJ20, not a line.

## What a partner would get wrong

1. **Frame.io review in Workfront needs no Frame.io license.** "No additional Frame.io license is required to use the Frame.io viewer for reviews and approvals." A partner who sells Frame.io Enterprise just to get review inside Workfront oversells. Frame.io Enterprise is for teams that upload and work inside Frame.io itself.
2. **Turning on unified review and approval takes Workfront Proof away.** "Workfront Proofing functionality is not available with this integration." Existing customers keep Proof only for projects created before the change. This is a decision for the client before XJ13 starts.
3. **Video review through Workfront is capped without Frame.io Enterprise.** "There is an annual cap for video proof requests set at 10% of an organization's total paid Workfront user licenses". A video-heavy team hits it quickly.
4. **Permissions for linked projects are set in Workfront, not Frame.io.** "This means you cannot invite a user to a project in Frame.io or modify user permissions in Frame.io."
5. **On Adobe's pages, Frame.io reaches AEM Assets through Workfront.** The integration is configured in Workfront Setup, needs Adobe cloud storage, and its repository cannot be changed later: "Due to the complexity of the integration, you can't change the repository after you save the initial configuration." The work overlaps the existing AEM Assets + Workfront connection in the catalog (flagged below).
6. **Express in Journey Optimizer sends data out of Journey Optimizer.** "By using the Adobe Express integration, data will leave Journey Optimizer. Do not use this integration with PHI or other health data." A health care client should not get XJ07.
7. **The Express editor inside Marketo Engage and Journey Optimizer B2B Edition is only the quick actions unless each user holds an Express Enterprise license in the same IMS organization.** "Users without a license can only access the quick actions in Adobe Express." And an edit to an image already in use changes every email that uses it.
8. **Express members cannot create templates or publish to social media by default.** "Users with this capability can create and edit custom templates (regular members of the organization cannot)." EP01 has to come before EP03 and EP06.
9. **Express templates in GenStudio work for four template types only** (Meta, Display, LinkedIn, TikTok), and only when shared in the same IMS organization. Email templates still come the HTML route or from Journey Optimizer and Marketo Engage.
10. **Asset Link comes in two forms.** The UXP plugin is for Photoshop 26.11 or newer; Illustrator and InDesign still use the CEP extension, and so does Photoshop against AEM 6.x: "Continue using the Asset Link CEP version when working with non-Cloud Service Adobe Experience Manager deployments." It also needs Named User Licensing with storage and services enabled, which some locked-down enterprises have switched off.
11. **The Projects panel shows only Workfront projects on Adobe cloud storage.** "Legacy Workfront storage projects are not supported in the Projects panel." The older Workfront plugin works without it; XJ23 and XJ24 are separate for that reason.
12. **Frame.io is off by default for Creative Cloud for enterprise**, and what editors get without a paid plan is a free plan with 100GB and five projects.
13. **Workfront Planning standalone has no Workflow features.** "This gives users no access to any Workfront Workflow features and access to Planning features." The Planning + Workfront connection needs both packages.
14. **Planning fields do not show on Workfront objects.** "Planning records fields are not accessible from Workfront objects." The link shows in a Planning section; lookups run from Workfront into Planning, not the other way.
15. **In the GenStudio workspace the connection runs one way.** "You cannot connect a Planning record type to a record type from the GenStudio workspace." A GenStudio record type connects to a Planning record type, and Planning record types connect to GenStudio Brands. And only Production changes sync: "Only changes you make to items in the Production environment synchronize between Workfront Planning and GenStudio."
16. **Coworker in Planning can delete things for good.** "Actions done by Coworker are permanent and could be irreversible." Write access is a setting the Workfront administrator chooses; read-only is the default.

## Overlaps with lines already in the catalog (flagged, not changed)

- **frameio-aemassets (XJ17, XJ18) and the existing `aemassets-workfront` connection.** Both configure the Workfront and AEM Assets integration and its metadata mapping. If both are on one canvas the overlap review should catch it; the Frame.io card should probably count only where Workfront's own AEM Assets lines are not already in scope.
- **planning-aemassets XJ29 and `aemassets-workfront`.** XJ29 depends on the same metadata mapping.
- **frameio-workfront (XJ13, XJ14) and Workfront's own proofing and approval lines.** Unified review and approval replaces Workfront Proof, so a statement of work should carry one approach.
- **express-workfront (XJ04, XJ05) and express-frameio (XJ06).** The same template approval, on Workfront Proof or on unified review and approval.
- **express-gspm and the existing GenStudio template line GS03.** GS03 builds channel templates; XJ10 builds them in Express.

## Open questions for Adam

1. **Unified review and approval (Frame.io + Workfront): keep it, with a condition?** Adobe's overview treats it as the standard way to review in Workfront, but one page says the new approval functionality "is only available for specific accounts" and Adobe's account representative has to check the contract. *Recommendation: keep the connection, with the statement of work line "Adobe confirms that the Workfront contract supports unified review and approval before this service starts". It is the heart of the Frame.io story.*
2. **Express images inside AEM Sites' Generate Variations: leave out?** Adobe documents it only on the version of Generate Variations it says will be deprecated. *Recommendation: leave it out. Express then has no line to AEM Sites; its tie to the site is through AEM Assets.*
3. **Frame.io + AEM Assets: show it as "through Workfront" for now?** That is the only route on Adobe's pages. Frame.io's own help site lists a direct export to AEM Assets, and that site cannot be read from here. *Recommendation: show the card with Workfront as a stated prerequisite, and have someone on an open network read the Frame.io article (and the Frame.io how-to pages behind FR02 to FR05) before these are built.*
4. **Creative Cloud's own services are IT work (Admin Console, packages, sharing policy). Keep them?** *Recommendation: keep them, with CC01 to CC04 and CC06 as the starting scope, because every Creative Cloud connection depends on packages and profiles being right. Custom fonts and monthly administration stay optional.*
5. **Express + Frame.io: its own card, or fold into Express + Workfront?** It is the same approval, reviewed in the Frame.io viewer, and it runs through Workfront. *Recommendation: keep one small card (one service, 24 hours) so the Frame.io viewer shows up for Express users, with Workfront named as a prerequisite.*

## Before merging into the canvas

- Connection ids put the new product first (`express-aemassets`); `catalog_map.json` will need the four product ids placed.
- `ext` is used once (XJ16, Workfront Fusion) and `tier` once (FR04, Frame.io Enterprise: Prime).
- Two connections carry `sow_prereq`: `frameio-workfront` (one) and `planning-cw` (two).
- The connection kinds are all `native`; none of these is a shared Experience Platform path. The Workfront plugin for Creative Cloud installs from the Adobe Marketplace, so `creativecloud-workfront` could be shown as `extension` if the canvas wants to mark installed plugins.
- Adobe's quotes in `prereq_sources` and `left_out` keep Adobe's own words, including labels such as beta; the card fields do not.


## Pages downloaded and checked

- https://developer.adobe.com/firefly-services/docs/express-api/
- https://developer.adobe.com/frameio
- https://experienceleague.adobe.com/en/docs/commerce/cloud-service/use-cases
- https://experienceleague.adobe.com/en/docs/coworker/content/coworker-for-teams/prompting-best-practices
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/generate-variations/generate-variations
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-adobe-express/native-integration-adobe-express
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/aem-cc-integration-best-practices
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates
- https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/internal-dam/image-edit-adobe-express
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/express
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/edit-images-adobe-express
- https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/frame-io-modules-new
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-integrations/workfront-for-creative-cloud/install-wf-cc/wf-install-cc
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-access/access-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/create-record-types
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/create-workspaces
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/configure-automations-to-create-records
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-reporting/reporting-in-planning-article-index
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-requests/requests-article-index
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-views/manage-record-views
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/planning-and-genstudio-integration/get-started-with-workfront-planning-and-genstudio-integration
- https://experienceleague.adobe.com/en/docs/workfront/using/documents/adobe-creative-cloud-projects/adobe-creative-cloud-projects-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-approvals-overview
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-reviews-and-approvals/manage-asset-review-and-approval/create-approval-template
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/get-started-with-unified-approvals
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/express-wf-frame
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/use-aem-with-frame
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-express
- https://helpx.adobe.com/business/enterprise/deploy-apps-updates/create-packages/create-managed-packages.html
- https://helpx.adobe.com/business/enterprise/deploy-apps-updates/customize-end-user-experience/including-plugins-package.html
- https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/adobe-asset-link-overview.html
- https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/configure-aem-assets-for-asset-link.html
- https://helpx.adobe.com/business/enterprise/manage-services/adobe-asset-link/deploy-adobe-asset-link-panel.html
- https://helpx.adobe.com/business/enterprise/manage-services/configure-services/enable-disable-services.html
- https://helpx.adobe.com/business/enterprise/manage-services/custom-fonts/upload-manage-custom-fonts.html
- https://helpx.adobe.com/business/enterprise/manage-storage-assets/manage-storage/libraries-in-business-storage.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/automate-frameio-setup.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/frame-io-cc-business.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/manage-account-roles.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/migrate-frameio-user-management.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/manage-product-profiles/product-profiles.html
- https://helpx.adobe.com/business/enterprise/settings/asset-settings/asset-settings-overview.html
- https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/brand-check.html
- https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/create-brand.html
- https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/custom-templates-analytics.html
- https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/template-control-overview.html
- https://helpx.adobe.com/express/web/brands-libraries-projects/create-manage-brands/template-control.html
- https://helpx.adobe.com/express/web/bring-in-assets-from-other-apps/import-files-from-other-apps/save-adobe-express-projects-in-aem-assets.html
- https://helpx.adobe.com/express/web/bring-in-assets-from-other-apps/use-creative-cloud-assets/photoshop-illustrator-linked-images.html
- https://helpx.adobe.com/express/web/bring-in-assets-from-other-apps/use-creative-cloud-assets/photoshop-illustrator-overview.html
- https://helpx.adobe.com/express/web/bulk-create-and-automate/bulk-create.html
- https://helpx.adobe.com/express/web/create-with-templates/org-custom-templates.html
- https://helpx.adobe.com/express/web/invite-collaborate/set-template-approval.html
- https://helpx.adobe.com/express/web/publish-and-share/schedule-manage-posts/content-scheduler-overview.html
- https://helpx.adobe.com/express/web/roles-and-permissions/roles-and-permissions.html
- https://helpx.adobe.com/legal/product-descriptions/adobe-workfront.html
- https://helpx.adobe.com/legal/product-descriptions/creative-cloud.html
- https://helpx.adobe.com/legal/product-descriptions/frameio.html

Also read, not quoted: the Express help pages on sharing brands, published links, template style restrictions and the Express help hub navigation; the Workfront Planning article index and its request form page; the Workfront Fusion Frame.io modules page; the Generate Variations page for the AEM editors; the AEM desktop app install page; the enterprise admin guide pages on optional services.

## Pages not read

- https://help.frame.io: Frame.io's own help center. Refused by this session's network settings; not attempted again in this pass. No Frame.io how-to article was read, so FR02 to FR05 are scoped from Adobe's product description and admin pages.
- https://help.frame.io/en/articles/12242607-adobe-workfront-integration-overview: Same host. Adobe's Workfront guide links to it for how Workfront-linked projects behave inside Frame.io (XJ15).
- https://help.frame.io/en/articles/15647440-export-frame-io-assets-to-adobe-experience-manager-assets: Same host. Known only from search results; would describe a direct export from Frame.io to AEM Assets without Workfront.
- https://help.frame.io (Supported File Types on Frame.io; Commenting on your media; Workspace Overview: Projects; Getting Started with Frame.io): Same host. Linked from Adobe's unified review and approval pages for file types, viewer use and projects.
- https://business.adobe.com/products/express-business/integrations.html: Blocked host. Not attempted. Lists Express integrations.
- https://business.adobe.com/products/genstudio-for-performance-marketing/integrations.html: Blocked host. Not attempted. Search summaries say it mentions Frame.io.
- https://www.adobe.com/express/business: Blocked host. A helpx address guessed for an Express enterprise page redirected here; the response was discarded unread and nothing from it is used.
- https://helpx.adobe.com/legal/product-descriptions/adobe-express.html: Returned 404: no Adobe Express product description was found at this address, so plan contents rest on the Express help pages.
