import React, { useState, useEffect } from 'react';
import p5 from 'p5';
import Mountain from '../utils/mountain';
import { load } from 'jinrishici';
import './App.css';

const loadAsync = (...args) =>
new Promise((resolve) => {
  load(...args.concat((result) => {
    resolve(result);
  }));
});

const colors = [
  {
      name: '黛紫',
      hexcode: '#574266'
  },
  {
      name: '青矾绿',
      hexcode: '#2c9678'
  },
  {
      name: '赭',
      hexcode: '#9c5333'
  },
  {
      name: '飞燕草蓝',
      hexcode: '#0f59a4'
  },
  {
      name: '胭脂',
      hexcode: '#c03f3c'
  },
  {
      name: '鹅冠红',
      hexcode: '#d11a2d'
  },
  {
      name: '尖晶玉红',
      hexcode: '#cc163a'
  },
  {
      name: '北瓜黄',
      hexcode: '#fc8c23'
  },
  {
      name: '蔻梢绿',
      hexcode: '#5dbe8a'
  },
  {
      name: '枯绿',
      hexcode: '#b78d12'
  },
  {
      name: '宝蓝',
      hexcode: '#4B5CC4'
  },
  {
      name: '枇杷黄',
      hexcode: '#fca106'
  },
  {
      name: '苍蓝',
      hexcode: '#134857'
  },
  {
      name: '玄青',
      hexcode: '#3D3B4F'
  },
  {
      name: '嫩菱红',
      hexcode: '#de3f7c'
  }
]
let speed = 1.; 
let value = 0.0;
let MAX = 255;

const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [state, setState] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return state;
};

const App = () => {
  const { width, height } = useWindowSize();
  const [ loop, setLoop ] = useState(false);
  const [ p5Instance, setP5Instance ] = useState();
  const [ colorSelect, setColorSelect ] = useState();
  let font;
  const playerRain = React.createRef();
  const playerMusic = React.createRef();
  const wrapperRef = React.createRef();

  useEffect(() => {
    let canvasInstance = new p5(sketch, wrapperRef.current)
    return () => {
      canvasInstance.remove()
    }
  }, [])

  const fetchVerses = async (p) => {
    let res = await loadAsync()
    let { content, matchTags, origin } = res.data
    p.verses = {
      author: origin.author,
      title: origin.title,
      translate: origin.translate,
      matchTags,
      content
    }
    p.redraw()
  }

  const growMountains = (p) => {
    const randomColor = p.random(colors)
    setColorSelect(randomColor)
    let c = p.color(randomColor.hexcode)

    return new Array(5).fill(1).map((_, i) => {
        let a = 255 - 50 * i
        c.setAlpha(a)
        let h = height - 50 * i
        return new Mountain(c, h)
    })
  }

  const sketch = (p) => {
    setP5Instance(p)
    p.preload = () => {
      font = p.loadFont("/assets/fonts/方正楷体.ttf")
    }

    p.setup = async () => {
      fetchVerses(p)
      p.createCanvas(width, height)
      p.background(230)
      p.textAlign(p.CENTER, p.CENTER)
      p.mountains = growMountains(p)
      loop ? p.loop() : p.noLoop()
    }

    p.draw = () => {
      p.background(230)
    
      if(p.verses){
        value += speed
        let fade = ((p.sin(p.radians(value))+1)/2)*MAX
        p.fill(0, fade)    
        p.textFont(font)
        p.textSize(40)
        p.text(p.verses.content, width / 2, height / 3)
        let nextContentHeight = 50
        const { matchTags } = p.verses
        if(matchTags) {
          p.textSize(15)
          p.text(matchTags, width / 2, height / 3 + nextContentHeight)
          nextContentHeight += 50
        }
        p.textSize(20)
        p.text(`${p.verses.author} 《${p.verses.title}》`, width / 2, (height / 3) + nextContentHeight)
      }
      if(p.mountains){
        p.mountains.forEach(m => m.display(p))
      }
    }

    p.mouseClicked = (e) => {
      fetchVerses(p)
    }
  }

  return (
    <>
      <div className="colorName">{colorSelect?colorSelect.name:""}</div>
      <div className="container">
        <span className={ loop ? "icon-pause2" : "icon-play"} onClick={(e) => {
          const toggleState = !loop
          setLoop(toggleState)
          if(p5Instance){
            if(toggleState) {
              p5Instance.loop()
              playerRain.current.play()
              playerMusic.current.play()
            } else {
              p5Instance.noLoop()
              playerRain.current.pause()
              playerMusic.current.pause()
            }
          }
          e.stopPropagation()
        }}></span>
        <span className="icon-download3" onClick={(e) => {
          if(p5Instance){
            p5Instance.saveCanvas(p5Instance.canvas, p5Instance.verses.origin, 'jpg')
          }
          e.stopPropagation()
        }}></span>
      </div>
      <audio ref={playerRain} loop="loop" autoPlay={loop}>
          <source src="http://qianjires.xxoojoke.com/therain.m4a" type="audio/mp4"/>
          浏览器暂不支持此功能.
      </audio>
      <audio ref={playerMusic} loop="loop" autoPlay={loop}>
          <source src="http://qianjires.xxoojoke.com/In_Autumn_the_Leaves_Came_to_Our_House.mp3" type="audio/mp3" />
          浏览器暂不支持此功能.
      </audio>
      <div ref={wrapperRef} />
    </>
  )
}

export default App;