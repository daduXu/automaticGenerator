<template>
  <el-container style="display:flex;flex-direction:column;height: 100%; border: 1px solid #eee">
    <div style="display:flex; flex-direction:column;width:100%;">
      <el-header>Insert语句批量生成</el-header>
    </div>
    <div style="display:flex; flex-direction:column;width:100%;">
      <el-row style="margin-bottom:15px;margin-left:15px;">
        <el-col :span="8" style="margin-right:5px;">
          <el-row style=""> <el-col :span="5">表名</el-col> <el-col><el-input v-model="tableName"></el-input></el-col> </el-row>
        </el-col>
         <el-col :span="8" style="margin-right:5px;">
          <el-row style=""> <el-col :span="5">数据量(条)</el-col> <el-col><el-input type="Number" min = "1" v-model="dataNum"></el-input></el-col> </el-row>
        </el-col>
        <el-col :span="8" style="margin-right:5px;">
          <el-row style=""> 类型说明：NVARCHAR2,NUMBER,ENUM,DATE </el-row>
        </el-col>  
      </el-row>
      <div v-for="(item, index) in dataList" :key="index" style="flex:1;">
        <el-card class="box-card">
          <div style="height:70px; ">
            <el-row>
              <el-col :span="7" style="margin-right:5px;">
                <el-row style=""> <el-col :span="5">属性名</el-col> <el-col><el-input v-model="item.stname"></el-input></el-col> </el-row>
              </el-col>
              <el-col :span="6" style="margin-right:5px;">
                <el-row style=""> <el-col :span="4">设置</el-col> <el-col><el-input v-model="item.stlen"></el-input></el-col> </el-row>
              </el-col>
              <el-col :span="7" style="margin-right:5px;">
                <el-row style=""> <el-col :span="5">类型</el-col> <el-col><el-input v-model="item.sttype"></el-input></el-col> </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
        
      </div>
      <div style="flex:1;margin-bottom: 10px;">
        <el-button type="primary" @click="addItem">添加属性</el-button>
        <el-button type="primary" @click="makeSourceList" v-loading.fullscreen.lock="fullscreenLoading">生成</el-button>
        <el-button type="primary" @click="copyResult">Copy</el-button>
      </div>
      <div style="flex:1;">
        <textarea style="height:400px;width:100%;"/>
      </div>
    </div>
  </el-container>
</template>
<script>
  // import _ from 'lodash'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import uuidV1 from 'uuid/v1'
  const { clipboard } = require('electron')
  // const uuidV1 = require('uuid/v1')
  export default {
    name: 'Resources',
    data () {
      return {
        cost: 0,
        outJson: '',
        dataList: [
          { stname: 'GUID', sttype: 'NVARCHAR2', stlen: '32' },
          { stname: 'ST_SEX', sttype: 'ENUM', stlen: '男,女' },
          { stname: 'ST_COST', sttype: 'NUMBER', stlen: '10' },
          { stname: 'ST_DATE', sttype: 'DATE', stlen: '1' }
        ],
        tableProp: '',
        tableName: 'TT_INFORMATION',
        dataNum: 1
      }
    },
    components: {

    },
    computed: {
      ...mapState(['fullscreenLoading'])
    },
    watch: {
      // dataList (newVal, oldVal) {
      //   console.log(newVal, oldVal)
      //   for (let i = 0, len = newVal.length; i < len; i++) {
      //     const { oid = '', sid = '', stname = '', stparentid = '', stviewcode = '', sti18n = '', stresourcetype = '', nsort = '', stcode = '' } = newVal[i]
      //     const oI = _.findIndex(this.opList, { guid: oid })
      //     this.opList[oI] = { guid: oid, stname, stcode }
      //     const sI = _.findIndex(this.sourceList, { guid: sid })
      //     this.sourceList[sI] = { guid: sid, stparentid, stname, stviewcode, nsort, stresourcetype, stoperationid: oid, sti18n }
      //   }
      //   this.makeSql()
      // },
      // guid (newVal, oldVal) {
      //   this.ctpermissionop = newVal + '1'
      //   this.ctpermissionresource = newVal + '2'
      //   this.ctpermissionopauth = newVal + '3'
      // }
    },
    mounted () {
      console.log('222')
    },
    methods: {
      ...mapActions(['makeInsertSql', 'showFullscreenLoading']),
      copyResult () {
        clipboard.clear()
        clipboard.writeText(this.outJson)
        this.$message({
          message: '已复制到剪帖板',
          type: 'success'
        })
      },
      makeSourceList () {
        const start = new Date().getTime()
        this.outJson = ''
        this.showFullscreenLoading({ isShow: true })
        this.makeInsertSql({
          tableName: this.tableName,
          dataNum: this.dataNum,
          dataList: this.dataList
        }).then(outstr => {
          const end = new Date().getTime()
          // 运行总时间
          const run = end - start
          console.log(`${start},${end},${run}`)
          // 总秒
          const sumSeconds = parseInt(run / 1000)
          this.outJson = outstr
          this.showFullscreenLoading({ isShow: false })
          this.$alert(`生成成功~耗时:${sumSeconds}`, '提示', {
            confirmButtonText: '确定'
          })
        }).catch(err => {
          this.showFullscreenLoading({ isShow: false })
          this.$message({
            message: '生成出错~' + err,
            type: 'success'
          })
        })
        // let prop = ''
        // for (let i = 0, len = this.dataList.length; i < len; i++) {
        //   const item = this.dataList[i]
        //   const { stname } = item
        //   if (i !== 0) {
        //     prop += ','
        //   }
        //   prop += stname
        // }
        // this.tableProp = `insert into ${this.tableName} (${prop}) values (`
        // this.makeSql()
      },
      getValueByType (type, len) {
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
          value = Math.ceil(Math.random() * Math.pow(10, (len - 0) - 4))
          value = `${value}.${Math.ceil(Math.random() * 10000)}`
          value = value - 0
          break
        }
        case 'DATE': {
          const year = '2020'
          const month = Math.ceil(Math.random() * 12)
          const day = Math.ceil(Math.random() * 31)
          const hh = Math.ceil(Math.random() * 23)
          const mm = Math.ceil(Math.random() * 59)
          const ss = Math.ceil(Math.random() * 59)

          value = `to_date('${day}-${month}-${year} ${hh}:${mm}:${ss}', 'dd-mm-yyyy hh24:mi:ss')`
          break
        }
        case 'ENUM': {
          const arr = len.split(',')
          value = `'${arr[Math.ceil(Math.random() * arr.length) - 1]}'`
          break
        }
        }
        return value
      },
      makeSql (loading) {
        let insterStr = ''
        for (let i = 0, len = this.dataNum; i < len; i++) {
          let propStr = ''
          for (let i = 0, len = this.dataList.length; i < len; i++) {
            const item = this.dataList[i]
            const { sttype, stlen } = item
            if (i !== 0) {
              propStr += ','
            }
            propStr += this.getValueByType(sttype, stlen)
          }
          insterStr += `${this.tableProp}${propStr});\n`
        }
        this.outJson = insterStr
        this.$message({
          message: '生成成功~',
          type: 'success'
        })
      },
      getLength (arr) {
        if (arr.length + 1 < 10) {
          return `0${arr.length + 1}`
        }
        return arr.length + 1
      },
      addItem () {
        // if (this.guid.length !== 29) {
        //   this.$message('输入三个表的guid前29位!')
        //   return ''
        // }
        // const oid = this.ctpermissionop + this.getLength(this.opList)
        // const sid = this.ctpermissionresource + this.getLength(this.sourceList)
        // const aid = this.ctpermissionopauth + this.getLength(this.authList)
        this.dataList.push({ stname: '', sttype: '', stlen: '' })
      },
      onSubmit () {
        this.$message('submit!')
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .el-header {
      background-color: #B3C0D1;
      color: #333;
      line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
