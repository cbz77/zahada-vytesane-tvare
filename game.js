// --- MAPA HRY A STAV ---

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;

this.localStorage.setItem("hra_spustena", 0);

let saved_game = this.localStorage.getItem("saved_game");

if(saved_game == null || saved_game == "") this.localStorage.setItem("saved_game", "");

// Definice předmětů v inventáři pro snazší správu (id, jméno, ikona)
const INVENTORY_ITEMS = {
	'vizitka': { name: 'Vizitka', icon: 'fa-address-card', tooltip: 'Zašlá vizitka, jméno někdo začmáral, ale adresa směřuje někam pod zámek do Frýdku.', type: "image", popupText: "<img src='../assets/images/inventory/vizitka.png' class='inventory_img'>" },
	'cerny_klic': { name: 'Černý klíč', icon: 'fa-key', tooltip: 'Starý, černý klíč. Nalezený archeologem při vykopávkách pod Štandlem.' },
	'dubovy_list': { name: 'Nákres listu', icon: 'fa-leaf', tooltip: 'Nákres reliéfu dubového listu, který byl na soše na místeckém náměstí.', type: "image", popupText: "<img src='../assets/images/inventory/list.png' class='inventory_img'>" },
	'kriz_z_hrobu': { name: 'Nákres kříže', icon: 'fa-cross', tooltip: 'Nákres Kříže z náhrobku u kostela sv. Jošta.', type: "image", popupText: "<img src='../assets/images/inventory/kriz.png' class='inventory_img'>" },
	'koruna': { name: 'Nákres koruny', icon: 'fa-crown', tooltip: 'Královská koruna, která byla vyryta na zámecké věži.', type: "image", popupText: "<img src='../assets/images/inventory/koruna.png' class='inventory_img'>" },
	'mapa': { name: 'Mapa', icon: 'fa-map', tooltip: 'Mapa z vrcholu Štandlu.', type: "image", popupText: "<img src='../assets/images/inventory/mapa.png' class='inventory_img'>" },
	'erb': { name: 'Nákres Erbu', icon: 'fa-shield', tooltip: 'Erb z kamene, nalezený ve vykopávkách staré Lipiny.', type: "image", popupText: "<img src='../assets/images/inventory/erb.png' class='inventory_img'>" },
	'strep': { name: 'Střepy', icon: 'fa-icicles', tooltip: 'Keramické střepy, nalezené v kameném pomníku.', type: "image", popupText: "<img src='../assets/images/inventory/strepy.png' class='inventory_img'>" },
	'lopatka': { name: 'Lopatka', icon: 'fa-arrow-pointer', tooltip: 'Stará lopatka, nalezená u vykopávek.', type: "image", popupText: "<img src='../assets/images/inventory/lopatka.png' class='inventory_img'>" },
	'denik': { name: 'Deník', icon: 'fa-book', tooltip: 'Potrhaný deník, ležel u těla Černé Barbory v tajné jeskyni.', type: "denik" },
};

const ikona_stopa = '<br><br><i class="fa-solid fa-puzzle-piece color-red"></i> ';

const MAP = {

	zacatek_cesty: {
		name: "Začátek cesty",
		N: { img: `../assets/bgr/zacatek/zacatek_N.png`, pohled: "stromy", items: [
			{ x: 380, y: 300, text: "Kříž tady stojí od pradávna.", type: 'text' }
		] },
		E: { img: `../assets/bgr/zacatek/zacatek_E.png`, pohled: "k lesní křižovatce", forward: "lesni_krizovatka", items: [] },
		W: { img: `../assets/bgr/zacatek/zacatek_W.png`, pohled: "zpátky domů", items: [
			{ x: 400, y: 400, text: "Zpátky se vrátím, až záhadu vyřeším.", type: 'text' }
		] },
		S: { img: `../assets/bgr/zacatek/zacatek_S.png`, pohled: "turistický ukazatel", items: [
			{ x: 650, y: 165, text: "Jdu správně.", type: 'text' }
		] },
	},

	lesni_krizovatka: {
		name: "Rozcestí u křížku",
		N: { img: `../assets/bgr/lesni_krizovatka/lesni_krizovatka_N.png`, pohled: "severní stezka", forward: "cesta_pole", items: [
			{ x: 120, y: 250, text: "Kamenná socha tiše pozoruje návštěvníky lesa.", type: 'text' },
		] },
		E: { img: `../assets/bgr/lesni_krizovatka/lesni_krizovatka_E.png`, pohled: "hustý les", items: [] },
		W: { img: `../assets/bgr/lesni_krizovatka/lesni_krizovatka_W.png`, pohled: "k začátku cesty", forward: "zacatek_cesty", items: [] },
		S: { img: `../assets/bgr/lesni_krizovatka/lesni_krizovatka_S.png`, pohled: "jižní stezka", forward: "upati_standlu", items: [
			{ x: 650, y: 400, text: "Zrezivělé kolo, dávno opuštěné svým majitelem, zde chátrá v lese.", type: 'text' },
		] },
	},

	/* SEVERNI STEZKA */

	cesta_pole: {
		name: "Cesta kolem pole",
		N: { img: `../assets/bgr/cesta_pole/cesta_pole_N.png`, pohled: "dále kolem pole", forward: "stara_lipina", items: [
			{ x: 260, y: 360, text: "Starý traktor. Kdysi býval pýchou polí, teď je to jen těžký rezavý vrak.", type: 'text' }
		] },
		E: { img: `../assets/bgr/cesta_pole/cesta_pole_E.png`, pohled: "les", items: [] },
		W: { img: `../assets/bgr/cesta_pole/cesta_pole_W.png`, pohled: "pole", items: [
			{ x: 420, y: 250, text: "Starý a otrhaný strašák, nahání mi hrůzu.", type: 'text' },
			{ x: 680, y: 520, text: "Rezavý kbelík, je prázdný.", type: 'text' },

		] },
		S: { img: `../assets/bgr/cesta_pole/cesta_pole_S.png`, pohled: "k rozcestí", forward: "lesni_krizovatka", items: [] },
	},

	stara_lipina: {
		name: "Mýtina",
		N: { img: `../assets/bgr/lipina/lipina_N.png`, pohled: "lesní obora", items: [
			{ x: 500, y: 300, text: "Stará myslivecká věž, nepatřičně trčí uprostřed obory…", type: 'text' }
		] },
		E: { img: `../assets/bgr/lipina/lipina_E2.png`, pohled: "k lesu", forward: "les_u_vykopavek", items: [
			{ x: 120, y: 220, text: "Zkorodovaná cedule na pahýlu stromu. <br>Možná je lepší nevědět, před čím varovala.", type: 'text' }
		] },
		W: { img: `../assets/bgr/lipina/lipina_W.png`, pohled: "odbočka k poli", forward: "cesta_pole", items: [
			{ x: 685, y: 400, text: "Pomník připomíná temnou událost, jež zde v roce 1886 otiskla svůj chladný stín. Jako by bolest tehdejšího dne dodnes prostupovala okolním tichem.", type: 'text' }
		] },
		S: { img: `../assets/bgr/lipina/lipina_S.png`, pohled: "oblast bývalé lipiny", items: [
			{ x: 400, y: 300, text: "Na tomto místě se kdysi rozkládala ves Frýdberk. Po jejích obydlích i lidech zůstala jen prázdnota a pár terénních nerovností.", type: 'text' }
		] },
	},

	les_u_vykopavek: {
		name: "Uprostřed lesa",
		N: { img: `../assets/bgr/les_u_vykopavek/les_u_vykopavek_N.png`, pohled: "smrkový les", items: [
			{ x: 400, y: 400, text: "Kolečka plná hlíny úplně obrostla ostružiním.", type: 'text' }
		] },
		E: { img: `../assets/bgr/les_u_vykopavek/les_u_vykopavek_E.png`, pohled: "závora přes cestu", items: [
			{ x: 455, y: 365, text: "Zrezivělá závora brání cestě dál. Za ní se rozprostírá bývalý vojenský prostor.", type: 'text' }
		] },
		W: { img: `../assets/bgr/les_u_vykopavek/les_u_vykopavek_W.png`, pohled: "cesta na mýtinu", forward: "stara_lipina", items: [] },
		S: { img: `../assets/bgr/les_u_vykopavek/les_u_vykopavek_S.png`, pohled: "staré vykopávky", forward: "vykopavky", items: [
			{ x: 140, y: 310, text: "Cedule zakazuje vstup na archeologické vykopávky. <br> Musím se dozvědět, co skrývají!", type: 'text' },
			{ x: 400, y: 400, text: "Nedávno zde archeologové odkrývali pozůstatky tvrze Lipina, která tady stávala.", type: 'text' }
		] },
	},

	vykopavky: {
		name: "Vykopávky na bývalé Lipině",
		N: { img: `../assets/bgr/vykopavky/vykopavky_N.png`, pohled: "zpět do lesa", forward: "les_u_vykopavek", items: [] },
		E: { img: `../assets/bgr/vykopavky/vykopavky_E.png`, pohled: "okolí vykopávek", items: [
			{ x: 460, y: 320, text: "Lopatka zaražená v zemi. Vezmu si ji.", itemKey: "lopatka", type: 'item' }
		] },
		W: { img: `../assets/bgr/vykopavky/vykopavky_W.png`, pohled: "okolí vykopávek", items: [
			{ x: 410, y: 300, text: "Na zemi leží březová větev. V okolí plném smrků působí jako nezvaný vetřelec.", type: 'text' }
		] },
		S: {
			img: `../assets/bgr/vykopavky/vykopavky_S.png`, pohled: "opuštěné vykopávky", items: [
				{ x: 515, y: 235, text: "Ve výkopu ležela stará vizitka <br><br> <img src='assets/bgr/vykopavky/vizitka_hlina.png' class='inventory_img' onclick='event.stopPropagation(); showLightbox(\"assets/bgr/vykopavky/vizitka_hlina.png\")'>" + ikona_stopa + " Získali jste stopu <span class='color-lighter-red'>Zašlá vizitka.</span>", itemKey: 'vizitka', type: 'item' },
				{ x: 135, y: 215, text: "V kameni se rýsuje zašlý středověký erb. Čas už ohlodal jeho obrysy. Nakreslím si ho.<br><br> <img src='assets/bgr/vykopavky/kamen_erb.png' class='inventory_img' onclick='event.stopPropagation(); showLightbox(\"assets/bgr/vykopavky/kamen_erb.png\")'>" + ikona_stopa + " Získali jste stopu <span class='color-lighter-red'>kamenný erb.</span>", type: 'item', itemKey: "erb" }
			]
		},
		
	},

	/* JIZNI STEZKA */

	upati_standlu: {
		name: "Úpatí Štandlu",
		N: { img: `../assets/bgr/upati_standlu/upati_standlu_N.png`, pohled: "na lesní křižovatku", forward: "lesni_krizovatka", items: []},
		E: {
			img: `../assets/bgr/upati_standlu/upati_standlu_E2.png`, pohled: "na vrchol štandlu", forward: "vrchol_standlu",
			items: [
				{ x: 500, y: 320, text: "Cesta se vine vzhůru k vrcholu, pomalu mizí v šeru lesa.", type: 'text' },
				{ x: 280, y: 420, text: "Na lesní lavičce zůstaly odložené prázdné lahve od piva.", type: 'text' },
			]
		},
		W: { img: `../assets/bgr/upati_standlu/upati_standlu_W.png`, pohled: "les", items: [] },
		S: { img: `../assets/bgr/upati_standlu/upati_standlu_S.png`, pohled: "lesní pěšina", forward: "lesni_pesina", items: [] },
	},
	lesni_pesina: {
		name: "Lesní pěšina",
		N: { img: `../assets/bgr/lesni_pesina/lesni_pesina_N.png`, pohled: "k úpatí Štandlu", forward: "upati_standlu", items: [] },
		E: { img: `../assets/bgr/lesni_pesina/lesni_pesina_E.png`, pohled: "březový les", items: [
			{ x: 200, y: 300, text: "Pěkně naskládané hromady dřeva.", type: 'text' }
		] },
		W: { img: `../assets/bgr/lesni_pesina/lesni_pesina_W.png`, pohled: "hustý les", items: [] },
		S: { img: `../assets/bgr/lesni_pesina/lesni_pesina_S.png`, pohled: "dál pěšinou", forward: "prudky_svah", items: [
			{ x: 180, y: 300, text: "Na zetlelém pařezu stojí prázdné krmítko. Nikdo ho už nedoplňuje a ani ptáci se sem dávno nevracejí.", type: 'text' }
		] },
	},
	prudky_svah: {
		name: "U potoka",
		N: { img: `../assets/bgr/prudky_svah/prudky_svah_N.png`, pohled: "do prudkého svahu", items: [
				{ x: 400, y: 300, text: "Strmý svah plný kamenů a kořenů. Tudy cesta nevede.", type: 'text' }
			] 
		},
		E: { img: `../assets/bgr/prudky_svah/prudky_svah_E.png`, pohled: "dále kolem štandlu", forward: "pod_standlem", items: [] },
		W: { img: `../assets/bgr/prudky_svah/prudky_svah_W.png`, pohled: "lesní pěšina", forward: "lesni_pesina", items: [
			{ x: 450, y: 390, text: "Starodávný vůz, zdá se být stále používaný.", type: 'text' },
			{ x: 130, y: 420, text: "Hraniční kámen, ten musí být nejméně 200 let starý.", type: 'text' },
		] },
		S: { img: `../assets/bgr/prudky_svah/prudky_svah_S.png`, pohled: "potok", items: [
			{ x: 300, y: 500, text: "Chladivá voda potoka příjemně zurčí mezi kameny.", type: 'text' },
			{ x: 565, y: 220, text: "Přes vodu se ke kříži nedostanu. Škoda.", type: 'text' },
		] },
	},
	pod_standlem: {
		name: "Pod Štandlem",
		N: { img: `../assets/bgr/pod_standlem/pod_standlem_N.png`, pohled: "zarostlá louka", items: [
			{ x: 150, y: 250, text: "Starý kamenný pomník, nikdo neví, kdo ho sem postavil ", type: 'text' },
			{ x: 200, y: 390, text: "Ve spodní části se za volným kamenem nacházelo velké množství keramických střepů. Vypadají velmi staře. <br><br><img src='assets/bgr/pod_standlem/strepy_skala.png' class='inventory_img' onclick='event.stopPropagation(); showLightbox(\"assets/bgr/pod_standlem/strepy_skala.png\")'>", itemKey: 'strep', type: 'item' },
		] },
		E: { img: `../assets/bgr/pod_standlem/pod_standlem_E.png`, pohled: "přes most do místku", forward: "mistecke_namesti", items: [
			{ x: 400, y: 300, text: "Starý kamenný mostek se klene nad šumícím potokem. Cesta vede do Místku.", type: 'text' },
			{ x: 595, y: 100, text: "Ve dne je tu světla dost.", type: 'text' },
		] },
		W: { img: `../assets/bgr/pod_standlem/pod_standlem_W.png`, pohled: "na vrchol štandlu", forward: "vrchol_standlu", items: [] },
		S: { img: `../assets/bgr/pod_standlem/pod_standlem_S.png`, pohled: "lesní cesta podél potoka", forward: "prudky_svah", items: [] },
	},
	vrchol_standlu: {
		name: "Vrchol Štandlu",
		N: { img: `../assets/bgr/vrchol_standlu/vrchol_standlu_N.png`, pohled: "cesta dolů z vrcholu", forward: "pod_standlem", items: [
			{ x: 180, y: 420, text: "Zvláštně navršené balvany. Možná to jsou poslední zbytky hradu.", type: 'text' },
			{ x: 670, y: 280, text: "Z hrubě otesaných kmenů někdo vztyčil dřevěný kříž.", type: 'text' }
		] },
		E: { img: `../assets/bgr/vrchol_standlu/vrchol_standlu_E_mirror.png`, pohled: "val", items: [] },
		W: { img: `../assets/bgr/vrchol_standlu/vrchol_standlu_W.png`, pohled: "k úpatí štandlu", forward: "upati_standlu", items: [
			{ x: 200, y: 400, text: "Zrezivělé zábradlí se třese při lehkém doteku. Za ním je hluboká jáma - místo, kde kdysi stávala pevnost Štandl.", type: 'text' }
		] },
		S: { img: `../assets/bgr/vrchol_standlu/vrchol_standlu_S.png`, pohled: "k informační ceduli", forward: "informacni_cedule", items: [] },
	},
	informacni_cedule: {
		name: "Informační cedule",
		N: { img: `../assets/bgr/informacni_cedule/informacni_cedule_N.png`, pohled: "na vrchol štandlu", forward: "vrchol_standlu", items: [] },
		E: { img: `../assets/bgr/informacni_cedule/informacni_cedule_E.png`, pohled: "postojení", forward: "pred_tvari", items: [
			{ x: 480, y: 250, text: "Po kamenných schodech se dá dostat na druhou stranu valu.", type: 'text' },
			{ x: 600, y: 450, text: "V listí leží starý turistický batoh. Působí dojmem, jako by ho někdo odložil jen na chvíli... ale k jeho návratu už nedošlo.", type: 'text' },
		] },
		W: { img: `../assets/bgr/informacni_cedule/informacni_cedule_W.png`, pohled: "zatarasená chodba", items: [
			{ x: 430, y: 450, text: "Chodba ve skále je zatarasena mříží. <br>Už se do ní nedá dostat. <br><br><img src='../assets/bgr/informacni_cedule/chodba_detail.png' class='inventory_img' onclick='event.stopPropagation(); showLightbox(\"assets/bgr/informacni_cedule/chodba_detail.png\")'>", type: 'text' },
			{ x: 130, y: 420, text: "Neotevřená láhev Radegasta. S touto etiketou se však neprodává už nejméně 20 let.", type: 'text' },
		] },
		S: { img: `../assets/bgr/informacni_cedule/informacni_cedule_S_mapa.png` , pohled: "informační cedule", items: [
			{ x: 670, y: 280, text: "V rohu informační cedule se skrývala skrčená mapa.", itemKey: 'mapa', type: 'item' },
		] },
	},
	pred_tvari: {
		name: "Za valem",
		N: { img: `../assets/bgr/pred_tvari/pred_tvari_N.png`, pohled: "na vrchol štandlu", forward: "informacni_cedule", items: [] },
		E: { img: `../assets/bgr/pred_tvari/pred_tvari_E.png`, pohled: "strmý svah", items: [
			{ x: 350, y: 450, text: "Starodávná kovová lucerna, už je nepoužitelná.", type: 'text' }
		] },
		W: { img: `../assets/bgr/pred_tvari/pred_tvari_W.png`, pohled: "strmý svah", items: [] },
		S: { img: `../assets/bgr/pred_tvari/pred_tvari_S.png`, pohled: "k lavičce", forward: "kamenny_erb", items: [
			{ x: 580, y: 450, text: "Uprostřed strmého lesního svahu stojí osamělá, ztrouchnivělá lavička. Kdysi z ní byl krásný výhled.", type: 'text' }
		] },
	},

	/* KAMENNY ERB */

	kamenny_erb: {
		name: "U velkého balvanu",
		N: { img: `../assets/bgr/kamenny_erb/kamenny_erb_N.png`, pohled: "zpět k vrcholu", forward: "pred_tvari", items: [] },
		E: { img: `../assets/bgr/kamenny_erb/kamenny_erb_E.png`, pohled: "roklina", items: [
			{ x: 400, y: 500, text: "Terén zde prudce klesá, nedá se tudy jít.", type: 'text' }
		] },
		W: { img: `../assets/bgr/kamenny_erb/kamenny_erb_W.png`, pohled: "k balvanu", forward: "kamenna_tvar", items: [
			{ x: 585, y: 270, text: "Na balvanu je cosi vytesáno. <br>Musím to prozkoumat podrobněji.", type: 'text' }
		] },
		S: { img: `../assets/bgr/kamenny_erb/kamenny_erb_S.png`, pohled: "strmý svah", items: [
			{ x: 400, y: 460, text: "Cestu blokuje starý spadlý strom.", type: 'text' }
		] },
	},
	kamenna_tvar: {
		name: "Kamenná tvář",
		
		N: { img: `../assets/bgr/kamenna_tvar/kamenna_tvar_N.png`, pohled: "pohled vedle kamene", items: [] },
		E: { img: `../assets/bgr/kamenna_tvar/kamenna_tvar_E.png`, pohled: "zpátky", forward: "kamenny_erb", items: [] },
		W: {
			img: `../assets/bgr/kamenna_tvar/kamenna_tvar_W.png`,
			pohled: "kamenná tvář",
			items: [
				{ x: 400, y: 300, text: "Tajemná tvář vytesaná do skály.", type: 'text' },
				{ x: 635, y: 400, text: "V kameni je klíčová dírka. <br>", type: 'puzzle' },

			]
		},
		S: { img: `../assets/bgr/kamenna_tvar/kamenna_tvar_S.png`, pohled: "pohled vedle kamene", items: [] }
	},
	jeskyne: {
		name: "Jeskyně ve Štandlu",
		
		N: { img: `../assets/bgr/jeskyne/jeskyne_N.png`, pohled: "zbrojnice", items: [
			{ x: 200, y: 400, text: "Na počest krále Attily zde jeho věrní spolubojovníci zanechali své zbraně. Kupodivu jsou stále v dobrém stavu.", type: 'text' }
		] },
		E: {
			img: `../assets/bgr/jeskyne/jeskyne_E.png`,
			pohled: "ven z jeskyně",
			forward: "konec"
		},
		W: {
			img: `../assets/bgr/jeskyne/jeskyne_W.png`,
			pohled: "tajemství ve štandlu",
			items: [
				{ x: 365, y: 500, text: "Kniha - deník Černé Barbory", type: 'item', itemKey: "denik" },
				{ x: 405, y: 285, text: "Meč je stále velmi ostrý. Ten musel být Attilův oblíbený.", type: 'text' },
				{ x: 630, y: 300, text: "Kostra Černé Barbory. Postihl ji strašný osud, avšak do poslední chvíle si zachovala víru v Boha.", type: 'text' },
				{ x: 440, y: 380, text: "Hrob krále Attily. Tak přece tady leží!", type: 'text' },
				{ x: 100, y: 500, text: "Poklad krále Attily. Zas tak obrovský není.", type: 'text' },
			]
		},
		S: { img: `../assets/bgr/jeskyne/jeskyne_S.png`, pohled: "pavouk", items: [
				{ x: 560, y: 480, text: "Dobroduh zde našel svůj konec. Leží tu již věky.", type: 'text' }
		] },
	},
	konec: {
		name: "Jeskyně ve Štandlu",
		N: {
			img: `../assets/bgr/temnota/temnota_N.png`, pohled: "temnota", items: [
				{ x: 550, y: 480, text: "černočerná tma", type: 'text' }
			]
		},
		E: { img: `../assets/bgr/temnota/temnota_E.png`, pohled: "temnota", items: [
				{ x: 550, y: 480, text: "černočerná tma", type: 'text' }
			]
		},
		W: { img: `../assets/bgr/temnota/temnota_W.png`, pohled: "temnota", items: [
				{ x: 550, y: 480, text: "černočerná tma", type: 'text' }
			] 
		},
		S: { img: `../assets/bgr/temnota/temnota_S.png`, pohled: "temnota", items: [
				{ x: 550, y: 480, text: "černočerná tma", type: 'text' }
			]
		},
	},
	
	/* F-M */

	mistecke_namesti: {
		name: "Místecké náměstí",
		E: { img: `../assets/bgr/namesti/namesti_E.png`, pohled: "cesta do Frýdku", forward: "frydecky_zamek", items: [] },
		S: { img: `../assets/bgr/namesti/namesti_S.png`, pohled: "socha panny marie", forward: "socha_marie", items: [] },
		N: { img: `../assets/bgr/namesti/namesti_N.png`, pohled: "budovy na místeckém naměstí", items: [] },
		W: { img: `../assets/bgr/namesti/namesti_W.png`, pohled: "průchod ke štandlu", forward: "pod_standlem", items: [
			{ x: 245, y: 330, text: "Na balkóně tohoto domu promluvil dne 3. ledna 1990 prezident Václav Havel", type: 'text' }
		] },
	},
	socha_marie: {
		name: "Socha Panny Marie",
		N: {
			img: `../assets/bgr/socha_marie/socha_marie_N.png`, pohled: "reliéf na soše", items: [
				{ x: 420, y: 280, text: "Na sloupu je výrazný reliéf dubového listu, raději si jej zaznamenám." + ikona_stopa + " Získali jste stopu <span class='color-lighter-red'>Dubový list.</span>", itemKey: 'dubovy_list', type: 'item' }
			]
		},
		E: { img: `../assets/bgr/socha_marie/socha_marie_E.png`, pohled: "okolí sochy", items: [] },
		W: { img: `../assets/bgr/socha_marie/socha_marie_W.png`, pohled: "do středu naměstí", forward: "mistecke_namesti",items: [] },
		S: { img: `../assets/bgr/socha_marie/socha_marie_S.png`, pohled: "před sochou", items: [] },
	},
	frydecky_zamek: {
		name: "Frýdecký zámek",
		E: { img: `../assets/bgr/zamek/zamek_E.png`, pohled: "zámecká zahrada", items: [] },
		S: { img: `../assets/bgr/zamek/zamek_S.png`, pohled: "na nádvoří zámku", forward: "zamek_nadvori",  items: [] },
		N: { img: `../assets/bgr/zamek/zamek_N.png`, pohled: "do města", items: [
			{ x: 300, y: 450, text: "Cesta vede dále do Frýdku.", type: 'text' }
		] },
		W: { img: `../assets/bgr/zamek/zamek_W.png`, pohled: "zámeckým parkem do místku", forward: "mistecke_namesti", items: [] },
	},
	zamek_nadvori: {
		name: "Zámek nádvoří",
		E: { img: `../assets/bgr/zamek_nadvori/nadvori_E.png`, pohled: "bránou na náměstí", forward: "zamek_namesti", },
		S: { img: `../assets/bgr/zamek_nadvori/nadvori_S.png`, pohled: "zámecké nádvoří", items: [
			{ x: 600, y: 300, text: "Nádvoří zeje prázdnotou.", type: 'text' }
		] },
		W: { img: `../assets/bgr/zamek_nadvori/nadvori_W.png`, pohled: "k věži", forward: "vez", items: [] },
		N: { img: `../assets/bgr/zamek_nadvori/nadvori_N.png`, pohled: "před frýdecký zámek", forward: "frydecky_zamek", items: [] },
	},
	vez: {
		name: "Zámecká věž",
		W: {
			img: `../assets/bgr/zamek_nadvori/vez/koruna.png`, pohled: "stěna pod věží", items: [
				{ x: 330, y: 240, text: "Na jedné cihle je vytesaný symbol, který připomíná královskou korunu. Nakreslím si to. " + ikona_stopa + " Získali jste stopu <span class='color-lighter-red'>Královská koruna</span>", itemKey: 'koruna', type: 'item' }
			]
		},
		S: { img: `../assets/bgr/zamek_nadvori/vez/vedle_veze_S.png`, pohled: "vedle věže vlevo", items: [] },
		N: { img: `../assets/bgr/zamek_nadvori/vez/vedle_veze_N.png`, pohled: "vedle věže vpravo", items: [] },
		E: { img: `../assets/bgr/zamek_nadvori/vez/vedle_veze_E.png`, pohled: "zpět na nádvoří", forward: "zamek_nadvori", items: [] },
	},
	zamek_namesti: {
		name: "Zámecké náměstí",
		E: { img: `../assets/bgr/zamek_namesti/zamek_namesti_E.png`, pohled: "ke kostelu", forward: "kostel_josta", items: [] },
		S: { img: `../assets/bgr/zamek_namesti/zamek_namesti_S.png`, pohled: "budovy", items: [] },
		N: { img: `../assets/bgr/zamek_namesti/zamek_namesti_N.png`, pohled: "kašna", items: [
			{ x: 430, y: 350, text: "Kašna se sochou sv. Floriána. <br>V kašně plave několik listů a větviček. Voda je ale čistá.", type: 'text' },
			{ x: 530, y: 170, text: "Svatojánská věž se tyčí nad náměstím.", type: 'text' }
		] },
		W: { img: `../assets/bgr/zamek_namesti/zamek_namesti_W.png`, pohled: "do zámku", forward: "zamek_nadvori", items: [] },
	},
	kostel_josta: {
		name: "Kostel sv. Jošta",
		E: { img: `../assets/bgr/jost/jost_E.png`, pohled: "vstup do kostela", items: [
			{ x: 650, y: 380, text: "Pozdně renesanční stavba z roku 1612. <br> Okolní park do konce 19. století sloužil jako hřbitov.", type: 'text' }
		] },
		S: { img: `../assets/bgr/jost/jost_S.png`, pohled: "okolo kostela", forward: "vedle_kostela", },
		N: { img: `../assets/bgr/jost/jost_N.png`, pohled: "po schodišti na náměstí", forward: "zamek_namesti", items: [
			{ x: 470, y: 360, text: "Statný kaštan, jistě toho mnoho pamatuje.", type: 'text' }
		] },
		W: { img: `../assets/bgr/jost/jost_W.png`, pohled: "na místecké naměstí", forward: "mistecke_namesti", items: [
			{ x: 200, y: 570, text: "Chodník vede do Místku", type: 'text' }
		] },
	},
	vedle_kostela: {
		name: "Vedle kostela sv. Jošta",
		E: {
			img: `../assets/bgr/jost_hrob/jost_hrob_E.png`, pohled: "stará škola", items: [],
		},
		S: { img: `../assets/bgr/jost_hrob/jost_hrob_S.png`, pohled: "socha sv. Floriána", items: [
			{ x: 250, y: 400, text: "Socha patrona hasičů, sv. Floriána", type: 'text' }
		] },
		N: { img: `../assets/bgr/jost_hrob/jost_hrob_N.png`, pohled: "náhrobní kámen", items: [
			{ x: 250, y: 400, text: "Na náhrobním kameni je velký, kamenný kříž. <br>Nakreslím si ho.<br><br> <img src='assets/bgr/jost_hrob/nahrobek.png' class='inventory_img' onclick='event.stopPropagation(); showLightbox(\"assets/bgr/jost_hrob/nahrobek.png\")'> " + ikona_stopa + " Získali jste stopu <span class='color-lighter-red'>kříž.</span>", itemKey: 'kriz_z_hrobu', type: 'item' }
		] },
		W: { img: `../assets/bgr/jost_hrob/jost_hrob_W.png`, pohled: "zpět ke vchodu do kostela", forward: "kostel_josta", items: [] },
	},
	u_muzea: {
		name: "U muzea",
		E: { img: `../assets/bgr/muzeum/muzeum_E.png`, pohled: "do města", items: [] },
		N: {
			img: `../assets/bgr/muzeum/muzeum_N.png`, pohled: "dveře do muzea", items: [
				{ x: 450, y: 350, text: "Muzeum je otevřeno.", type: 'npc' }
			]
		},
		S: { img: `../assets/bgr/muzeum/muzeum_S.png`, pohled: "cihlové kruhy", items: [] },
		W: { img: `../assets/bgr/muzeum/muzeum_W.png`, pohled: "k frýdeckému zámku", forward: "frydecky_zamek", items: [] },
	},
};


const DIRECTIONS = ['N', 'E', 'S', 'W'];

let currentArea = "zacatek_cesty";
let currentDirectionIndex = 1; // Výchozí směr: E (východ)
let inventory = []; // Skladuje ID předmětů
let solvedPuzzles = [];
let addedItems = [];

// --- ELEMENTY DOM ---
const viewport = document.getElementById('viewport');
const forwardButton = document.getElementById('move-forward');
const loadingOverlay = document.getElementById('loading-overlay');
const directionLabel = document.getElementById('direction-label');
const pohledLabel = document.getElementById('pohled-label');
const areaLabel = document.getElementById('area-label');
const textModalBackdrop = document.getElementById('text-modal-backdrop');
const puzzleModalBackdrop = document.getElementById('puzzle-modal-backdrop');
const popupText = document.getElementById('popup-text');
const inventoryDisplay = document.getElementById('inventory-display');
const startScreen = document.getElementById('start-screen');

// --- INVENTÁŘ A MODALY ---

/**
 * Zobrazí textové vyskakovací okno.
 * @param {string} text Text k zobrazení.
 */
function showPopup(text) {
	popupText.innerHTML = text;
	textModalBackdrop.style.display = 'flex';
}

/**
 * Skryje vyskakovací okno.
 * @param {string} modalId ID modalu k zavření.
 */
function hidePopup(modalId) {
	document.getElementById(modalId).style.display = 'none';
}

/**
 * Přidá předmět do inventáře a aktualizuje zobrazení.
 * @param {string} itemId ID předmětu (klíč z INVENTORY_ITEMS).
 */
function addItem(itemId) {
	if (!inventory.includes(itemId)) {
		inventory.push(itemId);
		addedItems.push(itemId);
		updateInventoryDisplay();
		updateView();
		return true; // Předmět byl přidán
	}
	return false; // Předmět již v inventáři je
}

/**
 * Odebere předmět z inventáře (pro interakci Poláška).
 * @param {string} itemId ID předmětu.
 */
function removeItem(itemId) {
	const index = inventory.indexOf(itemId);
	if (index > -1) {
		inventory.splice(index, 1);
		updateInventoryDisplay();
		return true;
	}
	return false;
}

/**
 * Aktualizuje zobrazení inventáře.
 */
function updateInventoryDisplay() {
	inventoryDisplay.innerHTML = '';
	if (inventory.length === 0) {
		inventoryDisplay.innerHTML = '<p style="text-align: center; color: #5a4d3f; font-size: 0.9em;">Inventář je prázdný. Hledejte stopy!</p>';
		return;
	}

	inventory.forEach(itemId => {
		const item = INVENTORY_ITEMS[itemId];
		if (item) {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'inventory-item';
			itemDiv.title = item.tooltip;
			itemDiv.onclick = () => handleInventoryClick(itemId);
			const icon = document.createElement('i');
			icon.className = `fas ${item.icon} inventory-icon`;

			const name = document.createElement('span');
			name.textContent = item.name

			itemDiv.appendChild(icon);
			itemDiv.appendChild(name);
			inventoryDisplay.appendChild(itemDiv);
		}
	});
}

/**
 * Zpracuje kliknutí na předmět v inventáři.
 * @param {string} itemId ID předmětu (klíč z INVENTORY_ITEMS).
 */
function handleInventoryClick(itemId) {
	const item = INVENTORY_ITEMS[itemId];

	if (!item) return;

	const title = `<i class="fas ${item.icon}"></i> ${item.name}`;
	let content = item.tooltip || "K tomuto předmětu není žádný popis.";

	// --- OBECNÁ LOGIKA PRO OTEVÍRÁNÍ OBRÁZKŮ V LIGHTBOXU ---
	if (item.type === 'image' && item.popupText) {
		const imageUrl = extractImageUrl(item.popupText);

		if (imageUrl) {
			// Vytvoříme klikatelný náhled
			// Důležité: Tady do popupu vkládáme HTML z popupText, ale přidáme mu náš onclick
			const clickableHtml = item.popupText.replace(
				'<img',
				`<img onclick="event.stopPropagation(); showLightbox('${imageUrl}')"`
			);

			content += `<br>
                <br>
                <div class='inventory_img'>
                ${clickableHtml}`;
			content += '</div>';

		} else {
			content += `<br><br>_Chyba: Nebyla nalezena URL obrázku v popupText pro ${item.name}._`;
		}
	}else if (item.type === 'denik') {
		handleDenikClick();	
	}
	else if (item.popupText) {
		// Standardní zobrazení extra textu pro jiné typy (pokud je definován)
		content += `<br><br>${item.popupText}`;
	}
	// --------------------------------------------------------

	showPopup(`${title}<br><br>${content}`);
}

/**
 * Extrahuje URL obrázku ze značky <img>.
 * @param {string} htmlString Řetězec obsahující značku <img>.
 * @returns {string|null} URL obrázku nebo null.
 */
function extractImageUrl(htmlString) {
	// Hledá atribut 'src' v řetězci <img>
	const match = htmlString.match(/src=['"](.*?)['"]/);
	return match ? match[1] : null;
}


/**
 * Zobrazí lightbox s obrázkem v plném rozlišení.
 * @param {string} imagePath Cesta k obrázku mapy.
 */
window.showLightbox = function (imagePath) {
	// 1. Zavři aktuální textový popup, abys viděl lightbox
	//hidePopup('text-modal-backdrop');

	// 2. Najdi lightbox elementy
	const lightboxBackdrop = document.getElementById('lightbox-backdrop');
	const lightboxImage = document.getElementById('lightbox-image');

	// 3. Nastav cestu k obrázku a zobraz lightbox
	if (lightboxBackdrop && lightboxImage) {
		lightboxImage.src = imagePath;
		lightboxBackdrop.style.display = 'flex';
	} else {
		// Pro případ, že lightbox HTML není přítomen
		console.error("Lightbox elementy nebyly nalezeny!");
		showPopup(`Došlo k chybě při zobrazování mapy. Cesta k souboru: ${imagePath}`);
	}
}




// --- LOGIKA HOTSPOTŮ ---

/**
 * Zpracuje kliknutí na hotspot s komplexní logikou.
 * @param {object} item Data hotspotu.
 */
function handleHotspotClick(item) {
	switch (item.type) {
		case 'item':
			const added = addItem(item.itemKey);
			if (added) {

				//vizitka
				if(item.itemKey == 'vizitka') {
					solvedPuzzles.push('vizitka');
					MAP['frydecky_zamek']['N'].forward = 'u_muzea';
				}

				showPopup(`${item.text} <br><br><span class="add_item_text">Předmět přidán do inventáře.</span>`);
			} else {
				showPopup("Už jste toto místo prozkoumali. " + item.text.replace(/(\*+.*\*+)/g, ''));
			}
			break;

		case 'npc':
			handlePolasekInteraction(item);
			break;

		case 'puzzle':
			handlePuzzleInteraction(item);
			break;

		case 'text':
		default:
			showPopup(item.text);
			break;
	}
}

/**
 * Speciální logika pro Poláška (NPC).
 */
function handlePolasekInteraction(item) {

	console.log(item)
	console.log(solvedPuzzles)
	console.log(inventory)

	if (inventory.includes('lopatka') && inventory.includes('strep')) {

		console.log("polasek 1")
		
		showPopup("Archeolog: 'Hmmm...To jsou zajímavé střepy, vypadají jako ze 17. století. Podobných tu máme plno. <br><br>A má stará lopatka! Našel jste jí pod Štandlem? Díky že jste mi to donesl. Před lety jsem tam ve vykopávkách našel tento starý klíč. Nikdy nešel vyčistit. Zdá se, že se vám může hodit.'<br><br>Získali jste <span class='color-lighter-red'>černý klíč</span>!");
		
		removeItem('lopatka');
		removeItem('strep');
		solvedPuzzles.push('lopatka');
		solvedPuzzles.push('strep');

		addItem('cerny_klic');

	}
	else if(inventory.includes('strep') && !solvedPuzzles.includes('lopatka')) {

		console.log("polasek 2")

		showPopup("Archeolog: 'Hmmm...To jsou zajímavé střepy, vypadají jako ze 17. století. Podobných tu máme plno. Díky že jste to donesl. Doneste mi ještě něco zajímavého a dám vám něco na oplátku.'");
		
		removeItem('strep');
		solvedPuzzles.push('strep');
	}
	else if (inventory.includes('lopatka') && !solvedPuzzles.includes('strep')) {

		console.log("polasek 3")

		showPopup("Archeolog: 'Aha! Má stará lopatka! Našel jste ji pod Štandlem? Díky, že jste ji donesl. Doneste mi ještě něco zajímavého a dám vám něco na oplátku.'");
		
		removeItem('lopatka');
		solvedPuzzles.push('lopatka');
	}
	else if (inventory.includes('strep') && solvedPuzzles.includes('lopatka')) {

		console.log("polasek 5")

		showPopup("Archeolog: 'Hmmm...To jsou zajímavé střepy, vypadají jako ze 17. století. Podobných tu máme plno. Díky že jste to donesl. Tady máte na oplátku starý klíč, možná se vám bude hodit.' <br><br>Získali jste <span class='color-lighter-red'>černý klíč</span>!");
		
		removeItem('strep');
		addItem('cerny_klic');

		solvedPuzzles.push('strep');
	}
	else if (inventory.includes('lopatka') && solvedPuzzles.includes('strep')) {
		
		console.log("polasek 6")

		showPopup("Archeolog: 'Aha! Má stará lopatka! Našel jste ji pod Štandlem? Díky, že jste ji donesl. Tady máte na oplátku starý klíč, možná se vám bude hodit.' <br><br>Získali jste <span class='color-lighter-red'>černý klíč</span>!");
		
		removeItem('lopatka');
		addItem('cerny_klic');

		solvedPuzzles.push('lopatka');
	}
	else if (inventory.includes('cerny_klic')) {

		console.log("polasek 7")

		showPopup("Archeolog: 'Máte, vše co potřebujete. Jsem rád, že jsem se klíče zbavil. Nosil mi smůlu. Odneste ho raději někde zpět ke Štandlu.'");

	} else {
		showPopup("Archeolog: 'Víte že, v lesích kolem Štandlu se ukrývá plno starých tajemství? Pokud najdete něco zajímavého, rád se na to podívám.'");
	}

}

/**
 * Logika pro spuštění hádanky.
 */
function handlePuzzleInteraction(item) {
	if (currentArea === 'kamenna_tvar' && inventory.includes('cerny_klic')) {
		// Hádanka u Erbu

		showPopup("Použil jsem černý klíč na otvor ve tvaru klíčové dírky. Zdá se, že to spustilo nějaký mechanismus uvnitř erbu.");

		puzzleModalBackdrop.style.display = 'flex';

	}else if(currentArea === 'kamenna_tvar' && !inventory.includes('cerny_klic') && solvedPuzzles.includes('kameny_erb_detail')) {
		showPopup("cesta je volná.");
	}
	
	else if (currentArea === 'kamenna_tvar' && !inventory.includes('cerny_klic')) {
		showPopup("Kamenný erb je na porostlý mechem. Po bližším prozkoumání je pod mechem v prohlubni vidět otvor ve tvaru klíčové dírky.");
	} else {
		showPopup(item.text);
	}
}


/**
* Správný symbol je určen rotací kola a je vyčten z jeho datového atributu.
*/
window.solvePuzzle = function () {

	// 1. Získání aktuálně vybraného symbolu z každého kotouče
	// Předpokládá se, že aktuálně vybraný symbol je uložen v atributu data-current-symbol
	const sym1 = document.getElementById('wheel1').getAttribute('data-current-symbol').toUpperCase();
	const sym2 = document.getElementById('wheel2').getAttribute('data-current-symbol').toUpperCase();
	const sym3 = document.getElementById('wheel3').getAttribute('data-current-symbol').toUpperCase();
	const sym4 = document.getElementById('wheel4').getAttribute('data-current-symbol').toUpperCase();

	// Správné řešení pro kola 
	// sym1: 'ERB', sym2: 'LIST', sym3: 'KRIZ'/'KŘÍŽ', sym4: 'KORUNA'
	const correctSym1 = 'ERB';
	const correctSym2 = 'LIST';
	const correctSym3 = 'KRIZ';
	const correctSym4 = 'KORUNA';

	// 2. Kontrola řešení
	if (sym1 === correctSym1 &&
		sym2 === correctSym2 &&
		(sym3 === correctSym3) &&
		sym4 === correctSym4) {

		hidePopup('puzzle-modal-backdrop');
		showPopup('Mechanismus zaskřípe a s hlasitým duněním se balvan odsune. <br><br><span class="color-lighter-red">Objevil se tajný vstup do jeskyně!</span><br><br> Nyní se musím pouze odhodlat a jít vpřed.');

		solvedPuzzles.push('kameny_erb_detail');
		removeItem('cerny_klic');

		// nasměrovat na kamen
		currentArea = 'kamenny_erb';
		currentDirectionIndex = 3;

		// Otevření nové cesty do Jeskyně
		MAP['kamenny_erb']['W'].forward = 'jeskyne';

		// Zrušení hádanky, už není potřeba
		const puzzleHotspot = MAP['kamenna_tvar']['E'].items.find(i => i.type === 'puzzle');
		if (puzzleHotspot) puzzleHotspot.text = "Vstup do jeskyně je nyní otevřen.";

		updateView();

	} else {
		
		showPopup('Nic se nestalo. Nastavení disků není správné.');
	}
}


/**
 * Logika pro konec
 */
function handleKonec() {
	if (currentArea === 'konec') {
		showPopup("<span class='color-lighter-red'>Temnota pohltila okolí...</span><br><br>Kámen se zavalil zpět a pochodně zhasly. Nyní tě nejspíš čeká stejný osud jako Černou Barboru! <br><br> <span class='color-lighter-red'>Konec hry</span>");
	} 
}


// --- VYKRESLENÍ POHLEDU ---

function renderHotspots() {
	
	// Odebere všechny prvky, které nejsou overlay nebo popisky
	const removableElements = Array.from(viewport.children).filter(el =>
		!el.classList.contains('loading-overlay') &&
		!el.classList.contains('direction-label') &&
		!el.classList.contains('area-label') &&
		!el.classList.contains('pohled-label') &&
		!el.classList.contains('start-screen') &&
		!el.classList.contains('save-game') &&
		!el.classList.contains('denik')
	);
	removableElements.forEach(el => el.remove());

	const currentDir = DIRECTIONS[currentDirectionIndex];
	const viewData = MAP[currentArea][currentDir];

	if (viewData.items && viewData.items.length > 0) {
		viewData.items.forEach(item => {

			if(addedItems.includes(item.itemKey) && item.type === 'item') {
				// Pokud už byl předmět přidán do inventáře, nevytvářej hotspot
				return;
			}
			
			// Vytvoření hotspotu

			const hotspot = document.createElement('div');
			hotspot.className = 'hotspot';
			// Hotspoty se umisťují relativně k viewportu
			hotspot.style.left = `${item.x / VIEWPORT_WIDTH * 100}%`;
			hotspot.style.top = `${item.y / VIEWPORT_HEIGHT * 100}%`;
			hotspot.title = "Prozkoumat";
			// Nastavení volání handleHotspotClick
			hotspot.onclick = () => handleHotspotClick(item, solvedPuzzles);
			viewport.appendChild(hotspot);
		});
	}
}

function updateView() {
	const currentDir = DIRECTIONS[currentDirectionIndex];
	const areaData = MAP[currentArea];
	const viewData = areaData[currentDir];
	const pohled = areaData[currentDir].pohled;

	console.log(`Pohled: ${pohled}`);

	// 1. Zobrazení indikátoru načítání
	loadingOverlay.style.display = 'flex';
	viewport.style.backgroundImage = 'none';

	// 2. Přednačtení obrázku
	const img = new Image();
	img.onload = () => {

		let bgr_img = viewData.img;

		//vyjimka - sebrana mapa
		if(inventory.includes('mapa') && currentArea === 'informacni_cedule' && currentDir === 'S') {
			bgr_img = `../assets/bgr/informacni_cedule/informacni_cedule_S.png`;
		}

		//vyjimka - sebrana lopatka
		if( (inventory.includes('lopatka') || solvedPuzzles.includes('lopatka') ) && currentArea === 'vykopavky' && currentDir === 'E') {
			bgr_img = `../assets/bgr/vykopavky/vykopavky_E_bez.png`;
		}

		//vyjimka - odemkla jeskyne
		if(solvedPuzzles.includes('kameny_erb_detail') && currentArea === 'kamenny_erb' && currentDir === 'W') {
			bgr_img = `../assets/bgr/kamenny_erb/kamenny_erb_W_odvalen.png`; //odvaleny balvan do jeskyne
		}

		//vyjimka - sebrany denik
		if(inventory.includes('denik') && currentArea === 'jeskyne' && currentDir === 'W') {
			bgr_img = `../assets/bgr/jeskyne/jeskyne_W_bez.png`;
		}

		viewport.style.backgroundImage = `url('${bgr_img}')`;

		loadingOverlay.classList.remove('visible');

		setTimeout(() => {
			loadingOverlay.style.display = 'none';
		}, 250);

		// 3. Aktualizace popisků
		directionLabel.textContent = `Směr: ${currentDir}`;
		areaLabel.textContent = `Oblast: ${areaData.name}`;
		pohledLabel.textContent = `${pohled}`;

		// 4. Aktualizace stavu tlačítka Vpřed
		if (viewData.forward) {
			forwardButton.disabled = false;
			forwardButton.title = `Pokračovat směrem ${MAP[viewData.forward].name}`;
			forwardButton.textContent = 'Vpřed';
		} else {
			forwardButton.disabled = true;
			forwardButton.title = "Dál jít nechci.";
			forwardButton.textContent = 'Vpřed';
		}

		// 5. Vykreslení Hotspotů a Inventáře
		renderHotspots();
		updateInventoryDisplay();


		//jeskyne - prvni prichod
		if(currentArea === 'jeskyne' && currentDir === 'W' && !solvedPuzzles.includes('jeskyne_prichod')) {
			showPopup("Proboha! To je snad Černá Barbora! <br> Kdysi jsem četl o jejím příběhu v městské kronice. Ale myslel jsem, že je to pouze pověra!");
			solvedPuzzles.push('jeskyne_prichod');
		}

	};

	img.onerror = () => {
		// Přesměrování na placeholder v případě chyby načítání
		viewport.style.backgroundImage = `url('https://placehold.co/800x600/600000/ffffff?text=Temnota+pohltila+obraz!')`;
		loadingOverlay.style.display = 'none';
		directionLabel.textContent = `Směr: ${currentDir}`;
		pohledLabel.textContent = `${pohled}`;
		areaLabel.textContent = `Oblast: ${areaData.name} (Temnota pohltila obraz!)`;
		forwardButton.disabled = true;
		renderHotspots();
	};

	img.src = viewData.img;

	//vyjimka - sebrana vizitka
	if(solvedPuzzles.includes('vizitka')){
		MAP['frydecky_zamek']['N'].forward = 'u_muzea';
	}

	//odemkla jeskyne
	if(solvedPuzzles.includes('kameny_erb_detail')) {
		MAP['kamenny_erb']['W'].forward = 'jeskyne';
		MAP['kamenny_erb']['W'].items = []; //zrusit hotspot
	}
}

// --- POHYBOVÉ FUNKCE ---
window.turnLeft = function () {
	currentDirectionIndex = (currentDirectionIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length;

	loadingOverlay.style.display = 'flex';
	
	setTimeout(() => {
		loadingOverlay.classList.add('visible'); 
	}, 10);

	setTimeout(() => {;
		updateView();
	}, 250)
}

window.turnRight = function () {
	currentDirectionIndex = (currentDirectionIndex + 1) % DIRECTIONS.length;

	loadingOverlay.style.display = 'flex';

	setTimeout(() => {
		loadingOverlay.classList.add('visible'); 
	}, 10);

	setTimeout(() => {;
		updateView();
	}, 250)

	
}

window.moveForward = function () {
	const currentDir = DIRECTIONS[currentDirectionIndex];
	const viewData = MAP[currentArea][currentDir];

	//jeskyne - zakazani vystupu kdyz nemam denik
	if(currentArea === 'jeskyne' && currentDir === 'E' && !inventory.includes('denik')) {
		if(!inventory.includes('denik')) {
			showPopup("Ještě se tady porozhlédnu.");
			return;
		}
	}

	if (viewData.forward) {
		currentArea = viewData.forward;

		loadingOverlay.style.display = 'flex';

		setTimeout(() => {
			loadingOverlay.classList.add('visible'); 
		}, 10);

		setTimeout(() => {
			currentArea = viewData.forward;
            updateView();
		}, 500)
		
	}

	if(currentArea === 'konec') {
		handleKonec();
	}
}

// --- INICIALIZACE ---
window.onload = function () {
	
	updateView();

	let ovladaci_prvky = document.getElementById('ovladaci_prvky');

	let start_btn = document.getElementById('spustit_hru');
	let load_btn_start = document.getElementById('nacist_hru_start');
	let load_btn = document.getElementById('nacist_hru');
	let save_btn = document.getElementById('ulozit_hru');

	ovladaci_prvky.style.display = 'none';
	
	start_btn.onclick = () => {
		
		let saved_game = this.localStorage.getItem("saved_game");
		let potvrzeni = true;
		if(saved_game.length > 0) {
			potvrzeni = this.confirm("Chcete hru spustit? Předchozí uložená hru bude smazána.");
		}

		if(potvrzeni) {
			startScreen.style.display = 'none';
			this.localStorage.setItem("hra_spustena", 1);
			this.localStorage.setItem("saved_game", "");
			ovladaci_prvky.style.display = 'block';
			updateView();
		}
		
	};

	/* LOAD GAME*/

	load_btn_start.onclick = () => {
		nacistHru();
	};

	load_btn.onclick = () => {
		let potvrzeni_nacteni = this.confirm("Chcete načíst uloženou hru?");
		if(potvrzeni_nacteni) {
			nacistHru();
		}
	};

	/* SAVE GAME */
	save_btn.onclick = () => {

		let potvrzeni_ulozeni = this.confirm("Chcete uložit hru?");

		if(potvrzeni_ulozeni) {

			let saved_game = {
				currentArea: currentArea,
				currentDirectionIndex: currentDirectionIndex,
				inventory: inventory,
				solvedPuzzles: solvedPuzzles,
				addedItems: addedItems
			};

			this.localStorage.setItem("saved_game", JSON.stringify(saved_game));

			if(this.localStorage.getItem("saved_game").length > 0) {
				alert("Hra byla uložena.");
			}
		}
	};

	/* CREDITS */

	let credits = document.getElementById('credits_link');
	credits.onclick = () => {

		let popupText = 
			"Vytvořil: <span class='color-lighter-red'>Jan Gerek</span><br><br>" +
			"Pomáhali: <br><br>"+
				"<ul class='credits-ul'>" +
					"<li><i class='fas fa-photo-film'></i> <a href='https://www.photos.google.com' target='_blank'>Google Photos</a>, <a href='https://www.photopea.com/' target='_blank'>Photopea</a></li>" +
					"<li><i class='fas fa-robot'></i> <a href='https://gemini.google.com/' target='_blank'>Google Gemini</li>" +
					"<li><i class='fas fa-font-awesome'></i> <a href='https://fontawesome.com/' target='_blank'>Font Awesome</li>"+
				"</ul>"

		showPopup(popupText);
	};

	/* zavrit denik */
	let close_denik = document.getElementById('zavrit_denik');
	close_denik.onclick = () => {
		let denik = document.getElementById('denik');
		denik.style.display = 'none';
	};

	/* NAPOVEDA */

	let napoveda_link = document.getElementById('napoveda_link');
	napoveda_link.onclick = () => {
		let napoveda = document.getElementById('napoveda');
		napoveda.style.display = 'flex';
	};

	/* zavrit napoveda */
	let close_napoveda = document.getElementById('zavrit_napoveda');
	close_napoveda.onclick = () => {
		let napoveda = document.getElementById('napoveda');
		napoveda.style.display = 'none';
	};

};

function nacistHru(){

	let saved_game_json = this.localStorage.getItem("saved_game");

	if(saved_game_json.length == 0) {
		alert("Žádná uložená hra k načtení.");
		return;
	}else{

		startScreen.style.display = 'none';

		let saved_game = JSON.parse(saved_game_json);

		currentArea = saved_game.currentArea;
		currentDirectionIndex = saved_game.currentDirectionIndex;
		inventory = saved_game.inventory;
		solvedPuzzles = saved_game.solvedPuzzles;
		addedItems = saved_game.addedItems;

		this.localStorage.setItem("hra_spustena", 1);

		ovladaci_prvky.style.display = 'block';

		updateView();
	}
}

window.addEventListener('beforeunload', function (e) {

	e.preventDefault();

	let hra_spustena = this.localStorage.getItem("hra_spustena");
	if (hra_spustena == "1") {
		return 'Jste si jisti, že chcete opustit stránku?';
	}

});


/**
 * Inicializace posluchačů událostí pro otáčení kol
 */
document.addEventListener('DOMContentLoaded', function() {
    const wheels = document.querySelectorAll('.wheel');
    wheels.forEach(wheel => {
        wheel.addEventListener('click', rotateWheel);
    });
});

/**
 * Funkce pro otočení jednoho kotouče o 90 stupňů a aktualizaci datového atributu
 * @param {Event} event 
 */
function rotateWheel(event) {
    const wheel = event.currentTarget;
    
    // 1. Získání a aktualizace indexu rotace (0, 1, 2, 3)
    let currentIndex = parseInt(wheel.getAttribute('data-current-index'));
    currentIndex = (currentIndex + 1) % 4;
    wheel.setAttribute('data-current-index', currentIndex);
    
    // 2. Aplikování CSS rotace
    const degrees = currentIndex * 90;
    wheel.style.transform = `rotate(${degrees}deg)`;
    
    // 3. Aktualizace aktuálně vybraného symbolu (ten, který je na pozici 0°/nahoře)
    // data-symbols je pole symbolů v pořadí: Nahoře (0°), Vpravo (90°), Dole (180°), Vlevo (270°)
    const symbols = JSON.parse(wheel.getAttribute('data-symbols'));
    
    // Index symbolu, který se dostal pod šipku (nahoru)
    // Pokud je kotouč otočen o 90° (index 1), tak se pod šipku dostal symbol, který byl na pozici 90° (Vpravo).
    const currentSymbol = symbols[currentIndex];
    
    wheel.setAttribute('data-current-symbol', currentSymbol.toUpperCase());
    
    // Volitelné: Pro zobrazení debug informací v konzoli
    console.log(`Kotouč ${wheel.id} otočen na index ${currentIndex} (${degrees}deg). Vybraný symbol: ${currentSymbol}`);
}

const denik_zapisy = {
	1: {
		"den": "8. února 1728",
		"text": "Dnes jsem vstala před úsvitem a ve studených zdech kláštera se modlila za klid, který stále nepřichází. Při práci v kuchyni jsem opět cítila, že mé srdce patří jinam, a i když se snažím být poslušná, mé myšlenky utíkají ven z kláštera k životu, který jsem si nikdy nedovolila žít."
	},
	2: {
		"den": "9. února",
		"text": "Matka představená dnes hovořila o ctnostech, ale každé její slovo mi připadalo jako další kámen na mé hrudi. V zahradě jsem se snažila najít pokoj, avšak přepadaly mě myšlenky na rytíře Harasovského a na to, zda jsem vůbec kdy byla určena k řeholnímu životu."
	},
	3: {
		"den": "10. února",
		"text": "Dnes v noci mě probudil sen, v němž na mě někdo stále volal, a já pochopila, že již déle nemohu popírat volání svého srdce. S modlitbou na rtech, ale s neklidem v duši, jsem se rozhodla. Zítra opustím klášter! A budu hledat vlastní cestu mimo jeho zdi."
	},
	4: {
		"den": "11. února",
		"text": "Utekla jsem z kláštera. Pod rouškou noci jsem došla až na Štandl, kde na mne měl čekat rytíř Harasovský. Teď sedím v tichu mezi chladnými kameny a čekám na něj. Proč stále nepřichází? Bojím se, že jsem udělala chybu."
	},
	5: {
		"den": "12. února",
		"text": "Dnešní ráno bylo mrazivé, probudil mne silný vítr a když jsem otevřela oči, spatřila jsem podivného muže, který vypadal jako by přišel z jiné doby. Stál nehybně nade mnou a hlubokým hlasem mi řekl, abych našla jakýsi balvan. Za ním prý najdu své štěstí. Symbolům a klíči jenž mi předal však nerozumím."
	},
	6: {
		"den": "12. února - večer",
		"text": "Už se stmívalo, ale ten balvan jsem našla. Na něm byla podivná rytina, která mi připomínala obličej onoho záhadného muže. Po chvíli jsem nalezla klíčovou dírku, do které vpadl klíč. Hlavolam, co se objevil ale stále nemohu rozluštit."
	},
	7: {
		"den": "13.února",
		"text": "Zkoušela jsem to celou noc, ale nakonec jsem to rozluštila! Vstoupila jsem do temné jeskyně. Uvnitř ležel hrob dávného krále obklopený poklady, jež se třpytily ve světle mé svíce. Vzala jsem si jen pár zlatých mincí. Když jsem se však obrátila k východu a vydala se zpět, čekalo mne strašné překvapení. Vchod se zavalil a já zůstala uvězněna."
	},
	8: {
		"den": "14. února 1728",
		"text": "Už nevím, kolik hodin jsem tu, v naprosté temnotě, kde slyším jen vlastní dech a kapání vody. Modlím se, aby mě někdo našel, nebo aby se skála slitovala a znovu se otevřela, ale má víra se třese stejně jako ruce, kterými píšu tento poslední záznam. Má poslední svíce dohořívá… a až zhasne, zůstane jen tma......."
	}
	
};

function handleDenikClick(){

	let denik = document.getElementById('denik');
	let denik_zapisy_div = document.getElementById('denik_zapisy');

	denik.style.display = 'flex';

	Object.values(denik_zapisy).forEach((zapis) => {

		let zapis_element = document.createElement('div');
		zapis_element.classList.add('zapis');
		zapis_element.innerHTML = `
			<div class="den">${zapis.den}</div>
			<div class="text">${zapis.text}</div>
		`;
    	denik_zapisy_div.appendChild(zapis_element);

	});

}
