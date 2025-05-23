import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { Output, TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  tethers?: { [name: string]: string };
}

// TODO: ageless serpent knockback
// TODO: add tank lightning cleave stuff
// TODO: tether during right of the heavens 2
// TODO: burnt strike callouts during shifting/sundered sky
// TODO: move callout for holy burnt strike bait

// Notes:
// sinsmite = lightning elemental break
// sinsmoke = fire elemental break
// sinsight = light elemental break
// blastburn = burnt strike fire knockback
// burnout = burnt strike lightning out
// shining blade = burnt strike light bait

const boundOfFaithFireTetherResponse = (data: Data, _matches: unknown, output: Output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    stackOnYou: Outputs.stackOnYou,
    stackOnPlayer: Outputs.stackOnPlayer,
    unknownTarget: Outputs.unknown,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alertText: output.stackOnYou!() };
  if (targets.length === 0)
    return { alertText: output.stackOnPlayer!({ player: output.unknownTarget!() }) };
  return { alertText: output.stackOnPlayer!({ player: data.party.member(targets[0]) }) };
};

const boundOfFaithLightningTetherResponse = (data: Data, _matches: unknown, output: Output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    onYou: {
      en: 'Take Lightning To Tanks',
      de: 'Bring Blitz zu den Tanks',
      fr: 'Donnez l\'Éclair au tanks',
      ja: 'タンクに近づく',
      cn: '靠近坦克',
      ko: '번개징 탱커쪽으로',
    },
    tetherInfo: {
      en: 'Lightning on ${player}',
      de: 'Blitz auf ${player}',
      fr: 'Éclair sur ${player}',
      ja: '${player}に感電',
      cn: '雷点${player}',
      ko: '"${player}" 번개징 대상자',
    },
    unknownTarget: Outputs.unknown,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alarmText: output.onYou!() };

  const target = targets.length === 1 ? data.party.member(targets[0]) : output.unknownTarget!();
  return { infoText: output.tetherInfo!({ player: target }) };
};

const boundOfFaithHolyTetherResponse = (data: Data, _matches: unknown, output: Output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    awayFromGroup: Outputs.awayFromGroup,
    awayFromPlayer: Outputs.awayFromPlayer,
    unknownTarget: Outputs.unknown,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alarmText: output.awayFromGroup!() };
  if (targets.length === 0)
    return { infoText: output.awayFromPlayer!({ player: output.unknownTarget!() }) };
  return { infoText: output.awayFromPlayer!({ player: data.party.member(targets[0]) }) };
};

const triggerSet: TriggerSet<Data> = {
  id: 'EdensPromiseAnamorphosisSavage',
  zoneId: ZoneId.EdensPromiseAnamorphosisSavage,
  timelineFile: 'e11s.txt',
  triggers: [
    {
      id: 'E11S Elemental Break Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5663', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks',
          de: 'Himmelsrichtung -> Auf Partner sammeln',
          fr: 'Positions -> Packez-vous avec votre partenaire',
          ja: '8方向散開 -> ペア頭割り',
          cn: '八方 -> 2人分摊',
          ko: '8산개 -> 파트너 쉐어뎀',
        },
      },
    },
    {
      id: 'E11S Elemental Break Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5666', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread',
          de: 'Himmelsrichtung -> Verteilen',
          fr: 'Positions -> Dispersez-vous',
          ja: '8方向散開 -> 散開',
          cn: '八方 -> 分散',
          ko: '8산개 -> 산개',
        },
      },
    },
    {
      id: 'E11S Elemental Break Holy',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5668', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean -> Holy Groups',
          de: 'Himmelsrichtung -> Sanctus Gruppen',
          fr: 'Positions -> Groupes',
          ja: '8方向散開 -> 光3方向頭割り',
          cn: '八方 -> 光三向分摊',
          ko: '8산개 -> 홀리 그룹 쉐어',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5652', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Knockback',
          de: 'Linien AoE -> Rückstoß',
          fr: 'AoE en ligne -> Poussée',
          ja: '直線範囲 -> ノックバック',
          cn: '直线 -> 击退',
          ko: '직선 장판 -> 넉백',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5654', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
          de: 'Linien AoE -> Raus',
          fr: 'AoE en ligne -> Extérieur',
          ja: '直線範囲 -> 離れる',
          cn: '直线 -> 去外侧',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Holy',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5656', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave + Bait',
          de: 'Linien AoE -> Ködern',
          fr: 'AoE en ligne -> Déposez au sol',
          ja: '直線範囲 -> AoE誘導',
          cn: '直线 -> 光诱导',
          ko: '직선 장판 + 장판 유도',
        },
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => {
        data.tethers ??= {};
        data.tethers[matches.target] = matches.sourceId;
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector Cleanup',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      delaySeconds: 20,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E11S Bound Of Faith Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5658', capture: false },
      response: boundOfFaithFireTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '565B', capture: false },
      response: boundOfFaithLightningTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Holy',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '565F', capture: false },
      response: boundOfFaithHolyTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Shifting Sky',
      type: 'StartsUsing',
      // After Shifting Sky, there's a fire (567F) and lightning (5682) Bound Of Faith from Images.
      // After Sundered Sky, there's a fire (567F) and holy (5BC5) Bound Of Faith from Images.
      // These are the only time these Images appear and cast Bound Of Faith,
      // catch the first via 5682 and the second via 5BC5 and call two tethers with one trigger.
      netRegex: { source: 'Fatebreaker\'s Image', id: '5682' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          fireTetherOnYou: {
            en: 'Stack With Fire Tether',
            de: 'Auf der Feuer-Verbindung sammeln',
            fr: 'Packez-vous avec le lien de Feu',
            ja: '炎の線を頭割り',
            cn: '火分摊点名',
            ko: '화염 선 대상자, 쉐어뎀',
          },
          lightningTetherOnYou: {
            en: 'Take Lightning To Tanks',
            de: 'Bring Blitz zum Tank',
            fr: 'Donnez l\'Éclair aux tanks',
            ja: 'タンクに近づく',
            cn: '雷靠近坦克',
            ko: '번개 탱커한테 넘기기',
          },
          tetherInfo: {
            en: 'Lightning on ${player1}, Fire on ${player2}',
            de: 'Blitz auf ${player1}, Feuer auf ${player2}',
            fr: 'Éclair sur ${player1}, Feu sur ${player2}',
            ja: '${player1} に雷, ${player2} に炎',
            cn: '雷点${player1}，火点${player2}',
            ko: '"${player1}" 번개, "${player2}" 화염',
          },
        };

        if (!data.tethers)
          return;
        const targets = Object.keys(data.tethers);
        const [firstTarget, secondTarget] = targets;
        if (firstTarget === undefined || secondTarget === undefined || targets.length !== 2) {
          console.error(`Unknown Sundered Sky tether targets: ${JSON.stringify(data.tethers)}`);
          return;
        }

        let fireTarget;
        let lightningTarget;
        if (data.tethers[firstTarget] === matches.sourceId) {
          lightningTarget = firstTarget;
          fireTarget = secondTarget;
        } else if (data.tethers[secondTarget] === matches.sourceId) {
          fireTarget = firstTarget;
          lightningTarget = secondTarget;
        } else {
          console.error(
            `Weird Shifting Sky tether targets: ${JSON.stringify(data.tethers)}` +
              `, ${JSON.stringify(matches)}`,
          );
          return;
        }

        const tetherInfo = output.tetherInfo!({
          player1: data.party.member(lightningTarget),
          player2: data.party.member(fireTarget),
        });
        const response = { infoText: tetherInfo };
        if (lightningTarget === data.me)
          Object.assign(response, { alarmText: output.lightningTetherOnYou!() });
        if (fireTarget === data.me)
          Object.assign(response, { alertText: output.fireTetherOnYou!() });
        return response;
      },
    },
    {
      id: 'E11S Bound Of Faith Sundered Sky',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker\'s Image', id: '5BC5' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          fireTetherOnYou: {
            en: 'Stack With Fire Tether',
            de: 'Auf der Feuer-Verbindung sammeln',
            fr: 'Packez-vous avec le lien de Feu',
            ja: '炎の線を頭割り',
            cn: '火分摊点名',
            ko: '화염 선 대상자, 쉐어뎀',
          },
          holyTetherOnYou: Outputs.awayFromGroup,
          tetherInfo: {
            en: 'Holy on ${player1}, Fire on ${player2}',
            de: 'Sanctus auf ${player1}, Feuer auf ${player2}',
            fr: 'Sacre sur ${player1}, Feu sur ${player2}',
            ja: '${player1} に光, ${player2} に炎',
            cn: '光点${player1}，火点${player2}',
            ko: '"${player1}" 홀리, "${player2}" 화염',
          },
        };

        if (!data.tethers)
          return;
        const targets = Object.keys(data.tethers);
        const [firstTarget, secondTarget] = targets;
        if (firstTarget === undefined || secondTarget === undefined || targets.length !== 2) {
          console.error(`Unknown Sundered Sky tether targets: ${JSON.stringify(data.tethers)}`);
          return;
        }

        let fireTarget;
        let holyTarget;
        if (data.tethers[firstTarget] === matches.sourceId) {
          holyTarget = firstTarget;
          fireTarget = secondTarget;
        } else if (data.tethers[secondTarget] === matches.sourceId) {
          fireTarget = firstTarget;
          holyTarget = secondTarget;
        } else {
          console.error(
            `Weird Sundered Sky tether targets: ${JSON.stringify(data.tethers)}` +
              `, ${JSON.stringify(matches)}`,
          );
          return;
        }

        const tetherInfo = output.tetherInfo!({
          player1: data.party.member(holyTarget),
          player2: data.party.member(fireTarget),
        });
        const response = { infoText: tetherInfo };
        if (holyTarget === data.me)
          Object.assign(response, { alarmText: output.holyTetherOnYou!() });
        if (fireTarget === data.me)
          Object.assign(response, { alertText: output.fireTetherOnYou!() });
        return response;
      },
    },
    {
      id: 'E11S Burnished Glory',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '56A4', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'E11S Powder Mark',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '56A2' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E11S Powder Mark Explosion',
      type: 'GainsEffect',
      netRegex: { source: 'Fatebreaker', effectId: '993' },

      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.awayFromGroup!(),
      outputStrings: {
        awayFromGroup: Outputs.awayFromGroup,
      },
    },
    {
      id: 'E11S Turn of the Heavens Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '566A', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝圈',
          ko: '화염: 파랑으로',
        },
      },
    },
    {
      id: 'E11S Turn of the Heavens Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '566B', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红圈',
          ko: '번개: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Shifting Sky Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5675', capture: false },
      durationSeconds: 17,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝圈',
          ko: '화염: 파랑으로',
        },
      },
    },
    {
      id: 'E11S Shifting Sky Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5676', capture: false },
      durationSeconds: 17,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红圈',
          ko: '번개: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Right Of The Heavens Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '566E', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝门',
          ko: '화염: 파랑으로',
        },
      },
    },
    {
      id: 'E11S Right Of The Heavens Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '566F', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红门',
          ko: '번개: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5677', capture: false },
      durationSeconds: 16,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire: Knockback To Red -> Go Blue',
          de: 'Feuer: Rückstoß zu Rot -> Geh zu Blau',
          fr: 'Feu : Poussée sur le Rouge -> Allez sur le Bleu',
          ja: '炎: 赤にノックバック -> 青へ',
          cn: '火：向红门击退 -> 去蓝门',
          ko: '화염: 빨강으로 넉백 -> 파랑으로 이동',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5678', capture: false },
      durationSeconds: 16,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lightning: Knockback To Blue -> Go Red',
          de: 'Blitz: Rückstoß zu Blau -> Geh zu Rot',
          fr: 'Éclair : Poussée sur le Bleu -> Allez sur le Rouge',
          ja: '雷: 青にノックバック -> 赤へ',
          cn: '雷：向蓝门击退 -> 去红门',
          ko: '번개: 파랑으로 넉백 -> 빨강으로 이동',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '568A', capture: false },
      durationSeconds: 12,
      infoText: (_data, _matches, output) => output.text!(),
      tts: (_data, _matches, output) => output.ttsText!(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks -> Line Cleave -> Knockback -> Stack',
          de: 'Himmelsrichtung -> Auf Partner sammeln -> Linien AoE -> Rückstoß -> Sammeln',
          fr:
            'Positions -> Packez-vous avec votre partenaire -> Aoe en ligne -> Poussée -> Package',
          ja: '8方向散開 -> 2人頭割り -> 直線範囲 -> ノックバック -> 頭割り',
          cn: '八方 -> 分摊 -> 直线 -> 击退 -> 集合',
          ko: '8산개 -> 파트너 쉐어뎀 -> 직선 장판 -> 넉백 -> 모이기',
        },
        ttsText: {
          en: 'Fire Cycle',
          de: 'Mehrfache Vergeltung: Feuer',
          fr: 'Multi-taillade : Feu',
          ja: '魔装連続剣：ファイア',
          cn: '火连续剑',
          ko: '연속검: 화염',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Fire Tether',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '568A', capture: false },
      delaySeconds: 16.5,
      response: boundOfFaithFireTetherResponse,
    },
    {
      id: 'E11S Cycle of Faith Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5692', capture: false },
      durationSeconds: 12,
      infoText: (_data, _matches, output) => output.text!(),
      tts: (_data, _matches, output) => output.ttsText!(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread -> Line Cleave -> Out -> Tank Cleaves',
          de: 'Himmelsrichtung -> Verteilen -> Linien AoE -> Raus -> Tank AoEs',
          fr: 'Positions -> Dispersez-vous -> AoE en ligne -> Extérieur -> Tank cleaves',
          ja: '8方向散開 -> 散開 -> 直線範囲 -> 離れる -> タンクに雷範囲',
          cn: '八方 -> 分散 -> 直线 -> 远离直线 -> T接雷',
          ko: '8산개 -> 산개 -> 직선 장판 -> 밖으로 -> 광역 탱버',
        },
        ttsText: {
          en: 'Lightning Cycle',
          de: 'Mehrfache Vergeltung : Blitz',
          fr: 'Multi-taillade: Foudre',
          ja: '魔装連続剣：いなずま',
          cn: '雷连续剑',
          ko: '연속검: 번개',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Lightning Tether',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '5692', capture: false },
      delaySeconds: 16.5,
      response: boundOfFaithLightningTetherResponse,
    },
    {
      id: 'E11S Cycle of Faith Holy',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '569A', capture: false },
      durationSeconds: 12,
      infoText: (_data, _matches, output) => output.text!(),
      tts: (_data, _matches, output) => output.ttsText!(),
      outputStrings: {
        text: {
          en: 'Protean -> Holy Groups -> Line Cleave -> Bait -> Away',
          de: 'Himmelsrichtung -> Sanctus Gruppen -> Linien AoE -> Ködern -> Weg',
          fr: 'Positions -> Groupes -> AoE en ligne -> Déposez au sol -> Éloignez-vous',
          ja: '8方向散開 -> 3方向頭割り -> 直線範囲 -> AoE誘導 -> 離れる',
          cn: '八方 -> 光三向分摊 -> 直线 -> 光诱导 -> 连线远离人群',
          ko: '8산개 -> 홀리 그룹 쉐어 -> 직선 장판 -> 장판 유도 -> 피하기',
        },
        ttsText: {
          en: 'Holy Cycle',
          de: 'Mehrfache Vergeltung: Sanctus',
          fr: 'Multi-taillade : Lumière',
          ja: '魔装連続剣：ホーリー',
          cn: '光连续剑',
          ko: '연속검: 홀리',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Holy Tether',
      type: 'StartsUsing',
      netRegex: { source: 'Fatebreaker', id: '569A', capture: false },
      delaySeconds: 16.5,
      response: boundOfFaithHolyTetherResponse,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demi-Gukumatz': 'Demi-Gukumatz',
        'Fatebreaker\'s Image': 'Abbild des Banns der Hoffnung',
        'Fatebreaker(?!\')': 'Bann der Hoffnung',
        'Halo of Flame': 'Halo der Flamme',
      },
      'replaceText': {
        'Ageless Serpent': 'Alterslose Schlange',
        'Blastburn': 'Brandstoß',
        'Blasting Zone': 'Erda-Detonation',
        'Bound Of Faith': 'Sünden-Erdstoß',
        'Bow Shock': 'Schockpatrone',
        'Brightfire': 'Lichtflamme',
        '(?<!Mortal )Burn Mark': 'Brandmal',
        'Burnished Glory': 'Leuchtende Aureole',
        'Burnout': 'Brandentladung',
        'Burnt Strike': 'Brandschlag',
        'Cycle Of Faith': 'Mehrfache Vergeltung',
        'Elemental Break': 'Elementarbruch',
        'Floating Fetters': 'Schwebende Fesseln',
        'Mortal Burn Mark': 'Brandmal der Sterblichen',
        'Powder Mark': 'Pulvermal',
        'Prismatic Deception': 'Prismatische Unsichtbarkeit',
        'Resonant Winds': 'Resonante Winde',
        'Resounding Crack': 'Gewaltiger Bruch',
        'Right Of The Heavens': 'Vier Himmel',
        'Shifting Sky': 'Himmelsverschiebung',
        'Shining Blade': 'Leuchtende Klinge',
        'Sinsight': 'Sündenlicht',
        'Sinsmite': 'Sündenblitz',
        'Sinsmoke': 'Sündenflamme',
        'Solemn Charge': 'Wütende Durchbohrung',
        'Sundered Sky': 'Himmelstrennung',
        'Turn Of The Heavens': 'Kreislauf der Wiedergeburt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demi-Gukumatz': 'demi-Gukumatz',
        'Fatebreaker\'s image': 'double du Sabreur de destins',
        'Fatebreaker(?!\'s image)': 'Sabreur de destins',
        'Halo of Flame': 'halo de feu',
      },
      'replaceText': {
        '\\?': ' ?',
        'Ageless Serpent': 'Serpent éternel',
        'Blastburn': 'Explosion brûlante',
        'Blasting Zone': 'Zone de destruction',
        'Bound Of Faith': 'Percée illuminée',
        'Bow Shock': 'Arc de choc',
        'Brightfire': 'Flammes de Lumière',
        '(?<!Mortal )Burn Mark': 'Marque explosive',
        'Burnished Glory': 'Halo luminescent',
        'Burnout': 'Combustion totale',
        'Burnt Strike': 'Frappe brûlante',
        'Cycle Of Faith': 'Multi-taillade magique',
        'Elemental Break': 'Rupture élémentaire',
        'Floating Fetters': 'Entraves flottantes',
        'Mortal Burn Mark': 'Marque de conflagration',
        'Powder Mark': 'Marquage fatal',
        'Prismatic Deception': 'Invisibilité prismatique',
        'Resonant Winds': 'Tourbillon magique',
        'Resounding Crack': 'Turbulence magique',
        'Right Of The Heavens': 'Quatre portails',
        'Shifting Sky': 'Percée céleste ultime',
        'Shining Blade': 'Lame étincelante',
        'Sinsight': 'Lumière du péché',
        'Sinsmite': 'Éclair du péché',
        'Sinsmoke': 'Flammes du péché',
        'Solemn Charge': 'Charge perçante',
        'Sundered Sky': 'Percée infernale ultime',
        'Turn Of The Heavens': 'Cercles rituels',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demi-Gukumatz': 'デミグクマッツ',
        'Fatebreaker\'s image': 'フェイトブレイカーの幻影',
        'Fatebreaker(?!\'s image)': 'フェイトブレイカー',
        'Halo of Flame': '焔の光輪',
      },
      'replaceText': {
        'Ageless Serpent': '龍頭龍尾',
        'Blastburn': 'バーンブラスト',
        'Blasting Zone': 'ブラスティングゾーン',
        'Bound Of Faith': 'シンソイルスラスト',
        'Bow Shock': 'バウショック',
        'Brightfire': '光炎',
        '(?<!Mortal )Burn Mark': '爆印',
        'Burnished Glory': '光焔光背',
        'Burnout': 'バーンアウト',
        'Burnt Strike': 'バーンストライク',
        'Cycle Of Faith': '魔装連続剣',
        'Elemental Break': 'エレメンタルブレイク',
        'Floating Fetters': '浮遊拘束',
        'Mortal Burn Mark': '大爆印',
        'Powder Mark': '爆印刻',
        'Prismatic Deception': 'プリズマチックインビジブル',
        'Resonant Winds': '魔旋風',
        'Resounding Crack': '魔乱流',
        'Right Of The Heavens': '四天召',
        'Shifting Sky': '至天絶技',
        'Shining Blade': 'シャインブレード',
        'Sinsight': 'シンライト',
        'Sinsmite': 'シンボルト',
        'Sinsmoke': 'シンフレイム',
        'Solemn Charge': 'チャージスラスト',
        'Sundered Sky': '堕獄絶技',
        'Turn Of The Heavens': '転輪召',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Demi-Gukumatz': '亚灵羽蛇',
        'Fatebreaker\'s image': '绝命战士的幻影',
        'Fatebreaker(?!\'s image)': '绝命战士',
        'Halo of Flame': '焰之光轮',
      },
      'replaceText': {
        'Ageless Serpent': '龙头龙尾',
        'Blastburn': '火燃爆',
        'Blasting Zone': '爆破领域',
        'Bound Of Faith': '罪壤刺',
        'Bow Shock': '弓形冲波',
        'Brightfire': '光炎',
        '(?<!Mortal )Burn Mark': '爆印',
        'Burnished Glory': '光焰圆光',
        'Burnout': '雷燃爆',
        'Burnt Strike': '燃烧击',
        'Cycle Of Faith': '魔装连续剑',
        'Elemental Break': '元素破',
        'Floating Fetters': '浮游拘束',
        'Mortal Burn Mark': '大爆印',
        'Powder Mark': '爆印铭刻',
        'Prismatic Deception': '棱光幻影',
        'Resonant Winds': '魔旋风',
        'Resounding Crack': '魔乱流',
        'Right Of The Heavens': '四天召唤',
        'Shifting Sky': '至天绝技',
        'Shining Blade': '光明之刃',
        'Sinsight': '罪光',
        'Sinsmite': '罪雷',
        'Sinsmoke': '罪炎',
        'Solemn Charge': '急冲刺',
        'Sundered Sky': '堕狱绝技',
        'Turn Of The Heavens': '光轮召唤',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Demi-Gukumatz': '데미구쿠마츠',
        'Fatebreaker\'s image': '페이트브레이커의 환영',
        'Fatebreaker(?!\'s image)': '페이트브레이커',
        'Halo of Flame': '화염 빛무리',
      },
      'replaceText': {
        'Ageless Serpent': '용두용미',
        'Blastburn': '연소 폭발',
        'Blasting Zone': '발파 지대',
        'Bound Of Faith': '죄의 소일 일격',
        'Bow Shock': '원형충격파',
        'Brightfire': '광염',
        '(?<!Mortal )Burn Mark': '폭인',
        'Burnished Glory': '광염광배',
        'Burnout': '완전 연소',
        'Burnt Strike': '연소 공격',
        'Cycle Of Faith': '마장 연속검',
        'Elemental Break': '원소 파괴',
        'Floating Fetters': '부유 구속',
        'Mortal Burn Mark': '대폭인',
        'Powder Mark': '폭인각',
        'Prismatic Deception': '분광 은신',
        'Resonant Winds': '마선풍',
        'Resounding Crack': '마난류',
        'Right Of The Heavens': '사천 소환',
        'Shifting Sky': '지천절기',
        'Shining Blade': '빛나는 칼날',
        'Sinsight': '죄의 빛',
        'Sinsmite': '죄의 번개',
        'Sinsmoke': '죄의 화염',
        'Solemn Charge': '돌진격',
        'Sundered Sky': '타옥절기',
        'Turn Of The Heavens': '빛무리 소환',
      },
    },
  ],
};

export default triggerSet;
