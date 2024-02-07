// JSONデータの構造例
const wordMappings =
{
  "フェーズ": [
    "ステージ"
  ],
  "商談": [
    "機会",
    "オポチュニティ",
    "Opportunity"
  ],
  "リード": [
    "見込み客"
  ],
  "大規模商談アラート": [
    "ビッグディールアラート"
  ],
  "主従関係": [
    "マスター/詳細",
    "マスター詳細",
  ],
  // "参照関係": [
  //   "ルックアップ"
  // ],
  "取引先責任者": [
    "連絡先",
    "お問い合わせ"
  ],
  "フローの保存前更新": [
    "保存前のフロー",
    "フローを保存する前"
  ],
  "メール-to-ケース": [
    "メールからケースへ"
  ],
  "ToDo": [
    "タスク"
  ],
  "定期的なToDoを作成": [
    "Create Recurring series ofTasks"
  ],
  "選択リスト": [
    "ピックリスト",
    "piclist"
  ],
  "強調表示パネル": [
    "ハイライトパネル"
  ],
  "無効化": [
    "非アクティブ化"
  ],
  "確度": [
    "確率"
  ],
  "連動選択リスト": [
    "依存する選択リスト"
  ],
  "ナレッジ記事": [
    "知識記事"
  ],
  "商談履歴レポートタイプ": [
    "商談ステージ期間レポート"
  ],
  "レコードの一括更新": [
    "物質移動ツール"
  ],
  "Chatter": [
    "おしゃべり",
    "会話"
  ],
  "キャンペーンインフルエンス": [
    "キャンペーンの影響"
  ],
  "パス": [
    "道"
  ],
  "個人取引先": [
    "個人のアカウント"
  ],
  "ロール階層": [
    "役割階層"
  ],
  "共有ルール": [
    "ルールの共有"
  ],
  "test.salesforce.com": [
    "test.saiesiorcc.com"
  ],
  "が存在する": [
    "セクシスト"
  ],
  "現在": [
    "ケラント"
  ],
  "組織": [
    "豚"
  ],
  "入力規則": [
    "検証ルール"
  ],
  "Lightning": [
    "稲妻"
  ],
  "価格表": [
    "PriceBook"
  ]
}

function replaceContextSpecificCases(text) {
  // "マスター/詳細ルックアップ"が含まれている場合は、"主従関係"に置き換え
  text = text.replace(/マスター\/詳細ルックアップ/g, "主従関係");

  // 上記の置き換え後、一般的な"ルックアップ"を"参照関係"に置き換え
  text = text.replace(/ルックアップ/g, "参照関係");

  //ルックアップフィルター
  text = text.replace(/参照関係フィルター/g, "ルックアップ検索条件");

  // "Salesforceアカウント"を保護するために、"Salesforce"の後ろにある"アカウント"は置き換えない
  // 負の後読みアサーションを使用して"アカウント"の前に"Salesforce"がないことを確認
  text = text.replace(/(?<!Salesforce)アカウント/g, "取引先");

  // パーミッションシリーズ。被るので色々調節
  // より具体的なフレーズから順に置き換え
  text = text.replace(/パーミッションセットグループ/g, '権限セットグループ');
  text = text.replace(/ミューティングパーミッションセット/g, 'ミュート権限セット');

  // 一般的な「パーミッション」を「権限」に置き換える際は、上記のフレーズに含まれる「パーミッション」が置き換えられないように注意
  text = text.replace(/(?<!セットグループの|ング)(パーミッション)(?!セット)/g, '権限');

  // 今度は項目シリーズ
  // 最も具体的なフレーズから置き換え
  text = text.replace(/ロールアップサマリーフィールド/g, '積み上げ集計項目');
  text = text.replace(/パスキーフィールド/g, 'パスの重要な項目');
  text = text.replace(/パス キーフィールド/g, 'パスの重要な項目');
  text = text.replace(/パス キー フィールド/g, 'パスの重要な項目');
  text = text.replace(/キーフィールド/g, '重要な項目');
  text = text.replace(/フィールドアップデート/g, '項目自動更新');

  // 「フィールドと関係」のように複数の単語が含まれるフレーズの置き換え
  text = text.replace(/フィールドと関係/g, '項目とリレーション');

  // 一般的な単語「フィールド」の置き換え、ただし上記のフレーズに含まれている場合は除外
  // 負の後読みおよび負の先読みを使用して、特定のフレーズの一部ではない場合にのみ「フィールド」を「項目」に置き換え
  text = text.replace(/(?<!ロールアップサマリー)(フィールド)(?!と関係)/g, '項目');

  return text;
}

// ページ内のテキストノードを走査して置き換える関数
function replaceText(node) {
  let text = node.nodeValue;

  // 特殊な置き替えルールを適用
  // text = replaceSpecialCases(text);
  text = replaceContextSpecificCases(text);

  Object.keys(wordMappings).forEach(targetWord => {
    wordMappings[targetWord].forEach(originalWord => {
      const regex = new RegExp(originalWord, 'g');
      text = text.replace(regex, targetWord);
    });
  });

  node.nodeValue = text;
}

function walk(node) {
  let child, next;

  switch (node.nodeType) {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;
    case 3: // Text node
      replaceText(node);
      break;
  }
}

walk(document.body);
