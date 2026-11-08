/* Release labels and feature-release dates do not belong in customer scope. */
(function(root){
 const rules=/*COPY_RULES*/null;
 function scrub(value){
  if(typeof value!=='string'||/^https?:\/\//.test(value))return value;
  for(const [before,after] of rules.replacements)value=value.split(before).join(after);
  for(const [pattern,replacement] of rules.patterns)value=value.replace(new RegExp(pattern,'gi'),replacement);
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
