import Vue from 'vue'
import Vuex from 'vuex'
import uuidV1 from 'uuid/v1'
const Mock = require('mockjs')
const Random = Mock.Random
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    fullscreenLoading: false,
    insertSql: ''
  },
  mutations: {
    setInsertSql: (state, insertSql) => {
      state.insertSql = insertSql
    },
    setFullscreenLoading: (state, isShowloading) => {
      state.fullscreenLoading = isShowloading
    }
  },
  actions: {
    showFullscreenLoading: ({commit}, params) => {
      const {
        isShow
      } = params
      commit('setFullscreenLoading', isShow)
    },
    makeInsertSql: ({commit}, params) => {
      const {
        tableName,
        dataNum,
        dataList
      } = params
      return new Promise((resolve) => {
        let prop = ''
        for (let i = 0, len = dataList.length; i < len; i++) {
          const item = dataList[i]
          const { stname } = item
          if (i !== 0) {
            prop += ','
          }
          prop += stname
        }
        const tableProp = `insert into ${tableName} (${prop}) values (`
        let insterStr = ''
        for (let i = 0, len = dataNum; i < len; i++) {
          let propStr = ''
          for (let i = 0, len = dataList.length; i < len; i++) {
            const item = dataList[i]
            const { sttype, stlen } = item
            if (i !== 0) {
              propStr += ','
            }
            propStr += getValueByType(sttype, stlen)
          }
          insterStr += `${tableProp}${propStr});\n`
        }
        // commit('setInsertSql', insterStr)
        resolve(insterStr)
      })
    }
  }
})
const getValueByType = (type, len) => {
  let value = ''
  switch (type.toUpperCase()) {
  case 'NVARCHAR2': {
    let char = uuidV1().split('-').join('')
    if (len > char.length) {
      const times = Math.ceil(len / char.length)
      for (let i = 0; i < times; i++) {
        char += char
      }
    }
    value = `'${char.substr(0, len)}'`
    break
  }
  case 'NUMBER': {
    // value = Math.ceil(Math.random() * Math.pow(10, (len - 0) - 4))
    // value = `${value}.${Math.ceil(Math.random() * 10000)}`
    // value = value - 0
    value = Random.float(0, Math.pow(10, (len - 0) - 4), 0, 4)
    break
  }
  case 'DATE': {
    value = `to_date('${Random.datetime('dd-MM-yyyy HH:mm:ss')}', 'dd-mm-yyyy hh24:mi:ss')`
    break
  }
  case 'ENUM': {
    const arr = len.split(',')
    value = `'${arr[Math.ceil(Math.random() * arr.length) - 1]}'`
    break
  }
  }
  return value
}
export default store
