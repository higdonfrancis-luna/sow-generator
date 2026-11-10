# Wave 2, the Firefly family: service-level research trail (Nov 10 2026)

Products: Firefly Creative Production for Enterprise (`fireflycp`, which includes the Firefly Services APIs), Firefly Custom Models (`fireflycm`) and Adobe Brand Intelligence (`brandintel`). Data: `firefly_family.json` in this folder. Research only: nothing in the tool changed, nothing was built or committed.

## Lifecycle questions for Adam (read these first)

### 1. `fireflycm`

Custom Models is in beta for individual and teams plans; enterprise access is on select plans, added through the account manager, and Adobe puts no beta label on the enterprise offering.

Adobe's words:

- "Custom Models is currently in beta for individual and teams users in Adobe Firefly." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)
- "Firefly Custom Models are available for Creative Cloud for individuals, Creative Cloud Pro for teams, Creative Cloud Pro Plus for teams subscribers, organizations that use" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)
- "If you have a Creative Cloud for enterprise plan, contact your Adobe Account Manager to add custom models to your plan." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)

Recommendation: Include the product, written for enterprise plans only, with the plan as its first prerequisite. Leave it out only if Adam reads the beta sentence as covering the whole product.

### 2. `brandintel`

Not under a beta or limited label, but it cannot be used without Adobe Forward-Deployed Engineering, which leads the loading and structuring of the brand data, and the web app is a reference implementation.

Adobe's words:

- "At least one Adobe Brand Intelligence Brand, At least one Adobe Brand Intelligence Skills Add-On, Operations (either through the Firefly Creative Production for Enterprise offering or the Shared Credits offering), and Adobe Forward-Deployed Engineering resources." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- "The ingestion and structuring of this training data is led by Adobe Forward-Deployed Engineers, who work directly with customer teams" (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- "While fully functional, the app is designed primarily as a reference implementation" (https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/validate-brand-compliance.html)

Recommendation: Include it, with partner lines that sit around Adobe's engineers (sources, API integration, review loop, training, upkeep) and the Adobe engineering requirement as the first prerequisite. Adam's rule about Adobe Consulting Services may apply here: if a product that needs Adobe's own engineers should not be in a partner tool, leave it out.

### 3. `fireflycp`

The product itself carries no beta label. Two things around it do: the November 2026 release notes introduce Firefly Graph (beta) as the node-based workspace, and the capsule pages updated today describe building from "a graph", while the Creative Production pages still describe Workflow Builder. Adobe does not say whether Graph replaces Workflow Builder.

Adobe's words:

- "Build and scale creative workflows with Firefly Graph (beta)" (https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html)
- "Capsules is a beta feature in Adobe Firefly now available for testing and feedback." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/interface-overview.html)
- "Use Create workflows in Creative Production to design consistent, reusable production pipelines" (https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html)

Recommendation: Include the product on the Workflow Builder pages as written, with no mention of Graph or capsules, and recheck these pages before it is built.

## Summary

| Product | Services | Starting services (one-time base hours) | Monthly | Connections written |
|---|---|---|---|---|
| Firefly Creative Production for Enterprise (`fireflycp`) | 9 | 5 (216 h) | FP09 (starting) | aemassets-fireflycp, workfront-fireflycp, fireflycp-frameio, creativecloud-fireflycp, fireflycp-fireflycm |
| Adobe Firefly Custom Models (`fireflycm`) | 7 | 5 (120 h) | FM07 (optional) | fireflycp-fireflycm, express-fireflycm, creativecloud-fireflycm, ajo-fireflycm |
| Adobe Brand Intelligence (`brandintel`) | 8 | 4 (184 h) | BN08 (starting) | workfront-brandintel |

### Firefly Creative Production for Enterprise (`fireflycp`)

Adobe's enterprise offering for producing content variants in volume: teams build workflows on a visual canvas, publish them, and run them over batches of images, video and InDesign or Photoshop templates, in the Firefly app or through the Firefly Services APIs. Source: https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/creative-production-overview.html

| Id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| FP01 | Creative Production access, roles and API credentials | one-time | 16 | 24 | 40 | yes |  |
| FP02 | Bulk presets: remove background, crop and color grade | one-time | 16 | 32 | 56 | yes |  |
| FP03 | Production workflows from Adobe's templates | one-time | 24 | 48 | 96 | yes |  |
| FP04 | Custom production workflows in Workflow Builder | one-time | 40 | 80 | 160 | optional |  |
| FP05 | Published workflows run from your client's systems | one-time | 40 | 80 | 160 | yes |  |
| FP06 | Firefly Services API automation | one-time | 40 | 80 | 160 | optional |  |
| FP07 | Run-Workflow MCP for AI agents | one-time | 8 | 16 | 32 | optional |  |
| FP08 | Governance, training and handover | one-time | 16 | 32 | 56 | yes |  |
| FP09 | Monthly workflow operations and tuning | monthly | 12 | 24 | 40 | yes |  |

Prerequisites:

- A Firefly Creative Production for Enterprise or Firefly Services entitlement, which Adobe sells on select enterprise plans. Adobe: "Firefly Creative Production is available to organizations with select enterprise plans." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/creative-production-overview.html)
- Users assigned to the product in the Admin Console by an administrator. Adobe: "Your admin assigns access through the correct product entitlement in Admin Console." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/adobe-firefly-creative-production-for-enterprise-faq.html)
- Operations in the contract: usage is measured in Operations by workflow type and by the number of assets or seconds of video. Adobe: "Your total cost depends on the workflow type, the number of assets or video seconds generated, and your contracted operations rate." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/creative-production-overview.html)
- For API use: an Adobe Developer Console project with OAuth Server-to-Server credentials, arranged with your client's Adobe representative. Adobe: "This tutorial assumes you have worked with your Adobe representative and have the following:" (https://developer.adobe.com/firefly-services/docs/workflow-builder-api/getting-started/)
- A desktop browser and English for the bulk actions. Adobe: "The only language currently supported is English." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/bulk-actions-overview.html)

Packages and add-ons:

- **Firefly Services entitlement**: Includes Firefly Creative Production. For these customers there is no separate product card: the administrator assigns Firefly Services to give access. Adobe: "Firefly Creative Production is included with Firefly Services and is also available as a standalone product." (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-creative-production.html)
- **Plans with premium generative AI features**: Creative Cloud and Firefly plans with premium generative AI features get the preset bulk workflows only (Remove background, Crop, Color grade), charged in generative credits. Workflow Builder, publishing and the APIs need the enterprise offering. Adobe: "Any plan that has access to premium generative AI features will get access to Firefly Creative Production." (https://helpx.adobe.com/firefly/web/perform-bulk-actions/creative-production-in-creative-cloud-faq.html)
- **Forward-deployed engineering (eligible plans)**: Adobe's own engineers, on eligible plans, help customize workflows and connect systems. Agree who does what before scoping FP04 to FP06. Adobe: "Access, on eligible plans, to forward-deployed engineering support to help customize workflows, connect systems, and support deployment." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/creative-production-overview.html)
- **Partner models**: Third-party image and video models offered inside Creative Production. Which ones your client can use depends on the organization, region and what Adobe has enabled. Adobe: "Availability may vary by organization, region, and access configuration; some models require additional enablement." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/partner-models-in-firefly-creative-production-for-enterprise.html)

### Adobe Firefly Custom Models (`fireflycm`)

Private Firefly image models that your client trains on its own images, so generated images keep a brand's subject or style in Firefly and other supported Adobe apps. Source: https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html

| Id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| FM01 | Custom Models access, trainers and projects | one-time | 8 | 16 | 32 | yes |  |
| FM02 | Training image sets and captions | one-time | 24 | 40 | 80 | yes |  |
| FM03 | Model training, testing and publishing | one-time | 16 | 32 | 64 | yes |  |
| FM04 | Prompt guide for each model | one-time | 8 | 16 | 32 | yes |  |
| FM05 | Sharing, permissions and model governance | one-time | 8 | 16 | 24 | yes |  |
| FM06 | Retraining on a newer Firefly image model | one-time | 8 | 16 | 32 | optional |  |
| FM07 | Monthly model upkeep | monthly | 8 | 12 | 24 | optional |  |

Prerequisites:

- A Creative Cloud for enterprise plan that includes Firefly custom models (Adobe names Edition 5, Edition 4 and Edition 4 with Premium Stock), added through your client's Adobe account manager. Adobe: "It's also only available on the Creative Cloud for enterprise Edition 5, Edition 4 (formerly Pro Firefly), and Edition 4 with Premium Stock (formerly Pro Plus) plans." (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-custom-models.html)
- Adobe storage for business on the organization. Adobe: "Firefly custom models are available to organizations that use Adobe storage for business" (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-custom-models.html)
- A product administrator for Firefly Custom Models, and each trainer given both the Trainer profile and a product that includes Firefly. Adobe: "To entitle a user as a trainer, a system administrator must assign them the trainer product profile in Firefly custom models and a product that entitles the user to Adobe Firefly." (https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-custom-models.html)
- 10 to 30 representative images in JPG or PNG for each model. Adobe: "representative images (JPG or PNG format)" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html)
- Your client's rights to every training image: Firefly asks the trainer to agree to this before training starts. Adobe: "This helps you grant necessary permissions to Firefly and confirm that you have the rights to use the uploaded images." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html)

Packages and add-ons:

- **Enterprise custom models**: Retraining on a newer Firefly image model, project-level access, starting a model from scratch and editing a draft model are for enterprise customers only. Adobe: "This feature is only available for enterprise customers." (https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/retrain-custom-models.html)
- **Limits Adobe may set**: Adobe may limit the number of users, the number and size of training runs, and concurrent generation requests. Adobe: "Adobe reserves the right to set limits on the number of concurrent generation requests with Custom Models." (https://helpx.adobe.com/legal/product-descriptions/custom-model.html)

### Adobe Brand Intelligence (`brandintel`)

A service with no app of its own, reached through APIs, that learns your client's brand rules from guidelines, approved assets and review decisions, then checks creative work against them (Validate), assembles on-brand variants from a brief (Instruct to Assemble) and tests creative on a synthetic audience (Simulate). Source: https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/adobe-brand-intelligence-overview.html

| Id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| BN01 | Brand sources gathered for Adobe's onboarding | one-time | 24 | 48 | 96 | yes |  |
| BN02 | Validate checks built into your client's tools | one-time | 40 | 80 | 160 | yes | Validate add-on |
| BN03 | Reviewer feedback loop | one-time | 16 | 32 | 56 | optional | Validate add-on |
| BN04 | Validation pilot on live campaigns | one-time | 16 | 32 | 64 | yes | Validate add-on |
| BN05 | Simulate in your client's chat assistant | one-time | 16 | 24 | 48 | optional | Simulate add-on |
| BN06 | Figma templates for assembled variants | one-time | 24 | 40 | 80 | optional | Instruct to Assemble add-on, Also needs Figma |
| BN07 | Reviewer training and rollout | one-time | 16 | 24 | 40 | yes | Validate add-on |
| BN08 | Monthly brand rule review | monthly | 8 | 16 | 32 | yes |  |

Prerequisites:

- All four required components licensed: at least one Brand, at least one Skills add-on, Operations, and Adobe Forward-Deployed Engineering resources. Adobe: "For Adobe Brand Intelligence to function and be usable, Customer must license all of the following (collectively, the "Required Components")." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- Operations licensed through Firefly Creative Production for Enterprise or the Shared Credits offering. Adobe: "Operations are licensed through Firefly Creative Production for Enterprise offering or the Shared Credits offering." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- Your client's brand profile configured by Adobe during onboarding, before any API call. Adobe: "Before making API calls, your organization's brand profile must be configured as part of your Adobe Brand Intelligence onboarding." (https://developer.adobe.com/adobe-brand-intelligence/validate/authentication/)
- An Admin Console administrator to give developers access to a product profile, for API credentials. Adobe: "An Admin Console administrator who can add you as a developer on a product profile." (https://developer.adobe.com/adobe-brand-intelligence/validate/authentication/)
- Brand guidelines, design systems, approved assets, briefs and past review feedback ready for Adobe's engineers to load. Adobe: "The ingestion and structuring of this training data is led by Adobe Forward-Deployed Engineers, who work directly with customer teams" (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)

Packages and add-ons:

- **Brand (for each brand, each year)**: One license covers one brand: one primary logo and its permitted variants. Each further brand needs its own license. Adobe: "Each Adobe Brand Intelligence Brand licensed by Customer enables Customer to use one Brand with Adobe Brand Intelligence." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- **Skills add-ons: Validate, Instruct to Assemble, Simulate (for each tenant, each year)**: Each skill is available only when its add-on is licensed. BN02 to BN04 need Validate, BN05 needs Simulate, BN06 needs Instruct to Assemble. Adobe: "For a particular Adobe Brand Intelligence Skill to be available to Customer, Customer must license the applicable Adobe Brand Intelligence Add-On for that Skill." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- **Operations**: Every use of a skill consumes Operations at the rate card set in the sales order. Adobe: "Use of Skills consumes Operations as set forth in the Rate Card." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html)
- **Adobe Forward-Deployed Engineering**: A required component. Adobe engineers lead the loading and structuring of brand data and configure the validation options. Adobe: "Other options will be populated according to your organization's requirements and standards by your dedicated Forward Deployed Engineering team in the Brand Control Center." (https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/validate-brand-compliance.html)

### Connections

| Connection | Kind | Label | Services (low / base / high hours) |
|---|---|---|---|
| `aemassets-fireflycp` | native | Creative Production workflows read source files from AEM Assets and write finished files back | XK01 AEM Assets as source and destination for production workflows (16 / 32 / 56, starting); XK02 Folder, naming and metadata rules for generated assets (16 / 24 / 48, optional) |
| `workfront-fireflycp` | extension | Workfront Fusion modules call Firefly and Photoshop APIs inside a scenario | XK03 Workfront Fusion scenarios with Firefly image generation (24 / 40 / 80, starting, also needs Workfront Fusion); XK04 Photoshop automation in Fusion scenarios (16 / 32 / 64, optional, also needs Workfront Fusion) |
| `fireflycp-frameio` | native | Creative Production workflows take files from Frame.io and send finished files back for review | XK05 Frame.io as source and review destination for production workflows (16 / 24 / 48, starting) |
| `creativecloud-fireflycp` | native | InDesign and Photoshop templates become repeatable merge steps in Creative Production workflows | XK06 InDesign templates for data merge workflows (24 / 40 / 80, starting); XK07 Photoshop templates for data merge workflows (24 / 40 / 80, starting) |
| `fireflycp-fireflycm` | native | Firefly API image generation uses a trained custom model by its ID | XK08 Custom models in Firefly API image generation (16 / 32 / 56, starting) |
| `express-fireflycm` | native | Published custom models generate images in Adobe Express for the people they are shared with | XK09 Custom models for Adobe Express creators (8 / 16 / 24, starting) |
| `creativecloud-fireflycm` | native | Published custom models generate in Creative Cloud apps for the people they are shared with | XK10 Custom models for designers in Creative Cloud apps (8 / 16 / 32, starting) |
| `ajo-fireflycm` | native | A custom Firefly model is added to Journey Optimizer by its model ID and chosen when generating images | XK11 Custom Firefly models in Journey Optimizer image generation (8 / 16 / 32, starting) |
| `workfront-brandintel` | native | A Workfront AI Reviewer checks assets in review against Adobe Brand Intelligence | XK12 Workfront AI Reviewer on Brand Intelligence (16 / 24 / 48, starting); XK13 AI Reviewer in approval templates and team rollout (8 / 16 / 32, starting) |

#### `aemassets-fireflycp`

Creative Production reads source files from AEM Assets and writes finished files back: input and output nodes in Workflow Builder, and Connect to storage in the bulk actions, can use AEM as a cloud source or destination once the organization has it configured. Source: https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html

Availability: Adobe says the AEM integration requires AEM as a Cloud Service, version 2024.10.18175 or later, and supports the Author tier only, not the Delivery tier.

Needs:

- AEM Assets as a Cloud Service, version 2024.10.18175 or later; the Author tier only. Adobe: "AEM integration requires AEM as a Cloud Service, version 2024.10.18175 or later, and will only support Author Tier, not Delivery Tier." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/bulk-actions-overview.html)
- The AEM source showing in Creative Production for your client's organization: Adobe says sources depend on the workspace, and publishes no setup steps, so ask Adobe to verify it. Adobe: "Permissions and entitlements still apply; if a source does not appear, verify connectivity and catalog availability for your workspace." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html)
- Users who hold both a Creative Production entitlement and access to the AEM folders a workflow reads and writes. Adobe: "You can add these assets from your local drive (upload one file or many) or from cloud-connected locations your organization has configured." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html)

In the statement of work this reads: "Adobe confirms the AEM Assets source is available in your Firefly Creative Production organization before this service starts"

#### `workfront-fireflycp`

Workfront Fusion has Adobe Firefly modules (generate, expand and fill an image, composites, generate video, and a custom API call) and Adobe Photoshop modules that call the Firefly Services APIs inside a scenario, so a Workfront task or request can start creative automation and receive the result. Source: https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-firefly-modules

Availability: Not stated by Adobe.

Needs:

- Workfront Fusion: included with Workfront Ultimate, an extra purchase with Prime and Select. Adobe: "If your organization has a Select or Prime Workfront package that does not include Workfront Automation and Integration, your organization must purchase Adobe Workfront Fusion." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-firefly-modules)
- An active Adobe Firefly account, and a Client ID and Client Secret from the Adobe Developer Console for the connection. Adobe: "You must have an active Adobe Firefly account." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-firefly-modules)
- A Firefly Services license for the Photoshop modules. Adobe: "You must have a Firefly Services license." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-photoshop-modules)
- Current module versions only: Adobe has retired older Firefly and Photoshop modules, so existing scenarios may need updating first. Adobe: "We recommend updating any scenarios that use these modules to the updated modules as soon as possible." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-photoshop-modules)

#### `fireflycp-frameio`

Creative Production can use Frame.io as a cloud source and destination: input and output nodes pull files from and send files to Frame.io where the organization has it available, the 3D workflows take a USDZ file from Frame.io, and the Substance 3D API accepts a Frame.io folder as a source. Source: https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html

Availability: Adobe says Frame.io can be used as a cloud source where it is available in the organization's environment.

Needs:

- A Frame.io account your client's Creative Production users can sign in to. Adobe: "Access to Frame.io or AEM for 3D asset storage (optional)" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-3d-digital-twin-workflows.html)
- The Frame.io source showing in Creative Production for your client's organization: Adobe says it depends on the environment, and publishes no setup steps, so ask Adobe to verify it. Adobe: "Permissions and entitlements still apply; if a source does not appear, verify connectivity and catalog availability for your workspace." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html)

In the statement of work this reads: "Adobe confirms the Frame.io source is available in your Firefly Creative Production organization before this service starts"

#### `creativecloud-fireflycp`

Designers prepare InDesign templates with Data Merge fields and Photoshop templates with double-brace tags in the desktop apps; uploaded to the Merge InDesign data and Merge Photoshop data nodes, the fields and tags become inputs a workflow fills with text, images and data on every run. Source: https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-template-and-data-merge-nodes.html

Availability: Not stated by Adobe.

Needs:

- InDesign and Photoshop for the designers who author the templates. Adobe: "To use these nodes effectively, author the template in the correct application first:" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-template-and-data-merge-nodes.html)
- A data source (CSV or delimited text) with one column for each field. Adobe: "InDesign Data Merge is driven by a data source file (commonly .csv)." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/merge-indesign-data.html)
- Linked images and fonts saved or packaged with the template so the node can validate it. Adobe: "Save or package the file with linked assets and fonts, as required, then upload the primary template file" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-template-and-data-merge-nodes.html)

#### `fireflycp-fireflycm`

The Firefly API, part of Firefly Services, generates images with a trained custom model: the model is shared with the API project's technical account, listed through the API, and its ID is passed in the Generate Image call. Source: https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-share-model/

Availability: Not stated by Adobe.

Needs:

- A trained custom model, shared with the technical account of the Developer Console project. Adobe: "Use this guide to give applications access to your custom models, making them available for use with API endpoints." (https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-share-model/)
- Firefly Services credentials (Client ID and Client Secret) from an Adobe Developer Console project. Adobe: "Retrieve a Firefly Services Client ID and Client Secret from your" (https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-generate-image/)
- Prompts written without negative prompting for models trained on Image Model 3 or Image Model 4. Adobe: "Negative prompting is not supported for Firefly Custom Models on Image Model 3 or Firefly Custom Models on Image Model 4." (https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-generate-image/)

#### `express-fireflycm`

A published custom model can be used to generate images in Adobe Express by people it has been shared with; the model owner gives them the Generator or Editor permission in Firefly. Source: https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html

Availability: Not stated by Adobe.

Needs:

- A trained model that has been published: on enterprise plans a model may need publishing before other users and apps see it. Adobe: "you may need to publish the trained model before it becomes available to other users or apps" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html)
- The model shared with each person or group with at least the Generator permission. Adobe: "Can generate with your published model in Creative Cloud apps but cannot edit or review." (https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/share-custom-models.html)
- Adobe Express for the people who will generate. Adobe: "Custom models can be used to generate content in supported Adobe apps, including Photoshop, Illustrator, Adobe Express, Firefly, and GenStudio." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)

#### `creativecloud-fireflycm`

A published custom model can be used to generate in Creative Cloud apps by the people it is shared with. Adobe names Illustrator and Photoshop among the supported apps; the model owner sets who can edit, review or only generate. Source: https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/share-custom-models.html

Availability: Not stated by Adobe.

Needs:

- A trained model that has been published: on enterprise plans a model may need publishing before other users and apps see it. Adobe: "you may need to publish the trained model before it becomes available to other users or apps" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html)
- The model shared with each designer or group as Editor or Generator. Adobe: "Can help you edit or review your model and can generate with your published model in Creative Cloud apps." (https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/share-custom-models.html)
- Illustrator as the app in scope: Adobe's wording for Photoshop ties custom models to an update that is not in the standard release, so it is left out here. Adobe: "Custom models can be used to generate content in supported Adobe apps, including Photoshop, Illustrator, Adobe Express, Firefly, and GenStudio." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)

#### `ajo-fireflycm`

In Journey Optimizer, a custom Firefly model is added as a generative model under Brands with its model ID from Firefly; after a connection test it can be chosen when generating images for content. Source: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/brands/generative-models

Availability: Adobe says creating custom Firefly models requires a Firefly ETLA agreement.

Needs:

- A Firefly enterprise agreement that covers custom models, and a trained model in Firefly. Adobe: "Creating custom Firefly models requires a Firefly ETLA agreement." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/brands/generative-models)
- The Generate Content permission for the Journey Optimizer users who will generate images. Adobe: "To access Generate Content in Adobe Journey Optimizer, users need to be granted the Generate Content permission" (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/gs-generative)
- Your client's acceptance of the user agreement for Generate Content in Journey Optimizer. Adobe: "You must agree to a user agreement before you can use Generate Content in Adobe Journey Optimizer." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/gs-generative)

#### `workfront-brandintel`

A Workfront AI Reviewer, an AI Collaborator assigned as a reviewer on assets, can be set to use Adobe Brand Intelligence instead of a brand created in Workfront. It needs Workfront's unified review and approval experience, where reviewers work in the Frame.io viewer and see the AI Reviewer's comments there. Source: https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators

Availability: Adobe's AI Reviewer page says the AI Reviewer is not available in Sandbox environments. Adobe states no separate availability for the Brand Intelligence option.

Needs:

- Adobe Brand Intelligence licensed and onboarded, with the Validate add-on. Adobe: "AI Reviewers can be configured to use Workfront brands, or Adobe Brand Intelligence." (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)
- Workfront's unified review and approval experience, which runs on Adobe cloud storage and the Frame.io viewer. Adobe: "To use Adobe Brand Intelligence for an AI Reviewer, your organization must use the unified review and approval experience in Workfront." (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)
- A Workfront Select, Prime or Ultimate package, and a system or group administrator to configure AI Collaborators. Adobe: "Select, Prime, or Ultimate" (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)
- A signed Adobe Gen AI agreement on file. Adobe: "Your organization must have a signed Adobe Gen AI Agreement on file." (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)
- The Adobe Brand Intelligence option showing in AI Collaborators setup in your client's production Workfront: ask Adobe to verify it for your client's package. Adobe: "Select whether the collaborator will use a brand or Adobe Brand Intelligence for its reviews." (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)

In the statement of work this reads: "Adobe confirms the Adobe Brand Intelligence option for AI Reviewers is available in your production Workfront before this service starts"

## How this was researched

1. Started from this morning's map-level files (`../genstudio_creative.json`, entries `ffcp`, `ffservices`, `ffcustom`, `firefly`; `../brand_visibility_side.json`, entry `brandintel`) and downloaded every page again with plain `curl -sS -L -m 45`, default headers.
2. Adobe Firefly help on helpx.adobe.com: took the full navigation from the Creative Production overview page (277 links) and read every page under Creative Production (31), custom models (10), Adobe Brand Intelligence (4), plus What's new, the Firefly FAQ, Firefly Graph (3), the Firefly brand and brand kit pages, the Figma plugin page, the Creative Cloud bulk actions FAQ, the two Admin Console pages on assigning users, the enterprise FAQ on Creative Production and the Operations rate card page. Product descriptions read: Firefly Creative Production for Enterprise, Custom Model, Adobe Brand Intelligence, Adobe's Brand Intelligence Service, Adobe Firefly.
3. developer.adobe.com: the Firefly Services documentation home, the Creative Production Workflow API (overview, authentication, feature guide), the Firefly API (overview, authentication, custom models concept, generate with a custom model, grant apps access), and the overview pages of the Express, Substance 3D, InDesign, Photoshop, Lightroom and Illustrator APIs; the Adobe Brand Intelligence developer site (home, Validate, authentication, core concepts, review feedback, Simulate, Simulate core concepts, Simulate using MCP).
4. Experience League: Workfront (Configure AI Collaborators, Get started with the Workfront AI Reviewer, Get started with unified review and approval), Workfront Fusion (Adobe Firefly modules, Adobe Photoshop modules, Adobe Lightroom modules, Adobe Express modules, Frame.io modules), Journey Optimizer (generative models, generate images, get started with Generate Content), GenStudio for Performance Marketing (release notes, generate image variants and seven other Create and guideline pages), Coworker (AI platforms, workflows), the overview of generative AI in CX Enterprise applications, Marketo Engage (generate content in the Email Designer), AEM (Assets overview, Generate Variations).
5. Web search limited to Adobe's three documentation hosts was used only to find pages (AEM Assets with Creative Production, Brand Intelligence with Workfront and Frame.io, custom models in GenStudio and in the Creative Cloud apps, Coworker and Firefly). Nothing is taken from a search summary.
6. Every downloaded page under the three products was searched by script for beta, early access, private or public preview, limited availability, coming soon, pre-release and deprecation wording. What that found is under "Left out".
7. Every quote was checked by script the way `../verify_quotes.py` does: page downloaded with curl, script and style blocks dropped, tags replaced by a space, entities unescaped, curly quotes straightened, whitespace collapsed, lower-cased, and the quote must be a substring.

Quote check: 139 quotes in the JSON (service evidence, prerequisites, packages, availability, not-documented, left-out and lifecycle entries), 139 found on their pages, 0 not found. Every quote printed in this trail is one of those.

Service ids: 37 (FP01 to FP09, FM01 to FM07, BN01 to BN08, XK01 to XK13). Checked by script against `sow/canvas/catalog.json`, every `sow/canvas/research/*.json` and every other file under `expansion_2026-11-10/`: no id repeats, and no existing id starts with FP, FM, BN or XK.

Voice check by script on every name, scope, how, gain, label, prerequisite, package note and client entry: no bare "your", no "the client" or "clients", no lifecycle label, no year, no prerequisite that opens with or follows a colon with "confirm", no em dash.

No blocked host was fetched and no block was worked around.

## What a partner would get wrong

**Firefly Creative Production**

- It is the umbrella, not a separate thing from Firefly Services. "Customers of Firefly Creative Production or Firefly Services are now entitled to Firefly Creative Production for Enterprise, which grants access to workflow capabilities." For Firefly Services customers there is no separate product card in the Admin Console.
- Cheaper plans get three presets, not the product. "Any plan that has access to premium generative AI features will get access to Firefly Creative Production." On those plans that means Remove background, Crop and Color grade, charged in generative credits; Workflow Builder, publishing and the APIs need the enterprise offering.
- Cost is in Operations, by output, and nobody can cap a user. A workflow run and a direct API call draw on the same pool at different rates, and the limit is for the whole organization. Admin Console metering was not available when Adobe's enterprise FAQ was written: "Metering for Firefly Creative Production isn't currently available but will be coming soon."
- Adobe's own engineers may be in the picture: "Access, on eligible plans, to forward-deployed engineering support to help customize workflows, connect systems, and support deployment." Some template workflows cannot be extended without them: "Users cannot add additional Action nodes unless working with Adobe Field Delivery Engineers."
- AEM means Author only: "AEM integration requires AEM as a Cloud Service, version 2024.10.18175 or later, and will only support Author Tier, not Delivery Tier." Adobe publishes no setup steps for the AEM or Frame.io source; it says only that sources depend on the workspace.
- Lightroom is gone: "The Lightroom API will reach end-of-life on July 31, 2026". Older Workfront Fusion Firefly and Photoshop modules have been retired too, so existing scenarios may need rework before new ones are added.
- Several things on the product's own pages are under a beta label and are not in these lines: the Resize and Reframe presets, capsules, and Firefly Graph.

**Firefly Custom Models**

- Enterprise only for this tool, on named plans, added through the account manager: "It's also only available on the Creative Cloud for enterprise Edition 5, Edition 4 (formerly Pro Firefly), and Edition 4 with Premium Stock (formerly Pro Plus) plans."
- A trainer needs two things in the Admin Console, the Trainer profile and a product that includes Firefly; generating needs neither, only a share.
- Sharing is by project: anyone with access to the project a model sits in gets the model. Set projects up before the models multiply.
- A trained model cannot be edited. It is duplicated and trained again, which is also how a model moves to a newer Firefly image model.
- Custom models are raster image models. Adobe's SVG download traces the image, it does not draw vectors.
- Photoshop is not ready for this in its standard release: "Photoshop (with an update available for its beta desktop app)".
- In Journey Optimizer the model is added by hand, by its ID from the Firefly address bar, and "Creating custom Firefly models requires a Firefly ETLA agreement."

**Adobe Brand Intelligence**

- The name misleads. It checks creative work against brand rules; it has nothing to do with AI search or Brand Visibility, and no Adobe page links the two.
- A partner cannot stand it up alone. "The ingestion and structuring of this training data is led by Adobe Forward-Deployed Engineers, who work directly with customer teams", and those engineers are one of four things the client must license.
- There is no app to roll out. The web app "is designed primarily as a reference implementation": the real work is building Validate into the client's own tools through the API, or using it through Workfront.
- Each skill is its own add-on for each tenant, each brand its own license, and every check consumes Operations, which come from Firefly Creative Production for Enterprise or Shared Credits.
- The Workfront route has its own conditions: the unified review and approval experience (Frame.io viewer, Adobe cloud storage), a signed Gen AI agreement, and no Sandbox. The Workfront AI Reviewer page, which describes reviewers that use Workfront's own brands, also asks for GenStudio Foundation; Adobe does not say whether that applies when the reviewer uses Brand Intelligence.
- The Workfront page that documents the Brand Intelligence option opens by saying highlighted content on the page is available only in Workfront's Preview environment. In the page's HTML the highlight sits on the Work Agents part, not on the AI Reviewer part, but that is our reading of the markup, so XK12 carries a condition that Adobe confirms the option in production.
- Our inference, not Adobe's words: that the AI Reviewer route needs the Validate add-on. Adobe says Validate is the skill that integrates into Workfront; it does not state the license for the AI Reviewer route.

## Not documented

- **cw-fireflycp**: Adobe's pages still disagree, and neither describes setup. The Coworker guide says a Firefly Image Generation skill exists (it is missing only when Coworker is reached through Claude), and lists a generate-image skill for Journey Optimizer that uses Firefly. Adobe's overview of generative AI gives Coworker a No in its Firefly Compatibility column. None of these pages names Firefly Creative Production, Firefly Services or a license for either, so there is nothing a partner sets up. Adobe: "The Firefly Image Generation skill is not available when you access Coworker through Claude." (https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms) Also: "Generates, crops, overlays, varies, and signs campaign images using Firefly." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows) Also: "Compatibility with Adobe Firefly is indicated for generative AI features." (https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/overview/generative-ai) In the table on the generative AI overview page the CX Enterprise Coworker row ends with No under Firefly Compatibility (read in the page text on Nov 10 2026; a table cell cannot be quoted as a sentence).
- **cw-fireflycm**: No Coworker page names custom models, and no Firefly custom models page names Coworker. Adobe: "To use the Firefly Image Generation skill, access Coworker through the Coworker interface or another supported AI platform." (https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms)
- **ajo-fireflycp**: Journey Optimizer's image generation uses Firefly models that come with Journey Optimizer; it does not call Firefly Creative Production or the Firefly Services APIs, and no page sets the two up together. Custom models are a different matter: see ajo-fireflycm. Adobe: "Image generation is managed with Adobe Firefly." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/gs-generative)
- **marketo-fireflycp**: Marketo Engage's Email Designer can generate images with Firefly as a built-in setting. No page ties it to Firefly Creative Production, the Firefly Services APIs or custom models. Adobe: "If you would like to generate images using Firefly, select the Image Settings and select the toggle for Generate Images using AI" (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/generate-content)
- **marketo-fireflycm**: The Marketo Engage page offers Adobe Firefly or a partner model and does not mention custom models. Adobe: "If you would like to generate images using Firefly, select the Image Settings and select the toggle for Generate Images using AI" (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/generate-content)
- **aemsites-fireflycp**: AEM Sites reaches Firefly only through Adobe Express inside Generate Variations. No page ties AEM Sites to Firefly Creative Production, the Firefly Services APIs or custom models. Adobe: "Use Adobe Express to generate images based on the copy variations; this uses the Generative AI capabilities of Firefly." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/generate-variations/generate-variations)
- **brandintel-frameio**: Not a connection of its own. The only documented path is through Workfront: when a Workfront AI Reviewer uses Brand Intelligence, its comments are viewed in the Frame.io viewer of Workfront's unified review. The Firefly help says Validate can be integrated into "Workfront and Frame" and gives no setup. It is covered by workfront-brandintel. Frame.io's own help site could not be read. Adobe: "You can easily integrate it into apps such as Workfront and Frame." (https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/adobe-brand-intelligence-overview.html)
- **brandintel-fireflycp**: A licensing prerequisite, not a connection with services. Brand Intelligence skills consume Operations, and Operations are licensed through Firefly Creative Production for Enterprise or through Shared Credits. Nothing is configured between the two products. It is recorded as a prerequisite and a tier on Brand Intelligence. One workflow template in Creative Production says it checks output against brand rules, without naming Brand Intelligence. Adobe: "Operations are licensed through Firefly Creative Production for Enterprise offering or the Shared Credits offering." (https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html) Also: "Checks output against brand rules" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/firefly-creative-production-home-page-overview.html)
- **aemassets-fireflycm**: No AEM Assets page names Firefly custom models. AEM Assets can generate an image with Adobe Firefly when a search finds nothing, as a built-in feature. Adobe: "AEM Assets allows you to generate an asset with Adobe Firefly in real-time when your search query does not return any results." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview)
- **workfront-fireflycm**: The Workfront Fusion Adobe Firefly modules page does not mention custom models; a model could only be reached through the module that makes a custom API call, which Adobe does not describe for this purpose. Adobe: "This action module makes a custom call to the Firefly API." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-firefly-modules)
- **brandintel (other products in the tool)**: Instruct to Assemble "selects optimal images from your DAM" without naming AEM Assets, so no AEM Assets connection is written. No Adobe page names Brand Intelligence together with GenStudio for Performance Marketing, Coworker, Journey Optimizer, Adobe Express or Brand Visibility. Adobe: "Selects optimal images from your DAM" (https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/instruct-to-assemble.html)

## Left out, and why

- **GenStudio for Performance Marketing with Firefly Custom Models (the pair gspm-fireflycm)**: Adobe documents that GenStudio supports custom models, but the place a model is chosen, Generate image variants, carries Adobe's Beta badge in the GenStudio guide. A service there would rest on a feature Adobe keeps under that label. This is a question for Adam. Adobe: "This feature is currently in Beta, so some functionality may be limited or subject to change." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/generate-assets) Also: "GenStudio for Performance Marketing now supports custom models trained on Adobe Firefly Image Model 4" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes) Also: "Select a model to use for image generation from" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/generate-assets)
- **Adobe Express with Firefly Creative Production (the pair express-fireflycp)**: The only tie is the Adobe Express API in the Firefly Services documentation, which Adobe labels beta, with access by request. Adobe: "The Adobe Express API is now in beta" (https://developer.adobe.com/firefly-services/docs/express-api/)
- **Capsules (called interfaces in the release note): simple run screens an author publishes from a workflow for batch jobs of up to 500 assets**: Adobe labels the feature beta. FP08 therefore hands over run books for published workflows, not capsules. Adobe: "Capsules is a beta feature in Adobe Firefly now available for testing and feedback." (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/interface-overview.html)
- **The Resize images and Reframe videos bulk presets**: Both carry a beta label on the bulk actions page. FP02 covers Remove background, Crop and Color grade only. Adobe: "Use Resize (beta) to easily resize multiple images at once" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/bulk-actions-overview.html) Also: "Use Reframe Videos (beta) to automatically resize multiple videos for various screen formats" (https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/bulk-actions-overview.html)
- **Firefly Graph, the node-based workspace announced in the November 2026 release notes**: Adobe labels it beta. Today's capsule pages describe building from "a graph", while the Creative Production pages still describe Workflow Builder without a label. The lines here follow the Workflow Builder pages. See the lifecycle question for Adam. Adobe: "Build and scale creative workflows with Firefly Graph (beta)" (https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html)
- **Lightroom API automation, in Firefly Services and in Workfront Fusion**: Adobe's Lightroom API page carries an end-of-life notice dated July 31, 2026. Adobe: "The Lightroom API will reach end-of-life on July 31, 2026" (https://developer.adobe.com/firefly-services/docs/lightroom/)
- **Custom models in Photoshop**: Adobe ties this to a pre-release build of the desktop app, so creativecloud-fireflycm names Illustrator and leaves Photoshop out. Adobe: "Photoshop (with an update available for its beta desktop app)" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/generate-and-edit-images-with-custom-models.html)
- **Brand color control by HEX value when training a custom model**: Adobe labels it a beta feature. Adobe: "Hex color control is currently a beta feature in custom models, available only to enterprise users." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/add-and-use-brand-colors.html)
- **The Tune edit tool for images made with a custom model**: Labelled beta in the list of edit tools. Adobe: "Tune (beta)" (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/generate-and-edit-images-with-custom-models.html)
- **Custom Models for individual and teams plans**: Adobe says Custom Models is in beta for individual and teams users. The product and its lines are written for enterprise plans only, where Adobe's pages carry no such label. See the lifecycle question for Adam. Adobe: "Custom Models is currently in beta for individual and teams users in Adobe Firefly." (https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html)
- **The Image guideline type of a Workfront AI Reviewer that uses a Workfront brand**: Carries a Beta badge and needs a beta agreement. It concerns Workfront's own brands, not Brand Intelligence, and no line here depends on it. Adobe: "System administrators must sign the beta agreement to enable this feature." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-reviews-and-approvals/wf-ai-reviewer)
- **Workfront Work Agents (Coworker or outside agents assigned to tasks)**: Out of scope for this family, and Adobe's page says the setup model is still in preview. Adobe: "The following setup guidance reflects Adobe Native support and the origin-based setup model that is still in preview." (https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators)
- **3D digital twin workflows (standardized packshots, 360 degree spin video, composite imagery from a USDZ product model)**: Not a lifecycle matter: documented and available as starter templates. Left out to keep the list to what a typical engagement starts with; some of these workflows cannot be extended without Adobe's own engineers. Easy to add as an optional line if Adam wants it. Adobe: "Users cannot add additional Action nodes unless working with Adobe Field Delivery Engineers." (https://helpx.adobe.com/enterprise/kb/automation-operation-definition.html)
- **Usage reporting for Operations in the Admin Console**: Adobe's enterprise FAQ (September 2025) says metering is not available yet, so FP09 reports Operations from job logs and the contract, not from an Admin Console report. Adobe: "Metering for Firefly Creative Production isn't currently available but will be coming soon." (https://helpx.adobe.com/enterprise/using/firefly-creative-production-faq.html)
- **InDesign Remap Links API (points links in an InDesign document at AEM URLs)**: A single API call named in the Firefly Services documentation, with no guide beyond the reference. Mentioned in the trail; not a service. Adobe: "Replaces file-based links in InDesign documents with Adobe Experience Manager (AEM) URLs." (https://developer.adobe.com/firefly-services/docs/indesign-apis/)

## Open questions for Adam

1. **Custom Models: in or out?** Adobe says it is in beta for individual and teams plans; the enterprise offering has no such label. Recommendation: in, for enterprise plans only, with the plan as the first thing a partner checks.
2. **Brand Intelligence: in or out?** It only works with Adobe's own engineers, who load the brand data. Recommendation: in, with the eight partner services that sit around Adobe's work and the Adobe engineering requirement shown first. If the rule is that nothing needing Adobe's own delivery people goes in the tool, leave it out.
3. **GenStudio with Custom Models.** Adobe says GenStudio supports custom models, but the GenStudio screen where a model is picked carries a Beta badge. Recommendation: leave the connection out for now and add it when the badge goes; the tool's GenStudio services do not depend on it.
4. **Firefly Creative Production and Firefly Graph.** Adobe's November notes introduce Firefly Graph (beta), and pages updated today describe building "from a graph", while the product pages still describe Workflow Builder. Recommendation: build on the Workflow Builder pages as written, say nothing of Graph, and recheck the pages on the day it is built.
5. **One box or two?** Partners may look for "Firefly Services". Recommendation: one box named Firefly Creative Production, with "includes the Firefly Services APIs" in its description, so a search for either name finds it.

## Pages cited (every quote in the JSON comes from one of these)

- https://developer.adobe.com/adobe-brand-intelligence/
- https://developer.adobe.com/adobe-brand-intelligence/simulate/using-mcp/
- https://developer.adobe.com/adobe-brand-intelligence/validate/authentication/
- https://developer.adobe.com/adobe-brand-intelligence/validate/review-feedback/
- https://developer.adobe.com/firefly-services/docs/express-api/
- https://developer.adobe.com/firefly-services/docs/firefly-api/
- https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-generate-image/
- https://developer.adobe.com/firefly-services/docs/firefly-api/guides/how-tos/cm-share-model/
- https://developer.adobe.com/firefly-services/docs/indesign-apis/
- https://developer.adobe.com/firefly-services/docs/lightroom/
- https://developer.adobe.com/firefly-services/docs/workflow-builder-api/
- https://developer.adobe.com/firefly-services/docs/workflow-builder-api/getting-started/
- https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows
- https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/overview/generative-ai
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/generate-variations/generate-variations
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/generate-assets
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/brands/generative-models
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/generate-content/gs-generative
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/generate-content
- https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-firefly-modules
- https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-photoshop-modules
- https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/set-up-wf/configure-system-defaults/configure-ai-collaborators
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/document-reviews-and-approvals/wf-ai-reviewer
- https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-creative-production.html
- https://helpx.adobe.com/business/enterprise/products-entitlements/manage-entitlements/assign-users-to-firefly-custom-models.html
- https://helpx.adobe.com/enterprise/kb/automation-operation-definition.html
- https://helpx.adobe.com/enterprise/using/firefly-creative-production-faq.html
- https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/adobe-brand-intelligence-overview.html
- https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/instruct-to-assemble.html
- https://helpx.adobe.com/firefly/web/adobe-brand-intelligence/validate-brand-compliance.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/add-and-use-brand-colors.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/best-practices-for-training-custom-models.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/generate-and-edit-images-with-custom-models.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/prompt-guidelines-for-custom-models.html
- https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html
- https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/retrain-custom-models.html
- https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/share-custom-models.html
- https://helpx.adobe.com/firefly/web/perform-bulk-actions/creative-production-in-creative-cloud-faq.html
- https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/adobe-firefly-creative-production-for-enterprise-faq.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/build-custom-workflows.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/bulk-actions-overview.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/creative-production-overview.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/firefly-creative-production-home-page-overview.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/interface-overview.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/merge-indesign-data.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/merge-photoshop-data.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/partner-models-in-firefly-creative-production-for-enterprise.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/run-workflow-mcp-overview.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-3d-digital-twin-workflows.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-input-and-output-nodes.html
- https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-template-and-data-merge-nodes.html
- https://helpx.adobe.com/legal/product-descriptions/adobe-brand-intelligence-base.html
- https://helpx.adobe.com/legal/product-descriptions/custom-model.html

About 110 pages were downloaded in all; the ones not cited were read for the lifecycle search and to rule connections in or out.

## Pages not read

- https://help.frame.io: Frame.io's own help center is refused by this session's network settings. Not attempted. Whatever Frame.io documents about Firefly Creative Production or Brand Intelligence could not be checked.
- https://business.adobe.com/: Blocked host. The product pages for Firefly Creative Production, Firefly Services, Custom Models and Brand Intelligence were not attempted.
- https://www.adobe.com/: Blocked host. Not attempted: the partner model supplemental coverage terms and the generative AI licensing terms that the product descriptions link to.
- https://developer.adobe.com/firefly-services/: Redirects to business.adobe.com (blocked). The documentation under /firefly-services/docs/ was read.
- https://experienceleague.adobe.com/en/toc/workfront-help-main-toc: The table of contents services for Workfront, Workfront Fusion, Coworker and GenStudio returned an empty shell, so those guides were searched page by page and by web search, not crawled in full.

What could not be confirmed because of this: anything Frame.io's own help says about Firefly Creative Production as a source or destination, about the Brand Intelligence comments in the Frame.io viewer, and about setup on the Frame.io side; Adobe's marketing pages for the three products (plan names, packaging and any availability wording there); the supplemental coverage terms for partner models.
