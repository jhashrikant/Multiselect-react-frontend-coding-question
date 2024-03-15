
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { usersDetails } from './utils';

function App() {

  const inputref = useRef()

  const hightlightref = useRef(0)

  const [querySearched, setquerySearched] = useState('')
  const [filteredData, setfiltereddata] = useState([])
  const [pillValue, setpillValue] = useState([])
  const [focus, setfocus] = useState(false)
  const [hightLightPillAtIndex, sethightLightPillAtIndex] = useState(null)
  const [hightLightcurrentIndex, sethightLightcurrentIndex] = useState(0)

  const unselectedusers = useMemo(() => {
    return usersDetails.filter(({ name }) => !pillValue.includes(name))
  }, [pillValue])

  const handleSearch = useCallback(() => {
    console.log('hsh')
    if (querySearched.toLowerCase() === '') {
      setfiltereddata([])
      return;
    }
    let filtered = unselectedusers.filter((user) => {
      return user.name.toLowerCase().includes(querySearched.trim().toLowerCase())
    })
    setfiltereddata(filtered)
  }, [querySearched])

  const addItem = (item) => {
    setpillValue((prev) => [...prev, item])
    if (querySearched) setquerySearched('')
  }


  const handleEnterpress = () => {
    if (querySearched !== '') {
      addItem(filteredData[hightLightcurrentIndex]?.name)
      sethightLightcurrentIndex(0)
    }
    else {
      addItem(unselectedusers[hightLightcurrentIndex]?.name)
      sethightLightcurrentIndex(0)
    }
  }


  const handleBackspacePress = () => {
    if (querySearched === '' && pillValue.length > 0) {
      //when first time backspace is clicked hightlight the last item in pillsvalue array
      hightlightref.current++
      if (hightlightref.current === 1) {
        sethightLightPillAtIndex(pillValue.length - 1)
      }
      if (hightlightref.current === 2) {
        const updatedarray = [...pillValue]
        updatedarray.pop()
        setpillValue(updatedarray)
        sethightLightPillAtIndex(null)
        hightlightref.current = 0
      }
    }
  }

  const handleinputChange = ({ target }) => {
    setquerySearched(target.value)
  }

  const handleArrowupPress = () => {
    if (hightLightcurrentIndex !== null && hightLightcurrentIndex > 0) {
      sethightLightcurrentIndex(hightLightcurrentIndex - 1)
    }
  }

  const handleArrowDownPress = () => {
    if (hightLightcurrentIndex === unselectedusers.length - 1) return
    if (hightLightcurrentIndex === null) {
      sethightLightcurrentIndex(0)
    } else {
      sethightLightcurrentIndex(prev => prev + 1)
    }
  }

  const handlekeypress = (event) => {
    switch (event.key) {
      case 'Enter':
        handleEnterpress()
        break;

      case 'Backspace':
        handleBackspacePress()
        break;

      case 'ArrowUp':
        handleArrowupPress()
        break;

      case 'ArrowDown':
        handleArrowDownPress();
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (inputref.current && !inputref.current.contains(target)) {
        setfocus(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return (() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }, [inputref])

  useEffect(() => {
    handleSearch()
  }, [querySearched])


  const removePillValue = (indextoremove) => {
    const updatedpills = pillValue.filter((_, index) => index !== indextoremove)
    setpillValue(updatedpills)
  }

  const handlefocus = () => {
    setfocus(true)
  }


  return (
    <Fragment>
      <div className='flex items-center justify-center flex-col mt-20'>
        <div ref={inputref} className='relative w-[28rem] border h-auto flex gap-1 flex-wrap items-center rounded-xl'>
          {pillValue.length > 0 && (
            pillValue.map((items, index) => {
              return <div key={index} className={`rounded-full ml-2 ${hightLightPillAtIndex === index ? 'bg-gray-400 border' : 'bg-gray-200 border'}  px-2 `}>{items}<span onClick={() => removePillValue(index)} className='cursor-pointer pl-3'>x</span></div>
            }))}
          <input onFocus={handlefocus} onKeyDown={handlekeypress} onChange={handleinputChange} value={querySearched} className='outline-none  px-2 h-8  w-24' type='text' placeholder='search...' />
        </div>
        {focus && <div className='w-[28rem] h-[12.5rem] overflow-y-scroll'>
          {filteredData.length === 0 && querySearched !== '' ? <div>No results found</div> :
            filteredData.length !== 0 ? filteredData?.map(({ id, name, email }, index) => {
              return (
                <div onClick={() => addItem(name)} key={id} className={`${hightLightcurrentIndex === index ? 'bg-gray-400' : ''} hover:bg-gray-200 cursor-pointer p-2 flex items-center justify-between`}>
                  <div className='text-sm'>{name}</div>
                  <div className='text-base'>{email}</div>
                </div>
              )
            }) :
              unselectedusers && unselectedusers?.map(({ id, name, email }, index) => {
                return (
                  <div onClick={() => addItem(name)} key={id} className={`${hightLightcurrentIndex === index ? 'bg-gray-400' : ''} hover:bg-gray-200 cursor-pointer p-2 flex items-center justify-between`}>
                    <div className='text-sm'>{name}</div>
                    <div className='text-base'>{email}</div>
                  </div>
                )
              })}
        </div>}
      </div>
    </Fragment>
  );
}

export default App;
