'use strict';
const ATLAS_SKILL_ROLES={
 'frontend-design':'화면의 색, 글씨, 간격과 구성을 정리합니다.',
 'ui-ux-pro-max':'모바일 배치, 버튼 크기와 접근성을 확인합니다.',
 'ux-writing':'버튼과 안내 문구를 짧고 분명하게 다듬습니다.',
 'gfield-textbook-design':'시험지의 글꼴, 다단, 도형과 인쇄 양식을 맞춥니다.',
 'evidence-gated-learning-pipeline':'문항·정답의 근거와 검수 결과를 연결합니다.',
 'pdf':'PDF를 만들고 다시 열어 페이지와 글꼴을 확인합니다.',
 'instructional-design':'학습 목표에 맞게 수업 활동과 평가를 구성합니다.',
 'source-to-memory':'원본과 인수인계에서 필요한 근거를 찾습니다.',
 'offers':'대상 학생, 수업 구성, 가격과 제공 범위를 정리합니다.',
 'copywriting':'소개글의 순서와 신청·문의 안내를 다듬습니다.',
 'documents':'문서의 제목, 표, 그림과 페이지를 편집합니다.',
 'presentations':'발표의 흐름과 슬라이드 구성을 정리합니다.',
 'gfield-skill-curator':'작업에 맞는 기존 스킬과 중복 여부를 확인합니다.'
};
let workflowTask=null;
let workflowChecks={};
try{workflowChecks=JSON.parse(localStorage.getItem('skill-atlas-workflow-checks-v1')||'{}');if(!workflowChecks||typeof workflowChecks!=='object'||Array.isArray(workflowChecks))workflowChecks={};}catch{}
function atlasPresenceLabel(name,device){const p=ATLAS_CURRENT.presence(name,device);return (device==='windows'?'Windows':'Mac')+(p.state==='observed'?' 파일 확인':' 미확인');}
function atlasCardStatus(s){const mac=ATLAS_CURRENT.presence(s.name,'mac'),v=ATLAS_CURRENT.validation(s.name);return `<span class="skill-status"><span class="device-pill ${mac.state==='observed'?'observed':''}">${esc(atlasPresenceLabel(s.name,'mac'))}</span><span class="device-pill">Windows 미확인</span><span class="device-pill ${v.state==='scoped'?'observed':''}">${v.state==='scoped'?'적용 검수 기록':'실행 검수 미확인'}</span></span>`;}
function atlasEvidence(s){const mac=ATLAS_CURRENT.presence(s.name,'mac'),v=ATLAS_CURRENT.validation(s.name);const copies=DATA.skills.filter(x=>x.name===s.name);return `<section class="current-evidence"><h3>기기와 실행 기록</h3><dl class="evidence-facts"><div><dt>Mac 같은 이름의 파일</dt><dd>${mac.state==='observed'?`${mac.files.length}개 경로 확인 · ${ATLAS_CURRENT.checkedAt}`:'확인한 경로에서 파일 연결 미확인'}</dd></div><div><dt>Windows 파일</dt><dd>미확인 · 이번에 기기 대조하지 않음</dd></div><div><dt>적용 검수</dt><dd>${v.date?esc(v.date)+' · ':''}${esc(v.scope)}${v.url?` <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">공개 기록 보기</a>`:''}</dd></div></dl>${mac.files.length?`<details class="file-evidence"><summary>확인한 Mac 파일·지문</summary><ul>${mac.files.map(f=>`<li><b>${esc(f.location)}</b><code>${esc(f.sha256)}</code><small>파일을 읽어 확인한 날짜 ${esc(f.checkedAt)}</small></li>`).join('')}</ul></details>`:''}<p class="evidence-caveat">현재 파일과 초기 목록 문서의 버전 일치는 별도 대조가 필요합니다. 파일 존재는 현재 에이전트의 활성화나 모든 작업의 성공을 보증하지 않습니다.</p>${atlasHistoricalEvidence(s.name)}${copies.length>1?`<button class="atlas-secondary" data-family="${esc(s.name)}">같은 이름의 사본 비교</button>`:''}</section>`;}
function openFamily(name){const copies=DATA.skills.filter(s=>s.name===name);if(copies.length<2)return;$('#dialog-body').innerHTML=`<span class="meta-label">같은 이름 · 서로 다른 문서</span><h2 id="dialog-title">${esc(name)} 사본 비교</h2><p>두 원본을 보존합니다. 이 지도에서 한 사본을 모든 작업의 기준으로 지정하지 않습니다.</p><div class="copy-comparison">${copies.map(s=>`<article><h3>${esc(s.versionNote||s.origin)}</h3><p class="path-text">${esc(s.displayPath)}</p><p>${s.lines}줄 · 근거 ${(s.evidence||[]).length}건</p><button class="atlas-secondary" data-skill="${esc(s.id)}">이 사본 근거 보기</button></article>`).join('')}</div><h3>작업에서 사본을 고르는 순서</h3><ol class="copy-policy">${ATLAS_CURRENT.duplicatePolicy.map(p=>`<li>${esc(p)}</li>`).join('')}</ol><p class="evidence-caveat">두 문서의 원래 경로·지문을 대조하기 전에는 같은 버전으로 간주하지 않습니다.</p>`;bindSkillButtons($('#dialog-body'));if(!$('#skill-dialog').open)$('#skill-dialog').showModal();document.body.classList.add('no-scroll');}
function renderWorkflow(id=''){
 workflowTask=ATLAS_CURRENT.tasks.find(t=>t.id===id)||null;
 $('#workflow-picker').hidden=Boolean(workflowTask);$('#workflow-plan').hidden=!workflowTask;
 $('#workflow-title').textContent=workflowTask?workflowTask.title:'지금 할 작업을 고르세요.';
 $('#workflow-intro').textContent=workflowTask?'필요한 스킬과 진행·검수 순서를 확인하세요.':'작업을 선택하면 필요한 스킬과 검수 순서를 보여드립니다.';
 $('#workflow-reset').hidden=!workflowTask;
 if(!workflowTask){$('#workflow-plan').replaceChildren();return;}
 const t=workflowTask;const checked=workflowChecks[t.id]||[];
 $('#workflow-plan').innerHTML=`<section class="workflow-skills" aria-labelledby="workflow-skills-title"><h2 id="workflow-skills-title">필요한 스킬</h2><div>${t.skills.map(name=>{const s=skillMatch(name);return `<article class="workflow-skill"><div><h3>${esc(name)}</h3><p>${esc(ATLAS_SKILL_ROLES[name]||'현재 기기의 제공 경로와 문서를 먼저 확인하세요.')}</p><span class="workflow-presence">${esc(atlasPresenceLabel(name,'mac'))} · Windows 미확인</span></div>${s?`<button class="atlas-secondary" data-skill="${esc(s.id)}" aria-label="${esc(name)} 스킬 근거 보기">근거 보기</button>`:''}</article>`;}).join('')}</div></section><div class="workflow-columns"><section aria-labelledby="workflow-steps-title"><h2 id="workflow-steps-title">진행 순서</h2><ol class="workflow-steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><section aria-labelledby="workflow-checks-title"><h2 id="workflow-checks-title">끝내기 전 확인</h2><div class="workflow-checks">${t.checks.map((s,i)=>`<label><input type="checkbox" data-workflow-check="${i}" ${checked.includes(i)?'checked':''}><span>${esc(s)}</span></label>`).join('')}</div><p class="evidence-caveat">선택 표시는 이 브라우저의 메모입니다. 실행 검수 기록은 별도로 확인합니다.</p></section></div><div class="workflow-actions"><button id="copy-workflow" class="atlas-primary">작업 지시문 복사</button><button id="save-workflow" class="atlas-secondary">지시문 파일 저장</button><button class="atlas-link" data-workflow-library>전체 스킬 목록</button></div><p id="workflow-copy-status" class="workflow-copy-status" role="status"></p><textarea id="workflow-copy-fallback" class="workflow-copy-fallback" aria-label="복사할 작업 지시문" readonly hidden></textarea>`;
 bindSkillButtons($('#workflow-plan'));
 $('#copy-workflow').addEventListener('click',async()=>{const text=ATLAS_CURRENT.prompt(t);try{if(!navigator.clipboard?.writeText)throw Error('clipboard_unavailable');await navigator.clipboard.writeText(text);$('#workflow-copy-status').textContent='작업 지시문을 복사했습니다.';}catch{$('#workflow-copy-fallback').hidden=false;$('#workflow-copy-fallback').value=text;$('#workflow-copy-fallback').focus();$('#workflow-copy-fallback').select();$('#workflow-copy-status').textContent='아래 지시문을 선택해 복사하세요.';}});
 $('#save-workflow').addEventListener('click',()=>saveText(`스킬지도-${t.id}-작업지시문.txt`,ATLAS_CURRENT.prompt(t)));
}
function initWorkflows(){
 $('#workflow-picker').innerHTML=ATLAS_CURRENT.tasks.map(t=>`<button class="task-choice" data-workflow="${t.id}"><strong>${esc(t.title)}</strong><span>${esc(t.summary)}</span></button>`).join('');
 $('#current-file-date').textContent=ATLAS_CURRENT.checkedAt;$('#current-mac-count').textContent=Object.keys(ATLAS_CURRENT.macFiles).length;
 $('#duplicate-note').innerHTML=`<div><h3>같은 이름의 사본</h3><p>source-to-memory의 두 문서는 내용이 다릅니다. 작업 지침이 지정한 경로부터 확인하세요.</p></div><button class="atlas-secondary" data-family="source-to-memory">사본 비교·선택 기준</button>`;
 document.addEventListener('click',e=>{const task=e.target.closest('[data-workflow]');if(task)showView('workflows/'+task.dataset.workflow);const family=e.target.closest('[data-family]');if(family)openFamily(family.dataset.family);if(e.target.closest('[data-workflow-reset]'))showView('workflows');if(e.target.closest('[data-workflow-library]'))showView('library');});
 $('#workflow-plan').addEventListener('change',e=>{const input=e.target.closest('[data-workflow-check]');if(!input||!workflowTask)return;workflowChecks[workflowTask.id]=[...$('#workflow-plan').querySelectorAll('[data-workflow-check]:checked')].map(x=>Number(x.dataset.workflowCheck));try{localStorage.setItem('skill-atlas-workflow-checks-v1',JSON.stringify(workflowChecks));}catch{}});
 $('#device-filter').addEventListener('change',renderLibrary);$('#validation-filter').addEventListener('change',renderLibrary);
}
