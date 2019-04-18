// plugin_htmlparser.js

const ERR_ASYNC = '『逐次実行』構文で使ってください。';
const ERR_PARSER = '『HTML逐次URL開』または『HTMLパース』を実行してHTMLパーサを利用可能にしてください。'

// モジュールローカル
const htmlObj = {}

// 文字列からDOMを取得して、エラーチェックもする
function getDom(query) {
  if (!htmlObj.$) throw new Error(ERR_PARSER)
  if (typeof query === "string") {
    const dom = htmlObj.$(query)
    if (!dom) throw new Error(`クエリ『${query}』が見当たりません。`)
    return dom
  }
  if (!query) throw new Error('空のDOMオブジェクトが指定されました。')
  return htmlObj.$(query)
}

const PluginHTMLParser = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__htmlparser = null;
      htmlObj.$ = null;
    }
  },

  // @HTMLパーサ(コンソール)
  'HTML応答ヘッダ': {type: 'const', value: ''}, // @HTMLおうとうへっだ
  'HTML逐次URL開': { // @任意のURLを開いてパースする。 // @HTMLちくじURLひらく
    type: 'func',
    josi: [['を']],
    fn: function (url, sys) {
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      const client = require('cheerio-httpcli')
      client.fetch(url, {}, function (err, $, res) {
        if (err) {
            throw new Error(`『${url}』の取得に失敗。` + err.message)
        }
        sys.__v0['HTML応答ヘッダ'] = res.headers
        sys.__htmlparser = $
        htmlObj.$ = $
        resolve()
      })
    }
  },
  'HTMLパース': { // @任意のHTML文字列をパースする。 // @HTMLぱーす
    type: 'func',
    josi: [['を']],
    fn: function (html, sys) {
      const client = require('cheerio')
      const $ = client.load(html)
      sys.__htmlparser = $
      htmlObj.$ = $
      return $
    }
  },
  'DOM要素取得': { // @パース済みHTMLからクエリQに該当するDOMを取得する // @DOMようそしゅとく
    type: 'func',
    josi: [['を','の','から']],
    fn: function (q, sys) {
      return getDom(q)
    }
  },
  'DOM子要素検索': { // @DOMの子要素Qを取得する // @DOMこようそけんさく
    type: 'func',
    josi: [['の','から'],['を']],
    fn: function (dom, q, sys) {
      const o = getDom(dom)
      return o.find(q)
    }
  },
  'DOM子要素全取得': { // @DOMの子要素を全部取得する // @DOMこようそぜんしゅとく
    type: 'func',
    josi: [['の','から']],
    fn: function (dom, sys) {
      const o = getDom(dom)
      return o.children()
    }
  },
  'DOM親要素取得': { // @DOMの親要素を取得する // @DOMおやようそしゅとく
    type: 'func',
    josi: [['を','の','から']],
    fn: function (q, sys) {
      return getDom(q).parent()
    }
  },
  'DOM抽出': { // @DOMからクエリQを利用して合致するものを抽出する // @DOMちゅうしゅつ
    type: 'func',
    josi: [['から','の'],['を']],
    fn: function (dom, q, sys) {
      const o = getDom(dom)
      return o.filter(q)
    }
  },
  '属性取得': { // @DOMの属性Kを取得する // @ぞくせいしゅとく
    type: 'func',
    josi: [['から','の'],['を']],
    fn: function (dom, k, sys) {
      const o = getDom(dom)
      return o.attr(k)
    }
  },
  'テキスト取得': { // @DOMのテキストを取得する // @てきすとしゅとく
    type: 'func',
    josi: [['から','の']],
    fn: function (dom, sys) {
      const o = getDom(dom)
      return o.text()
    }
  },
  'HTML取得': { // @DOMのHTMLを取得する // @HTMLしゅとく
    type: 'func',
    josi: [['から','の']],
    fn: function (dom, sys) {
      const o = getDom(dom)
      return o.html()
    }
  },
  'プロパティ取得': { // @DOMのプロパティPROPを取得する // @ぷろぱてぃしゅとく
    type: 'func',
    josi: [['から','の'],['を']],
    fn: function (dom, prop, sys) {
      const o = getDom(dom)
      return o.prop(prop)
    }
  },
  '値取得': { // @DOMの値を取得する // @あたいしゅとく
    type: 'func',
    josi: [['から','の']],
    fn: function (dom, sys) {
      const o = getDom(dom)
      return o.val()
    }
  },
  'スタイル取得': { // @DOMのスタイルKを取得する // @すたいるしゅとく
    type: 'func',
    josi: [['から','の'],['を']],
    fn: function (dom, k, sys) {
      const o = getDom(dom)
      return o.css(k)
    }
  },
  'データ取得': { // @DOMのデータkを取得する // @でーたしゅとく
    type: 'func',
    josi: [['から','の'],['を']],
    fn: function (dom, k, sys) {
      const o = getDom(dom)
      return o.data(k)
    }
  },
  'DOM配列変換': { // @DOMを // @DOMはいれつへんかん
    type: 'func',
    josi: [['から','の']],
    fn: function (dom, k, sys) {
      const o = getDom(dom)
      return o.toArray()
    }
  },
  'タグ名取得': { // @DOMのタグ名を取得する // @たぐめいしゅとく
    type: 'func',
    josi: [['から','の']],
    fn: function (dom, sys) {
      const o = getDom(dom)
      return o.tagName
    }
  }
}


module.exports = PluginHTMLParser

