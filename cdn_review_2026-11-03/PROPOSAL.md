# CDN services in the SOW tool: vetted for double counting (Nov 3 2026)

Adam asked (Nov 3): the CDN work is the smallest line, but a customer's own CDN gets complicated and contentious (partners struggle to get access), and nothing should be counted twice. A workflow of 4 agents vetted it: one mapped every CDN task to the services that claim it, one checked Adobe's Experience League pages, one wrote a proposal, and a skeptic re-checked the proposal against the catalog and Adobe. This file is the proposal with the skeptic's corrections applied. Nothing is built; it waits for Adam's yes.

## What Adobe says

1. **Adobe's managed CDN is one click.** On the AEM as a Cloud Service managed Fastly CDN, Optimize at Edge routing is a self-serve switch in Brand Visibility (Brands Management > CDN > Deploy optimizations to AI agents > Enable): "No further action is required on your end." ([managed CDN guide](https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn))
2. **Any other CDN is the customer's IT or CDN team.** "For customers using other CDN providers, your IT/CDN team needs to complete the required setup": routing rules, allowing the AdobeEdgeOptimize/1.0 user agent in robots.txt or bot-traffic rules, an optional fetcher key. Adobe never names partners. ([Optimize at Edge](https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge))
3. **Only the outer CDN counts.** "Routing must be configured at the outer CDN." A customer CDN in front of AEM loses the one-click path.
4. **Edge Delivery is not named.** The managed-CDN guide names only "AEM Cloud Service Managed CDN (Fastly)". Edge Delivery sites can sit on Adobe's managed CDN or on the customer's own CDN (Cloudflare, Akamai, Fastly, CloudFront; [aem.live BYO CDN](https://www.aem.live/docs/byo-cdn-setup)), so "Edge Delivery is on Adobe's Fastly" is not a given. Open question for Adobe (abv-at-edge@adobe.com).
5. **Every site needs CDN log forwarding registered**, or the Agentic Traffic dashboard stays blank. For a customer CDN it is two phases: a Brand Visibility admin registers it and gets the storage keys; someone with access to the CDN console creates the log job (an Akamai DataStream or a Fastly endpoint). Adobe gives no hours. ([log forwarding](https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview))
6. **For AEM as a Cloud Service, Adobe says its managed CDN "simplifies onboarding and CDN log forwarding"** but publishes no steps, and says nothing about Edge Delivery. Open question.

## What the tool counts today

- **No fixed play double counts CDN work in its starting scope.** Starting totals at $150, Typical: Brand Visibility $210,000, CJA $219,600, Commerce $222,000, AEM $484,800, FSI $300,000.
- **Doubles appear only with add-ons or on Create your own play:**
  - **Log forwarding:** Brand Visibility setup and baseline (L02, always on) says it gets log forwarding enabled and logs arriving; CDN log forwarding by the partner (OX1, when the CDN box is added) also registers the CDN and also accepts on "logs arriving".
  - **Edge routing on the AEM play:** Implement AEM Sites on Edge Delivery (A01) sets up the routing; the deployment pilot (L03), if added, claims to set it up again.
  - **Create your own play with Edge Delivery and AEM Sites both on:** A03 and SI04 both do the DNS and CDN cutover (SI04 is otherwise Adobe's AEM Cloud Service go-live checklist, which is real separate work); A01 and AXC01 both turn on managed-CDN routing (16 h); SO1 and AXC05 both allow the scanner's IP addresses (a few hours inside AXC05's 24).
- **The contentious work is not priced outside Commerce.** Routing on a customer's own CDN is a service only on Commerce (C07, CDN readiness and routing, 56 h). On the AEM play it hides inside A01's 960 hours ("Adobe's managed CDN or the customer's own"); on Brand Visibility, CJA and FSI nothing prices it, though the deployment pilot depends on it.

## Proposed (text first; hours change only where a double is removed)

1. **One owner for log forwarding.** L02 registers it, agrees the date with the customer's CDN team and confirms the logs arrive. OX1 is only the hands-on job in the customer's CDN console, chosen only when the customer gives the partner access; its scope drops "register the CDN", and its acceptance becomes "the log job is active for each agreed domain".
2. **One owner for routing on the AEM play.** A01 owns turning on routing on Adobe's managed CDN, and also allows AdobeEdgeOptimize/1.0 (today no AEM-play line says it). L03 on the AEM play says routing is already on from A01. L03 keeps its self-serve clause on the other plays, where it is the only line for a customer on AEM Cloud Service.
3. **A customer's own CDN becomes a stated customer dependency** in Dependencies and risks on every play: the customer's IT or CDN team adds the routing rules, allows the user agent and creates the log job, as Adobe's guidance says; the partner prepares and checks them, and does them itself only when the customer grants access and the SOW includes a CDN service. A missed change window moves the pilot and the traffic baseline. A01 keeps building the customer's own CDN for Edge Delivery when there is one (that is site build work, not routing), and its size gets a CDN item.
4. **Optionally, offer CDN readiness and routing (C07) on the other plays** as an add-on, off by default, with per-play wording (today its text is all about a Commerce store). Starting totals don't change.
5. **Create your own play:** take the DNS and CDN cutover out of SI04's scope when A03 is on, and show A01/AXC01 and SO1/AXC05 as overlaps under the overlap review Adam chose on Nov 3 (every service counts, the SOW asks how they differ), rather than switching anything off.

## Open for Adobe

- Does one-click edge routing and simplified log forwarding apply to Edge Delivery sites on Adobe's managed CDN, or only to AEM as a Cloud Service? Until Adobe answers, the tool should not promise "one click" for Edge Delivery.
