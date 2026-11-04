import { useEffect, useRef, useState } from 'react'

// 10 БАЗОВЫХ ФИЗИЧЕСКИХ ПРЕДМЕТОВ
const BASE_OBJECTS = [
  { 
    id: 'book', 
    name: 'Открытая книга', 
    tags: ['книга', 'обучение', 'образование', 'знания', 'учеба', 'чтение', 'курс', 'интеллект', 'мудрость', 'история', 'теория'] 
  },
  { 
    id: 'phone', 
    name: 'Смартфон с пазлом', 
    tags: ['смартфон', 'телефон', 'гаджет', 'приложение', 'мобильный', 'экран', 'мемы', 'прикол', 'юмор', 'соцсети', 'контент', 'связь', 'развлечение'] 
  },
  { 
    id: 'headphones', 
    name: 'Наушники', 
    tags: ['наушники', 'музыка', 'аудио', 'звук', 'подкаст', 'поддержка', 'отдых', 'релакс', 'фан', 'ваайб', 'настроение', 'гейминг'] 
  },
  { 
    id: 'lamp', 
    name: 'Настольная лампа', 
    tags: ['лампа', 'свет', 'идея', 'вдохновение', 'офис', 'фокус', 'эврика', 'мысль', 'открытие', 'креатив', 'работа'] 
  },
  { 
    id: 'vase', 
    name: 'Ваза с тюльпанами', 
    tags: ['ваза', 'цветы', 'тюльпаны', 'декор', 'уют', 'весна', 'красота', 'эстетика', 'радость', 'подарок', 'праздник', 'настроение'] 
  },
  { 
    id: 'folder', 
    name: 'Папка с документами', 
    tags: ['папка', 'документы', 'бумаги', 'файлы', 'офис', 'проект', 'бизнес', 'система', 'порядок', 'отчет', 'бюрократия'] 
  },
  { 
    id: 'puzzle', 
    name: 'Детали пазла', 
    tags: ['пазл', 'детали', 'решение', 'логика', 'связь', 'элемент', 'игра', 'квест', 'прикол', 'совпадение', 'собирать', 'задача'] 
  },
  { 
    id: 'coin', 
    name: 'Монета с замком', 
    tags: ['монета', 'замок', 'безопасность', 'финансы', 'деньги', 'крипта', 'богатство', 'успех', 'капитал', 'защита', 'инвестиции'] 
  },
  { 
    id: 'wallet', 
    name: 'Кошелек', 
    tags: ['кошелек', 'деньги', 'финансы', 'оплата', 'карты', 'бюджет', 'покупки', 'шопинг', 'эконом', 'доход', 'прибыль'] 
  },
  { 
    id: 'pen', 
    name: 'Авторучка', 
    tags: ['ручка', 'письмо', 'подпись', 'заметки', 'канцелярия', 'договор', 'сделка', 'творчество', 'автограф', 'план'] 
  },
]

// ГЕНЕРАЦИЯ КАТАЛОГА (40 элементов: L/S x Main/Background)
export const COMPONENTS = ['L', 'S'].flatMap((size) =>
  ['main', 'background'].flatMap((type) =>
    BASE_OBJECTS.map((obj) => ({
      id: `${obj.id}_${size.toLowerCase()}_${type}`,
      baseId: obj.id,
      name: `${obj.name}${type === 'background' ? ' (Фон)' : ''}`,
      size: size,
      type: type,
      tags: type === 'background' ? [...obj.tags, 'фоновое'] : obj.tags,
      svgUrl: `/svg/${size}/objects/${type}/${obj.id}.svg`,
    }))
  )
)

const FORMATS = {
  SQUARE: { id: 'SQUARE', width: 600, height: 600, label: '1:1 Квадрат' },
  WIDE: { id: 'WIDE', width: 800, height: 400, label: '2:1 Баннер' },
  TALL: { id: 'TALL', width: 400, height: 600, label: '2:3 Сториз' }
}

// ПРЕСЕТЫ ДИЗАЙНЕРСКИХ СЕТОК (С ВЫЛЕТОМ ЗА КРАЙ КАДРА, КАК НА РЕФЕРЕНСЕ)
const LAYOUT_PRESETS = {
  SQUARE: [
    {
      // Вариант 1: Крупный объект снизу по центру/слева с кадрированием
      heroScale: 1.45,
      hero: { x: 0.42, y: 0.65 },
      details: [{ x: 0.68, y: 0.40 }, { x: 0.25, y: 0.32 }],
      bg: [{ x: 0.20, y: 0.22 }, { x: 0.82, y: 0.25 }]
    },
    {
      // Вариант 2: Вылет из правого верхнего угла (Папка / Книга)
      heroScale: 1.4,
      hero: { x: 0.65, y: 0.38 },
      details: [{ x: 0.28, y: 0.68 }, { x: 0.52, y: 0.78 }],
      bg: [{ x: 0.18, y: 0.25 }, { x: 0.80, y: 0.72 }]
    },
    {
      // Вариант 3: Крупный план в левом нижнем углу (Наушники)
      heroScale: 1.5,
      hero: { x: 0.30, y: 0.72 },
      details: [{ x: 0.72, y: 0.45 }, { x: 0.55, y: 0.25 }],
      bg: [{ x: 0.25, y: 0.18 }, { x: 0.82, y: 0.35 }]
    }
  ],
  WIDE: [
    {
      // Широкий баннер: горизонтальное кадрирование
      heroScale: 1.35,
      hero: { x: 0.48, y: 0.55 },
      details: [{ x: 0.18, y: 0.52 }, { x: 0.82, y: 0.48 }],
      bg: [{ x: 0.10, y: 0.22 }, { x: 0.88, y: 0.22 }]
    },
    {
      heroScale: 1.4,
      hero: { x: 0.32, y: 0.62 },
      details: [{ x: 0.68, y: 0.42 }, { x: 0.88, y: 0.68 }],
      bg: [{ x: 0.15, y: 0.18 }, { x: 0.52, y: 0.15 }]
    }
  ],
  TALL: [
    {
      // Сториз: вертикальный стек с вылетом
      heroScale: 1.4,
      hero: { x: 0.50, y: 0.58 },
      details: [{ x: 0.42, y: 0.24 }, { x: 0.58, y: 0.84 }],
      bg: [{ x: 0.22, y: 0.12 }, { x: 0.78, y: 0.38 }]
    },
    {
      heroScale: 1.45,
      hero: { x: 0.45, y: 0.76 },
      details: [{ x: 0.52, y: 0.44 }, { x: 0.32, y: 0.18 }],
      bg: [{ x: 0.78, y: 0.22 }, { x: 0.22, y: 0.58 }]
    }
  ]
}

const PALETTE_CONFIG = {
  purple: {
    bg: '#F0E6FF',
    main: {
      '#f9a3aa': '#F9A3AA',
      '#f9ecb0': '#F9ECB0',
      '#ffe3e1': '#FFE3E1',
      '#d7cdf5': '#D7CDF5',
      '#7864d7': '#7864D7',
      '#181817': '#181817',
    },
    backgroundObject: {
      '#f9a3aa': '#C4B5F0',
      '#f9ecb0': '#D7CDF5',
      '#ffe3e1': '#E9E2FF',
      '#7864d7': '#3B2D75',
      '#181817': '#3B2D75',
    }
  },
  peach: {
    bg: '#FFF5EB',
    main: {
      '#f9a3aa': '#FAC896',
      '#f9ecb0': '#F9ECB0',
      '#ffe3e1': '#FDD7B9',
      '#d7cdf5': '#80DADA',
      '#7864d7': '#D27532',
      '#181817': '#181817', 
    },
    backgroundObject: {
      '#f9a3aa': '#FAC896',
      '#f9ecb0': '#FDD7B9',
      '#ffe3e1': '#FFF5EB',
      '#7864d7': '#D27532',
      '#181817': '#D27532',
    }
  },
  mint: {
    bg: '#E0F7FA',
    main: {
      '#f9a3aa': '#80DADA',
      '#f9ecb0': '#FFD4F2',
      '#ffe3e1': '#BEEBEB',
      '#d7cdf5': '#B6C6FE',
      '#7864d7': '#6D7BFC',
      '#181817': '#181817',
    },
    backgroundObject: {
      '#f9a3aa': '#80DADA',
      '#f9ecb0': '#BEEBEB',
      '#ffe3e1': '#E0F7FA',
      '#7864d7': '#5ABEBE',
      '#181817': '#5ABEBE',
    }
  }
}

const PALETTES = Object.entries(PALETTE_CONFIG).map(([id, palette]) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  canvasBg: palette.bg,
  bg: palette.bg,
  mainColors: palette.main,
  bgColors: palette.backgroundObject,
}))

const normalize = (value) => value.trim().toLocaleLowerCase('ru').replaceAll('ё', 'е')

const prepareSvgString = (svgString, palette, componentType) => {
  let modifiedSvg = svgString
  const colorMap = componentType === 'background' ? palette.bgColors : palette.mainColors
  
  for (const [originalColor, newColor] of Object.entries(colorMap)) {
    const regex = new RegExp(originalColor, 'gi')
    modifiedSvg = modifiedSvg.replace(regex, newColor)
  }
  return modifiedSvg
}

const updateCanvasBackground = (fabricCanvas, palette, size = 'L', formatId = 'SQUARE') => {
  const format = FORMATS[formatId] || FORMATS.SQUARE
  const bgPath = `/svg/${size}/background/${palette.id}.svg`
  const fabric = window.fabric

  if (!fabric) return

  fabric.loadSVGFromURL(bgPath, (objects, options) => {
    if (!objects || objects.length === 0) return
    const bgImage = fabric.util.groupSVGElements(objects, options)
    
    bgImage.set({
      left: 0,
      top: 0,
      scaleX: format.width / (bgImage.width || format.width),
      scaleY: format.height / (bgImage.height || format.height),
      selectable: false,
      evented: false,
      originX: 'left',
      originY: 'top'
    })

    fabricCanvas.setBackgroundImage(bgImage, fabricCanvas.renderAll.bind(fabricCanvas))
    fabricCanvas.setBackgroundColor(palette.canvasBg, fabricCanvas.renderAll.bind(fabricCanvas))
  })
}

function App() {
  const elementRef = useRef(null)
  const canvasRef = useRef(null)
  const [objectCount, setObjectCount] = useState(0)
  const [metaphor, setMetaphor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('ALL')
  const [currentFormat, setCurrentFormat] = useState('SQUARE')
  const [useBackgroundObjects, setUseBackgroundObjects] = useState(true)
  const [paletteId, setPaletteId] = useState(PALETTES[0].id)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(() => (
    window.fabric
      ? { text: 'Выберите компонент справа или опишите идею слева.', type: 'info' }
      : { text: 'Fabric.js не загружен. Проверьте подключение CDN в index.html.', type: 'error' }
  ))

  const activePalette = PALETTES.find((palette) => palette.id === paletteId) ?? PALETTES[0]
  
  const visibleComponents = COMPONENTS.filter((component) => 
    catalogFilter === 'ALL' || component.size === catalogFilter
  )

  const changeFormat = (formatId) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const format = FORMATS[formatId]
    if (!format) return

    setCurrentFormat(formatId)
    canvas.setWidth(format.width)
    canvas.setHeight(format.height)

    if (window.fabric) {
      const clipPath = new window.fabric.Rect({
        width: format.width,
        height: format.height,
        top: 0,
        left: 0,
        absolutePositioned: true,
      })
      canvas.clipPath = clipPath
    }

    updateCanvasBackground(canvas, activePalette, 'L', formatId)
    canvas.renderAll()
  }

  useEffect(() => {
    if (!window.fabric) return

    const initialFormat = FORMATS.SQUARE
    const canvas = new window.fabric.Canvas('illustration-canvas', {
      width: initialFormat.width,
      height: initialFormat.height,
      selection: true,
      preserveObjectStacking: true,
    })
    canvasRef.current = canvas

    const clipPath = new window.fabric.Rect({
      width: initialFormat.width,
      height: initialFormat.height,
      top: 0,
      left: 0,
      absolutePositioned: true,
    })
    canvas.clipPath = clipPath

    updateCanvasBackground(canvas, activePalette, 'L', 'SQUARE')

    const handleKeyDown = (event) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return

      const selected = canvas.getActiveObjects()
      if (selected.length === 0) return
      event.preventDefault()
      selected.forEach((object) => canvas.remove(object))
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      setObjectCount(canvas.getObjects().length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (canvasRef.current) {
        canvasRef.current.dispose()
        canvasRef.current = null
      }
    }
  }, [])

  const deleteSelected = () => {
    const canvas = canvasRef.current
    const activeObject = canvas?.getActiveObject()
    if (!activeObject) return

    canvas.remove(activeObject)
    canvas.discardActiveObject()
    canvas.renderAll()
    setObjectCount(canvas.getObjects().length)
  }

  const duplicateSelected = async () => {
    const canvas = canvasRef.current
    const activeObject = canvas?.getActiveObject()
    if (!activeObject) return

    activeObject.clone((clonedObj) => {
      canvas.discardActiveObject()
      clonedObj.set({
        left: activeObject.left + 30,
        top: activeObject.top + 30,
        compositionKey: Date.now() + Math.random(),
        componentId: activeObject.componentId,
      })

      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas
        clonedObj.forEachObject((obj) => canvas.add(obj))
        clonedObj.setCoords()
      } else {
        canvas.add(clonedObj)
      }

      canvas.setActiveObject(clonedObj)
      canvas.renderAll()
      setObjectCount(canvas.getObjects().length)
    })
  }

  const changeLayer = (direction) => {
    const canvas = canvasRef.current
    const activeObject = canvas?.getActiveObject()
    
    if (!activeObject) {
      setMessage({ text: 'Выберите объект для перемещения по слоям.', type: 'info' })
      return
    }

    if (direction === 'up') canvas.bringForward(activeObject)
    if (direction === 'down') canvas.sendBackwards(activeObject)
    if (direction === 'top') canvas.bringToFront(activeObject)
    if (direction === 'bottom') canvas.sendToBack(activeObject)

    activeObject.setCoords()
    canvas.requestRenderAll()
  }

  const addComponent = async (component, palette = activePalette, restoreState = null, customPos = null, scaleMult = 1.0) => {
    const canvas = canvasRef.current
    const fabric = window.fabric
    if (!canvas || !fabric) throw new Error('Холст Fabric.js ещё не готов.')

    const response = await fetch(component.svgUrl)
    if (!response.ok) throw new Error(`Не удалось загрузить SVG «${component.name}» (HTTP ${response.status}).`)
    const rawSvg = await response.text()
    const preparedSvg = prepareSvgString(rawSvg, palette, component.type)

    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(preparedSvg, (objects, options) => {
        try {
          const svgObjects = objects.filter(Boolean)
          if (svgObjects.length === 0) throw new Error(`В SVG «${component.name}» не найдены объекты.`)
          const obj = fabric.util.groupSVGElements(svgObjects, options)

          obj.componentId = component.id
          obj.compositionKey = restoreState ? restoreState.key : Date.now() + Math.random()
          obj.componentType = component.type
          obj.componentSize = component.size

          if (restoreState) {
            obj.set({
              left: restoreState.left,
              top: restoreState.top,
              angle: restoreState.angle,
              scaleX: restoreState.scaleX,
              scaleY: restoreState.scaleY,
              flipX: restoreState.flipX,
              flipY: restoreState.flipY,
              skewX: restoreState.skewX,
              skewY: restoreState.skewY,
              opacity: restoreState.opacity,
              originX: 'center',
              originY: 'center',
            })
            canvas.add(obj)
          } else {
            const format = FORMATS[currentFormat] || FORMATS.SQUARE
            
            // РЕДАКТОРСКИЙ МАСШТАБ (Крупные объекты занимают 45-60% кадра!)
            let baseDim = component.size === 'S' ? format.width * 0.22 : format.width * 0.48
            if (component.type === 'background') baseDim = format.width * 0.40

            const targetDimension = baseDim * scaleMult
            const maxObjDim = Math.max(obj.width || 1, obj.height || 1)
            const scaleFactor = targetDimension / maxObjDim
            obj.scale(scaleFactor)

            const isBg = component.type === 'background'
            const pos = customPos || { 
              left: (format.width / 2) + (Math.random() * 60 - 30), 
              top: (format.height / 2) + (Math.random() * 60 - 30), 
              angle: 0 
            }

            obj.set({
              originX: 'center',
              originY: 'center',
              left: pos.left,
              top: pos.top,
              angle: pos.angle,
              opacity: isBg ? 0.85 : 1,
            })

            canvas.add(obj)

            if (isBg) {
              canvas.sendToBack(obj)
            } else {
              canvas.bringToFront(obj)
              canvas.setActiveObject(obj)
            }
          }

          obj.setCoords()
          canvas.renderAll()
          setObjectCount(canvas.getObjects().length)
          resolve(obj)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const addComponents = async (components, emptyErrorMessage) => {
    const canvas = canvasRef.current
    if (!canvas || !components || components.length === 0) {
      if (emptyErrorMessage) setMessage({ text: emptyErrorMessage, type: 'error' })
      return false
    }

    canvas.clear()
    updateCanvasBackground(canvas, activePalette, 'L', currentFormat)

    const format = FORMATS[currentFormat] || FORMATS.SQUARE
    const presets = LAYOUT_PRESETS[currentFormat] || LAYOUT_PRESETS.SQUARE
    // Случайный выбор сетки композиции
    const selectedPreset = presets[Math.floor(Math.random() * presets.length)]

    const preparedList = []
    let detailIdx = 0
    let bgIdx = 0

    components.forEach((comp) => {
      let anchor
      let scaleMult = 1.0

      if (comp.type === 'background') {
        anchor = selectedPreset.bg[bgIdx % selectedPreset.bg.length]
        bgIdx++
      } else if (comp.size === 'L') {
        // Главный герой крупно
        anchor = selectedPreset.hero
        scaleMult = selectedPreset.heroScale || 1.3
      } else {
        // Детали рядом
        anchor = selectedPreset.details[detailIdx % selectedPreset.details.length]
        detailIdx++
      }

      // Перевод относительных координат пресета в реальные PX кадра
      const pos = {
        left: format.width * anchor.x + (Math.random() * 20 - 10),
        top: format.height * anchor.y + (Math.random() * 20 - 10),
        angle: 0
      }

      preparedList.push({ component: comp, pos, scaleMult })
    })

    // ИЗОМЕТРИЧЕСКАЯ СОРТИРОВКА (Сзади -> Наперед)
    preparedList.sort((a, b) => {
      if (a.component.type !== b.component.type) {
        return a.component.type === 'background' ? -1 : 1
      }
      return a.pos.top - b.pos.top
    })

    try {
      for (const item of preparedList) {
        await addComponent(item.component, activePalette, null, item.pos, item.scaleMult)
      }
    } catch (error) {
      canvas.clear()
      updateCanvasBackground(canvas, activePalette, 'L', currentFormat)
      setObjectCount(0)
      setMessage({ text: error instanceof Error ? error.message : 'Ошибка загрузки компонента.', type: 'error' })
      return false
    }

    canvas.renderAll()
    setObjectCount(canvas.getObjects().length)
    return true
  }

  const findComponent = (query) => {
    const term = normalize(query)
    return COMPONENTS.find((component) => (
      normalize(component.name) === term
      || component.tags.some((tag) => normalize(tag) === term)
    )) ?? COMPONENTS.find((component) => (
      normalize(component.name).includes(term)
      || component.tags.some((tag) => normalize(tag).includes(term))
    ))
  }

  const handleGenerateByName = () => {
    const queries = searchText.split(',').map((part) => part.trim()).filter(Boolean)
    if (queries.length === 0) {
      setMessage({ text: 'Введите названия компонентов через запятую.', type: 'error' })
      return
    }

    const found = []
    const missing = []
    for (const query of queries) {
      const component = findComponent(query)
      if (component) found.push(component)
      else missing.push(query)
    }

    if (found.length === 0) {
      setMessage({ text: `Не найдены компоненты: ${missing.join(', ')}.`, type: 'error' })
      return
    }

    void addComponents(found, 'Не удалось найти компоненты по указанным названиям.').then((success) => {
      if (success && missing.length > 0) setMessage({ text: `Добавлено: ${found.length}. Не найдены: ${missing.join(', ')}.`, type: 'info' })
    })
  }

    const handleGenerateByMetaphor = async () => {
    const query = metaphor.trim()
    if (!query) {
      setMessage({ text: 'Опишите метафору или идею.', type: 'error' })
      return
    }

    setIsLoading(true)
    setBusy(true)
    try {
      const baseCatalog = BASE_OBJECTS.map(({ id, name, tags }) => ({ id, name, tags }))

      const systemPrompt = `Ты — арт-директор графического редактора. Проанализируй запрос пользователей ("${query}") и выбери предметы для крупноплановой кадрированной иллюстрации.
Доступные 10 предметов: ${JSON.stringify(baseCatalog)}.

Правила:
1. Выбери 1 КРУПНЫЙ объект ("hero", например: book, folder, headphones, lamp, phone).
2. Выбери 1-2 МАЛЕНЬКИХ детали ("details", например: coin, pen, puzzle, wallet).
3.${useBackgroundObjects ? ' Выбери 1-2 предмета для заднего плана ("background").' : ' Массив "background" оставь пустым.'}
4. Предметы НЕ должны повторяться!

Верни строго JSON: {"hero": ["id1"], "details": ["id2"], "background": ["id3"]}.`

      // ТЕПЕРЬ ШЛЕМ ЗАПРОС НА НАШ СОБСТВЕННЫЙ БЭКЕНД CLOUDFLARE
      // Относительный путь /api автоматически проксируется на функции Pages
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ systemPrompt, query }),
      })

      const responseText = await response.text()
      let payload
      try {
        payload = JSON.parse(responseText)
      } catch {
        throw new Error(`Сервер вернул некорректный ответ (HTTP ${response.status}).`)
      }

      if (!response.ok) throw new Error(payload.error?.message || payload.error || 'Ошибка API.')

      const content = payload.choices?.[0]?.message?.content
      let cleanContent = typeof content === 'string' ? content.trim() : ''
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      }

      const selection = JSON.parse(cleanContent)
      const heroIds = selection.hero || []
      const detailIds = selection.details || []
      const bgIds = useBackgroundObjects ? (selection.background || []) : []

      const selectedComponents = []
      
      heroIds.forEach((baseId) => {
        const comp = COMPONENTS.find(c => c.baseId === baseId && c.size === 'L' && c.type === 'main')
        if (comp) selectedComponents.push(comp)
      })

      detailIds.forEach((baseId) => {
        if (!heroIds.includes(baseId)) {
          const comp = COMPONENTS.find(c => c.baseId === baseId && c.size === 'S' && c.type === 'main')
          if (comp) selectedComponents.push(comp)
        }
      })

      bgIds.forEach((baseId) => {
        if (!heroIds.includes(baseId) && !detailIds.includes(baseId)) {
          const comp = COMPONENTS.find(c => c.baseId === baseId && c.type === 'background')
          if (comp) selectedComponents.push(comp)
        }
      })

      if (!canvasRef.current) return

      const added = await addComponents(selectedComponents, 'Mistral не выбрал подходящих компонентов.')
      if (added) {
        setMessage({ text: `Скомпонована кадрированная сцена по сетке.`, type: 'success' })
      }
    } catch (error) {
      console.error('Ошибка генерации:', error)
      setMessage({ text: error instanceof Error ? error.message : 'Не удалось выполнить запрос.', type: 'error' })
    } finally {
      setIsLoading(false)
      setBusy(false)
    }
  }


  const handlePaletteChange = async (palette) => {
    setPaletteId(palette.id)
    const canvas = canvasRef.current
    if (!canvas) return

    const composition = canvas.getObjects().map((object) => ({
      key: object.compositionKey,
      componentId: object.componentId,
      left: object.left,
      top: object.top,
      angle: object.angle,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      flipX: object.flipX,
      flipY: object.flipY,
      skewX: object.skewX,
      skewY: object.skewY,
      opacity: object.opacity,
    }))

    setBusy(true)
    canvas.clear()
    updateCanvasBackground(canvas, palette, 'L', currentFormat)
    setObjectCount(0)

    try {
      for (const item of composition) {
        const component = COMPONENTS.find((entry) => entry.id === item.componentId)
        if (component) {
          await addComponent(component, palette, item)
        }
      }
      setMessage({ text: `Применена палитра «${palette.name}».`, type: 'success' })
      canvas.renderAll()
    } catch (error) {
      console.error('Ошибка смены палитры:', error)
      setMessage({ text: 'Не удалось применить палитру.', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const format = FORMATS[currentFormat] || FORMATS.SQUARE
    const svgData = canvas.toSVG({ suppressPreamble: false, width: format.width, height: format.height })
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `illustration-${currentFormat.toLowerCase()}-${Date.now()}.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage({ text: 'Редактируемый SVG скачан.', type: 'success' })
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.clear()
    updateCanvasBackground(canvas, activePalette, 'L', currentFormat)
    setObjectCount(0)
    setMessage({ text: 'Холст очищен.', type: 'info' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] px-4 py-6 font-sans text-slate-100 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

      <header className="relative mx-auto mb-7 flex max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-extrabold text-white shadow-lg ring-1 ring-white/15">✳</div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white">Forma</div>
            <div className="mt-0.5 text-xs text-slate-500">SVG-конструктор иллюстраций</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          Рабочее пространство / MVP
        </div>
      </header>

      <main className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* ЛЕВАЯ ПАНЕЛЬ */}
        <aside className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <div className="mb-2 text-xs font-medium text-slate-400">Сценарий 1 · Метафора</div>
            <textarea
              value={metaphor}
              onChange={(e) => setMetaphor(e.target.value)}
              placeholder="Например: запуск проекта, бестселлер или безопасность финансов"
              rows={3}
              className="w-full resize-y rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={useBackgroundObjects}
                onChange={(e) => setUseBackgroundObjects(e.target.checked)}
                disabled={busy}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
              />
              Добавлять фоновые объекты
            </label>
            <button
              type="button"
              onClick={handleGenerateByMetaphor}
              disabled={busy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 disabled:opacity-50"
            >
              {isLoading ? 'Генерация...' : 'Сгенерировать по смыслу'}
            </button>
          </div>

          <div className="mb-6 border-t border-slate-800/80 pt-5">
            <div className="mb-2 text-xs font-medium text-slate-400">Сценарий 2 · Поиск по названию</div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateByName()}
              placeholder="Книга, Ручка, Монета"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleGenerateByName}
              disabled={busy}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:opacity-50"
            >
              Добавить на холст
            </button>
          </div>

          <div className="border-t border-slate-800/80 pt-5">
            <div className="mb-3 text-sm font-semibold text-white">Выбор палитры</div>
            <div className="grid gap-2">
              {PALETTES.map((palette) => (
                <button
                  type="button"
                  key={palette.id}
                  onClick={() => handlePaletteChange(palette)}
                  disabled={busy}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                    palette.id === paletteId
                      ? 'border-indigo-500/60 bg-indigo-500/10 text-white ring-1 ring-indigo-500/20'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{palette.name}</span>
                  <span className="flex gap-1.5">
                    {[palette.canvasBg, ...Object.values(palette.mainColors)].slice(0, 4).map((color, i) => (
                      <span key={i} className="h-3 w-3 rounded-full ring-1 ring-white/10" style={{ background: color }} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={`mt-5 rounded-xl border px-3 py-2.5 text-xs leading-relaxed ${
            message.type === 'error' ? 'border-rose-500/20 bg-rose-500/10 text-rose-300' :
            message.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' :
            'border-slate-800 bg-slate-950/50 text-slate-400'
          }`}>
            {message.text}
          </div>
        </aside>

        {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">Рабочий холст</h1>
              <div className="mt-1 text-xs text-slate-500">
                {FORMATS[currentFormat].width} × {FORMATS[currentFormat].height} px · Элементов: {objectCount}
              </div>
            </div>
            
            {/* Переключатель форматов */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
              {Object.values(FORMATS).map((f) => (
                <button 
                  key={f.id} 
                  type="button"
                  onClick={() => changeFormat(f.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    currentFormat === f.id 
                      ? 'bg-indigo-500 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={duplicateSelected}
                disabled={busy || objectCount === 0}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                👯‍♂️ Дубл.
              </button>

              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
                <button
                  type="button"
                  onClick={() => changeLayer('top')}
                  disabled={busy || objectCount === 0}
                  title="На передний план"
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  ⏫ Вверх
                </button>
                <button
                  type="button"
                  onClick={() => changeLayer('up')}
                  disabled={busy || objectCount === 0}
                  title="На один слой выше"
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  ⬆️
                </button>
                <button
                  type="button"
                  onClick={() => changeLayer('down')}
                  disabled={busy || objectCount === 0}
                  title="На один слой ниже"
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  ⬇️
                </button>
                <button
                  type="button"
                  onClick={() => changeLayer('bottom')}
                  disabled={busy || objectCount === 0}
                  title="На задний план"
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  ⏬ Вниз
                </button>
              </div>

              <button
                type="button"
                onClick={deleteSelected}
                disabled={busy || objectCount === 0}
                className="rounded-xl border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-900/50 disabled:opacity-40"
              >
                🗑 Удалить
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={busy}
                className="rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Очистить
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={busy}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-white"
              >
                Экспорт SVG
              </button>
            </div>
          </div>

          <div className="relative overflow-auto rounded-2xl border border-slate-700/80 bg-[#171923] p-4 shadow-2xl">
            <div className="relative flex min-h-[500px] items-center justify-center overflow-auto rounded-xl bg-[#20212b] p-4">
              <canvas
                id="illustration-canvas"
                ref={elementRef}
                className="block shrink-0 rounded-md shadow-2xl"
              />
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-slate-500">
            Перетаскивайте объекты · Вращайте и меняйте размер
          </div>
        </section>

        {/* ПРАВАЯ ПАНЕЛЬ */}
        <aside className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Каталог компонентов</div>
            <span className="text-[11px] text-slate-500">({visibleComponents.length})</span>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            {[
              { id: 'ALL', label: 'Все' },
              { id: 'L', label: 'Крупные (L)' },
              { id: 'S', label: 'Детали (S)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCatalogFilter(tab.id)}
                className={`rounded-lg py-1 text-[11px] font-semibold transition-all ${
                  catalogFilter === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid max-h-[560px] grid-cols-2 gap-2 overflow-y-auto pr-1">
            {visibleComponents.map((component) => (
              <button
                type="button"
                key={component.id}
                onClick={() => {
                  setBusy(true)
                  void addComponent(component)
                    .then(() => setMessage({ text: `Добавлен: ${component.name}`, type: 'success' }))
                    .catch((err) => setMessage({ text: err.message, type: 'error' }))
                    .finally(() => setBusy(false))
                }}
                disabled={busy}
                className="group relative flex min-h-[105px] flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-950/40 px-2 py-3 text-xs font-medium text-slate-400 hover:scale-[1.03] hover:border-indigo-500/40 hover:bg-slate-800/80 hover:text-white disabled:opacity-50"
              >
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  <span className="rounded bg-slate-800/80 px-1 py-0.5 text-[8px] font-bold text-slate-300">
                    {component.size}
                  </span>
                  <span className={`rounded px-1 py-0.5 text-[8px] font-bold ${
                    component.type === 'background' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {component.type === 'background' ? 'ФОН' : 'ГЛАВНЫЙ'}
                  </span>
                </div>

                <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900/80 group-hover:bg-indigo-500/10">
                  <img className="h-10 w-10 object-contain" src={component.svgUrl} alt="" />
                </span>
                <span className="text-center text-[11px] leading-tight">{component.name}</span>
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App