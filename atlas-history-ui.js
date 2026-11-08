
const IMPECCABLE = {
 name:'Impeccable', status:'외부 스킬 · 미설치', checked:'2026.11.06',
 source:'https://github.com/pbakaus/impeccable/blob/c3bb418ee38ee49a6b999b7752c1368f3123a2bd/README.md',
 docs:'https://impeccable.style/docs',
 description:'웹·앱의 디자인과 사용성을 진단하고, 배치·글자·문구·반응형 화면을 다듬는 디자인 스킬입니다.',
 groups:[
  {title:'진단',commands:[['critique','디자인·사용성 평가'],['audit','접근성·반응형·성능 등 기술 품질 점검']]},
  {title:'화면 정리',commands:[['layout','배치·간격·리듬'],['typeset','글꼴·크기·정보 위계'],['clarify','버튼·안내 문구 개선'],['distill','불필요한 복잡함 덜기'],['colorize','목적에 맞는 색 추가']]},
  {title:'분위기·움직임',commands:[['bolder','더 선명하게 강조'],['quieter','과한 화면을 차분하게'],['animate','전환·상호작용 피드백'],['delight','작은 즐거움과 개성'],['overdrive','셰이더·물리·스크롤 효과 실험']]},
  {title:'완성도',commands:[['polish','정렬·여백·일관성 마무리'],['adapt','화면 크기·기기에 맞추기'],['harden','오류·번역·긴 글·예외 대응'],['optimize','로딩·렌더링 성능'],['onboard','첫 사용·빈 상태 안내']]},
  {title:'설계·디자인 관리',commands:[['init','제품 목적·사용자를 PRODUCT.md로 정리'],['shape','구현 전 UX 설계'],['document','기존 디자인 규칙을 DESIGN.md로 기록'],['extract','반복 패턴을 디자인 시스템으로 추출'],['live','실행 중인 로컬 화면에서 요소를 골라 시안 비교'],['generate','지정한 요소의 시안 생성'],['craft','일반 제작 요청의 폐기 예정 별칭']]}
 ]
};
function openImpeccable(){
 const commandCount=IMPECCABLE.groups.reduce((n,g)=>n+g.commands.length,0);
 document.querySelector('#dialog-body').innerHTML=`<span class="meta-label">${IMPECCABLE.status} · 공식 README 확인 ${IMPECCABLE.checked}</span><h2 id="dialog-title">Impeccable</h2><p>${IMPECCABLE.description}</p><p class="notice">지도에 분류만 추가했습니다. 설치·실행·프로젝트 적용은 하지 않았고, 기존 설치 스킬 집계에 더하지 않습니다.</p><h3>한 스킬 안의 ${commandCount}개 명령</h3><p>craft는 폐기 예정 별칭입니다. 아래 명령을 각각 설치된 스킬로 세지 않습니다.</p>${IMPECCABLE.groups.map(g=>`<h3>${esc(g.title)}</h3><ul class="impeccable-command-list">${g.commands.map(([name,desc])=>`<li><code>${esc(name)}</code> · ${esc(desc)}</li>`).join('')}</ul>`).join('')}<h3>지필드에서 먼저 쓸 순서</h3><p>critique → layout·clarify → adapt → polish. 첫 화면이나 버튼 묶음처럼 작은 범위를 지정합니다. 새 프로젝트는 init으로 목적·사용자를 먼저 정리합니다.</p><p class="impeccable-example">설치 후 Codex: $impeccable critique 사이언스 랩 첫 화면<br>설치 후 Claude Code: /impeccable critique 사이언스 랩 첫 화면</p><h3>우리 작업의 적용 기준</h3><p>기존 디자인 시스템, 한국어·정식 수학 용어·숫자·조건·채점·A4·필수 3D를 먼저 지킵니다. clarify로 문구를 다듬어도 학습 의미를 바꾸지 않습니다. 검사 보고서는 실제 기기·인쇄·교육 효과 검증을 대신하지 않습니다.</p><h3>도입 전 확인할 점</h3><p>원본은 자동 디자인 검사 hook과 엔진 다운로드를 지원합니다. 설치·hook 승인·추가 실행은 별도 확인이 필요합니다. live는 로컬 체크아웃용이며 운영 사이트에 주입하지 않습니다.</p><p>현재 README는 live의 문구 적용에서 채팅 연결이 없으면 승인·샌드박스를 끈 CLI로 넘길 수 있다고 안내합니다. 향후 사용 전 IMPECCABLE_LIVE_COPY_AGENT=chat 또는 off 설정과 실행 범위를 검토해야 합니다. 이번 작업에서는 어떤 설치나 live 실행도 하지 않았습니다.</p><h3>확인한 근거</h3><p>Paul Bakaus · Apache-2.0 · 2026.11.06 확인. 공식 README의 설명·24개 명령·Codex/Claude 호출 방식만 문서로 검토했으며 성능·보안·제품 효과를 실측하지 않았습니다.</p><p><a href="${IMPECCABLE.source}" target="_blank" rel="noopener noreferrer">확인한 원본 리비전 ↗</a> · <a href="${IMPECCABLE.docs}" target="_blank" rel="noopener noreferrer">공식 사용 안내 ↗</a></p>`;
 const dialog=document.querySelector('#skill-dialog');if(!dialog.open)dialog.showModal();document.body.classList.add('no-scroll');
}

function renderReferenceResults(){
 const section=$('#atlas-reference-results');if(!section)return;
 const q=$('#search').value.trim().toLowerCase(),cat=$('#category').value;
 const applicable=(cat==='all'||cat==='web')&&$('#device-filter').value==='all'&&$('#validation-filter').value==='all';
 const list=applicable?ATLAS_HISTORY.references.filter(r=>(r.name+' '+r.kind+' '+r.use+' 디자인 참고자료').toLowerCase().includes(q)):[];
 const external=applicable&&(IMPECCABLE.name+' '+IMPECCABLE.description+' 임페커블 '+IMPECCABLE.groups.flatMap(g=>g.commands.flat()).join(' ')).toLowerCase().includes(q);
 section.hidden=!list.length&&!external;
 section.innerHTML='<h2>외부 참고자료·미설치 스킬</h2><p>설치 문서 집계와 구분합니다. 아래 확인 범위는 이전 공개본에 남아 있던 당시 기록입니다.</p><div class="reference-grid">'+(external?'<button class="reference-card" data-impeccable><strong>Impeccable · 외부 스킬</strong><p>화면 진단과 디자인 명령24개</p><small>2026.11.06 README 검토 · 설치·실행 미확인</small></button>':'')+list.map(r=>'<a class="reference-card" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(r.name)+'</strong><p>'+esc(r.use)+'</p><small>2026.10.22 기록 · '+esc(r.scope)+'</small></a>').join('')+'</div>';
 section.querySelector('[data-impeccable]')?.addEventListener('click',openImpeccable);
}

function atlasHistoricalEvidence(name){
 const records=ATLAS_HISTORY.skillEvidence[name]||[];if(!records.length)return '';
 return '<details class="file-evidence"><summary>이전 공개본의 본문·설치 기록</summary><p class="evidence-caveat">9번 버전에 남아 있던 당시 기록입니다. 현재 파일 관측·활성화·실행 결과와 구분합니다.</p><ul>'+records.map(r=>'<li>'+esc(r.date||'2026-10-15')+' · '+esc(r.lines)+'줄'+(r.sha256?'<code>'+esc(r.sha256)+'</code>':'')+'<p>'+esc(r.note||r.checks||r.use||'기존 공개본 본문 확인 기록')+'</p></li>').join('')+'</ul><a class="atlas-link" href="./'+ATLAS_HISTORY.snapshotPath+'" target="_blank" rel="noopener noreferrer">당시 공개본 전체 보기</a></details>';
}
