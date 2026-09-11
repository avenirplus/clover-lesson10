(()=>{
'use strict';
const map=window.LESSON_PHRASE_READING||(window.LESSON_PHRASE_READING={});
const patch={
  '2-(3)':{en:['He never comes to see me','without leaving something behind.'],ja:['彼は決して私に会いに来ません','何かを置き忘れずには'],naturalJa:'彼は私に会いに来るときには必ず何か忘れ物をします．'},
  '2-(4)':{en:['The quality of the food at that restaurant','has declined','ever since the arrival of the new manager.'],ja:['あのレストランの料理の質は','落ちてきています','新しい経営者が来て以来ずっと'],naturalJa:'新しい経営者が来て以来ずっと，あのレストランの料理の質は落ちてきている．'},
  '3-(1)':{en:['Many young people these days','seem to be indifferent to what is happening','in the world.'],ja:['今日の多くの若者は','起きていることに無関心のように思えます','世界で'],naturalJa:'今日の多くの若者は世界で起きていることに無関心のように思える．'},
  '3-(3)':{en:['The student population of this university','is composed of people','from all over the world.'],ja:['この大学の学生は','人々で構成されています','その人々は世界中から来ています'],naturalJa:'この大学の学生は世界中から来た人々で構成されています．'},
  '4-(4)':{en:['How long does it take','to get there by bus?','Fifteen minutes.'],ja:['どのくらい時間がかかりますか','バスでそこへ行くのに','15分です'],naturalJa:'A「そこへ行くのにバスでどのくらいかかりますか」B「15分です」'},
  '4-(6)':{en:['I feel like','I’ve been running around in circles','these days.','Join the club.'],ja:['私は～のような気がします','ずっと空回りしている','最近','私も同じだよ'],naturalJa:'A「最近空回りしている気がするんだ．」B「私も同じだよ．」'},
  '4-(10)':{en:['I heard','Tom was in favor of your plan.','On the contrary,','he turned it down.'],ja:['私は聞きました','トムはあなたの計画に賛成だと','それどころか','彼はそれを断りました'],naturalJa:'A「トムは君の計画に賛成だって聞いたけど．」B「とんでもない，はねつけたよ．」'},
  '5-(2)':{en:['Your mother must be very proud of your winning.'],ja:['お母様はあなたが優勝したことを，きっととても誇りに思っているでしょう'],naturalJa:'あなたが優勝して，さぞかしお母様も鼻が高いでしょう．'},
  '5-(5)':{en:['People today cannot help living','with their eyes on the clock.'],ja:['現代人は暮らさざるをえません','時計を気にしながら'],naturalJa:'現代人は時計とにらめっこしながら暮らさざるをえない．'},
  '5-(6)':{en:['Who can believe','that the future will bring nothing but sorrow?'],ja:['だれが信じるでしょうか','未来が悲しみだけをもたらすなどと'],naturalJa:'未来には悲しみばかりだ，などとだれが信じるものか．'},
  '5-(7)':{en:['Mary was late for her classes.','She tried to make as many excuses as possible','for why she was late.'],ja:['メアリーは授業に遅刻しました','彼女はできるだけ多く言い訳をしようとしました','なぜ遅れたのかについて'],naturalJa:'メアリーは授業に遅刻した．彼女はなぜ遅れたのか可能な限り弁解しようとした．'}
};
Object.assign(map,patch);
window.CLOVER_PHRASE_READING_RULES={version:'1.0',principles:['意味のまとまりを最優先','文法単位を壊さない','英語の情報提示順に日本語を対応','通常3〜8語を目安にするが語数より構造を優先','短文1〜2，普通2〜4，長文3〜6チャンクを目安','教師のBank編集を最優先'],doNotSplit:['冠詞＋名詞','形容詞＋名詞','所有格＋名詞','前置詞＋目的語','助動詞＋動詞','to＋動詞','句動詞・熟語・定型表現','短い動詞＋目的語','短いbe動詞＋補語']};
})();
