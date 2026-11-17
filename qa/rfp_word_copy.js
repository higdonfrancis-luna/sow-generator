// Check the client copy in the same paragraph and table blocks read from the downloaded Word package.
function wordCopyIssues(doc) {
  const text = doc.blocks.flatMap(block => block.rows ? block.rows.flat() : [block.text]).join('\n');
  const voice = text.replace(/Client ID|Client Secret/g, '');
  return {
    clientVoice: voice.match(/your client|the Client\b/)?.[0] || null,
    partnerNote: text.match(/Notes for you|Ask your client|Adobe licenses this proposal|Confirm with Adobe|Ask Adobe|Good to know|Assumptions behind|Internal\./)?.[0] || null,
    internalStatus: text.match(/Drafted by the partner|not yet reviewed|Skipped by the partner|No catalog match/)?.[0] || null
  };
}

module.exports = {wordCopyIssues};
