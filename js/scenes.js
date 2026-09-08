/* 나라별 장면 일러스트 (단색 SVG). <div data-scene="cn|jp|kr"> 안에 넣는다. */
(function () {
  const S = {};

  S.cn = `<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <pattern id="cn-rain" width="18" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><line x1="4" y1="0" x2="4" y2="16" stroke="#cfd6ff" stroke-opacity=".14"/></pattern>
  <g id="cn-lan"><circle cx="0" cy="12" r="17" fill="#f0b040" opacity=".13"/><rect x="-1" y="-8" width="2" height="6" fill="#5b3d1e"/><rect x="-6" y="-2" width="12" height="3" fill="#6b3a1a"/><rect x="-7" y="1" width="14" height="20" rx="4" fill="#e8a13c"/><rect x="-3" y="5" width="6" height="12" rx="2" fill="#ffd27a"/><rect x="-6" y="21" width="12" height="3" fill="#6b3a1a"/><rect x="-1" y="24" width="2" height="8" fill="#b8352b"/></g>
</defs>
<rect width="400" height="170" fill="#0d1024"/>
<path d="M0 74 Q60 40 120 64 Q180 30 250 60 Q320 34 400 62 V120 H0Z" fill="#111631"/>
<path d="M0 90 Q50 70 110 84 Q170 66 230 82 Q300 64 400 84 V120 H0Z" fill="#0f1328"/>
<rect y="112" width="400" height="58" fill="#0a0d1d"/>
<path d="M235 112 L400 126 V170 H290 Z" fill="#171223"/>
<path d="M232 108 L400 121 V126 L235 113Z" fill="#241a2e"/>
<g fill="#2b2033"><rect x="250" y="98" width="3" height="16"/><rect x="290" y="101" width="3" height="18"/><rect x="335" y="105" width="3" height="20"/><rect x="380" y="108" width="3" height="22"/></g>
<rect x="112" y="104" width="176" height="8" fill="#1b1528"/>
<rect x="104" y="100" width="192" height="5" fill="#2a1f33"/>
<rect x="150" y="62" width="100" height="40" fill="#3a2612"/>
<rect x="160" y="66" width="80" height="34" fill="#5a3a1a"/>
<rect x="194" y="88" width="14" height="3" fill="#2b1a0e"/><rect x="196" y="91" width="2" height="9" fill="#2b1a0e"/><rect x="204" y="91" width="2" height="9" fill="#2b1a0e"/>
<circle cx="201" cy="84" r="6" fill="#f0b040" opacity=".25"/><rect x="199" y="82" width="4" height="6" rx="1" fill="#ffd27a"/>
<g fill="#1a1010"><circle cx="178" cy="80" r="4.5"/><path d="M170 100 Q172 86 178 85 Q184 86 186 100Z"/><circle cx="229" cy="72" r="4.5"/><path d="M224 100 L224 80 Q229 76 234 80 L234 100Z"/></g>
<path d="M186 96 Q192 94 194 100 L182 100Z" fill="#241610"/>
<rect x="150" y="60" width="11" height="42" fill="#d59a5c" opacity=".85"/><rect x="239" y="60" width="11" height="42" fill="#d59a5c" opacity=".85"/>
<g fill="#231710"><rect x="126" y="56" width="6" height="48"/><rect x="268" y="56" width="6" height="48"/><rect x="146" y="58" width="5" height="46"/><rect x="249" y="58" width="5" height="46"/></g>
<rect x="120" y="52" width="160" height="6" fill="#120f1e"/>
<path d="M90 60 Q118 56 128 44 L200 24 L272 44 Q282 56 310 60 L286 54 L200 34 L114 54 Z" fill="#1c1a30"/>
<rect x="197" y="14" width="6" height="12" fill="#1c1a30"/><circle cx="200" cy="13" r="4" fill="#1c1a30"/>
<use href="#cn-lan" x="100" y="66"/><use href="#cn-lan" x="300" y="66"/>
<use href="#cn-lan" x="140" y="54"/><use href="#cn-lan" x="260" y="54"/>
<use href="#cn-lan" x="60" y="86"/><use href="#cn-lan" x="340" y="92"/>
<g stroke="#e8a13c" stroke-opacity=".35" stroke-width="2"><line x1="100" y1="120" x2="100" y2="150"/><line x1="140" y1="118" x2="140" y2="140"/><line x1="60" y1="130" x2="60" y2="160"/><line x1="260" y1="118" x2="260" y2="140"/><line x1="300" y1="122" x2="300" y2="150"/></g>
<path d="M0 30 Q40 24 70 40 Q90 52 110 46" stroke="#1a1410" stroke-width="3" fill="none"/>
<g fill="#f2c9d0"><circle cx="30" cy="27" r="3"/><circle cx="52" cy="30" r="2.5"/><circle cx="72" cy="42" r="3"/><circle cx="90" cy="50" r="2.5"/><circle cx="106" cy="45" r="2"/><circle cx="18" cy="33" r="2"/></g>
<rect width="400" height="170" fill="url(#cn-rain)"/>
</svg>`;

  S.jp = `<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <pattern id="jp-stripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="16" fill="#2b3138"/><rect x="8" width="8" height="16" fill="#f2c531"/></pattern>
  <pattern id="jp-pole" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="#2b3138"/><rect x="5" width="5" height="10" fill="#f2c531"/></pattern>
</defs>
<rect width="400" height="170" fill="#8cc4e6"/>
<g fill="#fff" opacity=".9"><ellipse cx="80" cy="30" rx="26" ry="9"/><ellipse cx="96" cy="24" rx="16" ry="9"/><ellipse cx="300" cy="22" rx="30" ry="8"/><ellipse cx="316" cy="17" rx="14" ry="8"/></g>
<path d="M226 78 Q270 60 324 78 Z" fill="#5e7f6a"/>
<rect y="78" width="400" height="30" fill="#4f8fb8"/>
<path d="M0 86 Q10 82 20 86 T40 86 T60 86 T80 86 T100 86 T120 86 T140 86 T160 86 T180 86 T200 86 T220 86 T240 86 T260 86 T280 86 T300 86 T320 86 T340 86 T360 86 T380 86 T400 86" stroke="#fff" stroke-opacity=".7" fill="none" stroke-width="1.5"/>
<path d="M0 98 Q10 94 20 98 T40 98 T60 98 T80 98 T100 98 T120 98 T140 98 T160 98 T180 98 T200 98 T220 98 T240 98 T260 98 T280 98 T300 98 T320 98 T340 98 T360 98 T380 98 T400 98" stroke="#fff" stroke-opacity=".4" fill="none" stroke-width="1.5"/>
<rect y="108" width="400" height="62" fill="#d9d5c8"/>
<rect y="108" width="400" height="4" fill="#c2bfae"/>
<rect y="146" width="400" height="2" fill="#7a746a"/><rect y="152" width="400" height="2" fill="#7a746a"/>
<g fill="#3f7a4a"><circle cx="20" cy="40" r="30"/><circle cx="50" cy="20" r="26"/><circle cx="385" cy="45" r="32"/><circle cx="360" cy="18" r="24"/></g>
<g fill="#5a9c5e"><circle cx="34" cy="54" r="16"/><circle cx="372" cy="60" r="16"/></g>
<path d="M124 52 Q200 44 276 52 L276 60 Q200 52 124 60Z" fill="#8e887c"/>
<rect x="130" y="58" width="140" height="7" fill="#a9a396"/>
<rect x="142" y="72" width="116" height="6" fill="#a9a396"/>
<rect x="196" y="64" width="8" height="10" fill="#a9a396"/>
<rect x="150" y="58" width="10" height="64" fill="#b8b2a4"/><rect x="240" y="58" width="10" height="64" fill="#b8b2a4"/>
<rect x="147" y="118" width="16" height="6" fill="#8e887c"/><rect x="237" y="118" width="16" height="6" fill="#8e887c"/>
<g fill="#3a4a5a"><rect x="192" y="96" width="6" height="18" rx="2"/><circle cx="195" cy="92" r="3.5"/></g>
<g fill="#c98a5a"><rect x="202" y="98" width="6" height="16" rx="2"/><circle cx="205" cy="94" r="3.5"/></g>
<rect x="262" y="112" width="150" height="34" rx="5" fill="#3b8a68"/>
<rect x="262" y="130" width="150" height="16" rx="3" fill="#efdf9d"/>
<rect x="262" y="140" width="150" height="4" fill="#2f7a5c"/>
<g fill="#dff3f7"><rect x="272" y="117" width="14" height="11" rx="1"/><rect x="292" y="117" width="14" height="11" rx="1"/><rect x="312" y="117" width="14" height="11" rx="1"/><rect x="332" y="117" width="14" height="11" rx="1"/><rect x="352" y="117" width="14" height="11" rx="1"/><rect x="372" y="117" width="14" height="11" rx="1"/><rect x="392" y="117" width="14" height="11" rx="1"/></g>
<circle cx="267" cy="137" r="3" fill="#fff6c8"/>
<g fill="#2b3138"><circle cx="285" cy="147" r="4"/><circle cx="300" cy="147" r="4"/><circle cx="370" cy="147" r="4"/><circle cx="385" cy="147" r="4"/></g>
<rect x="96" y="66" width="6" height="84" fill="url(#jp-pole)"/>
<line x1="88" y1="48" x2="110" y2="66" stroke="#2b3138" stroke-width="3"/><line x1="110" y1="48" x2="88" y2="66" stroke="#2b3138" stroke-width="3"/>
<rect x="84" y="68" width="30" height="8" fill="#2b3138"/>
<circle cx="99" cy="86" r="7" fill="#2b3138"/><circle cx="99" cy="86" r="4" fill="#e63b2e"/>
<rect x="18" y="124" width="82" height="5" fill="url(#jp-pole)"/>
<rect y="162" width="400" height="8" fill="url(#jp-stripe)"/>
</svg>`;

  S.kr = `<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <pattern id="kr-grid" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#f1dfb2"/><rect width="14" height="2.5" fill="#3b2415"/><rect width="2.5" height="14" fill="#3b2415"/></pattern>
  <pattern id="kr-grid2" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e9d29a"/><path d="M0 0H10V10" fill="none" stroke="#3b2415" stroke-width="2"/></pattern>
  <g id="kr-candle"><circle cx="0" cy="-22" r="18" fill="#e7b45a" opacity=".15"/><rect x="-7" y="0" width="14" height="4" fill="#b08a3a"/><rect x="-4" y="-8" width="8" height="9" fill="#8a6a2e"/><rect x="-3" y="-28" width="6" height="21" fill="#f3e5c8"/><ellipse cx="0" cy="-32" rx="3" ry="5" fill="#f0b23a"/><ellipse cx="0" cy="-31" rx="1.5" ry="3" fill="#fff4c2"/></g>
</defs>
<rect width="400" height="170" fill="#2a1c12"/>
<rect width="400" height="10" fill="#1d130c"/>
<rect y="10" width="400" height="104" fill="#3a271a"/>
<rect y="114" width="400" height="56" fill="#6e4a2a"/>
<g stroke="#4e3219" stroke-width="1.5"><line x1="0" y1="128" x2="400" y2="128"/><line x1="0" y1="142" x2="400" y2="142"/><line x1="0" y1="156" x2="400" y2="156"/></g>
<rect y="114" width="400" height="3" fill="#2a1a0e"/>
<ellipse cx="200" cy="132" rx="140" ry="14" fill="#e7b45a" opacity=".12"/>
<rect x="16" y="18" width="98" height="92" fill="url(#kr-grid)" stroke="#3b2415" stroke-width="5"/>
<rect x="286" y="18" width="98" height="92" fill="url(#kr-grid)" stroke="#3b2415" stroke-width="5"/>
<rect x="130" y="14" width="140" height="14" fill="url(#kr-grid2)" stroke="#3b2415" stroke-width="3"/>
<rect x="128" y="34" width="144" height="76" fill="#2a1a0e"/>
<rect x="132" y="38" width="136" height="68" fill="#ecdfba"/>
<path d="M132 106 L150 70 L166 92 L184 58 L204 96 L222 66 L242 90 L256 72 L268 106Z" fill="#3f7a55"/>
<path d="M132 106 L146 84 L160 100 L176 76 L196 106Z" fill="#2f5a8a" opacity=".9"/>
<path d="M214 106 L232 80 L250 98 L262 86 L268 106Z" fill="#5a8a4a"/>
<circle cx="246" cy="52" r="6" fill="#d9532f"/>
<g fill="#e88aa0"><circle cx="150" cy="60" r="3"/><circle cx="158" cy="54" r="2.5"/><circle cx="238" cy="58" r="2.5"/></g>
<g stroke="#2a1a0e" stroke-width="2"><line x1="166" y1="38" x2="166" y2="106"/><line x1="200" y1="38" x2="200" y2="106"/><line x1="234" y1="38" x2="234" y2="106"/></g>
<rect x="186" y="106" width="28" height="4" fill="#3b2415"/><rect x="189" y="110" width="3" height="10" fill="#3b2415"/><rect x="208" y="110" width="3" height="10" fill="#3b2415"/>
<path d="M136 124 Q160 82 184 124Z" fill="#f2b8c6"/><rect x="154" y="92" width="12" height="14" rx="3" fill="#f7dbe2"/><circle cx="160" cy="86" r="6" fill="#3a2418"/>
<path d="M216 124 Q240 82 264 124Z" fill="#c9d8b8"/><rect x="234" y="92" width="12" height="14" rx="3" fill="#e4ecd8"/><circle cx="240" cy="86" r="6" fill="#3a2418"/>
<use href="#kr-candle" x="118" y="118"/><use href="#kr-candle" x="282" y="118"/>
<rect x="44" y="106" width="22" height="30" fill="#3b2415"/><rect x="47" y="109" width="16" height="24" fill="#f0c060"/><rect x="54" y="109" width="2" height="24" fill="#3b2415"/><rect x="47" y="120" width="16" height="2" fill="#3b2415"/>
<rect x="334" y="106" width="22" height="30" fill="#3b2415"/><rect x="337" y="109" width="16" height="24" fill="#f0c060"/><rect x="344" y="109" width="2" height="24" fill="#3b2415"/><rect x="337" y="120" width="16" height="2" fill="#3b2415"/>
<rect x="40" y="136" width="30" height="4" fill="#2a1a0e"/><rect x="330" y="136" width="30" height="4" fill="#2a1a0e"/>
</svg>`;

  window.SCENES = S;
  document.querySelectorAll("[data-scene]").forEach((el) => { el.innerHTML = S[el.dataset.scene] || ""; });
})();
