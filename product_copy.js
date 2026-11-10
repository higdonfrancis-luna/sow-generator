/* Release labels and feature-release dates do not belong in customer scope. */
(function(root){
 const rules=/*COPY_RULES*/null;
 const patterns=rules.patterns.map(([pattern,replacement])=>[new RegExp(pattern,'gi'),replacement]);
 /* step 62: a page asks for the same sentence many times while it opens (once a service, a band, a saved row), and every
    ask ran every rule; the answer for a sentence never changes, so it is kept. A big canvas opened in 37 seconds, now under 2. */
 const seen=new Map();
 function scrub(value){
  if(typeof value!=='string'||/^https?:\/\//.test(value))return value;
  const kept=seen.get(value);if(kept!==undefined)return kept;
  const asked=value;
  for(const [before,after] of rules.replacements)if(value.includes(before))value=value.split(before).join(after);
  for(const [pattern,replacement] of patterns)value=value.replace(pattern,replacement);
  if(seen.size>20000)seen.clear();
  seen.set(asked,value);
  return value;
 }
 function service(value){
  if(!value||typeof value!=='object')return value;
  for(const key of ['name','scope','deliverable','acceptance','assumptions','exclusions','basis','sourceTitle','sourceTitle2','estimateBasis'])if(typeof value[key]==='string')value[key]=scrub(value[key]);
  if(Array.isArray(value.references))for(const ref of value.references)if(ref&&typeof ref.title==='string')ref.title=scrub(ref.title);
  return value;
 }
 function state(value){
  for(const line of [...(value.custom||[]),...(value.canvas||[])])service(line);
  for(const rows of Object.values(value.estimates||{}))for(const row of Object.values(rows||{}))service(row);
  return value;
 }
 root.ProductCopy={scrub,service,state};
})(globalThis);
