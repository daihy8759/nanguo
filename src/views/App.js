/** @format */

import React, {useState, useEffect} from 'react'
import classNames from 'classnames'
import random from 'lodash/random'
import {Stage, Layer, Text, RegularPolygon} from 'react-konva'
import {load} from 'jinrishici'
import './App.css'

const loadAsync = (...args) =>
  new Promise(resolve => {
    load(
      ...args.concat(result => {
        resolve(result)
      }),
    )
  })

const colors = [
  {
    name: '黛紫',
    hexcode: '#574266',
  },
  {
    name: '青矾绿',
    hexcode: '#2c9678',
  },
  {
    name: '赭',
    hexcode: '#9c5333',
  },
  {
    name: '飞燕草蓝',
    hexcode: '#0f59a4',
  },
  {
    name: '胭脂',
    hexcode: '#c03f3c',
  },
  {
    name: '鹅冠红',
    hexcode: '#d11a2d',
  },
  {
    name: '尖晶玉红',
    hexcode: '#cc163a',
  },
  {
    name: '北瓜黄',
    hexcode: '#fc8c23',
  },
  {
    name: '蔻梢绿',
    hexcode: '#5dbe8a',
  },
  {
    name: '枯绿',
    hexcode: '#b78d12',
  },
  {
    name: '宝蓝',
    hexcode: '#4B5CC4',
  },
  {
    name: '枇杷黄',
    hexcode: '#fca106',
  },
  {
    name: '苍蓝',
    hexcode: '#134857',
  },
  {
    name: '玄青',
    hexcode: '#3D3B4F',
  },
  {
    name: '嫩菱红',
    hexcode: '#de3f7c',
  },
]

const useWindowSize = () => {
  const [state, setState] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return state
}

const App = () => {
  const {width, height} = useWindowSize()
  const [loop, setLoop] = useState(false)
  const [verses, setVerses] = useState({
    author: '王维',
    title: '相思',
    translate: '',
    matchTags: ['相思'],
    content: '红豆生南国，春来发几枝。',
  })
  const [settingVisible, setSettingVisible] = useState(false)
  const [form, setFormValues] = useState({
    rain: '',
    piano: '',
  })
  const stageRef = React.createRef()
  const playerRain = React.createRef()
  const playerMusic = React.createRef()
  const translateRef = React.createRef()
  const tooltipLayerRef = React.createRef()

  const loadConfigFromStore = () => {
    Object.keys(form).forEach(key => {
      if (localStorage.getItem(key) != null) {
        form[key] = localStorage.getItem(key)
      }
    })
  }

  const fetchVerses = async () => {
    const res = await loadAsync()
    const {content, matchTags, origin} = res.data
    setVerses({
      author: origin.author,
      title: origin.title,
      translate: origin.translate,
      matchTags,
      content,
    })
  }

  useEffect(() => {
    loadConfigFromStore()
    fetchVerses()
    return () => {}
  }, [])

  const updateField = e => {
    setFormValues({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="container">
        <span
          className={loop ? 'icon-pause2' : 'icon-play'}
          onClick={() => {
            const toggleState = !loop
            setLoop(toggleState)
            if (toggleState) {
              playerRain.current.load()
              playerRain.current.play()
              playerMusic.current.load()
              playerMusic.current.play()
            } else {
              playerRain.current.pause()
              playerMusic.current.pause()
            }
          }}
        />
        <span
          className="icon-download3"
          onClick={() => {
            let link = document.createElement('a')
            link.download = `${verses.title}.jpg`
            link.href = stageRef.current.toDataURL()
            link.click()
            link = null
          }}
        />
        <span
          className="icon-cog"
          onClick={() => {
            setSettingVisible(true)
          }}
        />
      </div>
      <audio ref={playerRain} loop="loop" autoPlay={loop}>
        <source src={form.rain} type="audio/mp4" />
        浏览器暂不支持此功能.
      </audio>
      <audio ref={playerMusic} loop="loop" autoPlay={loop}>
        <source src={form.piano} type="audio/mp3" />
        浏览器暂不支持此功能.
      </audio>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        style={{
          background: '#E6E6E6',
        }}
        onClick={() => {
          fetchVerses()
        }}>
        <Layer>
          {new Array(10).fill(1).map((_, i) => {
            const radius = Math.random() * 100 + 20
            const color = colors[random(colors.length - 1)]
            return (
              <RegularPolygon
                key={i}
                x={Math.random() * width}
                y={Math.random() * height}
                sides={Math.ceil(Math.random() * 5 + 3)}
                radius={radius}
                fill={color.hexcode}
                opacity={(radius - 20) / 100}
              />
            )
          })}
          <Text
            fontFamily="fzkt"
            onMouseOver={e => {
              const tooltip = translateRef.current
              tooltip
                .position({
                  x: e.evt.clientX + 5,
                  y: e.evt.clientY + 5,
                })
                .show()
              tooltipLayerRef.current.batchDraw()
            }}
            onMouseOut={() => {
              translateRef.current.hide()
              tooltipLayerRef.current.batchDraw()
            }}
            text={verses.content}
            width={width}
            y={height / 3}
            fontSize={40}
            align="center"
          />
          <Text
            fontFamily="fzkt"
            text={verses.matchTags.join(',')}
            width={width}
            y={height / 3 + 60}
            fontSize={15}
            align="center"
          />
          <Text
            fontFamily="fzkt"
            text={`${verses.author} 《${verses.title}》`}
            width={width}
            y={height / 3 + 100}
            fontSize={20}
            align="center"
          />
        </Layer>
        <Layer ref={tooltipLayerRef}>
          <Text
            ref={translateRef}
            fontFamily="fzkt"
            width={200}
            alpha={0.75}
            padding={5}
            visible={false}
            text={verses.translate}
            fontSize={15}
          />
        </Layer>
      </Stage>
      <div className={classNames('flavr-container modal center', {shown: settingVisible})}>
        <div className="flavr-overlay" />
        <div className="flavr-fixer">
          <div className="flavr-outer">
            <div className="flavr-content">
              <div className="flavr-message">
                <form className="flavr-form">
                  <div className="form-row">
                    <label>雨声：</label>
                    <input className="input" value={form.rain} name="rain" onChange={updateField} />
                  </div>
                  <div className="form-row">
                    <label>钢琴声：</label>
                    <input className="input" value={form.piano} name="piano" onChange={updateField} />
                  </div>
                </form>
              </div>
            </div>
            <div className="flavr-toolbar inline">
              <button
                type="button"
                className="flavr-button danger"
                onClick={() => {
                  Object.keys(form).forEach(key => {
                    if (form[key]) {
                      localStorage.setItem(key, form[key])
                    }
                  })
                  setSettingVisible(false)
                }}>
                确认
              </button>
              <button
                type="button"
                className="flavr-button default"
                onClick={() => {
                  setSettingVisible(false)
                }}>
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
