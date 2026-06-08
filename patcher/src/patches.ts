import { createHash } from "node:crypto";

export type PatchRule = {
  id: string;
  description: string;
  find: string;     // RegExp source (no surrounding slashes)
  flags: string;    // RegExp flags (must include "g" for replace-all semantics)
  replace: string;
  minMatches: number;
};

// Rules applied IN ORDER to the original bundle. Each rule is a regex find/replace.
// Tightly anchor your patterns — see `.claude/gotchas.md`.
export const RULES: ReadonlyArray<PatchRule> = [
  {
    id: "is-subscribed",
    description: "Force isSubscribed getter to return true",
    // \bget isSubscribed(){<body without '}'>} — observed bodies are simple
    // `return(0,r(_d[N]).getEffectiveIsSubscribed)()`.
    find: "\\bget isSubscribed\\(\\)\\{[^}]*\\}",
    flags: "g",
    replace: "get isSubscribed(){return true}",
    minMatches: 1
  },
  {
    id: "followup-revive",
    description:
      "Revive Gizmo's dead followup hooks: bind the discarded useMemo (followup array) and useCallback (ask-followup handler) to __fq / __fqAsk so the render rule can consume them. Matches both explain components (large + small screen).",
    find:
      "(\\(0,r\\(d\\[6\\]\\)\\.useMemo\\)\\(\\(\\)=>\\{const e=\\[\\.\\.\\.\\w+\\]\\.reverse\\(\\)\\.find\\(e=>'assistant'===e\\.role\\);return e\\?\\(0,r\\(d\\[15\\]\\)\\.extractFollowupQuestions\\)\\(e\\):\\[\\]\\},\\[\\w+\\]\\)),(\\(0,r\\(d\\[6\\]\\)\\.useCallback\\)\\(e=>\\{\\w+\\(\\{message:\\{role:'user',parts:\\[\\{type:'text',text:e\\}\\]\\}\\}\\)\\},\\[\\w+\\]\\));",
    flags: "g",
    replace: "const __fq=$1,__fqAsk=$2;",
    minMatches: 2
  },
  {
    id: "followup-render",
    description:
      "Render Gizmo's SuggestedQuestions pill list in the orphaned null slot beside the ELI5 button (last assistant message, status ready), wired to __fq/__fqAsk from followup-revive. Reuses Gizmo's own SuggestedQuestions component (r(d[15])). Matches both explain components.",
    find:
      "(text:\\w+\\(r\\(d\\[19\\]\\)\\.ELI5_AI_MESSAGE\\)\\}\\]\\}\\}\\)\\}\\}\\)),null\\]",
    flags: "g",
    replace:
      "$1,(0,r(d[8]).jsx)(r(d[15]).SuggestedQuestions,{questions:__fq,onSelectQuestion:__fqAsk,className:\"mx-auto max-w-screen-md w-full mt-2\"})]",
    minMatches: 2
  },
  {
    id: "followup-render-chat",
    description:
      "Render the SuggestedQuestions pill list in the INLINE understand-card chat (ChatMessage.tsx / EngagementOptions). The explain.tsx rules above target a different view; this is the one users actually see on the quiz card. We wrap the active-message EngagementOptions render in a Fragment and append SuggestedQuestions, computing followups from the message (n) and wiring onSelectQuestion to the local sendMessage (l) with the exact transport shape the ELI5/MoreDetail buttons use in this module (r(d[20]).TUTOR_ROLE_IDS, section_type CUSTOM_USER_QUESTION). The chat module that exports SuggestedQuestions/extractFollowupQuestions is NOT in this module's dependency array, so it is required by its global Metro id (5667) — exactly what r(d[15]) resolves to in explain.tsx. deleteMessagesAfterThisId:n.id is a no-op here because the pills only render on the active (last) message. Captures: $3=jsx-runtime dep, $4=message var, $5=sendMessage var; $2=original EngagementOptions render preserved verbatim.",
    find:
      "(message_still_generating&&)(\\(0,r\\((d\\[\\d+\\])\\)\\.jsx\\)\\(\\w+,\\{message:(\\w+),sendMessage:(\\w+)\\}\\))",
    flags: "g",
    replace:
      "$1(0,r($3).jsxs)(r($3).Fragment,{children:[$2,(0,r($3).jsx)(r(5667).SuggestedQuestions,{questions:(0,r(5667).extractFollowupQuestions)($4),onSelectQuestion:q=>$5({message:{role_id:r(d[20]).TUTOR_ROLE_IDS.user,message:q,json_input:null,section_type:'CUSTOM_USER_QUESTION'},deleteMessagesAfterThisId:$4.id}),className:\"px-4 mt-2\"})]})",
    minMatches: 1
  }
];

export type ApplyRulesOutcome = {
  output: string;
  perRuleCounts: Record<string, number>;
};

export const applyRules = (
  source: string,
  rules: ReadonlyArray<PatchRule>
): ApplyRulesOutcome => {
  const perRuleCounts: Record<string, number> = {};
  let output = source;
  for (const rule of rules) {
    // Count on the current output BEFORE replacing. A fresh regex avoids
    // shared lastIndex state between the count and replace passes.
    const matches = output.match(new RegExp(rule.find, rule.flags));
    perRuleCounts[rule.id] = matches ? matches.length : 0;
    // Native string replacement expands $1, $2, $$, $& in rule.replace.
    // (A future rule needing a literal "$" must escape it as "$$".)
    output = output.replace(new RegExp(rule.find, rule.flags), rule.replace);
  }
  return { output, perRuleCounts };
};

export const hashRules = (rules: ReadonlyArray<PatchRule>): string => {
  const canonical = JSON.stringify(rules);
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
};
