const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginHTMLParser = require('../src/plugin_htmlparser.js')
const assert_func = (a, b) => { assert.equal(a, b) }

describe('htmlparser_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginHTMLParser', PluginHTMLParser)
  // console.log(nako.gen.plugins)
  // nako.debug = true
  nako.setFunc('テスト', [['と'], ['で']], assert_func)
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.equal(nako.runReset(code).log, res)
  }
  const cmd = (code) => {
    if (nako.debug) console.log('code=' + code)
    nako.runReset(code)
  }
  // --- test ---
  it('表示', () => {
    cmp('3を表示', '3')
  })
  // --- テスト ---
  const html = '<html><body>' +
    '<h1 class="h1" id="h1" style="color:red">hoge</h1>' +
    '<a id="link" href="a.html">abc</a>' +
    '<ul><li class="hoge">aaa</li><li>bbb</li></ul></body></html>'
  it('basic', () => {
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「.hoge」のDOM要素取得して、テキスト取得して表示。`,
      'aaa')
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「.hoge」のテキスト取得して表示。`,
      'aaa')
  })
  it('rewite', () => {
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「.hoge」のDOM要素取得して、Aに代入。Aに「ccc」をHTML設定。Aのテキスト取得して表示。`,
      'ccc')
  })
  it('属性取得', () => {
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「#link」のDOM要素取得して、"href"を属性取得して表示。`,
      'a.html')
  })
  it('style', () => {
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「#h1」のDOM要素取得して、Aに代入。Aの"color"をスタイル取得して表示。`,
      'red')
  })
  it('タグ名取得', () => {
    cmp(
      `HTML=『${html}』;HTMLをHTMLパース;` +
      `「#link」のDOM要素取得して、Aに代入。Aのタグ名取得して表示。`,
      'a')
  })
  /*
  // 処理に時間がかかるのでパス
  it('逐次実行', (done) => {
    const url = 'https://nadesi.com/doc3/index.php?plugin_system'
    global.done = done
    cmd(
      '逐次実行\n' +
      `　先に、「${url}」をHTML逐次URL開く。\n` +
      '　次に、S=「title」のテキスト取得\n' +
      '　次に、Sと「plugin_system - なでしこ3」でテスト。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  */
})
