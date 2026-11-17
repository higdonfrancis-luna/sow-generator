#!/usr/bin/env python3
"""Re-apply the Figma connections change (Nov 17 2026) to a checkout of the SOW tool, by content, never by line numbers.

    python3 apply_figma.py <checkout> [--no-build]

Figma, the outside system added for Brand Intelligence on Nov 16, connects to four more Adobe products through the plugins and
add-on Adobe documents, each drawn as a native line (like Figma + Brand Intelligence and Adobe Asset Link), with six optional
services, XF01 to XF06, that start off (like XK16), so a canvas saved before the change reopens with the same services and totals:

  Figma + AEM Assets                           XF01 AEM Assets Connector rollout for Figma designers         8 / 16 / 32
                                               XF02 Save-back folders and export settings for Figma designs  8 / 16 / 32
  Figma + GenStudio for Performance Marketing  XF03 Figma ad templates prepared for the GenStudio plugin     16 / 32 / 56
                                               XF04 Figma frames converted for GenStudio Photoshop           8 / 16 / 32
  Figma + Adobe Express                        XF05 Figma designs imported into Adobe Express                8 / 16 / 32
  Figma + Firefly Custom Models                XF06 Custom models for Figma designers                        8 / 16 / 24

Every step finds its place by content and is idempotent: a step already applied is left as it is, and a step whose anchor is
missing stops the script with a message that names the file, so a later checkout that moved the text can be fixed by hand.

  1. canvas/research/wave6_figma.json             the four connections and six services, with the quote behind each fact
  2. canvas/research/connection_types.json        kind (outside, native line), label, prerequisites and their quotes
  3. product_copy_rules.json                      the client's version (connection_client) and the supporting pages
                                                  shown as links (connection_overrides, references_set)
  4. index.html (OUTSIDE_MORE)                    the statement of work keeps Figma on Create your own play, so a draft
                                                  saved there and opened again brings Figma back with its chosen services
  5. rfp_answers.js (NAMES, TIED)                 the RFI Builder names Figma only where a sentence ties it to a product it
                                                  connects to ('AEM Assets inside Figma'), not where an RFI mentions it in
                                                  passing ('our designers work in Figma'), and Figma's name stays evidence
                                                  for the services about it
  6. canvas/template.html                         a tag in the Add outside system menu that wraps keeps its words inside
                                                  its corners (Figma's lists five products)
  7. rfp_prototype/kb_method                      RFI write-ups: batches/, reviewed/ and phrases/ in the next free batch
  8. checks                                       the stated totals move by +4 connections and +6 services; Figma's menu
                                                  text in canvas/test_canvas.js; the later-connection filters of steps 62
                                                  and 64; new checks in canvas/test_canvas.js and test_step64.js
  9. builds                                       python3 canvas/build.py and python3 build_site.py, twice, so the
                                                  canvas shows the knowledge base's new counts
 10. README.md                                    one section, with the counts the build reports
"""
import glob, json, os, re, subprocess, sys

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else sys.exit(__doc__)
BUILD = '--no-build' not in sys.argv
CONN_DELTA, LINE_DELTA = 4, 6
IDS = ['figma-aemassets', 'figma-gspm', 'figma-express', 'figma-fireflycm']
LINES = ['XF01', 'XF02', 'XF03', 'XF04', 'XF05', 'XF06']
done = []


def path(*p):
    return os.path.join(ROOT, *p)


def read(p):
    return open(path(p), encoding='utf-8').read()


def write(p, s):
    open(path(p), 'w', encoding='utf-8').write(s)


def fail(p, why):
    sys.exit(f'apply_figma: {p}: {why}')


def jformat(raw):
    """The json.dumps settings a file was written with (it must round-trip exactly, or the file is edited by hand)."""
    d = json.loads(raw)
    for ind in (1, 2, None):
        for asc in (False, True):
            for nl in ('\n', ''):
                if json.dumps(d, indent=ind, ensure_ascii=asc) + nl == raw:
                    return d, (ind, asc, nl)
    return d, None


def jload(p):
    d, fmt = jformat(read(p))
    if fmt is None:
        fail(p, 'does not round-trip through json.dumps; edit it by hand')
    return d, fmt


def jdump(p, d, fmt):
    ind, asc, nl = fmt
    write(p, json.dumps(d, indent=ind, ensure_ascii=asc) + nl)


# ---------------------------------------------------------------- the Adobe pages (every quote checked word for word, Nov 17)
EL_FIGMA = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integration-figma/integrate-aem-assets-with-figma'
EL_KCS = 'https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-41364'
EL_ASSETS = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview'
EL_GSPM = 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/integrations/figma-plugin'
EL_GSPM_PS = 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/integrations/photoshop-plugin'
EL_GSPM_INT = 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/integrations/overview'
EL_GSPM_RN = 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes'
HX_EXPRESS = 'https://helpx.adobe.com/express/web/add-ons-and-integrations/import-figma-designs-into-adobe-express.html'
HX_ADDONS_ADMIN = 'https://helpx.adobe.com/business/teams/users-and-licenses/manage-products-and-entitlements/manage-adobe-express-add-on-access.html'
HX_ROLES = 'https://helpx.adobe.com/business/enterprise/users/manage-user-roles/user-roles-overview.html'
HX_EXPRESS_RN = 'https://helpx.adobe.com/express/web/whats-new/release-notes.html'
HX_FF_GEN = 'https://helpx.adobe.com/firefly/web/app-integrations/figma/generate-images-in-figma.html'
HX_FF_PLUGIN = 'https://helpx.adobe.com/firefly/web/app-integrations/figma/firefly-plugin-for-figma.html'
HX_CM = 'https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/custom-models-overview.html'
HX_CM_TRAIN = 'https://helpx.adobe.com/firefly/web/custom-models/get-started-with-custom-models/train-custom-models.html'

T_FIGMA = 'Experience League: Integrate AEM Assets with Figma'
T_KCS = 'Experience League: Resolve Unknown clientId login error in AEM Assets Connector for Figma'
T_ASSETS = 'Experience League: AEM Assets as a Cloud Service overview'
T_GSPM = 'Experience League: Figma plugin for GenStudio for Performance Marketing'
T_GSPM_PS = 'Experience League: GenStudio Photoshop for GenStudio for Performance Marketing'
T_GSPM_INT = 'Experience League: GenStudio for Performance Marketing integrations'
T_GSPM_RN = 'Experience League: GenStudio for Performance Marketing release notes'
T_EXPRESS = 'Adobe Help: Import Figma designs into Adobe Express'
T_ADDONS_ADMIN = 'Adobe Help: Manage Adobe Express add-on access'
T_ROLES = 'Adobe Help: User roles in Admin Console'
T_EXPRESS_RN = 'Adobe Help: Adobe Express on web release notes'
T_FF_GEN = 'Adobe Firefly help: Use text to image to generate images in Figma'
T_FF_PLUGIN = 'Adobe Firefly help: Use Firefly Enterprise and GenStudio for Figma'
T_CM = 'Adobe Firefly help: Custom models overview'
T_CM_TRAIN = 'Adobe Firefly help: Create and train custom models'

src = lambda u, t: {'url': u, 'title': t}
ref = lambda u, t, q: {'url': u, 'title': t, 'quote': q}
ev = lambda u, q: {'url': u, 'quote': q}

# the quotes, word for word from the pages (Nov 17 2026 check, ids from its quotes_verified_result.json)
Q = {
    'V01': 'AEM Assets integrates natively with Figma, which allows designers to directly access the assets stored in AEM Assets from within the Figma user interface. You can place content managed in AEM Assets in the Figma canvas and then save new or edited content in the AEM Assets repository.',
    'V02': 'Minimum required AEM release version is 19149.',
    'V03': 'You must have valid AEM Assets and Figma licenses to integrate AEM Assets with Figma.',
    'V04': 'For importing AEM assets into Figma, the supported formats are image assets (JPEG, PNG), video files (MP4, MOV, WebM), Animated files (GIF), and Vector files (SVG).',
    'V05': 'For exporting designs from Figma to AEM Assets, the supported formats are PNG, PDF, JPG, SVG.',
    'V06': 'The export configuration comprises the file format, scale, and quality. For example, if you select JPG as the file format, you can also define the image scale and quality. Similarly, if you select PNG as the file format, you can also define the image scale.',
    'V07': 'The assets used in the current Figma document are compared to the assets that exist in AEM. Any updates are listed in a separate window. Click Update to get the updated asset from AEM into your Figma document.',
    'V08': 'The integration is native, requiring no third-party connectors beyond the Adobe Experience Manager AEM Assets Connector available on the Figma community.',
    'V09': 'without switching between tools',
    'V10': 'Applies to: Experience Manager as a Cloud Service',
    'V11': 'On your Figma home page, click Actions from the toolbar at the bottom of the canvas and search for Adobe Experience Manager (AEM) Assets Connector in the search bar available in the dialog box.',
    'V12': 'Search for the asset using Content Advisor within the connector panel.',
    'V13': 'In the dialog box, select either Selected Item or Page, specify a file or page name, define an export configuration and click Upload to upload the selected asset or the entire design to the destination folder.',
    'V14': 'Integration with Figma: AEM Assets integrates natively with Figma, enabling designers to access assets stored directly in AEM Assets from within the Figma user interface.',
    'V15': 'Ensure you are using the official Adobe Experience Manager (AEM) Assets Connector from the Figma Community Marketplace.',
    'V16': 'Confirm that you are signing in to Figma with the same company or federated Adobe ID used for Experience Cloud and AEM Assets.',
    'V21': 'The GenStudio for Performance Marketing Figma plugin adds a new panel to the Figma application that lets you generate on-brand content.',
    'V22': 'Find and install the plugin from the Figma community marketplace.',
    'V23': 'Map Figma text elements to GenStudio for Performance Marketing fields, such as headline, body, on_image_text, and more.',
    'V24': 'Generate new on-brand Meta, LinkedIn, or Display ad Experiences based on a brand, persona, product, and text prompt.',
    'V25': 'Translate generated Experiences into multiple languages.',
    'V27': 'Export generated Experiences to GenStudio for Performance Marketing.',
    'V28': 'The plugin requires the first two levels of your Figma document to follow this convention:',
    'V29': 'There is no fixed size requirement. Display templates support any size.',
    'V30': 'LinkedIn templates Width: 1200 px (fixed) Height: 1200 px, 628 px, 2292 px, 1800 px, or 1500 px',
    'V31': 'For Instagram or Facebook posts: Width: 1080 px (fixed) Height: 1080 px or 1350 px For Instagram or Facebook stories: Width: 1080 px (fixed) Height: 1920 px',
    'V32': 'You must map an image by assigning the image field role to at least one image element in your template.',
    'V33': 'Select the number of variations to be produced (up to eight).',
    'V35': 'To perform this task, you need both the Figma plugin and GenStudio Photoshop.',
    'V36': 'You can use the Figma plugin to convert a Figma frame, multiple frames, or an entire document to Photoshop format and export it for use with GenStudio Photoshop.',
    'V37': 'Features such as strikethrough, superscript, subscript, opacity as percentages, gradients, and similar advanced properties are not yet supported.',
    'V38': 'Frames cannot be within a section during conversion.',
    'V39': 'Open the Firefly Enterprise and GenStudio plugin in Figma and click the Export tab in the plugin UI.',
    'V40': 'A text field’s font must be available on your machine for replacement to occur during generation.',
    'V41': 'Select the Brand, Persona, and Product to use for the content generation.',
    'V42': 'Explore the plugins that GenStudio for Performance Marketing offers, with other Adobe products and beyond, to streamline your design workflows.',
    'V45': 'Create on-brand and personalized ads directly using the new GenStudio Plugins for Adobe Photoshop and Figma design tools.',
    'V46': 'Photoshop, minimum version 25.6.0',
    'V47': 'Download and update the plugin from the Creative Cloud Marketplace in Adobe Exchange.',
    'V50': 'Native Import: Imports supported content as editable Adobe Express elements.',
    'V51': 'Import Figma pages, frames, or individual layers into Adobe Express using the Figma add-on.',
    'V52': 'You need a Figma account with access to the file you want to import and access to Add-ons in Adobe Express. Full and Dev Figma licenses have unlimited access to the add-on capabilities, while Collab and View seats have daily limits.',
    'V55': 'Open the Figma add-on and select Connect.',
    'V56': "Rasterize: Imports the selected content as a flattened image. You can move and scale the image, but you can't edit its individual elements.",
    'V57': 'You can use both import methods in the same design.',
    'V58': "The add-on matches fonts by name when the same font is available in Figma and Adobe Express. If a font isn't available in Adobe Express, a fallback font is applied and identified as Font Not Available in the import summary.",
    'V59': 'Gradients, patterns, and certain masked or combined shapes can be imported as images to preserve their appearance.',
    'V60': "The add-on has read-only access to Figma files and doesn't modify the original file.",
    'V61': 'The Figma add-on is available at no additional cost. You need valid Adobe Express and Figma accounts.',
    'V62': 'With Native Import, text remains editable, shapes and vectors are recreated as editable objects, and images are positioned to match the Figma layout. Frames retain their original dimensions and aspect ratio.',
    'V63': 'Return to Adobe Express, paste the URL in the URL link field, and then select Continue.',
    'V64': 'Select the page, frame, or layer you want to import.',
    'V66': 'Move designs between Figma and Adobe Express with smoother import/export workflows.',
    'V67': 'For enterprise organizations, Adobe Express add-on access is managed through role-based access controls.',
    'V68': 'By default, users can download and use Adobe Express add-ons.',
    'V69': 'Provide access to specific Adobe Express add-ons',
    'V71': "Select an Adobe or Partner model from the Model dropdown menu or choose a custom model you've created.",
    'V72': 'Firefly Enterprise and GenStudio plugin installed in Figma',
    'V73': 'Figma desktop app or Figma in the browser',
    'V74': 'Active Adobe account with Firefly access',
    'V75': 'You can generate images for your design templates using the Firefly Enterprise and GenStudio plugin in Figma.',
    'V76': 'Select Text to image option in the plugin panel.',
    'V77': 'The generated images will appear in the plugin panel. You can add them to your canvas using any of these methods:',
    'V78': "You'll find the Adobe Firefly Enterprise and GenStudio plugin in the Figma marketplace, where it's available like any other plugin.",
    'V81': 'The plugin will prompt you to sign in. Enter the email address and password that is associated with Adobe account to begin using the plugin within your Figma workspace.',
    'V83': 'Custom models can be used to generate content in supported Adobe apps, including Photoshop, Illustrator, Adobe Express, Firefly, and GenStudio.',
    'V84': 'Custom Models can be trained to generate a specific subject or reproduce a visual style.',
    'V85': 'Firefly Custom Models are available for Creative Cloud for individuals, Creative Cloud Pro for teams, Creative Cloud Pro Plus for teams subscribers, organizations that use Adobe storage for business, and select enterprise plans.',
    'V86': 'If you have a Creative Cloud for enterprise plan, contact your Adobe Account Manager to add custom models to your plan.',
    'V90': "If you're an enterprise customer, depending on your organization's workflow, you may need to publish the trained model before it becomes available to other users or apps.",
    'V94': 'Alternatively, access the Adobe Experience Manager (AEM) Assets Connector available on Figma community, click Open in…, select a recent file or create a new file and click Run to access the Adobe Experience Manager (AEM) Assets Connector panel.',
}

# ---------------------------------------------------------------- 1. the research file
CONNECTIONS = [
    {
        'id': 'figma-aemassets', 'a': 'figma', 'b': 'aemassets',
        'how': "Adobe's AEM Assets Connector opens as a panel in Figma. Designers search AEM Assets, place images, videos, GIFs and SVGs on the Figma canvas, bring in newer versions with Check for updates, and upload a selected item or a whole page to an AEM Assets folder.",
        'how_evidence': [ev(EL_KCS, Q['V15']), ev(EL_FIGMA, Q['V08']), ev(EL_FIGMA, Q['V11']), ev(EL_FIGMA, Q['V94']),
                         ev(EL_FIGMA, Q['V12']), ev(EL_FIGMA, Q['V04']), ev(EL_FIGMA, Q['V07']), ev(EL_FIGMA, Q['V13'])],
        'source': src(EL_FIGMA, T_FIGMA),
        'source_quote': Q['V01'],
        'gain': {'title': 'AEM Assets inside Figma',
                 'text': "Your client's designers place AEM Assets files on the Figma canvas, check for newer versions in AEM, and save new or edited designs back to an AEM Assets folder without switching between tools."},
        'gain_evidence': [ev(EL_FIGMA, Q['V01']), ev(EL_FIGMA, Q['V07']), ev(EL_FIGMA, Q['V09'])],
        'flows': [
            {'from': 'aemassets', 'to': 'figma', 'what': 'Images, videos, GIFs and SVGs found with Content Advisor and placed on the Figma canvas, and their newer versions through Check for updates', 'source': src(EL_FIGMA, T_FIGMA)},
            {'from': 'figma', 'to': 'aemassets', 'what': 'New or edited designs, a selected item or a whole page, uploaded to an AEM Assets folder as PNG, PDF, JPG or SVG', 'source': src(EL_FIGMA, T_FIGMA)},
        ],
        'kind': 'outside', 'line': 'native',
        'label': "Adobe's AEM Assets Connector places AEM Assets files on the Figma canvas and saves designs back to AEM Assets",
        'availability': '',
        'prereqs': [
            'Valid AEM Assets and Figma licenses',
            'AEM Assets as a Cloud Service on AEM release 19149 or later',
            'The Adobe Experience Manager (AEM) Assets Connector from the Figma Community, run from Actions in Figma',
            'Designers signed in with the same company or federated Adobe ID they use for Experience Cloud and AEM Assets',
            'Assets in JPEG, PNG, MP4, MOV, WebM, GIF or SVG to place in Figma, and designs saved back as PNG, PDF, JPG or SVG',
        ],
        'prereq_sources': [ev(EL_FIGMA, Q['V03']), ev(EL_FIGMA, Q['V02']), ev(EL_FIGMA, Q['V10']), ev(EL_FIGMA, Q['V11']), ev(EL_KCS, Q['V15']),
                           ev(EL_KCS, Q['V16']), ev(EL_FIGMA, Q['V04']), ev(EL_FIGMA, Q['V05'])],
        'references': [ref(EL_KCS, T_KCS, Q['V16']), ref(EL_ASSETS, T_ASSETS, Q['V14'])],
        'lines': [
            {'id': 'XF01', 'name': 'AEM Assets Connector rollout for Figma designers', 'unit': 'one-time', 'low': 8, 'base': 16, 'high': 32, 'default': False,
             'scope': "Check that your client's AEM environment is on release 19149 or later, give the designers access to the agreed AEM Assets folders with the same company or federated Adobe ID they sign in with, roll out the AEM Assets Connector from the Figma Community, and test search, place, Check for updates and upload with the design team.",
             'evidence': 'AEM Assets integrates natively with Figma, which allows designers to directly access the assets stored in AEM Assets from within the Figma user interface.',
             'source': src(EL_FIGMA, T_FIGMA)},
            {'id': 'XF02', 'name': 'Save-back folders and export settings for Figma designs', 'unit': 'one-time', 'low': 8, 'base': 16, 'high': 32, 'default': False,
             'scope': "Agree with your client's DAM owner which AEM Assets folders take the designs uploaded from Figma, the file format, scale and quality each use needs, how the files are named and when designers run Check for updates, then write the short guide the design team follows.",
             'evidence': 'The export configuration comprises the file format, scale, and quality.',
             'source': src(EL_FIGMA, T_FIGMA)},
        ],
        'client': {'how': 'Your designers open AEM Assets in a panel inside Figma, place images, videos, GIFs and SVGs from it on the Figma canvas, check for newer versions in AEM, and save new or edited designs back to an AEM Assets folder.',
                   'gain': 'Your designers use the files in your DAM without switching between tools, and their finished designs are saved back to AEM Assets.'},
    },
    {
        'id': 'figma-gspm', 'a': 'figma', 'b': 'gspm',
        'how': "Adobe's Firefly Enterprise and GenStudio plugin adds a GenStudio for Performance Marketing panel to Figma. Designers map the text and image layers of their ad templates to GenStudio fields, generate up to eight on-brand Meta, LinkedIn or Display variations from a brand, persona, product and prompt, translate them, and export them to GenStudio for Performance Marketing as experiences. The plugin also converts Figma frames to Photoshop documents for use with GenStudio Photoshop.",
        'how_evidence': [ev(HX_FF_PLUGIN, Q['V78']), ev(EL_GSPM, Q['V39']), ev(EL_GSPM, Q['V21']), ev(EL_GSPM, Q['V23']), ev(EL_GSPM, Q['V32']),
                         ev(EL_GSPM, Q['V24']), ev(EL_GSPM, Q['V33']), ev(EL_GSPM, Q['V41']), ev(EL_GSPM, Q['V25']), ev(EL_GSPM, Q['V27']),
                         ev(EL_GSPM, Q['V36'])],
        'source': src(EL_GSPM, T_GSPM),
        'source_quote': Q['V21'],
        'gain': {'title': 'Ad variations where the designers already work',
                 'text': "Your client's designers keep building ads in Figma and generate on-brand Meta, LinkedIn and Display variations and translations there, from the brands, personas and products in GenStudio. The results go to GenStudio for Performance Marketing as experiences."},
        'flows': [
            {'from': 'gspm', 'to': 'figma', 'what': 'The brand, persona and product chosen in the plugin, used to generate up to eight on-brand variations in the mapped Figma templates', 'source': src(EL_GSPM, T_GSPM)},
            {'from': 'figma', 'to': 'gspm', 'what': 'Generated variations, exported to GenStudio for Performance Marketing as experiences', 'source': src(EL_GSPM, T_GSPM)},
        ],
        'kind': 'outside', 'line': 'native',
        'label': "Adobe's Firefly Enterprise and GenStudio plugin in Figma generates on-brand ad variations in Figma templates and exports them to GenStudio for Performance Marketing",
        'availability': '',
        'prereqs': [
            "Your client's designers building their ad templates in Figma",
            'GenStudio for Performance Marketing, with the brands, personas and products the plugin generates from',
            'The Firefly Enterprise and GenStudio plugin from the Figma community marketplace, with each designer signed in with an Adobe account',
            'Figma files laid out as sections (projects) holding frames (templates), with the image role mapped to at least one image element in each template',
            'Template sizes: Meta posts 1080 px wide by 1080 or 1350 px high, Meta stories 1080 by 1920 px, LinkedIn 1200 px wide by 1200, 628, 2292, 1800 or 1500 px high, Display any size',
            "Every font used in the file installed on the designer's machine",
        ],
        'prereq_sources': [ev(EL_GSPM, Q['V41']), ev(EL_GSPM, Q['V22']), ev(HX_FF_PLUGIN, Q['V78']), ev(HX_FF_PLUGIN, Q['V81']), ev(EL_GSPM, Q['V28']),
                           ev(EL_GSPM, Q['V32']), ev(EL_GSPM, Q['V31']), ev(EL_GSPM, Q['V30']), ev(EL_GSPM, Q['V29']), ev(EL_GSPM, Q['V40'])],
        'references': [ref(EL_GSPM_PS, T_GSPM_PS, Q['V46']), ref(HX_FF_PLUGIN, T_FF_PLUGIN, Q['V81']), ref(EL_GSPM_INT, T_GSPM_INT, Q['V42']),
                       ref(EL_GSPM_RN, T_GSPM_RN, Q['V45'])],
        'lines': [
            {'id': 'XF03', 'name': 'Figma ad templates prepared for the GenStudio plugin', 'unit': 'one-time', 'low': 16, 'base': 32, 'high': 56, 'default': False,
             'scope': "Install the Firefly Enterprise and GenStudio plugin from the Figma community marketplace for your client's designers, set up their Figma ad files as sections and frames at the sizes Meta, LinkedIn and Display accept, map the field roles with at least one image, and generate, translate and export test variations to GenStudio for Performance Marketing.",
             'evidence': Q['V23'],
             'source': src(EL_GSPM, T_GSPM)},
            {'id': 'XF04', 'name': 'Figma frames converted for GenStudio Photoshop', 'unit': 'one-time', 'low': 8, 'base': 16, 'high': 32, 'default': False,
             'ext': 'GenStudio Photoshop from Adobe Exchange, in Photoshop 25.6.0 or later',
             'ext_evidence': [ev(EL_GSPM, Q['V35']), ev(EL_GSPM_PS, Q['V47']), ev(EL_GSPM_PS, Q['V46'])],
             'scope': 'Take the agreed Figma frames out of sections, convert them with the plugin to Photoshop documents for use with GenStudio Photoshop, open them in Photoshop, and rebuild with the designer what the conversion does not carry over, such as gradients, opacity percentages, strikethrough, superscript and subscript.',
             'evidence': Q['V36'],
             'source': src(EL_GSPM, T_GSPM)},
        ],
        'client': {'how': "Your designers keep building ad templates in Figma. Adobe's Firefly Enterprise and GenStudio plugin generates on-brand ad variations in those templates from your brands, personas and products, translates them, and sends them to GenStudio for Performance Marketing as experiences.",
                   'gain': 'Your designers produce on-brand variations and translations of your ads in the tool they already use, and the results reach GenStudio for Performance Marketing as experiences.'},
    },
    {
        'id': 'figma-express', 'a': 'figma', 'b': 'express',
        'how': "The Figma add-on in Adobe Express connects the user's Figma account and imports a page, frame or layer from a Figma file, as editable Express elements (Native Import) or a flattened image (Rasterize). Gradients, patterns and certain masked or combined shapes can come in as images, and a font Express lacks gets a fallback. The add-on does not change the Figma file.",
        'how_evidence': [ev(HX_EXPRESS, Q['V55']), ev(HX_EXPRESS, Q['V63']), ev(HX_EXPRESS, Q['V64']), ev(HX_EXPRESS, Q['V50']),
                         ev(HX_EXPRESS, Q['V56']), ev(HX_EXPRESS, Q['V59']), ev(HX_EXPRESS, Q['V58']), ev(HX_EXPRESS, Q['V60'])],
        'source': src(HX_EXPRESS, T_EXPRESS),
        'source_quote': Q['V51'],
        'gain': {'title': 'Figma work reused in Express',
                 'text': "Frames your client's designers make in Figma come into Adobe Express as editable Express elements, so the team can keep editing them in Express."},
        'gain_evidence': [ev(HX_EXPRESS, Q['V50']), ev(HX_EXPRESS, Q['V62'])],
        'flows': [
            {'from': 'figma', 'to': 'express', 'what': 'Figma pages, frames or layers, imported as editable Express elements with Native Import or as a flattened image with Rasterize', 'source': src(HX_EXPRESS, T_EXPRESS)},
        ],
        'kind': 'outside', 'line': 'native',
        'label': 'The Figma add-on in Adobe Express imports Figma pages, frames or layers as editable Express elements or flattened images',
        'availability': '',
        'prereqs': [
            'Valid Adobe Express and Figma accounts, with access to each Figma file to import and to Add-ons in Adobe Express (the Figma add-on has no additional cost)',
            'Full or Dev Figma seats for unlimited use of the add-on (Collab and View seats have daily limits)',
            'Add-on access for the people who import: on enterprise plans it is managed through roles in the Admin Console, where a custom role can give access to specific Express add-ons',
        ],
        'prereq_sources': [ev(HX_EXPRESS, Q['V61']), ev(HX_EXPRESS, Q['V52']), ev(HX_ADDONS_ADMIN, Q['V67']), ev(HX_ADDONS_ADMIN, Q['V68']), ev(HX_ROLES, Q['V69'])],
        'references': [ref(HX_ADDONS_ADMIN, T_ADDONS_ADMIN, Q['V67']), ref(HX_ROLES, T_ROLES, Q['V69']), ref(HX_EXPRESS_RN, T_EXPRESS_RN, Q['V66'])],
        'lines': [
            {'id': 'XF05', 'name': 'Figma designs imported into Adobe Express', 'unit': 'one-time', 'low': 8, 'base': 16, 'high': 32, 'default': False,
             'scope': "Check that your client's Express users who import can use the Figma add-on (on enterprise plans through Admin Console roles), connect the Figma account of each person who imports, import the agreed frames with Native Import or Rasterize, fix the fonts the import summary marks Font Not Available and the shapes that came in as images, and hand the corrected designs over for templates.",
             'evidence': Q['V50'],
             'source': src(HX_EXPRESS, T_EXPRESS)},
        ],
        'client': {'how': "Your designers' Figma pages, frames and layers come into Adobe Express through the Figma add-on, either as editable Express elements or as flattened images. The add-on only reads the Figma file.",
                   'gain': "Your designers' Figma work comes into Adobe Express as editable elements your team keeps editing there."},
    },
    {
        'id': 'figma-fireflycm', 'a': 'figma', 'b': 'fireflycm',
        'how': "Adobe's Firefly Enterprise and GenStudio plugin for Figma, the same plugin as on Figma + GenStudio for Performance Marketing, has a Model menu in Text to image. There the designer picks a custom model they have created, generates images and places them on the Figma canvas.",
        'how_evidence': [ev(HX_FF_PLUGIN, Q['V78']), ev(EL_GSPM, Q['V39']), ev(HX_FF_GEN, Q['V76']), ev(HX_FF_GEN, Q['V71']), ev(HX_FF_GEN, Q['V77'])],
        'source': src(HX_FF_GEN, T_FF_GEN),
        'source_quote': Q['V71'],
        'gain': {'title': 'Custom models on the Figma canvas',
                 'text': "Inside Figma, your client's designers generate images in the style or subject of the custom models they have created. The same models also generate in Firefly, Adobe Express and Photoshop."},
        'gain_evidence': [ev(HX_FF_GEN, Q['V75']), ev(HX_FF_GEN, Q['V71']), ev(HX_CM, Q['V84']), ev(HX_CM, Q['V83'])],
        'flows': [
            {'from': 'fireflycm', 'to': 'figma', 'what': 'Custom models the designer has created, picked from the Model menu in Text to image, generating images the designer places on the Figma canvas', 'source': src(HX_FF_GEN, T_FF_GEN)},
        ],
        'kind': 'outside', 'line': 'native',
        'label': "Adobe's Firefly Enterprise and GenStudio plugin for Figma generates images with the custom models a designer has created",
        'availability': '',
        'prereqs': [
            "Firefly Custom Models on your client's plan: a Creative Cloud for enterprise plan needs them added to it",
            'The Firefly Enterprise and GenStudio plugin installed in Figma, in the Figma desktop app or Figma in the browser',
            'An active Adobe account with Firefly access for each designer, signed in inside the plugin',
            'Firefly custom models each designer has created',
            "On enterprise plans, each model published where the organization's workflow requires it before other apps can use it",
        ],
        'prereq_sources': [ev(HX_CM, Q['V85']), ev(HX_CM, Q['V86']), ev(HX_FF_GEN, Q['V72']), ev(HX_FF_GEN, Q['V73']), ev(HX_FF_GEN, Q['V74']),
                           ev(HX_FF_PLUGIN, Q['V81']), ev(HX_FF_GEN, Q['V71']), ev(HX_CM_TRAIN, Q['V90'])],
        'references': [ref(HX_FF_PLUGIN, T_FF_PLUGIN, Q['V78']), ref(HX_CM, T_CM, Q['V83']), ref(HX_CM_TRAIN, T_CM_TRAIN, Q['V90'])],
        'lines': [
            {'id': 'XF06', 'name': 'Custom models for Figma designers', 'unit': 'one-time', 'low': 8, 'base': 16, 'high': 24, 'default': False,
             'scope': "Check that each of your client's Figma designers has the plugin, Firefly access and the custom models they have created, then with each designer pick their models in Text to image, generate images and place them on the Figma canvas, and walk them through the prompt guide for each model.",
             'evidence': Q['V71'],
             'source': src(HX_FF_GEN, T_FF_GEN)},
        ],
        'client': {'how': "In Text to image in Adobe's Firefly Enterprise and GenStudio plugin for Figma, your designers pick a custom model they have created and place the generated images on the Figma canvas.",
                   'gain': 'Inside Figma, your designers generate images in the style or subject of the custom models they have created. The same models also generate in other Adobe apps.'},
    },
]
RESEARCH = {
    'about': ("Figma connections, read on Nov 16 and 17 2026 from public Adobe pages: Integrate AEM Assets with Figma and its Experience League "
              "support article, the Figma plugin for GenStudio for Performance Marketing and GenStudio Photoshop (Experience League), Import Figma "
              "designs into Adobe Express and Adobe's pages on Express add-on access (Adobe Help), and Adobe Firefly help on the Firefly Enterprise "
              "and GenStudio plugin for Figma and on custom models. Every quote was checked word for word against its page on Nov 17 2026, read "
              "with a plain fetch. Each connection keeps the quote on its source page and the references behind it. Hours are our own estimates; "
              "Adobe publishes none. The four lines are native, like Figma + Brand Intelligence and Adobe Asset Link: AEM Assets, GenStudio for "
              "Performance Marketing and Firefly Custom Models use Adobe's plugins in Figma (Adobe calls the AEM one the official connector, and the "
              "GenStudio and Firefly pages link the same Firefly Enterprise and GenStudio plugin in the Figma Community), and the Figma add-on in "
              "Express is documented in Adobe's Express help and release notes. No Adobe page read names who publishes the Figma add-on in Express."),
    'checked': '2026-11-17',
    'products': [],
    'connections': CONNECTIONS,
    'notes': [
        "Every service starts off (default false), as XK16 does, so a canvas saved before Nov 17 reopens with the same services and totals.",
        "XF01 is the connector for Figma designers: the folders they reach and the Figma side, tested end to end. DAM onboarding, users and access (AS01) sets up the Admin Console users, groups and product profiles for AEM Assets as a whole.",
        "XF02 decides where designs uploaded from Figma land and with which export settings. The folder hierarchy, tags and metadata forms are AS02; the save-back of Express designs is XJ03.",
        "XF03 builds and maps Figma ad files for the plugin. GS03 codes responsive HTML templates in GenStudio, XJ10 builds Express templates for GenStudio, and GS05 trains editors on GenStudio itself. Adobe's integrations page calls Express templates in GenStudio the recommended approach for ad templates, so this connection is for clients whose designers already work in Figma; the card says so with its first prerequisite and no hedge.",
        "XF04 converts Figma frames for GenStudio Photoshop, which needs Photoshop 25.6.0 or later and installs from Adobe Exchange (its Experience League page); that is XF04's own note, so the card's prerequisites do not repeat it. XJ12 brings Photoshop and Illustrator files into Express, the other direction and another app.",
        "XF05 brings Figma designs into Express, fixes what the import changes and hands the designs over for templates: shared templates with locked elements are EP03, and Express templates for GenStudio are XJ10.",
        "XF06 works with the custom models each designer has created, the route Adobe's Figma page documents: it checks the plugin and Firefly access, generates with each designer and walks them through Text to image. It does not train, publish or share models (FM02, FM03, FM05) or write the prompt guide (FM04), which XK09 (Express) and XK10 (Creative Cloud apps) repeat.",
        "Adobe's Express add-ons overview says add-ons allow connections to third-party tools, and its listing of the Figma add-on could not be opened; no Adobe page read names the Figma add-on's publisher.",
        "Adobe's Figma page says to choose a custom model you've created. Only the Firefly web page adds models shared with you, and the share page says a Generator generates in Creative Cloud apps, so the card and XF06 promise only the models a designer has created.",
        "GenStudio for Performance Marketing and Firefly Custom Models work through one plugin, listed in the Figma marketplace as Firefly Enterprise and GenStudio (Adobe's Firefly help and the GenStudio page both name it), so both cards use that name and a partner plans one install.",
        "Left out for lack of an Adobe page: Express designs into Figma, and Figma with Creative Cloud apps, Frame.io or Firefly Creative Production. Workfront Fusion's Figma modules, AEM's Figma to Visual Content Fragments skill and Brand Intelligence's BN06 are other routes, not built here.",
    ],
}

# ---------------------------------------------------------------- 3. the client's version and the supporting pages
CLIENT = {c['id']: {'how': c['client']['how'], 'gain': c['client']['gain'], 'note': ''} for c in CONNECTIONS}
REFS_SET = {c['id']: [{'url': r['url'], 'title': r['title']} for r in c['references'] if r['url'] not in (HX_EXPRESS_RN, EL_GSPM_INT, EL_GSPM_RN, EL_ASSETS)]
            for c in CONNECTIONS}

# ---------------------------------------------------------------- 6. the RFI write-ups
FACTS_ASSETS = [
    "AEM Assets as a Cloud Service is Adobe's cloud-native solution for digital asset management and Dynamic Media. It helps you maximize the value of your digital assets across creation, management and delivery.",
    "AEM Assets is the repository where your digital assets are managed, enriched and delivered.",
    "People find the right asset through smart tags, customized metadata and enhanced search. Metadata forms let you add your own business-specific fields to an asset's details page, and we would agree those fields with you before the assets are loaded.",
]
FACTS_GSPM = [
    "GenStudio for Performance Marketing is an application built on Adobe's generative AI platform. It lets your marketing teams create, manage and optimize campaign content for ads and email.",
    "GenStudio for Performance Marketing creates and optimizes the campaign content for ads and email.",
    "We would start with your brand guidelines, which the generative AI uses as guardrails that guide content generation, and with templates that contain approved features and are optimized for specific channels.",
]
FACTS_EXPRESS = [
    "Adobe Express is where your teams create and edit images and videos for social posts, flyers, logos and more, from shared templates whose style controls keep them on brand.",
    "Adobe Express lets your teams create content from shared templates that keep them on brand.",
    "Roles and permissions are managed through the Admin Console, so your Enterprise admins give every team member the right level of access. Capabilities such as creating or editing templates and publishing to social media can be disabled for members.",
]
FACTS_CM = [
    "Firefly Custom Models let you train Firefly generative models on your own images, so generated content reflects a specific visual style or subject. The models are private by default and designed for commercial use.",
    "Firefly Custom Models generate content in your own visual style or of your own subject.",
    "A system administrator entitles the people who train models. Models are private by default, and publishing and sharing are managed through Custom Model projects.",
    "Trained models can be used to generate content in supported Adobe apps, including Photoshop, Illustrator, Adobe Express, Firefly and GenStudio.",
]
LBY ={l['id']: (c, l) for c in CONNECTIONS for l in c['lines']}
OWNER = {'figma-aemassets': 'Figma + AEM Assets', 'figma-gspm': 'Figma + GenStudio for Performance Marketing', 'figma-express': 'Figma + Adobe Express',
         'figma-fireflycm': 'Figma + Firefly Custom Models'}
PAGE_FACTS = {
    'XF01': FACTS_ASSETS + [Q['V12'], Q['V07'], Q['V16'], Q['V02'], Q['V11']],
    'XF02': FACTS_ASSETS + [Q['V13'], Q['V06'], Q['V05'], Q['V07']],
    'XF03': FACTS_GSPM + [Q['V22'], Q['V28'], Q['V24'], Q['V25'], Q['V27'], Q['V32'], Q['V40'], Q['V41']],
    'XF04': FACTS_GSPM + [Q['V35'], Q['V37'], Q['V38'], Q['V46'], Q['V47']],
    'XF05': FACTS_EXPRESS + [Q['V61'], Q['V52'], Q['V56'], Q['V57'], Q['V58'], Q['V59'], Q['V67']],
    'XF06': FACTS_CM + [Q['V71'], Q['V76'], Q['V77'], Q['V72'], Q['V74']],
}
LICENSE = {lid: l['ext'] for lid, (c, l) in LBY.items() if l.get('ext')}


def kb_source(lid):
    c, l = LBY[lid]
    return {'id': lid, 'name': l['name'], 'owner': [OWNER[c['id']]], 'unit': l['unit'], 'hours': {'low': l['low'], 'base': l['base'], 'high': l['high']},
            'scope': l['scope'], 'adobe_quote': l['evidence'], 'license': LICENSE.get(lid, ''), 'source': {'title': l['source']['title'], 'url': l['source']['url']},
            'connection_how': [c['client']['how']], 'product_facts': PAGE_FACTS[lid]}


KB_ENTRIES = [
    {'id': 'XF01',
     'steps': ['Check that your AEM environment is on release 19149 or later, and agree with your DAM owner which AEM Assets folders your Figma designers reach.',
               'Give the designers access to those folders under the same company or federated Adobe ID they sign in with, and roll out the AEM Assets Connector from the Figma Community.',
               'Test search with Content Advisor, placing assets, Check for updates and upload with a designer from each team, and record the results.'],
     'deliverables': ['Folder access sheet for your Figma designers', 'AEM Assets Connector rolled out in Figma', 'Test record for search, place, update and upload'],
     'asks': ['The designers who need AEM Assets in Figma, and the folders each team should reach', 'An AEM Assets administrator to grant the folder permissions'],
     'risk': 'Designers who cannot sign in to the connector: we check that each one signs in to Figma with the same company or federated Adobe ID used for AEM Assets.',
     'outcome': 'Your designers search AEM Assets from a panel in Figma, place assets on the Figma canvas and upload their designs to the agreed folders.',
     'kind': 'task', 'phase': 'build'},
    {'id': 'XF02',
     'steps': ['Agree with your DAM owner which AEM Assets folders take the designs uploaded from Figma, and how the files are named.',
               'Set the file format for each use, PNG, PDF, JPG or SVG, with the scale for PNG and the scale and quality for JPG.',
               'Write the short guide your designers follow when they upload and when they run Check for updates, and walk them through one upload end to end.'],
     'deliverables': ['Agreed save-back folders for Figma designs', 'Export settings for each use', 'Designer upload guide'],
     'asks': ['A DAM owner to agree the folders, the file names and the export settings'],
     'risk': 'Designs uploaded to the wrong folder or at the wrong scale: we agree the folders and settings first and walk the designers through a real upload.',
     'outcome': 'Designs uploaded from Figma land in the agreed AEM Assets folders, named and exported the way each use needs.',
     'kind': 'task', 'phase': 'build'},
    {'id': 'XF03',
     'steps': ['Install the Firefly Enterprise and GenStudio plugin from the Figma community marketplace for your designers, and agree the Meta, LinkedIn and Display ads to build as templates.',
               'Set up each Figma ad file as a section holding frames at the sizes each channel accepts, and map the field roles, with at least one image.',
               'Generate test variations from a brand, persona and product in GenStudio for Performance Marketing, and translate them into the agreed languages.',
               "Export the test variations to GenStudio for Performance Marketing as experiences, fix any template that fails, and record each template's field roles."],
     'deliverables': ['Figma ad templates mapped for the plugin', 'Test variations exported as experiences', 'Template sheet of sizes and field roles'],
     'asks': ['The Figma ad files, with the channel and size each one is for', 'Your brands, personas and products set up in GenStudio for Performance Marketing'],
     'risk': "A template whose text or images are not replaced: we check the field roles, the image role and the fonts on each designer's machine before handover.",
     'outcome': 'Your designers generate on-brand Meta, LinkedIn and Display variations in their Figma templates and send them to GenStudio for Performance Marketing as experiences.',
     'kind': 'task', 'phase': 'build'},
    {'id': 'XF04',
     'steps': ['Agree with your designer which Figma frames move to Photoshop, and take them out of sections, which the conversion does not accept.',
               'Convert the frames with the plugin to Photoshop documents for use with GenStudio Photoshop, open them in Photoshop and check each layer against the Figma original.',
               'Rebuild with your designer what the conversion does not carry over, such as gradients, opacity percentages, strikethrough, superscript and subscript.'],
     'deliverables': ['Agreed list of frames to convert', 'Converted Photoshop documents', 'Rebuilt effects, checked by your designer'],
     'asks': ['A designer to choose the frames and approve each converted document'],
     'risk': 'Effects lost in the conversion, such as gradients or strikethrough: we check each document against its Figma frame and rebuild what is missing.',
     'outcome': 'Your agreed Figma frames are Photoshop documents ready for GenStudio Photoshop, checked and finished by your designer.',
     'kind': 'task', 'phase': 'build'},
    {'id': 'XF05',
     'steps': ['Check that your Adobe Express users who import can use the Figma add-on, and connect the Figma account of each person who imports.',
               'Import the agreed frames with Native Import, and rasterize individual elements where they must keep their appearance.',
               'Fix the fonts the import summary marks Font Not Available and the shapes that came in as images.',
               'Check each corrected design with your designer and hand it over for your Adobe Express templates.'],
     'deliverables': ['Figma add-on ready for your users', 'Imported and corrected designs', 'Import check for each design, signed off by your designer'],
     'asks': ['The Figma files and frames to bring into Adobe Express', 'A designer to agree which frames come in editable and which as images'],
     'risk': 'Fonts or effects that change on import: we read the import summary for each frame and fix fonts and shapes before the designs are handed over.',
     'outcome': "Your designers' Figma work opens in Adobe Express as editable designs, with fonts and shapes corrected and ready to become templates.",
     'kind': 'task', 'phase': 'build'},
    {'id': 'XF06',
     'steps': ['Check that each of your Figma designers has the Firefly Enterprise and GenStudio plugin, Firefly access and the custom models they have created.',
               'With each designer, pick their custom models in Text to image and generate images.',
               'Walk your designers through placing the generated images on the Figma canvas, with the prompt guide for each model.'],
     'deliverables': ['Plugin, access and model check for each designer', 'Test images generated with each model in Figma', 'Designer walkthrough'],
     'asks': ['The Figma designers in scope and the custom models each one has created'],
     'risk': "A designer who cannot generate with a model: we check the plugin sign-in, Firefly access and, on enterprise plans, the model's publishing before the walkthrough.",
     'outcome': 'Your designers generate images in Figma with the custom models they have created, in the style or subject each model was trained on.',
     'kind': 'task', 'phase': 'launch'},
]
KB_PHRASES = {
    'XF01': ['AEM Assets inside Figma', 'connect Figma to our DAM', 'designers use DAM assets in Figma', 'AEM Assets Connector for Figma', 'Figma plugin for AEM Assets',
             'place DAM images in Figma designs', 'Figma access to brand assets', 'find assets without leaving Figma', 'newer asset versions in Figma files'],
    'XF02': ['save Figma designs to the DAM', 'export Figma designs to AEM Assets', 'folders for designs from Figma', 'export settings for Figma uploads',
             'file formats for designs saved from Figma', 'naming rules for uploaded designs', 'designer guide for uploading to AEM Assets', 'store finished Figma designs in the DAM'],
    'XF03': ['GenStudio plugin for Figma', 'generate ad variations in Figma', 'Figma ad templates for GenStudio', 'Meta and LinkedIn ads from Figma templates',
             'map Figma layers to ad fields', 'translate ads in Figma', 'export Figma ads to GenStudio', 'designers build ads in Figma'],
    'XF04': ['convert Figma frames to Photoshop', 'Figma to Photoshop conversion', 'Figma designs into GenStudio Photoshop', 'move Figma files to Photoshop',
             'rebuild effects after conversion', 'PSD files from Figma frames', 'Photoshop documents from Figma designs'],
    'XF05': ['import Figma designs into Adobe Express', 'Figma add-on for Adobe Express', 'Figma designs ready for Express templates', 'bring Figma frames into Express',
             'reuse Figma work in Express', 'editable Express designs from Figma', 'Figma to Express hand-off', 'fix fonts after a Figma import'],
    'XF06': ['custom models in Figma', 'Firefly custom models for Figma designers', 'brand-trained image generation in Figma', 'Firefly plugin for Figma',
             'generate on-brand images in Figma', 'designers generate with their own custom models', 'Text to image in Figma with custom models', 'brand style images on the Figma canvas'],
}


# ================================================================ the steps
def step_research():
    p = 'canvas/research/wave6_figma.json'
    # the research files canvas/build.py reads, other than this one (it skips connection_types, audit_classification, outside_systems)
    other = [f for f in glob.glob(path('canvas', 'research', '*.json')) if os.path.basename(f) != os.path.basename(p)
             and not os.path.basename(f).startswith(('connection_types', 'audit_classification', 'outside_systems'))
             and any(f'"{i}"' in open(f, encoding='utf-8').read() for i in LINES[:1] + IDS[:1])]
    if other:
        fail(p, f'another research file already holds the Figma connections: {other}')
    s = json.dumps(RESEARCH, indent=1, ensure_ascii=True) + '\n'
    if os.path.exists(path(p)) and read(p) == s:
        return done.append(p + ': already there')
    write(p, s)
    done.append(p + ': written')


def step_types():
    p = 'canvas/research/connection_types.json'
    d, fmt = jload(p)
    C = d['connections']
    for c in CONNECTIONS:
        entry = {'kind': c['kind'], 'line': c['line'], 'label': c['label'], 'availability': c['availability'], 'prereqs': list(c['prereqs']),
                 'evidence': [{'url': c['source']['url'], 'quote': c['source_quote']}] + [x for x in c['prereq_sources'] if x['quote'] != c['source_quote']]}
        C[c['id']] = entry
    jdump(p, d, fmt)
    done.append(p + ': ' + ', '.join(IDS))


def step_copy():
    p = 'product_copy_rules.json'
    d, fmt = jload(p)
    for cid in IDS:
        d['connection_client'][cid] = CLIENT[cid]
        o = d['connection_overrides'].setdefault(cid, {})
        o['references_set'] = REFS_SET[cid]
    jdump(p, d, fmt)
    done.append(p + ': connection_client and connection_overrides.references_set for ' + ', '.join(IDS))


def step_outside_more():
    """The statement of work keeps an outside system for a play only when OUTSIDE_MORE (or a template) allows it, both in the hand-off
    from the canvas and in a saved draft. Figma's services are research lines, not templates, so without this the statement of work
    drops Figma from the play: a draft saved there and opened in another browser comes back on Build without Figma, and the next
    save drops its services (XK16 on 6a96c44)."""
    p = 'index.html'
    s = read(p)
    m = re.search(r"const OUTSIDE_MORE=\{([^}]*)\};", s)
    if not m:
        fail(p, 'OUTSIDE_MORE not found')
    if re.search(r"(?:^|,)figma:\[", m.group(1)):
        return done.append(p + ': OUTSIDE_MORE already keeps figma')
    s = s[:m.end(1)] + ",figma:['custom']" + s[m.end(1):]
    write(p, s)
    done.append(p + ": OUTSIDE_MORE keeps figma on 'custom'")


TIED_JS = r"""// Nov 17 2026: designers work in Figma, so an RFI names it in passing ('our designers create in Figma', 'files in Box, Figma and
// Dropbox'). Figma counts as named only in a sentence that also names a product it connects to and ties the work to Figma: inside,
// into, from, to or with Figma, in Figma after anything but a word for where people work ('variants in Figma', not 'work in Figma'),
// a Figma plugin, canvas, template, design, frame or file, or a plugin for Figma; not as one of a list of tools ('Figma and
// Photoshop'). Its name stays evidence for the services about it (nameW in match)
const TIED={figma:/\b(?:inside|within|into|from|to|with)\s+(?:(?:the|their|our|your)\s+)?figma\b|(?<!\b(?:work|design|creat|liv|sit)\w*\s+)\bin\s+(?:(?:the|their|our|your)\s+)?figma\b|\bfigma(?:\s+(?!(?:for|and|or|to|in|on|with|of|at|by)\b)\w+)?\s+(?:plugins?|add-?ons?|connectors?|canvas|templates?|designs?|frames?|files?)\b|\b(?:plugins?|add-?ons?|connectors?)\s+(?:for|in)\s+figma\b/i};
function tied(id,raw,h,hits){   // h: a name hit of the outside system id in raw
  const at=h.a-1,stop=/[.?!](?=\s|$)|\n/g;let s=0,e=raw.length,m;
  while((m=stop.exec(raw))){if(m.index<at)s=m.index+1;else{e=m.index;break;}}
  const ends=new Set(C.filter(c=>(c.a===id||c.b===id)&&[...(c.lines||[]),...(c.more||[])].length).map(c=>c.a===id?c.b:c.a));
  const listed=/^\s*(?:,|and\b|or\b|&)\s*[A-Z]/.test(raw.slice(h.b-1,e))||/\w\s*,\s*$/.test(raw.slice(s,at));
  return !listed&&TIED[id].test(raw.slice(s,e))&&hits.some(x=>x.type==='name'&&!x.neg&&ends.has(x.pid)&&x.a-1>=s&&x.b-1<=e);
}
"""
DETECT_ANCHOR = "  if(!named.cja&&['aa','mmeasure','mmm','ca'].some(id=>named[id]))delete topics.cja;\n"
DETECT_JS = "  for(const id in TIED)if(named[id]&&!hits.some(h=>h.pid===id&&h.type==='name'&&!h.neg&&tied(id,String(text||''),h,hits)))delete named[id];   // Nov 17 2026: Figma in passing\n"
NAMEW_OLD = "nameW=nameWords(via==='rfp'?adobe:d.named.filter(id=>prods.includes(id)))"
NAMEW_NEW = "nameW=nameWords((via==='rfp'?adobe:d.named.filter(id=>prods.includes(id))).filter(id=>!TIED[id]))"


def step_names():
    """The RFI Builder names Figma, like the other outside systems' brand names (Snowflake, Salesforce), but only where a sentence
    ties it to a product it connects to: an RFI that mentions Figma in passing keeps the drafts it had before (6a96c44 never named
    Figma), and Figma's own name stays evidence for the services about it (AXD10, BN06, XK16 and the XF lines)."""
    p = 'rfp_answers.js'
    s = read(p)
    i = s.find('const NAMES={')
    if i < 0:
        fail(p, 'NAMES not found')
    j = s.find('};', i)
    if re.search(r"\n figma:\[", s[i:j]):
        done.append(p + ': NAMES already has figma')
    else:
        m = re.search(r"\n cms:\[[^\]]*\]", s[i:j])
        if not m:
            fail(p, 'the cms entry of NAMES was not found')
        at = i + m.end()
        s = s[:at] + ",\n figma:['figma']" + s[at:]
        done.append(p + ": NAMES names figma")
    if 'const TIED=' in s:
        done.append(p + ': the TIED rule is already there')
    else:
        for anchor, what in (('function detectAll(text,scope){\n', 'detectAll'), (DETECT_ANCHOR, "detectAll's step 69 line"), (NAMEW_OLD, "match's nameW")):
            if s.count(anchor) != 1:
                fail(p, f'{what} was not found once')
        s = s.replace('function detectAll(text,scope){\n', TIED_JS + 'function detectAll(text,scope){\n')
        s = s.replace(DETECT_ANCHOR, DETECT_ANCHOR + DETECT_JS)
        s = s.replace(NAMEW_OLD, NAMEW_NEW)
        done.append(p + ': Figma named only where a sentence ties it to a product it connects to (TIED), and its name kept as evidence')
    write(p, s)


TAG_OLD = '#out-menu .it2 .ctag{max-width:260px}\n'
TAG_NEW = ("/* Nov 17 2026: a tag that wraps keeps its words inside its corners (Figma's lists five products): round on one line, a rounded box on more */\n"
           '#out-menu .it2 .ctag{max-width:260px;border-radius:12px}\n')


def step_template():
    """The pill shape (border-radius 999px) cut the words of a tag on two or more lines in the Add outside system menu."""
    p = 'canvas/template.html'
    s = read(p)
    if TAG_NEW in s:
        return done.append(p + ': the Add outside system tags already keep their words inside their corners')
    if s.count(TAG_OLD) != 1:
        fail(p, "the Add outside system menu's tag rule was not found once")
    write(p, s.replace(TAG_OLD, TAG_NEW))
    done.append(p + ': a tag that wraps in the Add outside system menu keeps its words inside its corners')


def step_kb():
    kb = os.path.join('rfp_prototype', 'kb_method')
    nums = sorted(int(re.search(r'batch_(\d+)\.json$', f).group(1)) for f in glob.glob(path(kb, 'batches', 'batch_*.json')))
    mine = [n for n in nums if '"XF01"' in read(os.path.join(kb, 'batches', f'batch_{n:02d}.json'))]
    n = mine[0] if mine else nums[-1] + 1
    for f in glob.glob(path(kb, 'reviewed', 'batch_*.json')) + glob.glob(path(kb, 'phrases', 'claude_batch_*.json')):
        if f'batch_{n:02d}.json' not in f and '"XF01"' in open(f, encoding='utf-8').read():
            fail(f, 'already holds XF01 under another batch number')
    srcs = {'batch': f'{n:02d}', 'services': [kb_source(i) for i in LINES]}
    write(os.path.join(kb, 'batches', f'batch_{n:02d}.json'), json.dumps(srcs, indent=1, ensure_ascii=False) + '\n')
    write(os.path.join(kb, 'reviewed', f'batch_{n:02d}.json'), json.dumps(KB_ENTRIES, indent=1, ensure_ascii=True) + '\n')
    write(os.path.join(kb, 'phrases', f'claude_batch_{n:02d}.json'), json.dumps(KB_PHRASES, indent=1, ensure_ascii=True) + '\n')
    done.append(f'{kb}: batch {n:02d} (batches, reviewed, phrases) for ' + ', '.join(LINES))


# ---------------------------------------------------------------- 7. the checks
FIGMA_PHRASE = 'Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, with six optional services'
FIGMA_COMMENT = ('// Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models '
                 '(canvas/research/wave6_figma.json), four connections with six optional services, XF01 to XF06')


def bump(text, pattern, delta, what, p):
    m = re.search(pattern, text)
    if not m:
        fail(p, f'{what} not found')
    return text[:m.start(2)] + str(int(m.group(2)) + delta) + text[m.end(2):]


def catalog_statement(p):
    """The check that states the catalog's totals: its connections and services move by what this change adds."""
    s = read(p)
    if FIGMA_PHRASE in s:
        return done.append(p + ': counts already moved')
    i = s.find("'the catalog holds ")
    if i < 0:
        fail(p, "the 'the catalog holds' check was not found")
    k = s.rfind('ok(', 0, i)
    st = s.rfind('\n', 0, k) + 1
    end = s.find("',", i)
    stmt = s[st:end]
    stmt = bump(stmt, r'((?:cat\.conns|CAT\.connections)\.length === )(\d+)', CONN_DELTA, 'the connection count', p)
    stmt = bump(stmt, r'((?:cat\.lines|Object\.keys\((?:cat\.lines|L)\))\.length === )(\d+)', LINE_DELTA, 'the service count', p)
    m = re.search(r"(\d+) connections and (\d+) services \(", stmt)
    if not m:
        fail(p, 'the counts in the message were not found')
    stmt = (stmt[:m.start()] + f'{int(m.group(1)) + CONN_DELTA} connections and {int(m.group(2)) + LINE_DELTA} services ({FIGMA_PHRASE}; '
            + stmt[m.end():])
    indent = re.match(r'[ \t]*', s[st:]).group(0)
    s = s[:st] + indent + FIGMA_COMMENT + '\n' + stmt + s[end:]
    if p == 'test_step91.js':
        s = bump(s, r'(Object\.keys\(KB\.services\)\.length === )(\d+)', LINE_DELTA, 'the knowledge base count', p)
        s = bump(s, r"('the knowledge base covers all )(\d+)", LINE_DELTA, 'the knowledge base message', p)
    write(p, s)
    done.append(p + ': counts +4 connections, +6 services')


def step_counts():
    for p in ['test_step61.js', 'test_step62.js', 'test_step64.js', 'test_step66.js', 'test_step71.js', 'test_step85.js', 'test_step91.js']:
        catalog_statement(p)
    p = 'qa/check_product_copy.py'
    s = read(p)
    if 'Figma connects to AEM Assets' not in s:
        m = re.search(r"\nassert len\(templates\) == \d+ and len\(concepts\) == \d+ and len\(canvas\['connections'\]\) == \d+ and len\(canvas\['lines'\]\) == \d+", s)
        if not m:
            fail(p, 'the count assertion was not found')
        stmt = m.group(0)
        stmt = bump(stmt, r"(len\(concepts\) == )(\d+)", LINE_DELTA, 'the service definition count', p)
        stmt = bump(stmt, r"(len\(canvas\['connections'\]\) == )(\d+)", CONN_DELTA, 'the connection count', p)
        stmt = bump(stmt, r"(len\(canvas\['lines'\]\) == )(\d+)", LINE_DELTA, 'the canvas service count', p)
        note = ('\n# Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models: four '
                'connections, and six\n# service definitions and canvas services (XF01 to XF06)')
        s = s[:m.start()] + note + stmt + s[m.end():]
        write(p, s)
        done.append(p + ': counts +4 connections, +6 services and service definitions')
    else:
        done.append(p + ': counts already moved')


def step_filters():
    # step 62 counts its own six products' connections; Figma + GenStudio for Performance Marketing came later
    p = 'test_step62.js'
    s = read(p)
    if "c.id !== 'figma-gspm'" not in s:
        m = re.search(r"(theirs = cat\.conns\.filter\(c => \(six\.includes\(c\.a\) \|\| six\.includes\(c\.b\)\)[^\n]*?)(\)\.map\(c => c\.id\);)", s)
        if not m:
            fail(p, "the six products' connection filter was not found")
        s = s[:m.end(1)] + " && c.id !== 'figma-gspm'" + s[m.end(1):]
        line_start = s.rfind('\n', 0, s.rfind('const six = Object.keys(SIX)', 0, m.start())) + 1
        indent = re.match(r'[ \t]*', s[line_start:]).group(0)
        s = s[:line_start] + indent + '// Nov 17 2026: Figma + GenStudio for Performance Marketing (figma-gspm) came later, with the other Figma connections\n' + s[line_start:]
        write(p, s)
        done.append(p + ': figma-gspm left out of the step 62 connection count')
    else:
        done.append(p + ': figma-gspm already left out')
    # step 64 leaves the later connections of its seven products out of its count, as it does Figma + Brand Intelligence
    p = 'test_step64.js'
    s = read(p)
    if "'figma-express'" not in s:
        m = re.search(r"(\[[^\]\n]*'figma-brandintel'[^\]\n]*)\]", s)
        if not m:
            fail(p, "the list of later connections with 'figma-brandintel' was not found")
        s = s[:m.end(1)] + ", 'figma-express', 'figma-fireflycm'" + s[m.end(1):]
        write(p, s)
        done.append(p + ': figma-express and figma-fireflycm left out of the step 64 connection count')
    else:
        done.append(p + ': figma-express and figma-fireflycm already left out')


CANVAS_CHECKS = r"""
  // Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models through the plugins
  // and the add-on Adobe documents (canvas/research/wave6_figma.json): native lines, Adobe's pages as links only, six services that start off
  { const FIG = {'figma-aemassets': ['aemassets', {XF01: [8, 16, 32], XF02: [8, 16, 32]}], 'figma-gspm': ['gspm', {XF03: [16, 32, 56], XF04: [8, 16, 32]}],
      'figma-express': ['express', {XF05: [8, 16, 32]}], 'figma-fireflycm': ['fireflycm', {XF06: [8, 16, 24]}]};
    const ADOBE_PAGE = /^https:\/\/(?:experienceleague|helpx)\.adobe\.com\//;
    const fc = Object.keys(FIG).map(id => CAT.connections.find(c => c.id === id) || {id, prereqs: [], flows: [], lines: [], more: []});
    ok(fc.every(c => c.a === 'figma' && c.b === FIG[c.id][0] && c.kind === 'outside' && c.line === 'native' && c.label && c.how && c.availability === '' && c.prereqs.length >= 3 &&
        c.gain && c.gain.title && c.gain.text && c.sowHow && c.sowGain && ADOBE_PAGE.test((c.source || {}).url) && c.flows.length && c.flows.every(f => ADOBE_PAGE.test(f.source.url)) &&
        (c.references || []).length && c.references.every(r => ADOBE_PAGE.test(r.url) && r.title) && !c.lines.length && c.more.join() === Object.keys(FIG[c.id][1]).join()),
      'Nov 17: Figma connects natively to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, each with how it works, what you get together, its prerequisites, Adobe pages and services that start off',
      JSON.stringify(fc.map(c => [c.id, c.kind, c.line, c.lines, c.more])));
    const xf = Object.values(FIG).flatMap(([, h]) => Object.entries(h));
    ok(xf.every(([id, h]) => { const l = CAT.lines[id]; return !!l && l.origin === 'research' && l.unit === 'one-time' && !!l.scope && ADOBE_PAGE.test(l.url) && [l.low, l.base, l.high].join() === h.join(); }) &&
        CAT.lines.XF04.ext === 'GenStudio Photoshop from Adobe Exchange, in Photoshop 25.6.0 or later',
      'Nov 17: XF01 to XF06 carry their scope, Adobe page and hours, and the Photoshop conversion says it also needs GenStudio Photoshop',
      xf.map(([id]) => id + ' ' + (CAT.lines[id] ? [CAT.lines[id].low, CAT.lines[id].base, CAT.lines[id].high].join('/') : 'missing')).join(', '));
    const shown = fc.flatMap(c => [c.label, c.how, ...c.prereqs, c.gain && c.gain.title, c.gain && c.gain.text, ...c.flows.map(f => f.what)])
      .concat(xf.flatMap(([id]) => [(CAT.lines[id] || {}).name, (CAT.lines[id] || {}).scope, (CAT.lines[id] || {}).ext].filter(x => x !== undefined)));
    const hedge = t => typeof t !== 'string' || /confirm|not stated|\bbeta\b|limited availability|coming soon|recommended approach|account (?:team|manager)|in writing|\bthe client\b|\bclients\b/i.test(t) || /\b[Yy]our\b(?! client)/.test(t);
    ok(!shown.some(hedge), 'Nov 17: the Figma cards and services ask nothing of Adobe, carry no availability caveat and speak to the partner about "your client"', shown.find(hedge));
    // Adobe's Figma page documents custom models the designer has created, not models shared with them; one plugin carries one name;
    // each card says how it works in three sentences at most; GenStudio Photoshop is XF04's own note, not a prerequisite of the card
    const cm = fc[3], said = c => [c.label, c.how, ...c.prereqs, c.gain && c.gain.text, ...c.flows.map(f => f.what), c.sowHow, c.sowGain].join(' ');
    ok(/created/.test(cm.how) && /created/.test(cm.label) && !/\bshar|Generator/i.test(said(cm) + ' ' + (CAT.lines.XF06 || {}).scope) && [fc[1], cm].every(c => /Firefly Enterprise and GenStudio plugin/.test(c.label)) &&
        fc.every(c => c.how.split(/(?<=\.)\s+/).length <= 3) && !fc[1].prereqs.some(x => /Photoshop/.test(x)),
      'Nov 17: Figma + Firefly Custom Models promises only the custom models a designer has created, both plugin cards name the Firefly Enterprise and GenStudio plugin, each card says how it works in three sentences at most, and GenStudio Photoshop stays the conversion service\'s own note',
      JSON.stringify([cm.label, fc.map(c => c.how.split(/(?<=\.)\s+/).length), fc[1].prereqs.filter(x => /Photoshop/.test(x))]));
    // on Create your own play: Figma beside the four products, its four lines, and the total unchanged until a service is chosen
    const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of ['aemassets', 'gspm', 'express', 'fireflycm']) await addP(q, id);
    await outside(q); const t0 = await read(q);
    await q.click('#out-btn'); await q.waitForTimeout(200);
    const tag = await q.$eval('#out-menu [data-out="figma"] .ctag', e => ({t: e.textContent, r: getComputedStyle(e).borderTopLeftRadius, h: Math.round(e.getBoundingClientRect().height)})).catch(() => ({t: 'no Figma item'}));
    ok(tag.t === 'Connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models' && tag.r === '12px' && tag.h > 30,
      'Nov 17: Add outside system offers Figma for the four products on the canvas, and its tag, on several lines, keeps its words inside its rounded corners', JSON.stringify(tag));
    await q.click('#out-menu [data-out="figma"]'); await q.waitForTimeout(500); await away(q);
    const drawn = await edges(q), t1 = await read(q);
    ok(Object.keys(FIG).every(id => drawn.includes(id)) && t1.big === t0.big && t1.sub === t0.sub, 'Nov 17: adding Figma draws its four lines, and the total stays as it was: every Figma service starts off',
      drawn.join(',') + ' ' + t0.big + ' then ' + t1.big);
    ok(await layoutClean(q), 'Nov 17: and the canvas stays clean, with no box on another and every i clear of the boxes');
    await q.click('.ib[data-c="figma-aemassets"]'); await q.waitForTimeout(400);
    const card = await q.$eval('#card', c => ({text: c.innerText, rows: [...c.querySelectorAll('.ln')].map(r => r.dataset.l), links: [...c.querySelectorAll('a')].map(a => a.href)}));
    ok(card.text.includes('Figma + AEM Assets') && /Outside system/i.test(card.text) && /Before it works/i.test(card.text) && /What you get together/i.test(card.text) && /How it connects/i.test(card.text) &&
        card.rows.join() === 'XF01,XF02' && card.links.length > 0 && card.links.every(h => ADOBE_PAGE.test(h)),
      'Nov 17: the Figma + AEM Assets card says how they connect, what comes first and what you get, offers its two services and links only to Adobe pages', JSON.stringify(card).slice(0, 400));
    await q.click('#card [data-t="XF01"]'); await q.waitForTimeout(400);
    const t2 = await read(q), sum = s => Number(s.replace(/[^0-9.]/g, ''));
    ok(sum(t2.big) === sum(t0.big) + 16 * 150, 'Nov 17: choosing AEM Assets Connector rollout for Figma designers adds its 16 typical hours to the total', t0.big + ' then ' + t2.big);
    await q.context().close(); }
"""

STEP64_CHECKS = r"""
  // Nov 17 2026: a Figma service chosen on the canvas reaches the statement of work with its hours, its prerequisites and Adobe's page,
  // and the statement of work keeps Figma on the play (OUTSIDE_MORE in index.html), so a draft saved there brings both back on Build
  { const q = await own(['gspm']);
    await q.click('#out-btn'); await q.waitForTimeout(300); await q.click('#out-menu [data-out="figma"]'); await q.waitForTimeout(500); await closeAll(q);
    await q.fill('#rate', '150'); await q.waitForTimeout(150);
    await openCard(q, '.ib[data-c="figma-gspm"]'); await q.click('#card [data-t="XF03"]'); await q.waitForTimeout(400); await closeAll(q);
    await q.click('#save'); await q.waitForURL('**/sow/index.html#scope', {timeout: 60000}); await q.waitForTimeout(700);
    const xf3 = await q.evaluate(() => { const l = selectedLines().find(x => x.id.replace(/^CANVAS-/, '') === 'XF03'); return l ? {name: l.name, hours: l.hours, assumptions: String(l.assumptions || ''), refs: CapabilityReferences.forClient(l).map(r => r.url), outside: (state.outside || {}).custom || []} : null; });
    ok(!!xf3 && xf3.name === 'Figma ad templates prepared for the GenStudio plugin' && xf3.hours === 32 && xf3.outside.includes('figma') && /Prerequisites for Figma \+ GenStudio for Performance Marketing: /.test(xf3.assumptions) &&
        xf3.refs.includes('https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/integrations/figma-plugin') && !/confirm|not stated|recommended approach/i.test(xf3.assumptions) &&
        !/Photoshop 25\.6\.0/.test(xf3.assumptions),
      'Nov 17: Figma ad templates prepared for the GenStudio plugin, chosen on the canvas, reaches the statement of work with its 32 hours, its prerequisites (GenStudio Photoshop stays the conversion service\'s note) and Adobe\'s page, and Figma stays on the play', JSON.stringify(xf3));
    const [draft] = await Promise.all([q.waitForEvent('download'), q.click('#save-draft')]);
    const d = await fresh(); await d.goto(BASE + 'sow/'); await d.waitForTimeout(600);
    await d.setInputFiles('#draft-file', await draft.path()); await d.waitForTimeout(1000);
    await d.click('.steps [data-build]'); await d.waitForURL(u => !/\/sow\//.test(String(u))); await d.waitForTimeout(450);
    const back = await d.evaluate(() => ({out: st.out, on: counted('XF03')}));
    ok(back.out.includes('figma') && back.on, 'Nov 17: a draft saved there and opened in another browser brings Figma back on Build with that service on', JSON.stringify(back));
    await d.context().close(); await q.context().close(); }
"""


RFI_CHECKS = r"""
  // Nov 17 2026: the RFI Builder names Figma (NAMES in rfp_answers.js) where a sentence ties it to a product it connects to (TIED), so a
  // question that names Figma with AEM Assets, GenStudio for Performance Marketing or Adobe Express is answered from that Figma connection's own services
  const r4 = await h.text('1. Describe how our designers would use images from AEM Assets inside Figma and save their finished designs back to AEM Assets.\n' +
    '2. How would you set up Adobe GenStudio for Performance Marketing so our designers can generate ad variations in their Figma templates?\n' +
    '3. How would you bring our designers\' Figma designs into Adobe Express templates for the wider team?');
  const fg = r4.questions.map(q => ({conn: q.draft ? q.draft.conn : null, lines: q.draft ? q.draft.lines.map(x => x.id) : [], plain: q.draft ? q.draft.plain : ''}));
  ok(fg.length === 3 && fg[0].conn === 'figma+aemassets' && fg[0].lines.some(l => /^XF0[12]$/.test(l)) && fg[0].plain.includes('on the Figma canvas') &&
    fg[1].conn === 'figma+gspm' && fg[1].lines[0] === 'XF03' && fg[2].conn === 'figma+express' && fg[2].lines[0] === 'XF05' &&
    fg.every(x => !/your client|the partner/i.test(x.plain) && !LABELS.test(x.plain)),
    'Nov 17: a question that names Figma with AEM Assets, GenStudio for Performance Marketing or Adobe Express is answered from that Figma connection\'s own services',
    JSON.stringify(fg.map(x => [x.conn, x.lines.slice(0, 3)])));
  // ... and a question that mentions Figma in passing keeps the drafts it had before Figma connected to these products: the product's own
  // services, no Figma line, and no Figma box sent to Build
  const r5 = await h.text('1. Describe your approach to rolling out Adobe Express to our marketing teams. Our designers create the master layouts in Figma.\n' +
    '2. Describe how you would implement Adobe GenStudio for Performance Marketing for our paid social team. Our creative team builds the ads in Figma.\n' +
    '3. Describe how you would migrate our assets into AEM Assets from Box, Figma, Dropbox and shared drives.\n' +
    '4. Describe how you would set up Firefly Custom Models for our brand. Our designers work in Figma.\n' +
    '5. How would Coworker help our authors import Figma designs into AEM Sites?\n' +
    '6. Describe how you would set up Workfront for the creative team. We plan campaigns in Workfront and design in Figma.');
  const ps = r5.questions.map(q => ({conn: q.draft ? q.draft.conn || '' : '', products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : []}));
  const kept = [['EP01', 'EP02', 'EP03', 'EP04'], ['GS04', 'GS05'], ['AS02', 'AS03'], ['FM01', 'FM02', 'FM03'], ['AXD10'], ['WF01']];
  ok(ps.length === 6 && ps.every((x, i) => kept[i].every(l => x.lines.includes(l)) && !x.products.includes('figma') && !/figma/.test(x.conn) && !x.lines.some(l => /^XF/.test(l))),
    'Nov 17: a question that mentions Figma in passing (Express, GenStudio, an AEM Assets migration, Custom Models, Coworker\'s Figma import, Workfront) keeps the product\'s own services, with no Figma line or box',
    JSON.stringify(ps));
"""

def step_checks():
    p = 'canvas/test_canvas.js'
    s = read(p)
    if 'Figma connects natively to AEM Assets' not in s:
        s = bump(s, r'(OUTC\.length === )(\d+)', CONN_DELTA, 'the outside connection count', p)
        m = re.search(r'\((\d+) with Adobe Commerce \+ CRM and Brand Intelligence \+ Figma\)', s)
        if not m:
            fail(p, "the outside connections' message was not found")
        s = (s[:m.start()] + f"({int(m.group(1)) + CONN_DELTA} with Adobe Commerce + CRM, Brand Intelligence + Figma and Figma's four to AEM Assets, "
             'GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models)' + s[m.end():])
        old = "items.some(x => x.wait && /Connects to Brand Intelligence: add it first/.test(x.t))"
        if old not in s:
            fail(p, "the S44 check that Figma waits for Brand Intelligence was not found")
        s = s.replace(old, "items.some(x => x.wait && x.t === 'Connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express, Firefly Custom Models and Brand Intelligence: add one first')")
        s = s.replace('and Figma needs Brand Intelligence first', 'and Figma needs one of the five products it connects to first')
        anchor = "\n  ok(errs.length === 0, 'no script errors'"
        if s.count(anchor) != 1:
            fail(p, 'the closing no-script-errors check was not found once')
        s = s.replace(anchor, CANVAS_CHECKS.rstrip('\n') + anchor)
        write(p, s)
        done.append(p + ': outside connection count, the S44 Figma menu text, and the Figma checks')
    else:
        done.append(p + ': already has the Figma checks')
    p = 'test_step64.js'
    s = read(p)
    if 'Figma ad templates prepared for the GenStudio plugin, chosen on the canvas' not in s:
        i = s.find('await openRfi(')
        if i < 0:
            fail(p, 'the RFI Builder section was not found')
        line_start = s.rfind('\n', 0, i)
        while True:   # above the comment lines that open the RFI Builder section, at the end of the statement of work section
            prev = s.rfind('\n', 0, line_start)
            if not s[prev + 1:line_start].lstrip().startswith('//'):
                break
            line_start = prev
        s = s[:line_start] + STEP64_CHECKS.rstrip('\n') + s[line_start:]
        write(p, s)
        done.append(p + ': the Figma statement of work check')
    else:
        done.append(p + ': already has the Figma statement of work check')
    s = read(p)
    if "answered from that Figma connection's own services" not in s.replace("\\'", "'"):
        anchor = "\n  ok(!h.errors.length, 'no page errors in the RFI Builder'"
        if s.count(anchor) != 1:
            fail(p, "the RFI Builder's no-page-errors check was not found once")
        s = s.replace(anchor, RFI_CHECKS.rstrip('\n') + anchor)
        write(p, s)
        done.append(p + ': the Figma RFI Builder check')
    else:
        done.append(p + ': already has the Figma RFI Builder check')


# ---------------------------------------------------------------- 8. the builds, 9. the README
def step_build():
    # twice: canvas/build.py prints the knowledge base's counts under the canvas from sow/rfp_method.json, which build_site.py
    # writes after it, so the second pass carries the new write-ups' counts into canvas/index.html and site/index.html
    for cmd in (['canvas/build.py'], ['build_site.py'], ['canvas/build.py'], ['build_site.py']):
        r = subprocess.run([sys.executable] + cmd, cwd=ROOT, capture_output=True, text=True)
        if r.returncode:
            sys.exit(f'apply_figma: python3 {cmd[0]} failed:\n{r.stdout[-3000:]}\n{r.stderr[-3000:]}')
        tail = [x for x in r.stdout.splitlines() if x.startswith(('built:', 'ALL METHOD', 'step 49'))]
        done.append(f'python3 {cmd[0]}: ' + ' | '.join(tail))


README_TITLE = '## Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models (November 17, 2026)'


def readme_section(n_conn, n_lines, batch):
    return f"""{README_TITLE}

Figma, the outside system added for Brand Intelligence on November 16, connects to four more products, each through a plugin or add-on Adobe documents, drawn as native lines like Figma + Brand Intelligence and Adobe Asset Link: **AEM Assets** (Adobe's AEM Assets Connector places AEM Assets files on the Figma canvas and saves designs back), **GenStudio for Performance Marketing** (Adobe's Firefly Enterprise and GenStudio plugin generates on-brand ad variations in Figma templates and exports them to GenStudio for Performance Marketing; the card is for clients whose designers already work in Figma), **Adobe Express** (the Figma add-on in Express imports Figma pages, frames or layers) and **Firefly Custom Models** (the same plugin generates images with the custom models a designer has created, the route Adobe's Figma page documents; models shared with a designer are not on the card). Every quote behind the cards was checked word for word on Experience League and Adobe Help on November 17, and the cards show those pages as links only. Following the owner's November 12 rule (step 86), nothing on them asks the partner to confirm anything with Adobe. No Adobe page read names who publishes the Figma add-on in Express.

Six optional services start off, like XK16, so a canvas saved before them reopens with the same services and totals: XF01 AEM Assets Connector rollout for Figma designers and XF02 Save-back folders and export settings for Figma designs (8 / 16 / 32 hours each), XF03 Figma ad templates prepared for the GenStudio plugin (16 / 32 / 56), XF04 Figma frames converted for GenStudio Photoshop (8 / 16 / 32; it also needs GenStudio Photoshop from Adobe Exchange, in Photoshop 25.6.0 or later, which is the service's own note and not a prerequisite of the card), XF05 Figma designs imported into Adobe Express (8 / 16 / 32; it hands the corrected designs over, and shared templates with locked elements stay EP03) and XF06 Custom models for Figma designers (8 / 16 / 24). Each keeps its own deliverable beside the services it touches (AS01, AS02, XJ03, GS03, XJ10, EP03, FM02 to FM05, XK09, XK10); `canvas/research/wave6_figma.json` says how, with the quotes. The rest of the data is in `canvas/research/connection_types.json`, `product_copy_rules.json` (the client's version and the supporting pages) and the RFI write-ups in `rfp_prototype/kb_method` (batch {batch}). The statement of work keeps Figma on Create your own play (`OUTSIDE_MORE` in `index.html`), so a draft saved there and opened again brings Figma back with its chosen services (before, it came back without Figma, and the next save dropped XK16), and the RFI Builder names Figma only where a sentence ties it to a product it connects to, such as "AEM Assets inside Figma" (`NAMES` and `TIED` in `rfp_answers.js`): a question that mentions Figma in passing, such as "our designers work in Figma", keeps the product's own services. A tag that wraps in the Add outside system menu keeps its words inside its corners (`canvas/template.html`). The catalog is {n_conn} connections and {n_lines} services; the counts move in `qa/check_product_copy.py`, `canvas/test_canvas.js` and `test_step61`, `62`, `64`, `66`, `71`, `85` and `91`. `canvas/test_canvas.js` checks the four connections and Figma on a canvas, and `test_step64.js` checks that a Figma service reaches the statement of work and comes back from a saved draft, that the RFI Builder answers a question about Figma with a product from the Figma services, and that six questions that mention Figma in passing keep the product's own services.

"""


def step_readme():
    p = 'README.md'
    s = read(p)
    cat = json.load(open(path('canvas', 'catalog.json'), encoding='utf-8'))
    n_conn, n_lines = len(cat['connections']), len(cat['lines'])
    batch = re.search(r'batch_(\d+)\.json', next(f for f in glob.glob(path('rfp_prototype', 'kb_method', 'batches', 'batch_*.json'))
                                                 if '"XF01"' in open(f, encoding='utf-8').read())).group(1)
    section = readme_section(n_conn, n_lines, batch)
    if README_TITLE in s:
        i = s.index(README_TITLE)
        j = s.find('\n## ', i + len(README_TITLE))
        s = s[:i] + section + s[j + 1:]
    else:
        m = re.search(r'^## .*\((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d\)$', s, re.M)
        if not m:
            fail(p, 'no dated section to put this one above')
        s = s[:m.start()] + section + s[m.start():]
    write(p, s)
    done.append(p + f': section ({n_conn} connections, {n_lines} services, batch {batch})')


def main():
    for f in ('canvas/build.py', 'canvas/catalog_map.json', 'rfp_answers.js', 'index.html', 'README.md'):
        if not os.path.exists(path(f)):
            sys.exit(f'apply_figma: {ROOT} is not a checkout of the SOW tool ({f} is missing)')
    cmap = json.load(open(path('canvas', 'catalog_map.json'), encoding='utf-8'))
    if not any(p['id'] == 'figma' and p.get('outside') for p in cmap['products']):
        sys.exit('apply_figma: the checkout has no Figma outside system (commit 195de3d or later is needed)')
    step_research()
    step_types()
    step_copy()
    step_outside_more()
    step_names()
    step_template()
    step_kb()
    step_counts()
    step_filters()
    step_checks()
    if BUILD:
        step_build()
        step_readme()
    print('\n'.join(done))


if __name__ == '__main__':
    main()
